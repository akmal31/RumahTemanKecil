"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Compass, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [logoText, setLogoText] = useState("teman kecil");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.site_config?.logo) setLogoText(data.site_config.logo);
      })
      .catch(() => {});
  }, []);

  // Split logoText to give the second word a different style
  const words = logoText.split(" ");
  const firstWord = words[0] || "teman";
  const restWords = words.slice(1).join(" ") || "kecil";

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative">
            {logoText.startsWith("http") ? (
              <img
                src={logoText}
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  {/* Cyan Code Bracket Gimmick */}
                  <div className="absolute -top-3 -right-3 text-[10px] font-bold text-cyan-400 font-mono tracking-tighter">
                    &lt;/&gt;
                  </div>

                  {/* Main Chat Bubble Shape */}
                  <div className="w-10 h-10 rounded-[12px] rounded-br-[4px] bg-gradient-to-tr from-indigo-700 via-blue-600 to-blue-500 shadow-lg shadow-blue-900/40 flex items-center justify-center relative">
                    {/* Pointer for Bubble */}
                    <div className="absolute -bottom-2 -left-0 w-4 h-4 bg-indigo-700 [clip-path:polygon(0_0,100%_0,0_100%)] rounded-bl-sm"></div>

                    {/* TK Negative Space Letters */}
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      className="text-white fill-current relative z-10 translate-x-[1px]"
                    >
                      {/* T */}
                      <path d="M4 6h7v2.5H8v9.5H5v-9.5H4V6z" />
                      {/* K */}
                      <path d="M12 6h2.5v4.5l4-4.5h3.5l-4.5 4.5 5 7.5h-3.5l-3.5-5.5-1 1v4.5H12V6z" />
                    </svg>
                  </div>
                </div>

                {/* Text Logo */}
                <div className="flex items-center text-2xl tracking-tight text-white font-display ml-1">
                  <span className="font-bold">{firstWord}</span>
                  <span className="font-light opacity-90">{restWords}</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link
              href="/explore"
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Jelajahi</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4 ml-2 pl-4 border-l border-slate-800">
                {user.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900"
                  />
                  <span className="text-slate-200">{user.name}</span>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-slate-400 hover:text-red-400 ml-2"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition-colors font-bold"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div
            className="md:flex hidden lg:hidden xl:hidden 2xl:hidden sm:-mr-2 mr-0 items-center"
            style={{ display: "none" }}
          >
            {/* Kept here for alignment, real button below */}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-6 py-4 space-y-4 shadow-xl">
          <Link
            href="/explore"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-300 hover:text-white flex items-center gap-3 py-2"
          >
            <Compass className="w-5 h-5" />
            <span className="font-medium">Jelajahi</span>
          </Link>

          {user ? (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800/50">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="text-white font-medium">{user.name}</div>
                  <div className="text-slate-400 text-xs capitalize opacity-80">
                    {user.role}
                  </div>
                </div>
              </div>

              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-3 py-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">
                  Dashboard {user.role === "admin" ? "Admin" : "Member"}
                </span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-3 py-2 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-colors font-bold"
              >
                Masuk
              </Link>
            </div>
          )}
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">
              Konfirmasi Keluar
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Apakah Anda yakin ingin keluar dari sesi saat ini?
            </p>
            <div className="flex justify-end gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
