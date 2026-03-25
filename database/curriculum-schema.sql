-- --- CURRICULUM SCHEMA ---
-- Secure, OWASP Compliant, RLS Hardened

-- 1. Create Courses Table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor_id UUID REFERENCES auth.users NOT NULL,
  price DECIMAL DEFAULT 0,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Lessons Table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Enrollments Table
CREATE TABLE public.enrollments (
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses NOT NULL,
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies
-- Policy: Anyone can view published courses
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = TRUE);

-- Policy: Only instructor can edit their own courses
CREATE POLICY "Instructors can edit their own courses"
  ON public.courses FOR UPDATE
  USING (instructor_id = auth.uid());

-- Policy: Students can view lessons for enrolled courses
CREATE POLICY "Students can view lessons for enrolled courses"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE user_id = auth.uid() AND course_id = public.lessons.course_id
    )
  );

-- Policy: Students can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id = auth.uid());
