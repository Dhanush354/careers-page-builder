"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export interface LoginState {
  error: string | null;
}

export interface SignupState {
  error: string | null;
  success: boolean;
  fields?: {
    fullName: string;
    companyName: string;
    companySlug: string;
    email: string;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const companySlug = slugify(String(formData.get("company_slug") ?? "").trim());
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  const saved = { fields: { fullName, companyName, companySlug, email } };

  if (!fullName || !companyName || !companySlug || !email || !password) {
    return { error: "All fields are required.", success: false, ...saved };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false, ...saved };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: false, ...saved };
  }
  if (!/^[a-z0-9-]+$/.test(companySlug)) {
    return { error: "Company URL can only contain lowercase letters, numbers, and hyphens.", success: false, ...saved };
  }

  const supabase = await createClient();

  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists.", success: false, ...saved };
    }
    return { error: authError.message, success: false, ...saved };
  }

  if (!authData.user) {
    return { error: "Sign up failed. Please try again.", success: false, ...saved };
  }

  // Use service role to insert company + profile (no authenticated INSERT policy)
  const adminClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: company, error: companyError } = await adminClient
    .from("companies")
    .insert({ name: companyName, slug: companySlug })
    .select()
    .single();

  if (companyError) {
    if (companyError.message.includes("unique") || companyError.code === "23505") {
      return { error: "That company URL is already taken. Please choose another.", success: false, ...saved };
    }
    return { error: "Failed to create company. Please try again.", success: false, ...saved };
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .insert({ id: authData.user.id, company_id: company.id, full_name: fullName });

  if (profileError) {
    await adminClient.from("companies").delete().eq("id", company.id);
    return { error: "Failed to create profile. Please try again.", success: false, ...saved };
  }

  // If email confirmation is disabled, user has a session — redirect to dashboard
  if (authData.session) {
    redirect("/dashboard");
  }

  // Email confirmation required
  return { error: null, success: true };
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();

  let signInError;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    signInError = error;
  } catch {
    return {
      error: "We couldn't reach the sign-in service. Please try again shortly.",
    };
  }

  if (signInError) {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
