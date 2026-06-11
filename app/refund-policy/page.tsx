"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, HelpCircle, ArrowLeft, Mail, AlertTriangle, Coins, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-100 flex flex-col justify-between" id="refund-policy-page-container">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950/40 py-16 sm:py-24 border-b border-slate-900" id="refund-hero">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 to-transparent blur-3xl rounded-full" />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparansi Jaminan Layanan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4" id="refund-title">
              Kebijakan Pengembalian Dana
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed text-balance">
              Kami menghargai kepercayaan Anda. Pahami syarat dan prosedur refund demi kepuasan menggunakan platform TemanKecil.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-4xl mx-auto px-6" id="refund-content-section">
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Sidebar quick notes */}
            <div className="space-y-4 md:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Garansi Kami</span>
                <h4 className="font-bold text-white text-sm">7-Hari Jaminan Uang Kembali</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Jika saldo token tidak masuk atau terjadi kekeliruan sistem billing lainnya, Anda dilindungi penuh oleh garansi kami.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Metode Refund</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dana akan dikirimkan kembali ke rekening bank asal atau dompet digital Anda dalam waktu 1-3 hari kerja.
                </p>
              </div>
            </div>

            {/* Main policies */}
            <div className="md:col-span-2 space-y-8 bg-slate-900/40 border border-slate-850 p-6 sm:p-8 rounded-3xl">
              
              {/* Point 1 */}
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <h3 className="font-bold text-white text-base">Kelayakan Pengembalian Dana</h3>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm leading-relaxed space-y-2 pl-11">
                  <p>Anda dianggap memenuhi syarat pengajuan refund secara penuh apabila:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>Terjadi error transaksi ganda (payment gateway memproses tagihan Anda dua kali).</li>
                    <li>Sistem billing gagal menyinkronkan pembelian token, dan token tidak bertambah dalam waktu 24 jam setelah pembayaran lunas.</li>
                    <li>Layanan micro-tools yang bersangkutan tidak dapat diakses (sistem down total) secara berkepanjangan selama lebih dari 48 jam berturut-turut.</li>
                  </ul>
                </div>
              </div>

              {/* Point 2 */}
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <h3 className="font-bold text-white text-base">Kondisi yang Tidak Dapat Dilembagakan (Non-Refundable)</h3>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm leading-relaxed space-y-2 pl-11">
                  <p>Pengembalian dana ditolak apabila:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>Kredit/token yang dibeli telah dikonsumsi/digunakan untuk menjalankan micro-tools (lebih dari 20% token dalam paket telah terpakai).</li>
                    <li>Pengajuan dilakukan setelah melewati jangka waktu 7 (tujuh) hari dari tanggal transaksi.</li>
                    <li>Ditemukan indikasi kecurangan, penyalahgunaan fungsionalitas sistem, atau aktivitas lain yang melanggar Syarat dan Ketentuan layanan.</li>
                  </ul>
                </div>
              </div>

              {/* Point 3 */}
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <h3 className="font-bold text-white text-base">Prosedur Pengajuan Refund</h3>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-11 space-y-3">
                  <p>
                    Silakan ikuti instruksi berikut untuk memproses pengembalian dana secepatnya:
                  </p>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-300 text-xs">Kirimkan Bukti Pembayaran ke Admin:</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Sampaikan keluhan dan lampirkan tangkapan layar (screenshot) bukti pembayaran sukses beserta Invoice ID melalui WhatsApp ke: 
                        <strong className="text-indigo-400 ml-1">Admin - 081310077331</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
}
