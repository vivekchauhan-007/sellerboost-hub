
-- Lead status enum
DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM ('new','contacted','qualified','closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS status public.lead_status NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS lead_type text NOT NULL DEFAULT 'contact';

-- Blog SEO
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

-- Testimonials image
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS image_url text;

-- Admin activity logs
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_activity_logs TO authenticated;
GRANT ALL ON public.admin_activity_logs TO service_role;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins read activity" ON public.admin_activity_logs;
CREATE POLICY "admins read activity" ON public.admin_activity_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins insert activity" ON public.admin_activity_logs;
CREATE POLICY "admins insert activity" ON public.admin_activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);

-- Ensure admins can update contact_submissions (status changes) and delete
DROP POLICY IF EXISTS "admins update submissions" ON public.contact_submissions;
CREATE POLICY "admins update submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins delete submissions" ON public.contact_submissions;
CREATE POLICY "admins delete submissions" ON public.contact_submissions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
