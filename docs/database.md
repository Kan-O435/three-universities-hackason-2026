# データベース設計・RLS定義

> **対象環境：Supabase（PostgreSQL 15以上）**
> このドキュメントはSupabaseを前提として設計されています。SECURITY DEFINER関数はSQL Editorから作成するため、関数所有者が `postgres`（スーパーユーザー）となりRLSを確実にバイパスできます。一般的なPostgreSQL環境では別途権限設定が必要です。

---

## 設計の概要

### セキュリティモデル

このアプリはルームへの参加を `invite_code` で制御します。

- ルームのURLは `/rooms/[roomId]`、参加URLは `/rooms/[roomId]/join/[inviteCode]`
- `invite_code` はルーム作成時にDBが自動生成する8文字のランダム文字列
- `invite_code` を知っている人だけがルームに参加できる
- `roomId`（UUID）だけでは参加できないため、ルームIDが列挙されても安全

### アクセス制御の方針

| 状態 | rooms SELECT | room_members INSERT | messages INSERT/SELECT |
|---|---|---|---|
| 未ログイン | 不可（RPCのみ） | 不可 | 不可 |
| ログイン済み・未参加 | 不可（RPCのみ） | `join_room()` RPCのみ | 不可 |
| ログイン済み・参加済み | ✅ | — | ✅ |

### フロントエンドの呼び出し方

| 場面 | 方法 |
|---|---|
| 参加ページのルーム情報表示（未ログイン・未参加問わず） | `supabase.rpc('get_room_preview', { p_room_id })` |
| ルームへの参加 | `supabase.rpc('join_room', { p_room_id, p_invite_code })` |
| チャットページのルーム情報取得（参加済み） | `supabase.from('rooms').select(...)` |
| メッセージ取得・送信（参加済み） | `supabase.from('messages').select/insert(...)` |

---

## テーブル設計

### `users`

Supabaseの認証ユーザー（`auth.users`）と1対1で対応する公開プロフィールテーブル。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK、auth.usersと紐づけ ON DELETE CASCADE | auth.usersのIDをそのまま使用 |
| display_name | text | NOT NULL | 表示名。サインアップ時に必須入力 |
| created_at | timestamptz | NOT NULL DEFAULT now() | |
| updated_at | timestamptz | NOT NULL DEFAULT now() | UPDATE時にトリガーで自動更新 |

- アイコン色はクライアント側でIDから生成するためDBには持たない
- `id` にはDEFAULTを設定しない（`handle_new_user` トリガーが auth.usersのIDを引き継ぐ）

---

### `rooms`

チャットルームの情報を管理するテーブル。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK、DEFAULT gen_random_uuid() | チャットページのURL（`/rooms/[id]`）に使用 |
| name | text | NOT NULL、最大50文字 | ルーム名 |
| description | text | nullable、最大200文字 | ルームの説明 |
| owner_id | uuid | NOT NULL → users ON DELETE RESTRICT | 作成者。削除不可（ルームを所有している間） |
| invite_code | text | NOT NULL、UNIQUE、DEFAULT自動生成 | 参加URLに使用する8文字のランダム文字列 |
| expires_at | timestamptz | NOT NULL、CHECK (expires_at > now()) | 期限。作成後は変更不可（トリガーで保護） |
| created_at | timestamptz | NOT NULL DEFAULT now() | |
| updated_at | timestamptz | NOT NULL DEFAULT now() | UPDATE時にトリガーで自動更新 |

**設計上の注意：**
- `is_archived` カラムは持たない。`expires_at < now()` で期限切れ判定を行う
- 期限切れルームへのUPDATEは `expires_at > now()` のCHECK制約により失敗する（意図的）
- `invite_code` は `substring(replace(gen_random_uuid()::text, '-', ''), 1, 8)` で生成される8文字の16進数文字列（例：`a3f8b2c1`）

---

### `room_members`

ルームとユーザーの参加関係を管理する中間テーブル。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK、DEFAULT gen_random_uuid() | |
| room_id | uuid | NOT NULL → rooms ON DELETE CASCADE | |
| user_id | uuid | NOT NULL → users ON DELETE CASCADE | |
| joined_at | timestamptz | NOT NULL DEFAULT now() | 参加日時 |

- `(room_id, user_id)` にユニーク制約（同じルームに2回参加できない）
- INSERTポリシーは設定しない。`join_room()` 関数と `handle_new_room` トリガーのみが挿入できる

---

### `messages`

