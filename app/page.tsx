"use client";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, Sparkles, LayoutGrid, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [tools, setTools] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        // Once we have settings, fetch tools and filter by showcase_tools
        fetch("/api/tools", { cache: "no-store" })
          .then((r) => r.json())
          .then((allTools) => {
            if (data.showcase_tools && data.showcase_tools.length > 0) {
              const highlighted = allTools.filter((t: any) =>
                data.showcase_tools.includes(t.id),
              );
              setTools(highlighted.slice(0, 6)); // ensure max 6
            } else {
              setTools([]);
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, []);

  const headline =
    settings?.site_config?.headline ||
    "Waktumu Terlalu Berharga Untuk Bekerja Manual.";
  // We can split headline to color the last two words for the gimmick
  const words = headline.trim().split(" ");
  let coloredPart = "";
  let regularPart = headline;
  if (words.length > 2) {
    coloredPart = words.slice(-2).join(" ");
    regularPart = words.slice(0, -2).join(" ");
  }

  const subheadline =
    settings?.site_config?.subheadline ||
    "Jangan biarkan potensimu tertahan rutinitas. Kami menyediakan puluhan micro-tools dan aplikasi digital cerdas yang dirancang khusus untuk memangkas waktu kerja dan melipatgandakan hasilmu.";
  const testimonials =
    settings?.testimonials?.length > 0
      ? settings.testimonials
      : [
          {
            text: "Berkat TemanKecil, pekerjaan copywrite untuk produk ratusan SKU bisa selesai dalam 2 hari. Benar-benar game changer!",
            name: "Sarah M.",
            role: "Digital Marketer",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          },
          {
            text: "Invoice generator dan CRM sederhananya ngurangin pusing ngurus klien freelance. Sumpah ini UI-nya enak dan ga bikin ribet.",
            name: "Deni Pratama",
            role: "Freelance Designer",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deni",
          },
          {
            text: "Banyak tools yang harganya mahal, tapi di sini bundled dan efektif banget bikin startup kecil kayak kami bisa sprint lebih cepat.",
            name: "Reza F.",
            role: "Founder Startup",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reza",
          },
        ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 text-slate-50 relative">
      <Navbar />

      {/* Hero Section (Dark Elegant with Gimmick) */}
      <section className="relative overflow-hidden bg-slate-950 pt-10 sm:pt-16 lg:pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-transparent blur-3xl rounded-full" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Temukan Tools Digital Penunjang Produktivitas</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-display">
            {regularPart}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {coloredPart}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed text-balance">
            {subheadline}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/explore"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-900/20 transition-all flex items-center gap-2 group"
            >
              Jelajahi Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section (Slightly Brighter) */}
      <section className="py-24 bg-slate-900 border-y border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">
              {settings?.categories_config?.title || "Kategori Aplikasi"}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {settings?.categories_config?.description ||
                "Kami mengelompokkan alat produktivitas dalam dua kategori utama untuk menyesuaikan dengan workflow modern."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {settings?.categories_config?.items?.map((item: any, i: number) => (
              <div
                key={i}
                className="rounded-3xl bg-slate-950/50 overflow-hidden border border-slate-800 hover:border-indigo-500/30 transition-colors group flex flex-col"
              >
                <div className="w-full h-48 overflow-hidden bg-slate-900 border-b border-slate-800/50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <LayoutGrid className="w-12 h-12 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Fallback if no items defined */}
            {(!settings?.categories_config?.items ||
              settings.categories_config.items.length === 0) && (
              <>
                <div className="rounded-3xl bg-slate-950/50 overflow-hidden border border-slate-800 hover:border-indigo-500/30 transition-colors group flex flex-col">
                  <div className="w-full h-48 overflow-hidden bg-slate-900 border-b border-slate-800/50 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-12 h-12 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-3">
                      AI Based Tools
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Asisten cerdas yang memanfaatkan kecerdasan buatan untuk
                      mengotomatisasi generasi teks, analisis data, dan
                      memberikan wawasan cerdas dalam hitungan detik.
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-950/50 overflow-hidden border border-slate-800 hover:border-blue-500/30 transition-colors group flex flex-col">
                  <div className="w-full h-48 overflow-hidden bg-slate-900 border-b border-slate-800/50 flex items-center justify-center text-blue-400">
                    <LayoutGrid className="w-12 h-12 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Non-AI Based Tools
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      Alat bantu utilitas cepat bermutu tinggi untuk pemrosesan
                      file presisi, manajemen database ringan, dan utilitas
                      berbasis logika yang sangat andal.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Apps (Dark) */}
      <section className="py-24 bg-slate-950 relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4 font-display">
                Aplikasi Pilihan
              </h2>
              <p className="text-slate-400 max-w-xl">
                Coba beberapa alat bantu favorit yang paling sering digunakan
                para profesional untuk mempercepat pekerjaan harian mereka.
              </p>
            </div>
            <Link
              href="/explore"
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Lihat Semuanya <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all"
              >
                <div className="h-48 w-full overflow-hidden bg-slate-800 relative">
                  {tool.image ? (
                    <img
                      src={tool.image}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-bold tracking-wider uppercase text-slate-300">
                    {tool.type}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-grow">
                    {tool.description}
                  </p>
                  <Link
                    href={tool.url || "#"}
                    className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-center text-sm font-semibold transition-colors"
                  >
                    Coba Sekarang
                  </Link>
                </div>
              </div>
            ))}
            {tools.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                Belum ada aplikasi yang terdaftar. Administrator dapat
                menambahkannya di Dashboard.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section (Brighter slate-900 or slate-950) */}
      <section className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 font-display">
              Pilihan Paket Token TemanKecil
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Sistem pengisian saldo credit yang transparan dan fleksibel. Pilih paket token yang sesuai dengan skala kebutuhan operasional bisnis Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
                <div className="flex items-baseline justify-start gap-1 my-4">
                  <span className="text-sm font-medium text-slate-400">Rp</span>
                  <span className="text-4xl font-extrabold text-white font-display">
                    {parseInt(settings?.site_setting?.starter_price || "49000").toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-slate-800/60">Cocok untuk penguasaan awal dan uji coba fitur produktivitas.</p>
                <ul className="space-y-3 text-slate-300 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Dapatkan <strong className="text-white">{settings?.site_setting?.starter_credits || "5"} Token / Credits</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Akses ke semua micro-tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Tanpa masa kedaluwarsa</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="block w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-center text-xs font-bold transition-all"
              >
                Top-up Starter
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-indigo-950/20 to-slate-950 border-2 border-indigo-500/80 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Terpopuler
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pro Sprint</span>
                <div className="flex items-baseline justify-start gap-1 my-4">
                  <span className="text-sm font-medium text-slate-400">Rp</span>
                  <span className="text-4xl font-extrabold text-white font-display">
                    {parseInt(settings?.site_setting?.pro_price || "99000").toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-indigo-500/10">Skala ideal untuk kreator konten dan bisnis berkembang fast-paced.</p>
                <ul className="space-y-3 text-slate-300 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Dapatkan <strong className="text-white">{settings?.site_setting?.pro_credits || "25"} Token / Credits</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Prioritas pemrosesan server AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Akses premium ke semua rilis baru</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-center text-xs font-bold transition-all shadow-lg shadow-indigo-900/20"
              >
                Top-up Pro
              </Link>
            </div>

            {/* Max Plan */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Elite</span>
                <div className="flex items-baseline justify-start gap-1 my-4">
                  <span className="text-sm font-medium text-slate-400">Rp</span>
                  <span className="text-4xl font-extrabold text-white font-display">
                    {parseInt(settings?.site_setting?.max_price || "179000").toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 pb-6 border-b border-slate-800/60">Selesaikan seluruh tumpukan tugas tanpa batas atau restriksi.</p>
                <ul className="space-y-3 text-slate-300 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Dapatkan <strong className="text-white">{settings?.site_setting?.max_credits === "-1" || settings?.site_setting?.max_credits === -1 ? "Tanpa Batas" : (settings?.site_setting?.max_credits || "Custom")} Token</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Bebas kuota penggunaan harian</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">✓</span>
                    <span>Konsultasi deployment khusus admin</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="block w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-center text-xs font-bold transition-all"
              >
                Top-up Max
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial (Brighter Slate 900) */}
      <section className="py-24 bg-slate-900 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-12 h-12 text-blue-500/50" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-16 font-display">
            Testimoni Pengguna
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-2xl p-8 border border-slate-800 relative text-left"
              >
                <div className="text-4xl text-slate-800 font-serif absolute top-4 left-6">
                  &quot;
                </div>
                <p className="text-slate-300 text-sm relative z-10 italic mb-6 leading-relaxed">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        t.img ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`
                      }
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <span className="text-xs text-slate-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>
          &copy; 2026 TemanKecil AI Platform. Dirancang khusus untuk Profesional
          dan Bisnis.
        </p>
      </footer>
    </div>
  );
}
