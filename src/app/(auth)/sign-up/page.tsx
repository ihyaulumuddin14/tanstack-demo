import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account to get started",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
