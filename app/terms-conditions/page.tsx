"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Shield, Users, HelpCircle, HardDriveDownload } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-100 flex flex-col justify-between" id="terms-page-container">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950/40 py-16 sm:py-24 border-b border-slate-900" id="terms-hero">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-transparent blur-3xl rounded-full" />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold mb-6">
              <FileText className="w-3.5 h-3.5" />
              <span>Perjanjian Hukum Layanan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4" id="terms-title">
              Syarat & Ketentuan
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed text-balance">
              Harap baca seluruh Syarat & Ketentuan penggunaan platform TemanKecil berikut dengan saksama sebelum membeli token atau memanfaatkan produk micro-tools kami.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 max-w-4xl mx-auto px-6 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed space-y-8" id="terms-content">
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>

          <div className="space-y-6 bg-slate-900/40 border border-slate-850 p-6 sm:p-10 rounded-2xl">
            
            <p className="text-slate-400 italic">
              Terakhir diperbarui: 11 Juni 2026. Dengan mengakses aplikasi, mendaftarkan akun, atau membeli paket token/credits di TemanKecil, Anda dianggap setuju untuk mengikatkan diri dalam persetujuan hukum berikut.
            </p>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                1. Registrasi & Akun Pembeli
              </h3>
              <p>
                Untuk bertransaksi (baik di dashboard maupun di landing page khusus promosi), Anda setuju untuk memberikan informasi data diri yang akurat, meliputi nama lengkap, alamat email aktif, dan nomor telepon WhatsApp. 
              </p>
              <p>
                Sistem kami akan memproses data tersebut untuk mengalokasikan akun baru beserta password temporer secara otomatis apabila email yang didaftarkan belum memiliki akun di TemanKecil. Keamanan kata sandi dan kewenangan akun seutuhnya berada di bawah tanggung jawab pengguna individual.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                2. Kebijakan Saldo Token (Credits)
              </h3>
              <p>
                Platform TemanKecil beroperasi menggunakan mata uang dalam format virtual token (credits). Setiap token yang berhasil dibeli dapat digunakan tanpa masa kedaluwarsa seumur hidup aplikasi. 
              </p>
              <p>
                Token bersifat non-transferable (tidak dapat dipindahkan atau dipasarkan kembali kepada pengguna lain) dan tidak dapat dicairkan kembali ke bentuk uang rupiah tunai di luar lingkup garansi resmi pengembalian dana kami (Refund Policy).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                3. Kebijakan Penggunaan Wajar (Fair Use Policy)
              </h3>
              <p>
                Semua micro-tools berbasis AI dan generator otomatis di TemanKecil dimaksudkan untuk mempermudah pekerjaan kreatif dan produktivitas profesional. Anda dilarang keras untuk:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-450 text-xs">
                <li>Menggunakan bot, script eksplotasi, atau scraper otomatis untuk membanjiri request server AI TemanKecil.</li>
                <li>Menghasilkan konten yang melanggar hukum, berbau kebencian (SARA), pornografi, penipuan, fitnah, atau muatan berbahaya lainnya.</li>
                <li>Mencoba mengeksploitasi celah sekuritas pada database PostgreSQL, simulator pembayaran, maupun backend sistem hosting kami.</li>
              </ul>
              <p>
                Pelanggaran atas ketentuan di atas akan berakibat pada penutupan (suspend) akses akun secara permanen tanpa adanya penggantian sisa saldo token.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span> 
                4. Batasan Tanggung Jawab
              </h3>
              <p>
                TemanKecil mengandalkan model AI generasi terbaru yang terus berkembang tingkat akurasinya. Kami tidak menjamin kelayakan mutlak hasil output teks atau data yang diekstraksi dari micro-tools untuk kebutuhan pengambilan keputusan final berisiko tinggi. Kami menyarankan Anda untuk selalu meninjau ulang output generator secara bijak sebelum menggunakannya secara resmi.
              </p>
            </div>

          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
}