チャットメッセージを管理するテーブル。

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK、DEFAULT gen_random_uuid() | |
| room_id | uuid | NOT NULL → rooms ON DELETE CASCADE | |
| user_id | uuid | NOT NULL → users ON DELETE CASCADE | 送信者 |
| content | text | NOT NULL、最大2000文字 | メッセージ本文 |
| created_at | timestamptz | NOT NULL DEFAULT now() | 送信日時 |

- メッセージの編集・削除機能はない
- 期限切れ後もメンバーはメッセージを読むことができる（送信は不可）

---

## インデックス

| テーブル | 対象カラム | 理由 |
|---|---|---|
| messages | `(room_id, created_at)` | チャット履歴を時系列で取得するクエリに使用 |
| room_members | `user_id` | ユーザーが参加しているルーム一覧の取得に使用 |
| room_members | `room_id` | `is_room_member()` 関数内の検索に使用 |

---

## Realtime

Supabase Realtimeを使い、メッセージ送信とメンバー参加をリアルタイムで反映する。

| テーブル | 設定 | 理由 |
|---|---|---|
| messages | REPLICA IDENTITY FULL | 新着メッセージをリアルタイムで全クライアントに配信 |
| room_members | REPLICA IDENTITY FULL | 新規メンバー参加をリアルタイムで反映 |

> **注意：** `alter publication supabase_realtime add table ...` は冪等ではありません。2回実行するとエラーになるため、初回のみ実行してください。

---

## トリガー

| トリガー名 | テーブル | タイミング | 関数 | 説明 |
|---|---|---|---|---|
| `on_auth_user_created` | auth.users | AFTER INSERT | `handle_new_user()` | 認証ユーザー作成時に public.users を自動作成 |
| `on_room_created` | rooms | AFTER INSERT | `handle_new_room()` | ルーム作成時にオーナーを room_members へ自動追加 |
| `lock_expires_at` | rooms | BEFORE UPDATE | `lock_room_fields()` | expires_at・owner_id・invite_code の変更を無効化 |
| `update_rooms_updated_at` | rooms | BEFORE UPDATE | `set_updated_at()` | updated_at を自動更新 |
| `update_users_updated_at` | users | BEFORE UPDATE | `set_updated_at()` | updated_at を自動更新 |

**roomsのBEFORE UPDATEトリガーについて：**
PostgreSQLでは同一イベントの複数BEFOREトリガーはトリガー名のアルファベット順に実行されます。
`lock_expires_at`（l）→ `update_rooms_updated_at`（u）の順が保証されるため、先に `expires_at` を元の値に戻してから `updated_at` を更新できます。
トリガーをリネームする場合はこの順序が崩れないよう注意してください。

---

## 関数とRLSポリシー

### `set_updated_at()`

UPDATEトリガーから呼ばれ、`updated_at` を現在時刻に更新するシンプルなトリガー関数。

---

### `lock_room_fields()`

`rooms` テーブルのUPDATE前に呼ばれ、変更してはならないカラムを元の値に戻すトリガー関数。
- `expires_at`：期限は作成後に変更不可
- `owner_id`：オーナーの移譲は不可
- `invite_code`：参加コードは変更不可

---

### `handle_new_user()`

`auth.users` にレコードが作成されたとき、自動的に `public.users` にプロフィールを作成する。
`display_name` が未設定の場合は明示的に例外を発生させ、サインアップ自体を失敗させる。
フロントエンドでサインアップ時に `display_name` を必須入力として制御すること。

---

### `handle_new_room()`

`rooms` にルームが作成されたとき、オーナーを自動的に `room_members` に追加する。
SECURITY DEFINERで実行するため、`room_members` のINSERTポリシーがなくても挿入できる。

---

### `is_room_member(p_room_id uuid)`

指定されたルームにログイン中のユーザーが参加しているかを返す関数。
`room_members` テーブルのRLSポリシーで自己参照すると無限再帰になるため、
この関数をSECURITY DEFINERにしてRLSをバイパスすることで回避している。

```sql
-- 使用例（RLSポリシー内）
using (is_room_member(room_id))
```

---

### `get_room_preview(p_room_id uuid)`

参加ページで必要なルーム情報を返す関数。`invite_code` は含まない。
未ログインユーザーもアクセスできるよう `anon` ロールにも実行権限を付与している。

**返却カラム：** id, name, description, expires_at, owner_name

```ts
// フロントエンドでの使用例
const { data } = await supabase.rpc('get_room_preview', { p_room_id: roomId })
```

---

### `join_room(p_room_id uuid, p_invite_code text)`

