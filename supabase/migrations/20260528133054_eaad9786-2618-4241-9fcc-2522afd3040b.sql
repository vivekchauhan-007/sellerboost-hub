-- Roles enum and helper
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile on signup; first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles policies
CREATE POLICY "Profiles: own select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Profiles: own update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Roles: select authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles: admin insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Roles: admin delete" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============= CONTENT TABLES =============

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name text NOT NULL DEFAULT 'SellerBoost',
  tagline text DEFAULT '',
  phone text DEFAULT '+91 98765 43210',
  email text DEFAULT 'hello@sellerboost.in',
  whatsapp_number text DEFAULT '919876543210',
  address text DEFAULT 'WeWork Galaxy, Residency Road, Bengaluru 560025',
  facebook_url text DEFAULT '#',
  instagram_url text DEFAULT '#',
  linkedin_url text DEFAULT '#',
  twitter_url text DEFAULT '#',
  disclaimer text DEFAULT 'SellerBoost is an independent third-party service provider and is not affiliated with, endorsed by, or part of Flipkart Internet Pvt. Ltd.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings: public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Settings: admin update" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Settings: admin insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id) VALUES (1);

-- Pricing plans
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text DEFAULT '',
  price_inr int NOT NULL,
  period text NOT NULL DEFAULT 'month',
  features text[] NOT NULL DEFAULT '{}',
  cta_label text NOT NULL DEFAULT 'Get Started',
  cta_url text NOT NULL DEFAULT '/contact',
  payment_url text DEFAULT '',
  highlighted boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_plans TO anon, authenticated;
GRANT ALL ON public.pricing_plans TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.pricing_plans TO authenticated;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans: public read active" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Plans: admin write" ON public.pricing_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'ListChecks',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services: public read active" ON public.services FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Services: admin write" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text DEFAULT '',
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  initials text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials: public read active" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Testimonials: admin write" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Results stats
CREATE TABLE public.results_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'TrendingUp',
  value text NOT NULL,
  label text NOT NULL,
  description text DEFAULT '',
  tone text NOT NULL DEFAULT 'primary',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.results_stats TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.results_stats TO authenticated;
GRANT ALL ON public.results_stats TO service_role;
ALTER TABLE public.results_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Results: public read active" ON public.results_stats FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Results: admin write" ON public.results_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text DEFAULT 'General',
  cover_image_url text DEFAULT '',
  author text DEFAULT 'SellerBoost Team',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog: public read published" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Blog: admin write" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'contact',
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  business text DEFAULT '',
  sales_range text DEFAULT '',
  message text DEFAULT '',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submissions: anyone insert" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Submissions: admin read" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Submissions: admin update" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Submissions: admin delete" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger for blog
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============= SEED DATA =============
INSERT INTO public.pricing_plans (name, tagline, price_inr, features, highlighted, sort_order) VALUES
('Basic', 'For new Flipkart sellers', 2499, ARRAY['20 product listings','Inventory updates','Basic catalog support','Email support','Monthly report'], false, 1),
('Growth', 'Most chosen by growing brands', 4599, ARRAY['100 product listings','Sponsored Ads management','Weekly performance reports','Account health monitoring','Priority chat support'], true, 2),
('Premium', 'Full done-for-you service', 7999, ARRAY['Unlimited listings','Full account management','Dedicated account manager','Daily ad optimization','24/7 support + WhatsApp'], false, 3);

INSERT INTO public.services (icon, title, description, sort_order) VALUES
('ListChecks','Product Listing Optimization','Keyword-rich titles, bullets and A+ content that rank and convert.',1),
('FolderKanban','Catalog Management','Bulk uploads, variants and error-free catalog operations at scale.',2),
('Megaphone','Sponsored Ads Management','PCA & PLA campaigns optimized daily for maximum ROAS.',3),
('Boxes','Inventory Management','Smart restocking, FBF coordination, zero stock-out planning.',4),
('PackageCheck','Order & Return Handling','Reduce RTO, manage returns and protect your seller rating.',5),
('HeartPulse','Account Health Management','Resolve violations, appeals and keep your seller score healthy.',6),
('Search','Product SEO Optimization','Search rank improvements with data from Flipkart insights.',7),
('Store','Brand Store Setup','Beautiful, conversion-focused brand storefronts on Flipkart.',8);

INSERT INTO public.testimonials (name, role, quote, initials, sort_order) VALUES
('Rahul Mehta','Founder, UrbanWear India','SellerBoost took our monthly Flipkart revenue from ₹3L to ₹14L in 5 months. Their ad optimization is just incredible.','RM',1),
('Priya Sharma','Director, Saanvi Crafts','We finally got out of account violations and our listings rank on page 1. Worth every rupee — best Flipkart agency in India.','PS',2),
('Arjun Reddy','CEO, TechBuy Electronics','The team is super responsive and reports are crystal clear. ROAS jumped from 2.1x to 6.4x within 60 days.','AR',3),
('Neha Gupta','Owner, GlowKart Beauty','From cataloging to brand store setup, everything was handled. My sales doubled in the first quarter itself.','NG',4),
('Vikram Singh','Founder, FitNest Sports','Truly data-driven. They explain every move and you can actually see the impact in dashboards.','VS',5),
('Ananya Iyer','Director, Aroma Living','Account health was a nightmare before SellerBoost. Now we get only growth conversations, not violation emails.','AI',6);

INSERT INTO public.results_stats (icon, value, label, description, tone, sort_order) VALUES
('TrendingUp','+312%','Avg. Sales Growth','in first 90 days across active clients','primary',1),
('Eye','+185%','Product Visibility','improvement in Flipkart search rankings','accent',2),
('RotateCcw','-42%','Return Rate','reduction through catalog & QC improvements','success',3),
('BadgeIndianRupee','5.8x','Avg. ROAS','from optimized Sponsored Ads campaigns','primary',4);

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, published, published_at) VALUES
('flipkart-listing-hacks','10 Flipkart Listing Hacks That Doubled Our Clients'' Sales','Title structure, keyword placement, image strategy — the playbook we use every day.','Full article content goes here. Edit from the admin panel.','Listings',true, now() - interval '1 day'),
('pla-vs-pca','Sponsored PLA vs PCA: Which Should You Run First?','A practical breakdown for sellers spending under ₹50K/month on Flipkart ads.','Full article content goes here.','Ads',true, now() - interval '10 days'),
('reduce-return-rate','How to Reduce Flipkart Return Rate by 40%','Catalog QA, product descriptions and packaging tips that cut RTO drastically.','Full article content goes here.','Operations',true, now() - interval '30 days');