-- First, create the admin user if not exists
-- Note: This creates the user with the specified credentials
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'dnohagamalclinic@gmail.com';
  
  -- If user doesn't exist, we'll need to use signUp from the app
  -- But we can prepare the admin role entry
  IF new_user_id IS NOT NULL THEN
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (new_user_id, 'د. نهى جمال عبدالمالك', 'dnohagamalclinic@gmail.com')
    ON CONFLICT (user_id) DO UPDATE SET
      full_name = 'د. نهى جمال عبدالمالك',
      email = 'dnohagamalclinic@gmail.com';
  END IF;
END $$;