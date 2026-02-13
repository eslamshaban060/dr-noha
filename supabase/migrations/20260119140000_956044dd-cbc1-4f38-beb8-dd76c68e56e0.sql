-- Drop the old type check constraint and add a new one that includes 'review'
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('info', 'warning', 'success', 'error', 'review'));