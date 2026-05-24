"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignUp } from "@/features/auth/hooks/use-sign-up";

export function SignUpForm() {
  const { mutateAsync: signUp, isPending, error } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signUp({ name, email, password });
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details below to get started
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error.message ?? "Failed to create account. Please try again."}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="signup-password"
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                disabled={isPending}
              />
            </div>
          </div>

          <Button
            id="signup-submit"
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 pt-5">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
