/*
  # Create poses table

  1. New Tables
    - `poses`
      - `id` (text, primary key) - Unique pose ID
      - `title` (text) - Pose title
      - `description` (text) - Pose description
      - `imageUrl` (text) - URL to pose image (Cloudflare R2)
      - `category` (text) - Category the pose belongs to
      - `created_at` (timestamptz) - When pose was created
      - `updated_at` (timestamptz) - When pose was last updated

  2. Indexes
    - Index on `category` for faster filtering
*/

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

-- Enable RLS (optional - for public read access)
ALTER TABLE poses ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can view poses"
  ON poses
  FOR SELECT
  USING (true);


