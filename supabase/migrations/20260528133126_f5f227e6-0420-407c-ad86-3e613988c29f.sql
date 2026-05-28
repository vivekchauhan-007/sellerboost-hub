ALTER FUNCTION public.touch_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Submissions: anyone insert" ON public.contact_submissions;
CREATE POLICY "Submissions: validated insert" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 2 AND 120
    AND length(coalesce(message,'')) <= 2000
    AND length(coalesce(email,'')) <= 200
    AND length(coalesce(phone,'')) <= 30
    AND length(coalesce(business,'')) <= 200
    AND source IN ('contact','audit')
  );