ルームへの参加処理を行う関数。以下を検証してから `room_members` に追加する：
1. 指定された `p_room_id` と `p_invite_code` が一致するルームが存在するか
2. そのルームの期限が切れていないか

検証に失敗した場合は例外を発生させる。
すでにメンバーの場合は `on conflict do nothing` で何もしない（冪等）。

```ts
// フロントエンドでの使用例
const { error } = await supabase.rpc('join_room', {
  p_room_id: roomId,
  p_invite_code: inviteCode,
})
if (error) {
  // 'Invalid invite code or room has expired'
}
```

---

### RLSポリシー一覧

#### `users`
| 操作 | ロール | 条件 | 説明 |
|---|---|---|---|
| SELECT | authenticated | 常に許可 | チャット内でメンバー名を表示するため全ユーザーが読める |
| INSERT | — | 不可 | `handle_new_user` トリガーのみが挿入できる |
| UPDATE | authenticated | `auth.uid() = id` | 自分のプロフィールのみ変更可 |

#### `rooms`
| 操作 | ロール | 条件 | 説明 |
|---|---|---|---|
| SELECT | authenticated | `is_room_member(id)` | メンバーのみ読める。`invite_code` の漏洩を防ぐため |
| INSERT | authenticated | `owner_id = auth.uid()` | 自分をオーナーにしたルームのみ作成可 |
| UPDATE | authenticated | `auth.uid() = owner_id` | オーナーのみ変更可。変更不可カラムはトリガーで保護 |
| DELETE | — | 不可 | ルームは削除しない |

> 参加前のルーム情報は `get_room_preview()` RPC を使うこと。`supabase.from('rooms')` は参加済みルームのみ取得できる。

#### `room_members`
| 操作 | ロール | 条件 | 説明 |
|---|---|---|---|
| SELECT | authenticated | `is_room_member(room_id)` | メンバーのみ同じルームのメンバー一覧を読める |
| INSERT | — | ポリシーなし | `join_room()` と `handle_new_room` トリガーがSECURITY DEFINERで処理 |
| UPDATE | — | 不可 | |
| DELETE | — | 不可 | 退出・キック機能なし |

#### `messages`
| 操作 | ロール | 条件 | 説明 |
|---|---|---|---|
| SELECT | authenticated | `is_room_member(room_id)` | メンバーは期限切れ後も読める |
| INSERT | authenticated | メンバー かつ 期限内 かつ `user_id = auth.uid()` | なりすまし防止のため `user_id` も検証 |
| UPDATE | — | 不可 | 編集機能なし |
| DELETE | — | 不可 | 削除機能なし |

---

## SQL（全文）

