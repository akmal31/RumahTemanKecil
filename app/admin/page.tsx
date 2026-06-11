"use client";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  LayoutDashboard,
  Settings as SettingsIcon,
  AppWindow,
  Users,
  Menu,
  X,
  CreditCard,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "tools" | "settings" | "users" | "landing_page" | "transactions"
  >("dashboard");
  const [settingsSubTab, setSettingsSubTab] = useState<
    "branding" | "showcase" | "categories" | "testimonials" | "pricing" | "tutorials"
  >("branding");
  const [tools, setTools] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [settings, setSettings] = useState<any>({
    site_config: { logo: "teman kecil", headline: "", subheadline: "" },
    showcase_tools: [],
    testimonials: [],
    site_setting: {
      starter_price: "49000",
      starter_credits: "5",
      pro_price: "99000",
      pro_credits: "25",
      max_price: "179000",
      max_credits: "-1",
      tutorial_youtube_url: "",
      tutorial_description: "",
    },
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileAdminMenuOpen, setIsMobileAdminMenuOpen] = useState(false);

  // Dialog and Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    message: string;
  } | null>(null);

  const showSuccess = (message: string) => {
    setSuccessPopup({ isOpen: true, message });
    setTimeout(() => {
      setSuccessPopup(null);
    }, 2000);
  };

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "AI Based",
    image: "",
    videoEmbed: "",
    description: "",
    url: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const userItemsPerPage = 6;
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    credit: 0,
  });

  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showLandingForm, setShowLandingForm] = useState(false);
  const [isEditingLanding, setIsEditingLanding] = useState(false);
  const [landingFormData, setLandingFormData] = useState({
    slug: "",
    htmlContent: "",
  });

  const fetchLandingPages = async () => {
    try {
      const res = await fetch("/api/settings/landing", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setLandingPages(data.landingPages || []);
      }
    } catch (e) {
      console.error("Gagal mengambil data landing pages", e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/settings/transactions", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error("Gagal mengambil logs transaksi", e);
    }
  };

  useEffect(() => {
    if (activeTab === "landing_page") {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      fetchLandingPages();
    } else if (activeTab === "transactions") {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      fetchTransactions();
    }
  }, [activeTab]);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated || data.user?.role !== "admin") {
          setLoading(false);
          router.replace("/login");
        } else {
          setIsAdmin(true);
          loadLists();
        }
      })
      .catch((e) => {
        console.error("Session fetch failed", e);
        setLoading(false);
        router.replace("/login");
      });
  }, [router]);

  function loadLists() {
    setLoading(true);
    Promise.all([
      fetch("/api/tools", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/users", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/settings", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => ({})),
    ])
      .then(([toolsData, usersData, settingsData]) => {
        setTools(Array.isArray(toolsData) ? toolsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        if (settingsData) {
          setSettings((prev: any) => ({
            ...prev,
            ...settingsData,
            site_config: settingsData.site_config || prev.site_config,
            testimonials: settingsData.testimonials || prev.testimonials,
            site_setting: {
              ...prev.site_setting,
              ...(settingsData.site_setting || {}),
            },
          }));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const openAddModal = () => {
    setEditingToolId(null);
    setFormData({
      title: "",
      type: "AI Based",
      image: "",
      videoEmbed: "",
      description: "",
      url: "",
    });
    setShowModal(true);
  };

  const openEditModal = (tool: any) => {
    setEditingToolId(tool.id);
    setFormData({
      title: tool.title || "",
      type: tool.type || "AI Based",
      image: tool.image || "",
      videoEmbed: tool.videoEmbed || "",
      description: tool.description || "",
      url: tool.url || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Aplikasi",
      message: `Anda yakin ingin menghapus aplikasi "${title}"?`,
      onConfirm: async () => {
        await fetch(`/api/tools/${id}`, { method: "DELETE" });
        loadLists();
        setConfirmDialog(null);
        showSuccess("Aplikasi berhasil dihapus");
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDialog({
      isOpen: true,
      title: editingToolId ? "Simpan Perubahan" : "Tambah Aplikasi",
      message: "Apakah Anda yakin ingin menyimpan data ini?",
      onConfirm: async () => {
        if (editingToolId) {
          await fetch(`/api/tools/${editingToolId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
        } else {
          await fetch(`/api/tools`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
        }
        setShowModal(false);
        setConfirmDialog(null);
        loadLists();
        showSuccess("Aplikasi berhasil disimpan");
      },
    });
  };

  const handleSaveSettings = (key: string, value: any) => {
    setConfirmDialog({
      isOpen: true,
      title: "Simpan Pengaturan",
      message: "Terapkan perubahan pengaturan ini pada website?",
      onConfirm: async () => {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
        setConfirmDialog(null);
        showSuccess("Pengaturan berhasil disimpan");
        loadLists();
      },
    });
  };

  const openEditUserModal = (user: any) => {
    setEditingUserId(user.userId);
    setUserFormData({
      name: user.name || "",
      credit: user.credit || 0,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Simpan User",
      message: "Terapkan perubahan pengguna ini?",
      onConfirm: async () => {
        if (editingUserId) {
          await fetch(`/api/users`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: editingUserId, ...userFormData }),
          });
        }
        setShowUserModal(false);
        setConfirmDialog(null);
        loadLists();
        showSuccess("Pengguna berhasil diupdate");
      },
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-50 pb-20">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 pb-20 relative">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white mb-8 font-display tracking-tight">
            Admin<span className="text-indigo-400">Panel</span>
          </h1>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "dashboard" ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("tools");
                setCurrentPage(1);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "tools" ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}
            >
              <AppWindow className="w-5 h-5" /> Aplikasi & Tools
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "settings" ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}
            >
              <SettingsIcon className="w-5 h-5" /> Site Settings
            </button>
             <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "users" ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}
            >
              <Users className="w-5 h-5" /> Users
            </button>
            <button
              onClick={() => setActiveTab("landing_page")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "landing_page" ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Landing Pages
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "transactions" ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"}`}
            >
              <CreditCard className="w-5 h-5" /> Log Transaksi
            </button>
          </nav>
        </aside>

        {/* Sidebar Mobile Burger Menu */}
        <div className="md:hidden mb-2 relative w-full">
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-bold">Admin Panel</span>
              <span className="text-slate-500">-</span>
              <span className="text-white font-medium capitalize">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "tools"
                    ? "Aplikasi & Tools"
                    : activeTab === "settings"
                      ? "Site Settings"
                      : activeTab === "users"
                        ? "Users"
                        : activeTab === "landing_page"
                          ? "Landing Pages"
                          : "Log Transaksi"}
              </span>
            </div>
            <button
              onClick={() => setIsMobileAdminMenuOpen(!isMobileAdminMenuOpen)}
              className="p-2 bg-slate-800 rounded-lg text-slate-300"
            >
              {isMobileAdminMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {isMobileAdminMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 z-50 shadow-2xl flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "dashboard" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("tools");
                  setCurrentPage(1);
                  setIsMobileAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "tools" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <AppWindow className="w-5 h-5" /> Aplikasi & Tools
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setIsMobileAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "settings" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <SettingsIcon className="w-5 h-5" /> Site Settings
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  setIsMobileAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "users" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <Users className="w-5 h-5" /> Users
              </button>
              <button
                onClick={() => {
                  setActiveTab("landing_page");
                  setIsMobileAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "landing_page" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Landing Pages
              </button>
              <button
                onClick={() => {
                  setActiveTab("transactions");
                  setIsMobileAdminMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "transactions" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <CreditCard className="w-5 h-5" /> Log Transaksi
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white font-display">
                Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <LayoutDashboard className="w-24 h-24" />
                  </div>
                  <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Total Aplikasi
                  </h3>
                  <div className="text-5xl font-bold text-white mb-2">
                    {tools.length}
                  </div>
                  <p className="text-sm text-indigo-400">Aplikasi aktif</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Users className="w-24 h-24" />
                  </div>
                  <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
                    Total Pengguna
                  </h3>
                  <div className="text-5xl font-bold text-white mb-2">
                    {users.length}
                  </div>
                  <p className="text-sm text-indigo-400">Pengguna terdaftar</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row shadow-sm justify-between items-start sm:items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
                <div>
                  <h2 className="text-xl font-bold">Daftar Pengguna</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Total {users.length} pengguna terdaftar.
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Nama atau Email..."
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setUserCurrentPage(1);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mt-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-950 text-slate-400">
                      <tr>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                          Profil
                        </th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                          Role
                        </th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                          Credit
                        </th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {users
                        .filter(
                          (u) =>
                            u.name
                              .toLowerCase()
                              .includes(userSearchQuery.toLowerCase()) ||
                            u.email
                              .toLowerCase()
                              .includes(userSearchQuery.toLowerCase()),
                        )
                        .slice(
                          (userCurrentPage - 1) * userItemsPerPage,
                          userCurrentPage * userItemsPerPage,
                        )
                        .map((u) => (
                          <tr key={u.userId} className="hover:bg-slate-800/20">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <img
                                src={
                                  u.avatar ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
                                }
                                className="w-10 h-10 rounded-full bg-slate-800"
                              />
                              <div>
                                <div className="font-bold text-slate-200">
                                  {u.name}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  {u.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${u.role === "admin" ? "bg-indigo-900/50 text-indigo-400 border border-indigo-800/50" : "bg-slate-800 text-slate-400"}`}
                              >
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-200 font-bold">
                              {u.credit || 0}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => openEditUserModal(u)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-blue-900/50 hover:text-blue-400 text-slate-400 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination for Users */}
              {users.filter(
                (u) =>
                  u.name
                    .toLowerCase()
                    .includes(userSearchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
              ).length > userItemsPerPage && (
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({
                    length: Math.ceil(
                      users.filter(
                        (u) =>
                          u.name
                            .toLowerCase()
                            .includes(userSearchQuery.toLowerCase()) ||
                          u.email
                            .toLowerCase()
                            .includes(userSearchQuery.toLowerCase()),
                      ).length / userItemsPerPage,
                    ),
                  }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setUserCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold transition-colors ${userCurrentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tools" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row shadow-sm justify-between items-start sm:items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 gap-4">
                <div>
                  <h2 className="text-xl font-bold">Koleksi Aplikasi</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Total {tools.length} aplikasi terdaftar di platform.
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="px-5 py-2.5 w-full sm:w-auto justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Aplikasi
                </button>
              </div>

              <div className="grid gap-4">
                {tools
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((tool) => (
                    <div
                      key={tool.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                    >
                      <div className="h-16 w-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                        {tool.image ? (
                          <img
                            src={tool.image}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 m-auto text-slate-600 mt-4" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0 w-full sm:w-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold truncate">
                            {tool.title}
                          </h3>
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-mono tracking-wide">
                            {tool.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                        <button
                          onClick={() => openEditModal(tool)}
                          className="p-2.5 rounded-lg bg-slate-800 hover:bg-blue-900/50 hover:text-blue-400 text-slate-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id, tool.title)}
                          className="p-2.5 rounded-lg bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {tools.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-300 disabled:opacity-50 hover:bg-slate-800"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-4 py-2 text-slate-400 text-sm">
                    Halaman {currentPage} dari{" "}
                    {Math.ceil(tools.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(tools.length / itemsPerPage),
                          prev + 1,
                        ),
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(tools.length / itemsPerPage)
                    }
                    className="px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-300 disabled:opacity-50 hover:bg-slate-800"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white font-display">
                  Site Settings
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Kelola konfigurasi, showcase aplikasi, kategori, dan testimoni website.
                </p>
              </div>

              {/* Subtabs Navigation */}
              <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("branding")}
                  className={`flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    settingsSubTab === "branding"
                      ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  Branding & Hero
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("showcase")}
                  className={`flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    settingsSubTab === "showcase"
                      ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-805 border border-transparent"
                  }`}
                >
                  Showcase Aplikasi
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("categories")}
                  className={`flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    settingsSubTab === "categories"
                      ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-805 border border-transparent"
                  }`}
                >
                  Kategori Aplikasi
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("testimonials")}
                  className={`flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    settingsSubTab === "testimonials"
                      ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-805 border border-transparent"
                  }`}
                >
                  Testimoni Pengguna
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("pricing")}
                  className={`flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    settingsSubTab === "pricing"
                      ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-805 border border-transparent"
                  }`}
                >
                  Harga Token
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsSubTab("tutorials")}
                  className={`flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    settingsSubTab === "tutorials"
                      ? "bg-indigo-600 border border-indigo-500 text-white shadow-lg shadow-indigo-900/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-805 border border-transparent"
                  }`}
                >
                  Tutorial Video
                </button>
              </div>

              {/* Basic Info */}
              {settingsSubTab === "branding" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <h3 className="text-lg font-bold border-b border-slate-800 pb-4">
                    Branding & Hero
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        Logo Text
                      </label>
                      <input
                        value={settings.site_config?.logo || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            site_config: {
                              ...settings.site_config,
                              logo: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        Favicon URL
                      </label>
                      <input
                        value={settings.site_config?.favicon || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            site_config: {
                              ...settings.site_config,
                              favicon: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        Headline
                      </label>
                      <textarea
                        rows={2}
                        value={settings.site_config?.headline || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            site_config: {
                              ...settings.site_config,
                              headline: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        Subheadline
                      </label>
                      <textarea
                        rows={3}
                        value={settings.site_config?.subheadline || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            site_config: {
                              ...settings.site_config,
                              subheadline: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleSaveSettings("site_config", settings.site_config)
                      }
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold mt-4"
                    >
                      Simpan Branding
                    </button>
                  </div>
                </div>
              )}

              {/* Showcase Aplikasi */}
              {settingsSubTab === "showcase" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <h3 className="text-lg font-bold border-b border-slate-800 pb-4">
                    Showcase Aplikasi (Pilih maksimal 6)
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      Pilih hingga 6 aplikasi untuk ditampilkan di halaman beranda.
                    </p>
                    <div className="space-y-3">
                      {settings.showcase_tools &&
                      settings.showcase_tools.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {settings.showcase_tools.map(
                            (id: string, idx: number) => {
                              const t = tools.find((tool: any) => tool.id === id);
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl"
                                >
                                  <div className="text-sm text-slate-300 font-medium">
                                    {t ? t.title : `ID Tidak Dikenal: ${id}`}
                                  </div>
                                  <button
                                    onClick={() => {
                                      const newTools = [
                                        ...settings.showcase_tools,
                                      ];
                                      newTools.splice(idx, 1);
                                      setSettings({
                                        ...settings,
                                        showcase_tools: newTools,
                                      });
                                    }}
                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                    title="Hapus"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 italic p-4 bg-slate-950 rounded-xl border border-dashed border-slate-800 text-center">
                          Belum ada aplikasi yang dipilih.
                        </div>
                      )}

                      {(!settings.showcase_tools ||
                        settings.showcase_tools.length < 6) &&
                        tools.length > 0 && (
                          <div className="mt-4">
                            <select
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  const newTools = [
                                    ...(settings.showcase_tools || []),
                                    e.target.value,
                                  ];
                                  setSettings({
                                    ...settings,
                                    showcase_tools: newTools,
                                  });
                                }
                              }}
                            >
                              <option value="" disabled>
                                + Tambah Aplikasi ke Showcase
                              </option>
                              {tools
                                .filter(
                                  (t) =>
                                    !(settings.showcase_tools || []).includes(
                                      t.id,
                                    ),
                                )
                                .map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.title}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                    </div>
                    <button
                      onClick={() =>
                        handleSaveSettings(
                          "showcase_tools",
                          settings.showcase_tools,
                        )
                      }
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold mt-4"
                    >
                      Simpan Showcase
                    </button>
                  </div>
                </div>
              )}

              {/* Kategori Aplikasi */}
              {settingsSubTab === "categories" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-bold">
                      Kategori Aplikasi (Home)
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Judul Section
                      </label>
                      <input
                        value={settings.categories_config?.title || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            categories_config: {
                              ...settings.categories_config,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm mt-1"
                        placeholder="e.g. Kategori Aplikasi"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Deskripsi Section
                      </label>
                      <textarea
                        rows={2}
                        value={settings.categories_config?.description || ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            categories_config: {
                              ...settings.categories_config,
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm mt-1"
                        placeholder="Deskripsi..."
                      />
                    </div>

                    {settings.categories_config?.items?.map(
                      (item: any, i: number) => (
                        <div
                          key={i}
                          className="pt-4 border-t border-slate-800 space-y-3 relative overflow-hidden"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-slate-300">
                              Kategori {i + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                const items = [
                                  ...settings.categories_config.items,
                                ];
                                items.splice(i, 1);
                                setSettings({
                                  ...settings,
                                  categories_config: {
                                    ...settings.categories_config,
                                    items,
                                  },
                                });
                              }}
                              className="bg-red-900/50 hover:bg-red-900 text-red-500 hover:text-red-400 p-2 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">
                              Nama Kategori
                            </label>
                            <input
                              value={item.title || ""}
                              onChange={(e) => {
                                const items = [
                                  ...settings.categories_config.items,
                                ];
                                items[i].title = e.target.value;
                                setSettings({
                                  ...settings,
                                  categories_config: {
                                    ...settings.categories_config,
                                    items,
                                  },
                                });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">
                              Deskripsi
                            </label>
                            <textarea
                              rows={2}
                              value={item.description || ""}
                              onChange={(e) => {
                                const items = [
                                  ...settings.categories_config.items,
                                ];
                                items[i].description = e.target.value;
                                setSettings({
                                  ...settings,
                                  categories_config: {
                                    ...settings.categories_config,
                                    items,
                                  },
                                });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">
                              URL Gambar / Icon
                            </label>
                            <input
                              value={item.image || ""}
                              onChange={(e) => {
                                const items = [
                                  ...settings.categories_config.items,
                                ];
                                items[i].image = e.target.value;
                                setSettings({
                                  ...settings,
                                  categories_config: {
                                    ...settings.categories_config,
                                    items,
                                  },
                                });
                              }}
                              className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-sm mt-1"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                        </div>
                      ),
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          const items = [
                            ...(settings.categories_config?.items || []),
                            { title: "", description: "", image: "" },
                          ];
                          setSettings({
                            ...settings,
                            categories_config: {
                              ...settings.categories_config,
                              items,
                            },
                          });
                        }}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl mt-4 max-w-max flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Tambah Kategori
                      </button>
                      <button
                        onClick={() =>
                          handleSaveSettings(
                            "categories_config",
                            settings.categories_config,
                          )
                        }
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl mt-4 max-w-max"
                      >
                        Simpan Kategori
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimoni Pengguna */}
              {settingsSubTab === "testimonials" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-bold">Testimoni Pengguna</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newTesti = [
                          ...(settings.testimonials || []),
                          { name: "", text: "", role: "", img: "" },
                        ];
                        setSettings({ ...settings, testimonials: newTesti });
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-xs cursor-pointer"
                    >
                      Tambah
                    </button>
                  </div>
                  <div className="space-y-4">
                    {settings.testimonials?.map((testi: any, i: number) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 border border-slate-800 rounded-xl bg-slate-950 relative group"
                      >
                        <img
                          src={
                            testi.img ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
                          }
                          className="w-12 h-12 rounded-full border border-slate-800 bg-slate-800"
                        />
                        <div className="flex-1 space-y-2">
                          <input
                            value={testi.name || ""}
                            onChange={(e) => {
                              const arr = [...settings.testimonials];
                              arr[i].name = e.target.value;
                              setSettings({ ...settings, testimonials: arr });
                            }}
                            className="bg-transparent font-bold focus:outline-none w-1/3 border-b border-slate-800 py-1"
                            placeholder="Nama..."
                          />
                          <input
                            value={testi.role || ""}
                            onChange={(e) => {
                              const arr = [...settings.testimonials];
                              arr[i].role = e.target.value;
                              setSettings({ ...settings, testimonials: arr });
                            }}
                            className="bg-transparent text-sm text-slate-400 focus:outline-none w-1/3 border-b border-slate-800 py-1"
                            placeholder="Role (Founder, dll)..."
                          />
                          <textarea
                            value={testi.text || ""}
                            onChange={(e) => {
                              const arr = [...settings.testimonials];
                              arr[i].text = e.target.value;
                              setSettings({ ...settings, testimonials: arr });
                            }}
                            rows={2}
                            className="w-full mt-2 bg-transparent text-sm focus:outline-none border-b border-slate-800 py-1"
                            placeholder="Testimoni..."
                          />
                          <input
                            value={testi.img || ""}
                            onChange={(e) => {
                              const arr = [...settings.testimonials];
                              arr[i].img = e.target.value;
                              setSettings({ ...settings, testimonials: arr });
                            }}
                            className="bg-transparent font-mono text-xs text-slate-500 focus:outline-none w-full border-b border-slate-800 py-1"
                            placeholder="URL Profil image..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const arr = settings.testimonials.filter(
                              (_, idx) => idx !== i,
                            );
                            setSettings({ ...settings, testimonials: arr });
                          }}
                          className="absolute top-4 right-4 text-slate-600 hover:text-red-400 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        handleSaveSettings("testimonials", settings.testimonials)
                      }
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold mt-4"
                    >
                      Simpan Testimoni
                    </button>
                  </div>
                </div>
              )}

              {/* Configure Harga Token */}
              {settingsSubTab === "pricing" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <h3 className="text-lg font-bold border-b border-slate-800 pb-4">
                    Konfigurasi Paket Token / Credit
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Starter Tier */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="font-bold text-indigo-400 text-sm">Paket Starter</h4>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                          Jumlah Token / Credit
                        </label>
                        <input
                          type="number"
                          value={settings.site_setting?.starter_credits ?? "5"}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              site_setting: {
                                ...settings.site_setting,
                                starter_credits: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                          Harga (IDR)
                        </label>
                        <input
                          type="number"
                          value={settings.site_setting?.starter_price ?? "49000"}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              site_setting: {
                                ...settings.site_setting,
                                starter_price: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Pro Tier */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="font-bold text-indigo-400 text-sm">Paket Pro Sprint</h4>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                          Jumlah Token / Credit
                        </label>
                        <input
                          type="number"
                          value={settings.site_setting?.pro_credits ?? "25"}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              site_setting: {
                                ...settings.site_setting,
                                pro_credits: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                          Harga (IDR)
                        </label>
                        <input
                          type="number"
                          value={settings.site_setting?.pro_price ?? "99000"}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              site_setting: {
                                ...settings.site_setting,
                                pro_price: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Max Tier */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="font-bold text-indigo-400 text-sm">Paket Max Elite</h4>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                          Jumlah Token / Credit (-1 = Tanpa Batas)
                        </label>
                        <input
                          type="number"
                          value={settings.site_setting?.max_credits ?? "-1"}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              site_setting: {
                                ...settings.site_setting,
                                max_credits: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">
                          Harga (IDR)
                        </label>
                        <input
                          type="number"
                          value={settings.site_setting?.max_price ?? "179000"}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              site_setting: {
                                ...settings.site_setting,
                                max_price: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl focus:border-indigo-500 focus:outline-none text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleSaveSettings("site_setting", settings.site_setting)
                    }
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold mt-4"
                  >
                    Simpan Konfigurasi Token
                  </button>
                </div>
              )}

              {/* Configure Tutorial */}
              {settingsSubTab === "tutorials" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <h3 className="text-lg font-bold border-b border-slate-800 pb-4">
                    Konfigurasi Video & Deskripsi Tutorial Resmi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        YouTube Embed URL
                      </label>
                      <input
                        type="text"
                        value={settings.site_setting?.tutorial_youtube_url ?? ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            site_setting: {
                              ...settings.site_setting,
                              tutorial_youtube_url: e.target.value,
                            },
                          })
                        }
                        placeholder="Contoh: https://www.youtube.com/embed/dQw4w9WgXcQ"
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        Deskripsi Lengkap Tutorial
                      </label>
                      <textarea
                        value={settings.site_setting?.tutorial_description ?? ""}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            site_setting: {
                              ...settings.site_setting,
                              tutorial_description: e.target.value,
                            },
                          })
                        }
                        rows={6}
                        placeholder="Tuliskan petunjuk operasional atau deskripsi lengkap mengenai pengoperasian aplikasi TemanKecil..."
                        className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleSaveSettings("site_setting", settings.site_setting)
                      }
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold mt-4"
                    >
                      Simpan Konfigurasi Tutorial
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "landing_page" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white font-display">
                    Landing Page Creator
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Buat landing page kustom dengan mengunggah HTML dan menentukan target slug url.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLandingFormData({ slug: "", htmlContent: "" });
                    setIsEditingLanding(false);
                    setShowLandingForm(true);
                  }}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-900/20 self-start"
                >
                  + Buat Landing Page Baru
                </button>
              </div>

              {/* LP Form Modal/Section */}
              {showLandingForm && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-indigo-400">
                      {isEditingLanding ? "Edit Landing Page" : "Buat Landing Page Baru"}
                    </h3>
                    <button
                      onClick={() => setShowLandingForm(false)}
                      className="text-slate-500 hover:text-white-400 text-sm"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch("/api/settings/landing", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(landingFormData),
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                          setSuccessPopup({ isOpen: true, message: "Landing page berhasil disimpan!" });
                          setTimeout(() => setSuccessPopup(null), 3000);
                          setShowLandingForm(false);
                          fetchLandingPages();
                        } else {
                          alert(data.error || "Gagal menyimpan");
                        }
                      } catch (err) {
                        alert("Terjadi kesalahan");
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">
                          Slug URL (Tanpa karakter &quot;/&quot; di awal/akhir)
                        </label>
                        <div className="flex gap-2 items-center">
                          <span className="text-sm font-mono text-slate-500 bg-slate-950 px-3 py-2.5 rounded-lg border border-slate-800/80">
                            /
                          </span>
                          <input
                            required
                            disabled={isEditingLanding}
                            type="text"
                            value={landingFormData.slug}
                            onChange={(e) =>
                              setLandingFormData({
                                ...landingFormData,
                                slug: e.target.value.toLowerCase().trim().replace(/[^a-z0-9-_]/g, ""),
                              })
                            }
                            placeholder="contoh: promo-special"
                            className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">
                          Konten HTML Landing Page
                        </label>
                        <span className="block text-xs text-slate-500 mb-2">
                          Tips: Anda bisa mengunggah berkas HTML atau langsung mengetik syntax kode di textarea.
                        </span>
                        <div className="flex flex-col gap-3">
                          <input
                            type="file"
                            accept=".html,.htm"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setLandingFormData({
                                    ...landingFormData,
                                    htmlContent: event.target?.result as string,
                                  });
                                };
                                reader.readAsText(file);
                              }
                            }}
                            className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-900/30 file:text-indigo-400 hover:file:bg-indigo-900/40"
                          />
                          <textarea
                            required
                            value={landingFormData.htmlContent}
                            onChange={(e) =>
                              setLandingFormData({ ...landingFormData, htmlContent: e.target.value })
                            }
                            rows={12}
                            className="w-full bg-slate-950 font-mono text-xs border border-slate-800 p-4 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-300"
                            placeholder="Paste kode <html> disini..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowLandingForm(false)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm"
                      >
                        Simpan Landing Page
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Landing Pages Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-950/35">
                  <h3 className="font-bold text-white">Daftar Landing Page Aktif</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/60 uppercase text-xs font-bold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Target URL/Slug</th>
                        <th className="px-6 py-4">Ukuran Konten</th>
                        <th className="px-6 py-4">Tanggal Diperbarui</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {landingPages.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            Belum ada landing page yang dibuat. Klik tombol diatas untuk membuat.
                          </td>
                        </tr>
                      ) : (
                        landingPages.map((lp) => (
                          <tr key={lp.slug} className="hover:bg-slate-850/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">
                              <a
                                href={`/${lp.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:underline flex items-center gap-1.5"
                              >
                                /{lp.slug} <span className="text-xs text-slate-500">➚</span>
                              </a>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                              {(lp.htmlContent?.length || 0).toLocaleString()} bytes
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-xs">
                              {new Date(lp.updatedAt || lp.createdAt).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setLandingFormData({ slug: lp.slug, htmlContent: lp.htmlContent });
                                  setIsEditingLanding(true);
                                  setShowLandingForm(true);
                                }}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: "Hapus Landing Page?",
                                    message: `Apakah Anda yakin ingin menghapus landing page dengan slug /${lp.slug}? Tindakan ini tidak dapat dibatalkan.`,
                                    onConfirm: async () => {
                                      try {
                                        const res = await fetch("/api/settings/landing", {
                                          method: "DELETE",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ slug: lp.slug }),
                                        });
                                        if (res.ok) {
                                          showSuccess("Landing page berhasil dihapus");
                                          fetchLandingPages();
                                        }
                                      } catch (err) {}
                                      setConfirmDialog(null);
                                    },
                                  });
                                }}
                                className="px-3 py-1.5 bg-red-950/40 border border-red-900/30 hover:bg-red-950 text-red-400 text-xs font-bold rounded-lg transition-colors"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white font-display">
                    Log Transaksi & Pembelian Token
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Ringkasan riwayat top-up token dari dashboard maupun landing page eksternal.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-right bg-slate-900/40 border border-slate-800 px-4 py-2.5 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Total Penjualan</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      Rp {transactions.reduce((acc, curr) => acc + (curr.status === "completed" ? curr.amount : 0), 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions Log Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-950/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">Daftar Transaksi Masuk</h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Menampilkan seluruh aktivitas top-up saldo dan transaksi pembayaran.
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/60 uppercase text-xs font-bold text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">ID Transaksi</th>
                        <th className="px-6 py-4">Pembeli</th>
                        <th className="px-6 py-4">Paket / Token</th>
                        <th className="px-6 py-4">Jumlah Bayar</th>
                        <th className="px-6 py-4">Sumber</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Tanggal dibuat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            Belum ada riwayat transaksi yang masuk.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{tx.id}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-white">{tx.name}</div>
                              <div className="text-xs text-slate-400">{tx.email}</div>
                              {tx.phone && <div className="text-[10px] text-slate-500">{tx.phone}</div>}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-white">{tx.packageName}</div>
                              <div className="text-xs text-slate-400">+{tx.credits} Credits</div>
                            </td>
                            <td className="px-6 py-4 font-bold text-white">
                              Rp {tx.amount.toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tx.source === "landing" ? "bg-amber-950/50 text-amber-300 border border-amber-900/30" : "bg-teal-950/50 text-teal-300 border border-teal-900/30"}`}>
                                {tx.source === "landing" ? "Landing Page" : "Dashboard"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${tx.status === "completed" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/10" : "bg-slate-950/60 text-slate-400 border border-slate-900/10"}`}>
                                {tx.status === "completed" ? "Selesai" : "Menunggu"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">
                              {new Date(tx.createdAt).toLocaleString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Pengguna</h2>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  required
                  value={userFormData.name}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, name: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="Nama..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Credit
                </label>
                <input
                  type="number"
                  required
                  value={userFormData.credit}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      credit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 py-3 px-4 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-5 py-2.5 font-bold text-sm text-slate-400 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveUser}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-indigo-900/20"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingToolId ? "Edit Aplikasi" : "Tambah Aplikasi Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Judul Aplikasi
                  </label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                    placeholder="Misal: Cerita Ajaib"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tipe / Kategori
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                  >
                    <option>AI Based</option>
                    <option>Non-AI Based</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> URL Gambar Thumbnail
                </label>
                <input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Video className="w-3 h-3" /> Embed Video YouTube (Opsional)
                </label>
                <input
                  value={formData.videoEmbed}
                  onChange={(e) =>
                    setFormData({ ...formData, videoEmbed: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="Misal: https://www.youtube.com/embed/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="Penjelasan aplikasi..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> URL Tujuan Aplikasi
                </label>
                <input
                  required
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="/play/..."
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold"
                >
                  Simpan Aplikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Dialog */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4">
            <h3 className="text-xl font-bold">{confirmDialog.title}</h3>
            <p className="text-slate-400 text-sm">{confirmDialog.message}</p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold"
              >
                Batal
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successPopup?.isOpen && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[120] bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            ✓
          </div>
          {successPopup.message}
        </div>
      )}
    </div>
  );
}
