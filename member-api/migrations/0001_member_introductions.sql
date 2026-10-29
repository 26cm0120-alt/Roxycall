CREATE TABLE IF NOT EXISTS member_introductions (
    user_id TEXT PRIMARY KEY,
    introduction TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
