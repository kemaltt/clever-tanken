"use client";

import { useState } from "react";
// import Link from "next/link"; // Removed
import { X, Menu, User, LogOut, Settings, Eye, EyeOff, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn, signOut, useSession } from "next-auth/react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter as useNextRouter } from "next/navigation";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Sidebar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [verificationError, setVerificationError] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  // State for messages replaced by toast
  // const [loginError, setLoginError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const nextRouter = useNextRouter();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { openFavorites } = useFavorites();
  const { isSidebarOpen: isOpen, toggleSidebar, closeSidebar } = useSidebar();
  
  const t = useTranslations('Sidebar');
  const tAuth = useTranslations('Auth');

  const handleResendVerification = async () => {
    const { resendVerification } = await import("@/actions/resend-verification");
    const result = await resendVerification(email);
    
    if (result.success) {
      setResendSuccess(true);
      toast.success(tAuth('sent'));
      setTimeout(() => setResendSuccess(false), 5000);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = t('email') + " erforderlich"; // Fallback simple validation msg
    }
    if (!password.trim()) {
      newErrors.password = t('password') + " erforderlich";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setVerificationError(false);
    setResendSuccess(false);
    // setLoginError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log("Login failed, checking verification...");
      const { checkEmailVerification } = await import("@/actions/check-verification");
      const { verified, hasPassword } = await checkEmailVerification(email);
      
      
      if (hasPassword && verified === false) {
        setVerificationError(true);
      } else {
        // setLoginError(tAuth('loginError'));
        toast.error(tAuth('loginError'));
      }
    } else if (result?.ok) {
      closeSidebar();
      nextRouter.refresh();
      setLoading(false);
    }
    
    // If we are here and not redirected/ok, stop loading if error
    if (result?.error) {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success(tAuth('logoutSuccess'));
    nextRouter.refresh();
  };

  const changeLanguage = (locale: string) => {
      router.replace(pathname, {locale});
  };

  return (
    <>
      {/* Burger Menu Button (Fixed to top right or part of a minimal header) */}
      <button
        onClick={toggleSidebar}
        className="fixed right-4 top-10 z-50 rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
      >
        <Menu className="h-6 w-6 text-[#0078BE]" />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-[#F5F7F9] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="mb-8 self-start text-[#0078BE] hover:text-[#006098]"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-6 text-lg font-medium text-[#003050]">
            <Link href="/" onClick={toggleSidebar} className="text-[#0078BE]">
              {t('home')}
            </Link>
            <button 
              onClick={() => {
                toggleSidebar();
                openFavorites();
              }} 
              className="text-left hover:text-[#0078BE]"
            >
              {t('favorites')}
            </button>
            <Link href="#" className="hover:text-[#0078BE]">
              {t('statistics')}
            </Link>
            <Link href="#" className="hover:text-[#0078BE]">
              {t('deals')}
            </Link>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Auth Section */}
          <div className="mt-auto">
            {session?.user ? (
              // Logged In View
              <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003050] text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate font-bold text-[#003050]">{session.user.name || "Benutzer"}</p>
                    <p className="truncate text-xs text-gray-500">{session.user.email}</p>
                  </div>
                </div>
                
                <hr className="border-gray-100" />
                
                <button className="flex items-center gap-2 text-sm font-medium text-[#003050] hover:text-[#0078BE]">
                  <Settings className="h-4 w-4" />
                  {t('account')}
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              // Login Form View
              <>
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full border-2 border-[#003050] p-2">
                    <User className="h-10 w-10 text-[#003050]" />
                  </div>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <div>
                    <input
                      type="email"
                      placeholder={t('email')}
                      className={`w-full rounded border p-2 text-sm focus:outline-none ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#0078BE]"
                      }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('password')}
                      className={`w-full rounded border p-2 pr-10 text-sm focus:outline-none ${
                        errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#0078BE]"
                      }`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-[#003050]">
                    <input type="checkbox" id="keep-logged-in" className="rounded border-gray-300" />
                    <label htmlFor="keep-logged-in">{t('keepLoggedIn')}</label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 rounded bg-[#0078BE] py-2 font-bold text-white hover:bg-[#006098] disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? t('loggingIn') : t('login')}
                  </button>
                </form>

                {/* Login error shown via toast */}

                {verificationError && (
                  <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm">
                    <p className="font-medium text-yellow-800">{tAuth('verifyEmail')}</p>
                    <button
                      onClick={handleResendVerification}
                      className="mt-2 text-sm font-medium text-[#0078BE] hover:underline"
                    >
                      {tAuth('resend')}
                    </button>
                  </div>
                )}

                {resendSuccess && (
                  <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    {tAuth('sent')}
                  </div>
                )}

                <div className="mt-4 flex justify-between text-xs text-[#0078BE]">
                  <Link href="/register" onClick={toggleSidebar}>
                    {t('register')}
                  </Link>
                  <Link href="/forgot-password" onClick={toggleSidebar}>{t('forgotPassword')}</Link>
                </div>
              </>
            )}

            {/* Language Switcher */}
            <div className="mt-6 flex justify-center gap-4 text-sm font-medium text-gray-500">
                <button onClick={() => changeLanguage('de')} className="hover:text-[#0078BE]">DE</button>
                <div className="border-r border-gray-300"></div>
                <button onClick={() => changeLanguage('en')} className="hover:text-[#0078BE]">EN</button>
                <div className="border-r border-gray-300"></div>
                <button onClick={() => changeLanguage('tr')} className="hover:text-[#0078BE]">TR</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
