"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import {
  LoginFormSchema,
  RegisterFormSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  DeleteAccountSchema,
  type LoginFormState,
  type RegisterFormState,
  type ForgotPasswordFormState,
  type ResetPasswordFormState,
  type ChangePasswordFormState,
  type DeleteAccountFormState,
} from "@/lib/definitions";

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const redirectTo = (formData.get("redirect") as string | null) || "/dashboard";

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/dashboard");
}

export async function register(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  const redirectTo = (formData.get("redirect") as string | null) || "/dashboard";

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;

  // Check if username is already taken
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return {
      errors: {
        username: ["This username is already taken."],
      },
    };
  }

  const supabase = await createClient();

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  // Create user in database with Prisma
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          username,
        },
      });

      // Initialize streak for the user
      await prisma.streak.create({
        data: {
          userId: data.user.id,
        },
      });
    } catch (dbError) {
      console.error("Error creating user in database:", dbError);
      // User was created in Supabase Auth but failed to create in DB
      // You might want to handle this case differently
    }
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/dashboard");
}

export async function forgotPassword(
  state: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  // Validate form fields
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Check your email for a password reset link.",
  };
}

export async function resetPassword(
  state: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  // Validate form fields
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Password updated successfully!",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function changePassword(
  state: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const validatedFields = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return { message: "Not authenticated." };
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return {
      errors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { message: error.message };
  }

  return {
    success: true,
    message: "Password updated successfully!",
  };
}

export async function deleteAccount(
  state: DeleteAccountFormState,
  formData: FormData
): Promise<DeleteAccountFormState> {
  const validatedFields = DeleteAccountSchema.safeParse({
    confirmation: formData.get("confirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Not authenticated." };
  }

  const userId = user.id;

  // Delete user data from database (cascade will handle related records)
  // Use deleteMany to avoid errors if user doesn't exist
  try {
    const result = await prisma.user.deleteMany({
      where: { id: userId },
    });
    
    if (result.count === 0) {
      console.log(`[Delete Account] User ${userId} not found in database, may have been already deleted`);
    }
  } catch (error) {
    console.error("Error deleting user data:", error);
    // Continue anyway - try to delete from Supabase Auth
  }

  // Delete user from Supabase Auth using admin client
  try {
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error("Error deleting user from Supabase Auth:", deleteError);
      // Continue anyway - database is already deleted
    }
  } catch (error) {
    console.error("Error creating admin client or deleting user:", error);
    // Continue anyway - database is already deleted
  }

  // Sign out
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/?deleted=true");
}
