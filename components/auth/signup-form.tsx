"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signup, type SignupState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignupState = { error: null, success: false };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [email, setEmail] = useState("");

  function handleCompanyNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCompanyName(e.target.value);
    setCompanySlug(slugify(e.target.value));
  }

  if (state.success) {
    return (
      <div className="flex flex-col gap-3 text-center">
        <p className="text-sm font-medium text-foreground">Check your email</p>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your email address. Click it to activate
          your account and sign in.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company_name">Company name</Label>
        <Input
          id="company_name"
          name="company_name"
          type="text"
          required
          value={companyName}
          onChange={handleCompanyNameChange}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company_slug">
          Company URL{" "}
          <span className="text-muted-foreground font-normal">
            (your-company.com/acme/careers)
          </span>
        </Label>
        <Input
          id="company_slug"
          name="company_slug"
          type="text"
          placeholder="acme"
          pattern="[a-z0-9-]+"
          required
          value={companySlug}
          onChange={(e) => setCompanySlug(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm_password">Confirm password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
