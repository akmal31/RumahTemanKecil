"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Shield, FileText, PhoneCall, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-700 via-blue-600 to-blue-500 shadow-md flex items-center justify-center font-bold text-white text-xs">
              TK
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              Teman<span className="font-light text-slate-300">Kecil</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mt-2">
            Penyedia ragam micro-tools dan aplikasi digital cerdas untuk mendukung peningkatan produktivitas kerja harian Anda.
          </p>
        </div>

        {/* Navigation: Policies */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Perusahaan & Kebijakan</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/terms-conditions" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Syarat & Ketentuan (Terms)
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-500" /> Kebijakan Pengembalian (Refund)
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation: Support & FAQ */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Bantuan & Informasi</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/faq" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Pertanyaan Umum (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-500" /> Hubungi Kami & Alamat
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contact Info Mini-Panel */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Hubungi Admin</h4>
          <div className="space-y-3 mt-1">
            <div className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Jl. Cluster 34 Blok AX1 no 3, Mustikasari, Mustika Jaya, Kota Bekasi.
              </p>
            </div>
            <div className="flex gap-2.5 items-center">
              <PhoneCall className="w-4 h-4 text-sky-500 shrink-0" />
              <a href="https://wa.me/6281310077331" target="_blank" rel="noreferrer" className="text-xs hover:text-white transition-colors">
                Admin - 081310077331
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 TemanKecil AI Platform. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="font-mono text-[10px]">Bekasi, Indonesia</p>
      </div>
    </footer>
  );
}
