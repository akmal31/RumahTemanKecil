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
  const [showGateway, setShowGateway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedTxData, setCompletedTxData] = useState<any>(null);

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
        // IF NOT FROM LANDING and NOT AUTHENTICATED -> Must login
        if (!isFromLanding) {
          router.replace(`/login?redirect=/checkout?pkg=${pkgParam}`);
          return;
        }
      }
      setLoading(false);
    });
  }, [isFromLanding, pkgParam, router]);

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
          // Redirect user securely to the official iPaymu checkout site with buyer details pre-filled and hidden
          window.location.href = data.paymentUrl;
        } else {
          setShowGateway(true);
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

  const handleSimulatePayment = async () => {
    if (!activeTxId) return;
    setIsProcessingPayment(true);
    
    // Simulate payment gateway processing lag
    setTimeout(async () => {
      try {
        const res = await fetch("/api/checkout/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: activeTxId })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCompletedTxData(data.transaction);
          setPaymentSuccess(true);
          setShowGateway(false);
        } else {
          alert("Gagal mengonfirmasi pembayaran.");
        }
      } catch {
        alert("Gagal menghubungi server backend.");
      } finally {
        setIsProcessingPayment(false);
      }
    }, 2500);
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

        {paymentSuccess && completedTxData ? (
          /* Payment Completed Screen */
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-900/30 text-xs font-bold rounded-full uppercase">
                Pembayaran Sukses
              </span>
              <h2 className="text-2xl font-bold text-white font-display">Terima Kasih, {completedTxData.name}!</h2>
              <p className="text-slate-400 text-sm">
                Transaksi <span className="font-mono text-slate-300 font-bold">{completedTxData.id}</span> telah selesai diproses.
              </p>
            </div>

            {/* Email Notification Simulator View */}
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-300">Simulasi Resit Email Terkirim</h4>
                  <p className="text-[10px] text-slate-500">Dikirim langsung ke: <span className="text-indigo-400 font-semibold">{completedTxData.email}</span></p>
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                <p>Halo <strong>{completedTxData.name}</strong>,</p>
                <p>Pembayaran sebesar <strong>Rp {completedTxData.amount.toLocaleString("id-ID")}</strong> untuk pembelian <strong>{completedTxData.packageName} (+{completedTxData.credits} Credits)</strong> telah kami terima.</p>
                
                {completedTxData.temporaryPassword ? (
                  <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/40 rounded-xl space-y-1.5">
                    <p className="text-indigo-300 font-semibold text-[11px] uppercase tracking-wider">🔐 Akun Baru Terbuat!</p>
                    <p className="text-slate-400 text-[10px]">Gunakan detail akun berikut untuk masuk ke website TemanKecil:</p>
                    <div className="font-mono text-slate-200">
                      <div>Email: <strong className="text-white">{completedTxData.email}</strong></div>
                      <div>Password Sementara: <strong className="text-white select-all">{completedTxData.temporaryPassword}</strong></div>
                    </div>
                    <p className="text-slate-500 text-[9px] pt-1">*Segera ubah kata sandi Anda setelah masuk demi keamanan data.</p>
                  </div>
                ) : (
                  <p>Token sejumlah <strong>{completedTxData.credits} credits</strong> telah otomatis ditambahkan ke saldo akun Anda. Silakan muat ulang atau buka dashboard Anda.</p>
                )}
                
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900 flex justify-between items-center">
                  <span>TemanKecil Billing Team</span>
                  <span>Status: LUNAS/SUCCESS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => router.replace(user ? "/dashboard" : "/login")}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                {user ? "Masuk ke Dashboard" : "Masuk ke Akun Anda"}
              </button>
              <button
                onClick={() => router.replace("/")}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Billing and Form Screen */
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
        )}
      </div>

      {/* MIDTRANS / XENDIT STYLE GATEWAY SIMULATOR MODAL */}
      {showGateway && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/20 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase tracking-widest font-mono">
                  TK
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Simulator Gerbang Pembayaran</h3>
                  <p className="text-[10px] text-slate-500">Transaksi ID Segera: {activeTxId}</p>
                </div>
              </div>
              <button
                onClick={() => setShowGateway(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Batal
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="bg-indigo-950/40 p-4 border border-indigo-500/20 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400">Jumlah Tagihan</span>
                  <div className="text-xl font-black text-white">Rp {activePackage.price.toLocaleString("id-ID")}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Product</span>
                  <div className="text-xs font-bold text-slate-300">{activePackage.name}</div>
                </div>
              </div>

              {/* Payment Select Options */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Pilih Saluran Pembayaran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className={`p-3 rounded-xl border text-left flex gap-3 items-center transition-all ${paymentMethod === "qris" ? "bg-slate-820 border-indigo-500 text-white" : "bg-slate-950/40 border-slate-800 hover:border-slate-705"}`}
                  >
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0">
                      <span className="text-indigo-900 font-extrabold text-xs font-mono">QRIS</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">QRIS GoPay/Dana</div>
                      <div className="text-[10px] text-slate-500">Bayar instan via scan QR</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("va")}
                    className={`p-3 rounded-xl border text-left flex gap-3 items-center transition-all ${paymentMethod === "va" ? "bg-slate-820 border-indigo-500 text-white" : "bg-slate-950/40 border-slate-800 hover:border-slate-705"}`}
                  >
                    <div className="w-8 h-8 rounded bg-white flex items-center justify-center shrink-0">
                      <span className="text-indigo-900 font-extrabold text-[10px] font-mono">BCA VA</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Transfer Virtual Account</div>
                      <div className="text-[10px] text-slate-500">Cek otomatis 24 Jam</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Gateway Instructions */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 flex gap-3 items-start">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <p className="font-bold text-slate-300">Instruksi Pembayaran:</p>
                  {paymentMethod === "qris" ? (
                    <p>Cukup klik tombol simulasikan sukses untuk memproses pembelian instan ini. Saldo token akan langsung dialokasikan ke email pembeli.</p>
                  ) : (
                    <p>Gunakan Kode VA <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-400 font-bold font-mono">1120038892716</code> pada aplikasi banking Anda untuk melakukan simulasi transfer.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex gap-3 justify-end rounded-b-3xl">
              <button
                type="button"
                onClick={() => setShowGateway(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessingPayment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses Simulasi...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Simulasikan Sukses Bayar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
