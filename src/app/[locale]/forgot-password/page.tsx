"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { resetPassword } from "@/actions/reset-password";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Bitte geben Sie Ihre E-Mail-Adresse ein.");
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      setSuccess("E-Mail zum Zurücksetzen des Passworts wurde gesendet.");
    } else {
      setError(result.error || "Etwas ist schief gelaufen.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#003050]">Passwort vergessen?</h1>
        
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
            <label className="mb-1 block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#0078BE] focus:outline-none focus:ring-1 focus:ring-[#0078BE]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#0078BE] py-2 font-medium text-white hover:bg-[#006098]"
          >
            Link zum Zurücksetzen senden
          </button>
        </form>
      </div>
    </div>
  );
}
