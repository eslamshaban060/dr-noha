-- Drop existing restrictive policies and create permissive ones for reviews
DROP POLICY IF EXISTS "Anyone can create review" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;

-- Create PERMISSIVE policies for reviews
CREATE POLICY "Anyone can create review" 
ON public.reviews 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
TO public
USING (status = 'approved');

CREATE POLICY "Admins can view all reviews" 
ON public.reviews 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reviews" 
ON public.reviews 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews" 
ON public.reviews 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix user_roles policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

CREATE POLICY "Users can view own role" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));