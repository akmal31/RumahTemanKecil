"use client";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function Explore() {
  const [tools, setTools] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch("/api/tools", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setTools(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = tools.filter((t) => filter === "All" || t.type === filter);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentTools = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 relative">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4 font-display">
          Eksplorasi TemanKecil
        </h1>
        <p className="text-slate-400 max-w-2xl mb-12">
          Temukan berbagai alat bantu dan hiburan interaktif yang dirancang
          khusus untuk memacu imajinasi dan logika.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {["All", "AI Based", "Non-AI Based"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${filter === f ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30" : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"}`}
            >
              {f === "All" ? "Semua Aplikasi" : f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentTools.map((tool) => (
            <div
              key={tool.id}
              className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
            >
              <div className="h-40 w-full overflow-hidden bg-slate-800 relative">
                {tool.image && (
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[9px] font-bold tracking-wider uppercase text-slate-300">
                  {tool.type}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
                  {tool.description}
                </p>
                <a
                  href={tool.url}
                  className="w-full py-2.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-center text-sm font-semibold transition-colors"
                >
                  Buka Aplikasi
                </a>
              </div>
            </div>
          ))}
          {currentTools.length === 0 && (
            <div className="col-span-full text-center py-32 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              Tidak ada aplikasi yang ditemukan.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 border border-slate-800 rounded-xl bg-slate-900 text-slate-300 disabled:opacity-50 hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 text-slate-400 text-sm font-medium">
              Hal {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 border border-slate-800 rounded-xl bg-slate-900 text-slate-300 disabled:opacity-50 hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
