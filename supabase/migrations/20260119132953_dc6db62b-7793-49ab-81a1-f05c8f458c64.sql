-- Allow anyone to insert notifications (for review submissions)
DROP POLICY IF EXISTS "Anyone can insert notifications" ON public.notifications;
CREATE POLICY "Anyone can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Allow moderators to view all notifications
DROP POLICY IF EXISTS "Moderators can view all notifications" ON public.notifications;
CREATE POLICY "Moderators can view all notifications"
ON public.notifications
FOR SELECT
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Allow moderators to update notifications
DROP POLICY IF EXISTS "Moderators can update notifications" ON public.notifications;
CREATE POLICY "Moderators can update notifications"
ON public.notifications
FOR UPDATE
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Allow moderators to view site visits
DROP POLICY IF EXISTS "Moderators can view visits" ON public.site_visits;
CREATE POLICY "Moderators can view visits"
ON public.site_visits
FOR SELECT
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Allow moderators to view all reviews
DROP POLICY IF EXISTS "Moderators can view all reviews" ON public.reviews;
CREATE POLICY "Moderators can view all reviews"
ON public.reviews
FOR SELECT
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Allow moderators to update reviews
DROP POLICY IF EXISTS "Moderators can update reviews" ON public.reviews;
CREATE POLICY "Moderators can update reviews"
ON public.reviews
FOR UPDATE
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Allow moderators to delete reviews
DROP POLICY IF EXISTS "Moderators can delete reviews" ON public.reviews;
CREATE POLICY "Moderators can delete reviews"
ON public.reviews
FOR DELETE
USING (has_role(auth.uid(), 'moderator'::app_role));

-- Allow moderators to view bookings
DROP POLICY IF EXISTS "Moderators can select bookings" ON public.bookings;
CREATE POLICY "Moderators can select bookings"
ON public.bookings
FOR SELECT
USING (has_role(auth.uid(), 'moderator'::app_role));