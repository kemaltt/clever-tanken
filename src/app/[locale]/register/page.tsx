"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/register";
import { useSidebar } from "@/contexts/SidebarContext";

export default function RegisterPage() {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

      if (result.success) {
        setSuccess("Bestätigungs-E-Mail gesendet! Bitte überprüfen Sie Ihr Postfach.");
      } else {
        setError(result.error || "Registration failed");
      }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-lg ring-1 ring-border">
        <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Register
          </button>
        </form>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button 
            onClick={() => {
              router.push("/");
              setTimeout(() => openSidebar(), 100);
            }}
            className="font-medium text-primary hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
