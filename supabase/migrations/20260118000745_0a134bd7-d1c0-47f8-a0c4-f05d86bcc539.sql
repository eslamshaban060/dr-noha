-- Remove the overly permissive INSERT policy from bookings table
-- The application sends booking data via WhatsApp, not to the database
-- Removing this policy prevents unauthorized direct API inserts
DROP POLICY IF EXISTS "Anyone can create booking" ON public.bookings;