```sql
-- =====================================================
-- Tables
-- =====================================================

-- gen_random_uuid() はPostgreSQL 13以降ビルトイン（pgcrypto拡張は不要）

create table public.users (
  id           uuid        primary key references auth.users(id) on delete cascade,
  display_name text        not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.rooms (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null check (char_length(name) <= 50),
  description text        check (char_length(description) <= 200),
  owner_id    uuid        not null references public.users(id) on delete restrict,
  invite_code text        not null unique
                          default substring(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  expires_at  timestamptz not null check (expires_at > now()),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.room_members (
  id        uuid        primary key default gen_random_uuid(),
  room_id   uuid        not null references public.rooms(id) on delete cascade,
  user_id   uuid        not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table public.messages (
  id         uuid        primary key default gen_random_uuid(),
  room_id    uuid        not null references public.rooms(id) on delete cascade,
  user_id    uuid        not null references public.users(id) on delete cascade,
  content    text        not null check (char_length(content) <= 2000),
  created_at timestamptz not null default now()
);

-- =====================================================
-- Indexes
-- =====================================================

create index on public.messages     (room_id, created_at);
create index on public.room_members (user_id);
create index on public.room_members (room_id);

-- =====================================================
-- Realtime（初回のみ実行：冪等でないためマイグレーション管理を推奨）
-- =====================================================

alter table public.messages     replica identity full;
alter table public.room_members replica identity full;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.room_members;

-- =====================================================
-- Functions
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.lock_room_fields()
returns trigger
language plpgsql
as $$
begin
  new.expires_at  := old.expires_at;
  new.owner_id    := old.owner_id;
  new.invite_code := old.invite_code;
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data->>'display_name' is null then
    raise exception 'display_name is required';
  end if;

  insert into public.users (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create or replace function public.handle_new_room()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.room_members (room_id, user_id)
  values (new.id, new.owner_id);
  return new;
end;
$$;

-- RLS回避用メンバー判定関数
-- Supabase環境では関数所有者がpostgresになるためRLSを確実にバイパスできる
create or replace function public.is_room_member(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.room_members
    where room_id = p_room_id
    and   user_id = auth.uid()
  );
$$;

-- 参加ページ用：invite_codeを含まない最小限の情報を返す
-- フロントエンド: supabase.rpc('get_room_preview', { p_room_id })
create or replace function public.get_room_preview(p_room_id uuid)
returns table (
  id          uuid,
  name        text,
  description text,
  expires_at  timestamptz,
  owner_name  text
)
language sql
security definer
set search_path = public
as $$
  select
    r.id,
    r.name,
    r.description,
    r.expires_at,
    u.display_name
  from public.rooms r
  join public.users u on u.id = r.owner_id
  where r.id = p_room_id;
$$;

-- 参加処理：invite_codeと期限を検証してroom_membersに追加
-- フロントエンド: supabase.rpc('join_room', { p_room_id, p_invite_code })
create or replace function public.join_room(p_room_id uuid, p_invite_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.rooms
    where id          = p_room_id
    and   invite_code = p_invite_code
    and   expires_at  > now()
  ) then
    raise exception 'Invalid invite code or room has expired';
  end if;

  insert into public.room_members (room_id, user_id)
  values (p_room_id, auth.uid())
  on conflict do nothing;
end;
$$;

-- 引数型を含めた完全なシグネチャで指定
grant execute on function public.get_room_preview(uuid)  to anon, authenticated;
grant execute on function public.join_room(uuid, text)   to authenticated;

-- =====================================================
-- Triggers
-- =====================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger on_room_created
  after insert on public.rooms
  for each row execute function public.handle_new_room();

-- roomsのBEFORE UPDATEはアルファベット順で実行される
-- lock_expires_at(l) → update_rooms_updated_at(u) の順が保証される
create trigger lock_expires_at
  before update on public.rooms
  for each row execute function public.lock_room_fields();

create trigger update_rooms_updated_at
  before update on public.rooms
  for each row execute function public.set_updated_at();

create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- =====================================================
-- RLS
-- =====================================================

alter table public.users        enable row level security;
alter table public.rooms        enable row level security;
alter table public.room_members enable row level security;
alter table public.messages     enable row level security;

-- users
create policy "users: authenticated select"
  on public.users for select
  to authenticated
  using (true);

create policy "users: update own"
  on public.users for update
  to authenticated
  using     (auth.uid() = id)
  with check (auth.uid() = id);

-- rooms（メンバーのみSELECT可：invite_code漏洩防止）
-- 参加前のルーム情報は get_room_preview() RPC を使用すること
create policy "rooms: members select"
  on public.rooms for select
  to authenticated
  using (is_room_member(id));

create policy "rooms: authenticated insert"
  on public.rooms for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "rooms: owner update"
  on public.rooms for update
  to authenticated
  using     (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- room_members
-- INSERTポリシーなし：join_room()とhandle_new_room()がSECURITY DEFINERで処理するため
create policy "room_members: members select"
  on public.room_members for select
  to authenticated
  using (is_room_member(room_id));

-- messages
create policy "messages: members select"
  on public.messages for select
  to authenticated
  using (is_room_member(room_id));

create policy "messages: members insert"
  on public.messages for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and is_room_member(room_id)
    and exists (
      select 1 from public.rooms
      where id = room_id and expires_at > now()
    )
  );
```

---

## 設計上の注意事項

- **期限切れルームのUPDATE不可**：`expires_at > now()` のCHECK制約により、期限切れたルームへのUPDATEはすべて失敗する。アーカイブ後にname/descriptionを変更できないが、意図的な副作用として許容している
- **オーナーのアカウント削除不可**：`rooms.owner_id` の ON DELETE RESTRICT により、ルームを所有するユーザーはauth.usersから削除できない。ユーザー削除機能は実装しないため問題なし
- **表示名なしでのサインアップ不可**：`handle_new_user` トリガーが明示的に例外を発生させるため、フロントエンドで必須入力として制御すること
- **`invite_code` はフロントから変更不可**：`lock_room_fields` トリガーで保護されているため、フロントから送っても元の値に戻される
- **`alter publication` は初回のみ実行**：冪等でないため2回実行するとエラーになる
- **`gen_random_uuid()` はPG13以降ビルトイン**：`pgcrypto` 拡張は不要
