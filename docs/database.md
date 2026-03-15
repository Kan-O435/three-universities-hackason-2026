# データベース設計・RLS定義

## テーブル設計

### `users`
| カラム | 型 | 制約 |
|---|---|---|
| id | uuid | PK、auth.usersと紐づけ ON DELETE CASCADE |
| display_name | text | NOT NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| updated_at | timestamptz | NOT NULL DEFAULT now() |

- `id` はauth.usersのIDをそのまま使用（DEFAULT gen_random_uuidは不要）
- アイコン色はクライアント側でIDから生成するためDBには持たない

---

### `rooms`
| カラム | 型 | 制約 |
|---|---|---|
| id | uuid | PK、DEFAULT gen_random_uuid()、招待URLにそのまま使用 |
| name | text | NOT NULL、最大50文字 |
| description | text | nullable、最大200文字 |
| owner_id | uuid | NOT NULL、→ users ON DELETE RESTRICT |
| expires_at | timestamptz | NOT NULL、CHECK (expires_at > now()) |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| updated_at | timestamptz | NOT NULL DEFAULT now() |

- `is_archived` カラムは持たない。`expires_at < now()` で期限切れ判定を行う
- 招待コードは持たない。`id`（UUID）が招待URLとなる
- 期限切れルームへのUPDATEはCHECK制約により失敗する（意図的）

---

### `room_members`
| カラム | 型 | 制約 |
|---|---|---|
| id | uuid | PK、DEFAULT gen_random_uuid() |
| room_id | uuid | NOT NULL、→ rooms ON DELETE CASCADE |
| user_id | uuid | NOT NULL、→ users ON DELETE CASCADE |
| joined_at | timestamptz | NOT NULL DEFAULT now() |

- `(room_id, user_id)` にユニーク制約

---

### `messages`
| カラム | 型 | 制約 |
|---|---|---|
| id | uuid | PK、DEFAULT gen_random_uuid() |
| room_id | uuid | NOT NULL、→ rooms ON DELETE CASCADE |
| user_id | uuid | NOT NULL、→ users ON DELETE CASCADE |
| content | text | NOT NULL、最大2000文字 |
| created_at | timestamptz | NOT NULL DEFAULT now() |

- メッセージの編集・削除機能はない
- 期限切れ後もメンバーはメッセージを読むことができる（送信は不可）

---

## インデックス

| テーブル | 対象カラム | 理由 |
|---|---|---|
| messages | `(room_id, created_at)` | チャット履歴の時系列取得 |
| room_members | `user_id` | ユーザーの参加ルーム一覧取得 |
| room_members | `room_id` | メンバー一覧・RLSチェック |

---

## Realtime

| テーブル | 設定 | 理由 |
|---|---|---|
| messages | REPLICA IDENTITY FULL | チャットのリアルタイム更新 |
| room_members | REPLICA IDENTITY FULL | メンバー参加のリアルタイム更新 |

---

## トリガー

| トリガー名 | テーブル | タイミング | 内容 |
|---|---|---|---|
| `on_auth_user_created` | auth.users | AFTER INSERT | public.usersに自動作成 |
| `on_room_created` | rooms | AFTER INSERT | オーナーをroom_membersに自動追加 |
| `lock_expires_at` | rooms | BEFORE UPDATE | expires_at・owner_idの変更を無効化 |
| `update_rooms_updated_at` | rooms | BEFORE UPDATE | updated_atを自動更新 |
| `update_users_updated_at` | users | BEFORE UPDATE | updated_atを自動更新 |

- roomsのBEFORE UPDATEトリガーはアルファベット順で実行される
  - `lock_expires_at`（l）→ `update_rooms_updated_at`（u）の順が保証される

---

## RLS ポリシー

### 共通関数（無限ループ防止）

`room_members` を自己参照するとRLSが無限再帰になるため、SECURITY DEFINER関数を介して解決する。

```sql
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
```

---

### `users`
| 操作 | ロール | 条件 |
|---|---|---|
| SELECT | anon, authenticated | 常に許可（参加ページでオーナー名表示のため） |
| INSERT | — | 不可（on_auth_user_createdトリガーで自動作成） |
| UPDATE | authenticated | `auth.uid() = id`（自分のみ） |

### `rooms`
| 操作 | ロール | 条件 |
|---|---|---|
| SELECT | anon, authenticated | 常に許可（未ログインでも参加ページ表示のため） |
| INSERT | authenticated | `owner_id = auth.uid()` |
| UPDATE | authenticated | `auth.uid() = owner_id`（expires_at・owner_idはトリガーで変更不可） |
| DELETE | — | 不可 |

### `room_members`
| 操作 | ロール | 条件 |
|---|---|---|
| SELECT | authenticated | `is_room_member(room_id) = true` |
| INSERT | authenticated | `user_id = auth.uid()` かつ `expires_at > now()` |
| UPDATE | — | 不可 |
| DELETE | — | 不可（退出・キック機能なし） |

### `messages`
| 操作 | ロール | 条件 |
|---|---|---|
| SELECT | authenticated | `is_room_member(room_id) = true`（期限切れ後も読める） |
| INSERT | authenticated | `user_id = auth.uid()` かつ `is_room_member(room_id) = true` かつ `expires_at > now()` |
| UPDATE | — | 不可 |
| DELETE | — | 不可 |

---

## SQL（全文）

```sql
-- =====================================================
-- Tables
-- =====================================================

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
-- Realtime
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
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.lock_room_fields()
returns trigger
language plpgsql
as $$
begin
  new.expires_at := old.expires_at;
  new.owner_id   := old.owner_id;
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

-- =====================================================
-- Triggers
-- =====================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger on_room_created
  after insert on public.rooms
  for each row execute function public.handle_new_room();

-- アルファベット順で lock_expires_at が先に実行される
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
create policy "users: public select"
  on public.users for select
  to anon, authenticated
  using (true);

create policy "users: update own"
  on public.users for update
  to authenticated
  using     (auth.uid() = id)
  with check (auth.uid() = id);

-- rooms
create policy "rooms: public select"
  on public.rooms for select
  to anon, authenticated
  using (true);

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
create policy "room_members: members select"
  on public.room_members for select
  to authenticated
  using (is_room_member(room_id));

create policy "room_members: join non-expired room"
  on public.room_members for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.rooms
      where id = room_id and expires_at > now()
    )
  );

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

- **期限切れルームのUPDATE不可**：`expires_at > now()` のCHECK制約により、期限切れたルームへのUPDATEはすべて失敗する。アーカイブ後にname/descriptionを変更できないのは意図的な副作用として許容している
- **オーナーのアカウント削除不可**：`rooms.owner_id` の ON DELETE RESTRICT により、ルームを所有するユーザーはauth.usersから削除できない。ユーザー削除機能は実装しないため問題なし
- **表示名なしでのサインアップ不可**：`handle_new_user` トリガーがNOT NULL制約に違反してエラーになるため、フロントエンドで必須入力として制御する
