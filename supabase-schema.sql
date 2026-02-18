-- Supabase Database Schema for Footle Leaderboard
-- Run this in your Supabase SQL Editor

-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGSERIAL PRIMARY KEY,
  game_type TEXT NOT NULL,
  nickname TEXT NOT NULL,
  guesses INTEGER NOT NULL,
  time INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_game_type_date ON leaderboard(game_type, date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_date ON leaderboard(date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at);

-- Create custom shared games table
CREATE TABLE IF NOT EXISTS custom_games (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  target_player_id INTEGER NOT NULL,
  selected_leagues TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_games_slug ON custom_games(slug);
CREATE INDEX IF NOT EXISTS idx_custom_games_created_at ON custom_games(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_games ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read leaderboard entries
CREATE POLICY "Anyone can view leaderboard entries"
  ON leaderboard
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert leaderboard entries
CREATE POLICY "Anyone can insert leaderboard entries"
  ON leaderboard
  FOR INSERT
  WITH CHECK (true);

-- Custom game policies
CREATE POLICY "Anyone can view custom games"
  ON custom_games
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert custom games"
  ON custom_games
  FOR INSERT
  WITH CHECK (true);

-- Optional: Create a function to clean up old leaderboard entries (run daily)
-- This keeps only the last 30 days of data
CREATE OR REPLACE FUNCTION clean_old_leaderboard_entries()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM leaderboard
  WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$$;

-- Optional: Create a cron job to run the cleanup function daily at midnight
-- Note: Requires pg_cron extension (available in Supabase)
-- SELECT cron.schedule(
--   'clean-old-leaderboard',
--   '0 0 * * *',
--   'SELECT clean_old_leaderboard_entries();'
-- );
