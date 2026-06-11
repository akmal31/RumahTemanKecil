"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PhoneCall, 
  MapPin, 
  Mail, 
  Send, 
  Clock, 
  MessageSquare, 
  ArrowLeft, 
  CheckCircle2,
  ExternalLink 
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Kemitraan & Integrasi",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Harap lengkapi semua kolom pesan!");
      return;
    }
    setFormSubmitted(true);
    // Auto reset submission view
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", subject: "Kemitraan & Integrasi", message: "" });
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-100 flex flex-col justify-between" id="contact-page-container">
      <div>
        <Navbar />

        {/* Hero Banner Header Section */}
        <section className="relative overflow-hidden bg-slate-950/40 py-16 sm:py-24 border-b border-slate-900" id="contact-hero">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-transparent blur-3xl rounded-full" />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="px-3 py-1 bg-blue-950/60 border border-blue-900/30 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
              Hubungi Kami
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display mt-4 mb-2" id="contact-title">
              Alamat & Kontak Admin
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed text-balance">
              Ada pertanyaan, kendala pembelin, proposal kerjasama, atau ingin konsultasi kustomisasi tool? Tim kami siap melayani Anda.
            </p>
          </div>
        </section>

        {/* Info Grid Structure Section */}
        <section className="py-16 max-w-6xl mx-auto px-6" id="contact-details-grid">
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side details cards */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-extrabold text-white text-xl font-display">Saluran Informasi & Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kami memprioritaskan komunikasi responsif secara langsung demi keamanan dan kenyamanan transaksi Anda.
                </p>
              </div>

              {/* Physical Address Card */}
              <div className="bg-slate-900 border border-slate-805/80 rounded-3xl p-6 space-y-4 shadow-xl hover:border-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-900/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-sm">Alamat Kantor Utama</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Jl. Cluster 34 Blok AX1 no 3, Mustikasari, Mustika Jaya, Kota Bekasi, Jawa Barat.
                  </p>
                </div>
                <a 
                  href="https://maps.google.com/?q=Jl.Cluster+34+Blok+AX1+no+3,+Mustikasari,+Mustika+Jaya,+Kota+Bekasi" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:underline pt-1"
                >
                  Buka di Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Whatsapp Contact Card */}
              <div className="bg-slate-900 border border-slate-805/80 rounded-3xl p-6 space-y-4 shadow-xl hover:border-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-900/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-sm">Kontak Admin</h4>
                  <p className="text-xs text-slate-300 font-mono font-bold">
                    Admin - 081310077331
                  </p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Tersedia via obrolan WhatsApp dan telepon langsung untuk bantuan teknis dan billing cepat.
                  </p>
                </div>
                <a 
                  href="https://wa.me/6281310077331" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/20 inline-flex items-center gap-2 transition-all mt-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Obrolan WhatsApp Instan
                </a>
              </div>

              {/* Working Hours Card */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 flex items-center gap-4">
                <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <p className="font-bold text-slate-300">Jam Operasional CS:</p>
                  <p>Setiap Hari: 08.00 WIB - 22.00 WIB</p>
                </div>
              </div>

            </div>

            {/* Right side contact email form */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              {formSubmitted ? (
                <div className="h-[300px] flex flex-col justify-center items-center text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Pesan Anda Berhasil Ditransmisikan</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Terima kasih telah menghubungi kami. Kami akan memeriksa email Anda dalam waktu maksimal 1x24 jam kerja.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-lg">Kirim Pesan Surel</h3>
                    <p className="text-xs text-slate-400">Atau langsung isi formulir dinamis di bawah ini.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full bg-slate-950 border border-slate-805/80 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Alamat Email Anda
                      </label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Contoh: budi@gmail.com"
                        className="w-full bg-slate-950 border border-slate-805/80 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Subjek Permasalahan / Tujuan
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-805/80 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none text-slate-300"
                    >
                      <option value="Kemitraan & Integrasi">Kemitraan & Integrasi</option>
                      <option value="Masalah Teknis AI Tools">Masalah Teknis AI Tools</option>
                      <option value="Billing & Saldo Koin">Billing & Saldo Koin</option>
                      <option value="Saran & Masukan Baru">Saran & Masukan Baru</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Rincian Pesan / Keluhan
                    </label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      placeholder="Jelaskan kebutuhan atau kendala Anda secara ringkas..."
                      className="w-full bg-slate-950 border border-slate-805/80 rounded-xl p-4 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-950/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim Pesan Sekarang
                  </button>

                </form>
              )}

            </div>

          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
}
