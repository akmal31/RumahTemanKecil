"use client";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, Shield, HardDrive, KeyRound } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    password: "",
  });
  const [toolsCount, setToolsCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/tools", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([sessionData, toolsData]) => {
        if (!sessionData.authenticated) {
          router.replace("/login");
        } else {
          setUser(sessionData.user);
          setFormData({
            name: sessionData.user.name || "",
            avatar: sessionData.user.avatar || "",
            password: "",
          });
          setToolsCount(Array.isArray(toolsData) ? toolsData.length : 0);
        }
      })
      .catch((e) => {
        console.error(e);
        router.replace("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage("Menyimpan...");
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          name: formData.name,
          avatar: formData.avatar,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage("Berhasil diperbarui!");
        setUser(data.user); // Update locally
        setTimeout(() => {
          setIsEditing(false);
          setSaveMessage("");
        }, 1500);
      } else {
        setSaveMessage(data.error || "Gagal memperbarui");
      }
    } catch (err) {
      setSaveMessage("Kesalahan jaringan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-50 pb-20">
        <Navbar />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8 font-display">
          Dashboard Member
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Profil */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                Informasi Pengguna
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
                >
                  Edit Profil
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={handleSave}
                className="space-y-5 animate-in fade-in"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5 opacity-60">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Email (Tidak bisa diubah)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    Password Baru (Kosongkan jika tidak diubah)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    URL Avatar
                  </label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSaveMessage("");
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                </div>
                {saveMessage && (
                  <p className="text-sm text-indigo-400 mt-2">{saveMessage}</p>
                )}
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-inner"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nama
                    </p>
                    <p className="text-lg font-medium text-white">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-lg font-medium text-gray-300">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Role
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold">
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Navigasi & Stats */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  Aplikasi Terdaftar
                </p>
                <p className="text-3xl font-display font-bold md:text-4xl">
                  {toolsCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-indigo-400" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Navigasi Utama
              </h3>
              <div className="space-y-3">
                <Link
                  href="/explore"
                  className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Settings className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Explore Menu</p>
                    <p className="text-xs text-slate-500">
                      Lihat semua aplikasi
                    </p>
                  </div>
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <Shield className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Admin Panel</p>
                      <p className="text-xs text-slate-500">
                        Kelola sistem & user
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
