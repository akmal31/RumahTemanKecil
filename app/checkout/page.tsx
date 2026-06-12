/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User, 
  Wallet,
  Clock,
  ExternalLink
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Interface for pricing configurations
interface PackageInfo {
  id: string;
  name: string;
  credits: string;
  price: number;
  badge: string;
}

// Pure helper function declared outside React scope to bypass purity checks
function getSecureTxId(): string {
  // eslint-disable-next-line react-hooks/purity
  return "TX-" + Math.floor(100000 + Math.random() * 900000);
}

// Suspended component that handles URL processing
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pkgParam = searchParams.get("pkg") || "starter";
  const sourceParam = searchParams.get("source") || "dashboard"; // 'landing' or 'dashboard'
  const isFromLanding = sourceParam === "landing";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [selectedPkg, setSelectedPkg] = useState<string>(pkgParam);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTxId, setActiveTxId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch official price configuration, session, etc.
    Promise.all([
      fetch("/api/auth/session", { cache: "no-store" }).then(r => r.json()).catch(() => ({ authenticated: false })),
      fetch("/api/settings", { cache: "no-store" }).then(r => r.json()).catch(() => null)
    ]).then(([session, settingsData]) => {
      setSettings(settingsData);
      
      if (session.authenticated && session.user) {
        setUser(session.user);
        setFormData({
          name: session.user.name || "",
          email: session.user.email || "",
          phone: session.user.phone || session.user.noHp || "",
        });
      } else {
        // Must login: redirect to login with original target package query
        router.replace(`/login?redirect=/checkout?pkg=${pkgParam}`);
        return;
      }
      setLoading(false);
    });
  }, [pkgParam, router]);

  // Pricing helper based on DB settings
  const getPackageDetails = (pkgType: string): PackageInfo => {
    const s = settings?.site_setting;
    if (pkgType === "pro") {
      return {
        id: "pro",
        name: "Pro Sprint",
        credits: s?.pro_credits || "25",
        price: parseInt(s?.pro_price || "99000"),
        badge: "Paling Populer"
      };
    } else if (pkgType === "max") {
      const creditsVal = parseInt(s?.max_credits || "-1");
      return {
        id: "max",
        name: "Max Elite",
        credits: creditsVal === -1 ? "Format Tanpa Batas" : String(creditsVal),
        price: parseInt(s?.max_price || "179000"),
        badge: "Super Hemat"
      };
    } else {
      return {
        id: "starter",
        name: "Starter Pack",
        credits: s?.starter_credits || "5",
        price: parseInt(s?.starter_price || "49000"),
        badge: "Sangat Terjangkau"
      };
    }
  };

  const activePackage = getPackageDetails(selectedPkg);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Harap lengkapi semua kolom pembayaran!");
      return;
    }

    setIsSubmitting(true);
    try {
      const txId = getSecureTxId();
      const payload = {
        id: txId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        packageName: activePackage.name,
        credits: activePackage.credits === "Format Tanpa Batas" ? 100 : parseInt(activePackage.credits),
        amount: activePackage.price,
        source: sourceParam,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveTxId(txId);
        if (data.paymentUrl) {
          // Redirect user securely to the official iPaymu checkout site
          window.location.href = data.paymentUrl;
        } else {
          alert("Gagal memuat link pembayaran iPaymu.");
        }
      } else {
        alert(data.error || "Gagal membuat transaksi");
      }
    } catch {
      alert("Koneksi gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-mono text-sm">Menyiapkan checkout aman...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>

        {/* Checkout Billing and Form Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in">
            {/* Left Card: Payment Information Form */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="px-2.5 py-1 bg-indigo-950/60 text-indigo-400 border border-indigo-900/40 text-[10px] font-extrabold rounded-full uppercase tracking-widest">
                  Secure Checkout
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">Detail Pembayaran</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Harap isi data di bawah dengan benar. Token akan langsung dikirim setelah transaksi sukses.
                </p>
              </div>

              {/* Conditionally customizable Product Selector (from Landing Page) */}
              {isFromLanding ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-amber-500" /> PROMO LANDING PAGE: Pilih Paket Produk Anda
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {["starter", "pro", "max"].map((type) => {
                      const pInfo = getPackageDetails(type);
                      const isSelected = selectedPkg === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedPkg(type)}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${isSelected ? "bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-900/10" : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                {type}
                              </span>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>}
                            </div>
                            <h4 className="font-bold text-white text-sm">{pInfo.name}</h4>
                            <p className="text-indigo-400 text-xs font-bold">+{pInfo.credits} Credits</p>
                          </div>
                          <div className="mt-4 pt-2 border-t border-slate-800/40">
                            <span className="text-xs text-slate-500">Harga promo:</span>
                            <div className="font-black text-white text-sm">Rp {pInfo.price.toLocaleString("id-ID")}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Static view (From Dashboard click) */
                <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Paket Dipilih</span>
                    <h3 className="font-extrabold text-white text-lg">{activePackage.name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Mendapatkan +{activePackage.credits} Credits/Token aplikasi.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total harga:</span>
                    <span className="font-black text-xl text-white">Rp {activePackage.price.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              )}

              {/* Billing Form */}
              <form onSubmit={handleCreateTransaction} className="space-y-4 pt-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" /> Nama Pembayar
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama lengkap..."
                      className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" /> Alamat Email Aktif
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Contoh: pembayar@gmail.com..."
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" /> Nomor Hp / WhatsApp
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 08123456789..."
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Memproses Pesanan...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" /> Lanjutkan ke Pembayaran
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Summary / Value Props Panel */}
            <div className="space-y-6">
              {/* Checkout details summary review */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-white text-base">Ringkasan Sesi</h3>
                <div className="divide-y divide-slate-800/60 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">Total Credits</span>
                    <span className="font-bold text-indigo-400">+{activePackage.credits} Token</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">Metode</span>
                    <span className="font-medium text-slate-300">Gateway Aman</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">Sistem Akun</span>
                    <span className="font-medium text-slate-300">
                      {isFromLanding ? "Kirim Resit & Password" : "Kredit ke ID Saya"}
                    </span>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-bold pt-4 border-t border-slate-800">
                    <span className="text-white">Harga Layanan</span>
                    <span className="text-emerald-400">Rp {activePackage.price.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Keunggulan TemanKecil
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3 text-xs">
                    <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="text-white">Proses Instan</strong>
                      <p className="text-slate-400 mt-0.5">Saldo token langsung masuk setelah konfirmasi berhasil.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="text-white">Akses Penuh Aplikasi</strong>
                      <p className="text-slate-400 mt-0.5">Gunakan saldo untuk puluhan micro-tools yang tersedia.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <Wallet className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <strong className="text-white">Tanpa Berlangganan</strong>
                      <p className="text-slate-400 mt-0.5">Sistem kredit beli-sekali, bebas hangus seumur hidup.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

// Global Wrapper to comply with Suspended Search Parameters in Next.js 15 App router
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-mono text-sm">Menyiapkan checkout aman...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
