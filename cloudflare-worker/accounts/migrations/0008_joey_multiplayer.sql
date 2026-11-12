CREATE TABLE IF NOT EXISTS joey_presence (
  profile_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  deck_index INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL DEFAULT 'ready',
  created_at INTEGER NOT NULL,
  refreshed_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_joey_presence_lobby ON joey_presence(group_key, module_key, state, expires_at);

CREATE TABLE IF NOT EXISTS joey_challenges (
  challenge_id TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  challenger_account_id TEXT NOT NULL,
  challenger_profile_id TEXT NOT NULL,
  challenged_account_id TEXT NOT NULL,
  challenged_profile_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  resolved_at INTEGER,
  match_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_joey_challenges_challenger ON joey_challenges(challenger_profile_id, state);
CREATE INDEX IF NOT EXISTS idx_joey_challenges_challenged ON joey_challenges(challenged_profile_id, state);

CREATE TABLE IF NOT EXISTS joey_matches (
  match_id TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  side_a_account_id TEXT NOT NULL,
  side_a_profile_id TEXT NOT NULL,
  side_b_account_id TEXT NOT NULL,
  side_b_profile_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  winner_side TEXT,
  completion_reason TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_joey_matches_group ON joey_matches(group_key, status);

CREATE TABLE IF NOT EXISTS joey_active_match (
  profile_id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  side TEXT NOT NULL,
  group_key TEXT NOT NULL,
  module_key TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_joey_active_match_match ON joey_active_match(match_id);

CREATE TABLE IF NOT EXISTS joey_match_results (
  match_id TEXT PRIMARY KEY,
  module_key TEXT NOT NULL,
  side_a_profile_id TEXT NOT NULL,
  side_b_profile_id TEXT NOT NULL,
  winner_side TEXT,
  completion_reason TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  completed_at INTEGER NOT NULL
);
