"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { useTranslations } from "next-intl";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const t = useTranslations('ResetPassword');

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError(t('passwordRequired'));
      return;
    }

    const result = await newPassword(password, token);

    if (result.success) {
      setSuccess(t('success'));
      setTimeout(() => {
        router.push("/?login=true");
      }, 2000);
    } else {
      setError(result.error || t('error'));
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
      <h1 className="mb-6 text-center text-2xl font-bold text-[#003050]">{t('title')}</h1>
      
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('passwordLabel')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0078BE] focus:outline-none focus:ring-1 focus:ring-[#0078BE]"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#0078BE] py-2 font-medium text-white hover:bg-[#006098]"
        >
          {t('submit')}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
