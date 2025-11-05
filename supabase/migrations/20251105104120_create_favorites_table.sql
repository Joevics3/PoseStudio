/*
  # Create favorites table

  1. New Tables
    - `favorites`
      - `id` (text, primary key) - Unique pose ID
      - `title` (text) - Pose title
      - `description` (text) - Pose description
      - `imageUrl` (text) - URL to pose image
      - `category` (text) - Category the pose belongs to
      - `isFavorite` (boolean) - Always true for favorites
      - `created_at` (timestamptz) - When favorite was added

  2. Security
    - Enable RLS on `favorites` table
    - Public read access for all users (no auth required for this demo app)
    - Public insert/delete access for managing favorites
*/

CREATE TABLE IF NOT EXISTS favorites (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  "imageUrl" text NOT NULL,
  category text NOT NULL,
  "isFavorite" boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view favorites"
  ON favorites
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can remove favorites"
  ON favorites
  FOR DELETE
  USING (true);
