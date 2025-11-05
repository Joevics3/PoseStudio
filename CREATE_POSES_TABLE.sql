-- Run this SQL in your Supabase SQL Editor to create the poses table
-- Go to: Supabase Dashboard > SQL Editor > New Query > Paste this > Run

CREATE TABLE IF NOT EXISTS poses (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  "imageUrl" text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_poses_category ON poses(category);

-- Enable RLS (Row Level Security)
ALTER TABLE poses ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can view poses"
  ON poses
  FOR SELECT
  USING (true);

-- Verify the table was created
SELECT * FROM poses LIMIT 1;


