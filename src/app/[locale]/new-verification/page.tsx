"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { useTranslations } from "next-intl";

function VerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const t = useTranslations('NewVerification');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError(t('invalidToken'));
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(t('success'));
          setTimeout(() => {
            router.push("/?login=true");
          }, 2000);
        } else {
          setError(data.error || t('error'));
        }
      })
      .catch(() => {
        setError(t('error'));
      });
  }, [token, success, error, router, t]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200 text-center">
        <h1 className="mb-6 text-2xl font-bold text-[#003050]">{t('title')}</h1>
        
        {!success && !error && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0078BE] border-t-transparent"></div>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="mt-4">
            <a href="/?login=true" className="text-sm text-[#0078BE] hover:underline">{t('backToLogin')}</a>
        </div>
      </div>
    </div>
  );
}

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationForm />
    </Suspense>
  );
}
