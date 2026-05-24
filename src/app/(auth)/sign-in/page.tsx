import type { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return <SignInForm />;
}
