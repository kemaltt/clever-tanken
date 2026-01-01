"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/register";
import { useSidebar } from "@/contexts/SidebarContext";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const t = useTranslations('Register');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);
    
    setLoading(false);

      if (result.success) {
        setSuccess(t('success'));
      } else {
        setError(result.error || t('failed'));
      }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-lg ring-1 ring-border">
        <h1 className="mb-6 text-center text-2xl font-bold">{t('title')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t('name')}</label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('email')}</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('password')}</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? t('loading') : t('submit')}
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
          {t('alreadyAccount')}{" "}
          <button 
            onClick={() => {
              router.push("/");
              setTimeout(() => openSidebar(), 100);
            }}
            className="font-medium text-primary hover:underline"
          >
            {t('login')}
          </button>
        </div>
      </div>
    </div>
  );
}
