-- Tighten the public read policy on site_settings.
-- The old policy was a tautology (USING (true)), letting anyone read every row.
-- The table is a singleton (id is CHECK (id = 1)), so scope reads to that row.
DROP POLICY "Settings: public read" ON public.site_settings;
CREATE POLICY "Settings: public read"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (id = 1);
