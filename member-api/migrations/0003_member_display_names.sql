CREATE TABLE IF NOT EXISTS member_display_names (
  user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
