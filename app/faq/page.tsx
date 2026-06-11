"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Sparkles, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Apa itu TemanKecil?",
      answer: "TemanKecil adalah asisten produktivitas digital serbaguna yang menyajikan ratusan micro-tools berbasis kecerdasan buatan (AI) serta utilitas praktis lainnya. Platform kami dirancang khusus untuk membantu profesional, pengusaha, penulis, kreatif, dan developer mempercepat alur kerja harian mereka dengan mengotomatiskan tugas-tugas repetitive."
    },
    {
      question: "Bagaimana sistem saldo token / credits di TemanKecil bekerja?",
      answer: "Kami menggunakan model Bayar Sekali Pakai (Pay-as-you-go) melalui system kredit saldo token. Satu kali penggunaan tools umumnya mengonsumsi 1 kredit token. Saldo token yang telah dibeli aktif selamanya tanpa batas kedaluwarsa, artinya Anda tidak perlu pusing berlangganan bulanan."
    },
    {
      question: "Apakah tersedia jaminan pengembalian dana?",
      answer: "Ya, kami berkomitmen pada kualitas layanan kami. Jika terdapat kesalahan sistem yang mengakibatkan token gagal teralokasi, atau Anda mengalami kegagalan teknis berulang saat menjalankan fitur, Anda berhak mengajukan pengembalian dana penuh dalam waktu 7 hari setelah pembelian. Selengkapnya dapat Anda tinjau pada halaman Kebijakan Refund."
    },
    {
      question: "Bagaimana jika koin/token tidak bertambah otomatis setelah pembayaran?",
      answer: "Sistem gerbang pembayaran pembayaran kami dikonfigurasi untuk memeriksa status pesanan secara real-time. Namun jika terjadi gangguan sinkronisasi, Anda dapat segera menekan tombol 'Hubungi Admin' atau mengirim pesan WhatsApp langsung ke Administrator kami di nomor 081310077331 dengan menyertakan Invoice ID. Admin kami akan segera melakukan kredit manual dalam waktu kurang dari 10 menit."
    },
    {
      question: "Dapatkah saya mengusulkan micro-tool atau fitur baru?",
      answer: "Tentu saja! Kami sangat senang mendengar saran dari pengguna. Sebagian besar micro-tools terbaik kami lahir dari umpan balik komunitas. Anda bisa langsung menghubungi tim Admin kami untuk mengajukan usulan fitur baru."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-100 flex flex-col justify-between" id="faq-page-container">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950/40 py-16 sm:py-24 border-b border-slate-900" id="faq-hero">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-transparent blur-3xl rounded-full" />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Bantuan TemanKecil</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display mb-4" id="faq-title">
              Pertanyaan Umum (FAQ)
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed text-balance">
              Temukan jawaban tercepat untuk segala kesalahpahaman, instruksi penggunaan kredit, atau bantuan transaksi di bawah ini.
            </p>
          </div>
        </section>

        {/* FAQ Contents */}
        <section className="py-16 max-w-3xl mx-auto px-6" id="faq-content-section">
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
          </Link>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div 
                  key={i} 
                  id={`faq-item-${i}`}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(i)}
                    className="w-full text-left p-5 flex justify-between items-center bg-slate-900 hover:bg-slate-850/60 transition-colors"
                  >
                    <span className="font-bold text-white text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] border-t border-slate-850 bg-slate-950/30" : "max-h-0"}`}
                  >
                    <p className="p-5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt banner for additional supports */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950/20 border border-slate-800 rounded-3xl p-6 sm:p-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-bold text-white text-base">Masih punya pertanyaan lain?</h4>
              <p className="text-xs text-slate-400">Tim bantuan teknis kami siap memandu Anda 24 jam penuh.</p>
            </div>
            <Link 
              href="/contact" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-950/30 transition-all shrink-0"
            >
              Hubungi CS TemanKecil
            </Link>
          </div>

        </section>
      </div>

      <Footer />
    </div>
  );
}
