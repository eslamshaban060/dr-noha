-- Fix: Drop all restrictive policies and recreate as PERMISSIVE
-- Reviews table - need to be PERMISSIVE for OR logic
DROP POLICY IF EXISTS "Anyone can create review" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Public can insert reviews" 
ON public.reviews 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can view approved reviews" 
ON public.reviews 
AS PERMISSIVE
FOR SELECT 
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Admins can view all reviews" 
ON public.reviews 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews" 
ON public.reviews 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews" 
ON public.reviews 
AS PERMISSIVE
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- User roles table - need to be PERMISSIVE for OR logic
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view own role" 
ON public.user_roles 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
AS PERMISSIVE
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix site_visits and bookings to be permissive as well
DROP POLICY IF EXISTS "Admins can view visits" ON public.site_visits;
DROP POLICY IF EXISTS "Anyone can insert visits" ON public.site_visits;

CREATE POLICY "Admins can view visits" 
ON public.site_visits 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert visits" 
ON public.site_visits 
AS PERMISSIVE
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage bookings" ON public.bookings;

CREATE POLICY "Admins can select bookings" 
ON public.bookings 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert bookings" 
ON public.bookings 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings" 
ON public.bookings 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings" 
ON public.bookings 
AS PERMISSIVE
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix notifications policies
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" 
ON public.notifications 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" 
ON public.notifications 
AS PERMISSIVE
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage notifications" 
ON public.notifications 
AS PERMISSIVE
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'));