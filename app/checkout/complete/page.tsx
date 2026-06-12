/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [txData, setTxData] = useState<any>(null);

  useEffect(() => {
    if (!txId) {
      setError("ID Transaksi tidak ditemukan.");
      setLoading(false);
      return;
    }

    // Process the checkout complete API to settle package credits and guest account
    fetch("/api/checkout/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: txId })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setTxData(data.transaction);
        } else {
          setError(data.error || "Gagal memproses detail pembayaran.");
        }
      })
      .catch(() => {
        setError("Koneksi ke backend terputus.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [txId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Memverifikasi transaksi aman...</p>
      </div>
    );
  }

  return (
    <div id="payment-complete-wrapper" className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-16">
        {error ? (
          <div id="error-card" className="bg-slate-900 border border-red-500/20 rounded-3xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
              ✕
            </div>
            <h2 className="text-xl font-bold text-white">Verifikasi Gagal</h2>
            <p className="text-slate-400 text-sm">{error}</p>
            <button
              id="back-home-btn"
              onClick={() => router.replace("/")}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : txData ? (
          <div id="receipt-card" className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-900/30 text-xs font-bold rounded-full uppercase">
                Pembayaran Sukses
              </span>
              <h2 className="text-2xl font-bold text-white font-display">Terima Kasih, {txData.name}!</h2>
              <p className="text-slate-400 text-sm">
                Transaksi <span className="font-mono text-slate-300 font-bold">{txData.id}</span> telah berhasil diverifikasi oleh sistem iPaymu.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-300">Resit Email & Alokasi Akun</h4>
                  <p className="text-[10px] text-slate-500">Dikirim langsung ke: <span className="text-indigo-400 font-semibold">{txData.email}</span></p>
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                <p>Halo <strong>{txData.name}</strong>,</p>
                <p>Pembayaran sebesar <strong>Rp {txData.amount.toLocaleString("id-ID")}</strong> untuk pembelian <strong>{txData.packageName} (+{txData.credits} Credits)</strong> telah kami terima.</p>
                
                {txData.temporaryPassword ? (
                  <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/40 rounded-xl space-y-1.5">
                    <p className="text-indigo-300 font-semibold text-[11px] uppercase tracking-wider">🔐 Detail Login Akun Baru:</p>
                    <p className="text-slate-400 text-[10px]">Silakan masuk dengan kredensial sementara ini:</p>
                    <div className="font-mono text-slate-200">
                      <div>Email: <strong className="text-white">{txData.email}</strong></div>
                      <div>Password Sementara: <strong className="text-white select-all">{txData.temporaryPassword}</strong></div>
                    </div>
                    <p className="text-slate-500 text-[9px] pt-1">*Segera ubah kata sandi di menu dashboard demi keamanan Anda.</p>
                  </div>
                ) : (
                  <p>Token sejumlah <strong>{txData.credits} credits</strong> telah otomatis ditambahkan ke saldo akun Anda. Silakan muat ulang atau buka dashboard Anda.</p>
                )}
                
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-950 flex justify-between items-center font-mono">
                  <span>TemanKecil Billing Team</span>
                  <span className="text-emerald-400 font-bold">LUNAS/SUCCESS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                id="complete-to-dashboard-btn"
                onClick={() => router.replace("/dashboard")}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Ke Dashboard <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="complete-to-home-btn"
                onClick={() => router.replace("/")}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <div id="invalid-card" className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Transaksi Tidak Valid</h2>
            <p className="text-slate-400 text-sm">Kami tidak menemukan data transaksi Anda.</p>
            <button
              id="invalid-back-btn"
              onClick={() => router.replace("/")}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Memverifikasi transaksi aman...</p>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
