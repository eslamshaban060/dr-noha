import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "غير مصرح" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "غير مصرح" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if caller is admin
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "يجب أن تكون مديراً لإضافة مساعدين" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return new Response(
        JSON.stringify({ error: "البريد الإلكتروني والاسم وكلمة المرور مطلوبان" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating moderator: ${email}, ${name}`);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      // User exists, check if already has moderator/admin role
      const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", existingUser.id)
        .in("role", ["admin", "moderator"])
        .maybeSingle();

      if (existingRole) {
        return new Response(
          JSON.stringify({ error: "هذا المستخدم لديه صلاحيات إدارية بالفعل" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = existingUser.id;
      console.log(`User already exists with id: ${userId}`);
    } else {
      // Create new user with the provided password
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
        },
      });

      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ error: `فشل في إنشاء المستخدم: ${createError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = newUser.user.id;
      console.log(`Created new user with id: ${userId}`);
    }

    // Update profile with name
    await supabaseAdmin
      .from("profiles")
      .upsert({
        user_id: userId,
        email,
        full_name: name,
      }, { onConflict: "user_id" });

    // Update role to moderator (remove user role first if exists, then add moderator)
    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "user");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role: "moderator",
        },
        { onConflict: "user_id,role" }
      );

    if (roleError) {
      console.error("Error setting role:", roleError);
      return new Response(
        JSON.stringify({ error: `فشل في تعيين الصلاحيات: ${roleError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully added moderator: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إضافة المساعد بنجاح",
        userId 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
