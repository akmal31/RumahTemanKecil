import pg from "pg";
const { Pool } = pg;

export interface DBUser {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: string;
  passwordHash?: string;
  credit: number;
  createdAt: string;
}

export interface DBTool {
  id: string;
  title: string;
  type: string;
  image: string;
  videoEmbed: string;
  description: string;
  url: string;
  createdAt: string;
}

const memoryDb = {
  users: [
    {
      userId: "admin_01",
      name: "Super Admin",
      email: "admin@temankecil.id",
      passwordHash:
        "$2b$10$p1YLMAWrqoUjyEzdmf2h2u5FJhmUsWD4nQN6AD4NeYZ8S9W8CLvgm", // hashed "R4H4514"
      role: "admin" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      credit: 100,
      createdAt: new Date().toISOString(),
    },
    {
      userId: "member_01",
      name: "Member Dummy",
      email: "memberdummy@temankecil.id",
      passwordHash:
        "$2b$10$p1YLMAWrqoUjyEzdmf2h2u5FJhmUsWD4nQN6AD4NeYZ8S9W8CLvgm", // hashed "R4H4514"
      role: "user" as const,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Member",
      credit: 10,
      createdAt: new Date().toISOString(),
    },
  ] as DBUser[],
  tools: [
    {
      id: "tool_1",
      title: "Auto Copywriter",
      type: "AI Based",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80",
      videoEmbed: "",
      description:
        "Hasilkan teks marketing dan copywriting untuk berbagai platform dengan sekali klik, didukung oleh AI canggih.",
      url: "/play/auto-copywriter",
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool_2",
      title: "Invoice Generator",
      type: "Non-AI Based",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      videoEmbed: "",
      description:
        "Buat, kelola, dan kirim invoice profesional ke klien dengan template yang mudah disesuaikan secara instan.",
      url: "/play/invoice-generator",
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool_3",
      title: "Resume Builder",
      type: "AI Based",
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
      videoEmbed: "",
      description:
        "Optimalkan CV dan resume Anda agar lolos sistem ATS dengan saran dan pemformatan pintar dari AI.",
      url: "/play/resume-builder",
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool_4",
      title: "Simple CRM",
      type: "Non-AI Based",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      videoEmbed: "",
      description:
        "Lacak prospek, klien, dan status proyek Anda dalam satu dashboard yang minimalis dan tidak membingungkan.",
      url: "/play/simple-crm",
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool_5",
      title: "Social Media Scheduler",
      type: "AI Based",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      videoEmbed: "",
      description:
        "Jadwalkan postingan sosial media Anda sebulan ke depan dan biarkan AI menyarankan caption terbaik.",
      url: "/play/social-scheduler",
      createdAt: new Date().toISOString(),
    },
    {
      id: "tool_6",
      title: "PDF Merger & Splitter",
      type: "Non-AI Based",
      image:
        "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&q=80",
      videoEmbed: "",
      description:
        "Alat praktis dan cepat untuk menggabungkan banyak dokumen PDF atau memisahkannya tanpa perlu instal aplikasi berat.",
      url: "/play/pdf-tools",
      createdAt: new Date().toISOString(),
    },
  ] as DBTool[],
};

let pool: any = null;
let tablesInitialized = false;

function getPool() {
  if (typeof window !== "undefined") return null;
  const connectionString = process.env.DATABASE_URL;
  if (
    !connectionString ||
    connectionString.includes("username:password@hostname")
  )
    return null;

  if (!pool) {
    try {
      pool = new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } catch (e) {
      pool = null;
    }
  }
  return pool;
}

async function ensureTablesExist(p: any) {
  if (tablesInitialized) return;
  try {
    const client = await p.connect();
    try {
      await client.query("BEGIN");
      await client.query(`
        CREATE TABLE IF NOT EXISTS "users" (
          "user_id" VARCHAR(255) PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "email" VARCHAR(255) UNIQUE NOT NULL,
          "password_hash" VARCHAR(255),
          "role" VARCHAR(50) NOT NULL DEFAULT 'user',
          "avatar" TEXT,
          "credits" INTEGER NOT NULL DEFAULT 0,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "deleted_at" TIMESTAMP WITH TIME ZONE
        );
      `);
      await client.query(`
        ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 0;
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS "tools" (
          "id" VARCHAR(255) PRIMARY KEY,
          "title" VARCHAR(255) NOT NULL,
          "type" VARCHAR(50) NOT NULL,
          "image" TEXT,
          "video_embed" TEXT,
          "description" TEXT,
          "url" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "deleted_at" TIMESTAMP WITH TIME ZONE
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS "settings" (
          "key" VARCHAR(255) PRIMARY KEY,
          "value" JSONB NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS "site_settings" (
          "key" VARCHAR(255) PRIMARY KEY,
          "value" TEXT NOT NULL
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS "tool_stats" (
          "id" VARCHAR(255) PRIMARY KEY,
          "tool_id" VARCHAR(255) NOT NULL REFERENCES "tools"("id"),
          "views" INTEGER NOT NULL DEFAULT 0,
          "last_accessed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await client.query(`
        INSERT INTO "settings" ("key", "value") VALUES 
        ('site_config', '{"logo": "teman kecil", "headline": "Waktumu Terlalu Berharga Untuk Bekerja Manual.", "subheadline": "Jangan biarkan potensimu tertahan rutinitas. Kami menyediakan puluhan micro-tools dan aplikasi digital cerdas yang dirancang khusus untuk memangkas waktu kerja dan melipatgandakan hasilmu."}'),
        ('showcase_tools', '[]'),
        ('testimonials', '[{"text": "Berkat TemanKecil, pekerjaan copywrite untuk produk ratusan SKU bisa selesai dalam 2 hari. Benar-benar game changer!", "name": "Sarah M.", "role": "Digital Marketer", "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"}, {"text": "Invoice generator dan CRM sederhananya ngurangin pusing ngurus klien freelance. Sumpah ini UI-nya enak dan ga bikin ribet.", "name": "Deni Pratama", "role": "Freelance Designer", "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Deni"}]')
        ON CONFLICT ("key") DO NOTHING;
      `);
      const siteSettingCheck = await client.query('SELECT COUNT(*) FROM "site_settings"');
      if (parseInt(siteSettingCheck.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO "site_settings" ("key", "value") VALUES
          ('starter_price', '49000'),
          ('starter_credits', '5'),
          ('pro_price', '99000'),
          ('pro_credits', '25'),
          ('max_price', '179000'),
          ('max_credits', '-1'),
          ('tutorial_youtube_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
          ('tutorial_description', 'Pelajari petunjuk penggunaan and tips produktivitas menggunakan instrumen TemanKecil.')
          ON CONFLICT ("key") DO NOTHING;
        `);
      }
      await client.query(`
        INSERT INTO "users" ("user_id", "name", "email", "password_hash", "role", "avatar")
        VALUES ('admin_01', 'Super Admin', 'admin@temankecil.id', '$2b$10$p1YLMAWrqoUjyEzdmf2h2u5FJhmUsWD4nQN6AD4NeYZ8S9W8CLvgm', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')
        ON CONFLICT ("user_id") DO NOTHING;
      `);
      await client.query(`
        INSERT INTO "users" ("user_id", "name", "email", "password_hash", "role", "avatar")
        VALUES ('member_01', 'Member Dummy', 'memberdummy@temankecil.id', '$2b$10$p1YLMAWrqoUjyEzdmf2h2u5FJhmUsWD4nQN6AD4NeYZ8S9W8CLvgm', 'user', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Member')
        ON CONFLICT ("user_id") DO NOTHING;
      `);

      const toolsCheck = await client.query('SELECT COUNT(*) FROM "tools"');
      if (parseInt(toolsCheck.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO "tools" ("id", "title", "type", "image", "video_embed", "description", "url") VALUES 
          ('tool_1', 'Auto Copywriter', 'AI Based', 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80', '', 'Hasilkan teks marketing dan copywriting untuk berbagai platform dengan sekali klik, didukung oleh AI canggih.', '/play/auto-copywriter'),
          ('tool_2', 'Invoice Generator', 'Non-AI Based', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', '', 'Buat, kelola, dan kirim invoice profesional ke klien dengan template yang mudah disesuaikan secara instan.', '/play/invoice-generator'),
          ('tool_3', 'Resume Builder', 'AI Based', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80', '', 'Optimalkan CV dan resume Anda agar lolos sistem ATS dengan saran dan pemformatan pintar dari AI.', '/play/resume-builder'),
          ('tool_4', 'Simple CRM', 'Non-AI Based', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', '', 'Lacak prospek, klien, dan status proyek Anda dalam satu dashboard yang minimalis dan tidak membingungkan.', '/play/simple-crm'),
          ('tool_5', 'Social Media Scheduler', 'AI Based', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', '', 'Jadwalkan postingan sosial media Anda sebulan ke depan dan biarkan AI menyarankan caption terbaik.', '/play/social-scheduler'),
          ('tool_6', 'PDF Merger & Splitter', 'Non-AI Based', 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&q=80', '', 'Alat praktis dan cepat untuk menggabungkan banyak dokumen PDF atau memisahkannya tanpa perlu instal aplikasi berat.', '/play/pdf-tools')
        `);
      }

      await client.query("COMMIT");
      tablesInitialized = true;
    } catch (err) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  } catch (err) {}
}

export const db = {
  isRealDbConnected(): boolean {
    return getPool() !== null;
  },

  async verifyUser(
    email: string,
    passwordPlain: string,
  ): Promise<DBUser | null> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        const res = await p.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const isMatch = await import("bcryptjs").then((bcrypt) =>
            bcrypt.compare(passwordPlain, row.password_hash || ""),
          );
          if (isMatch) {
            return {
              userId: row.user_id,
              name: row.name,
              email: row.email,
              role: row.role,
              avatar: row.avatar,
              credit: row.credits,
              createdAt: row.created_at.toISOString(),
            };
          }
        }
      } catch (err) {}
    }

    // Fallback
    const u = memoryDb.users.find((x) => x.email === email);
    if (u) {
      const isMatch = await import("bcryptjs").then((bcrypt) =>
        bcrypt.compare(passwordPlain, u.passwordHash || ""),
      );
      if (isMatch) {
        const { passwordHash, ...safeUser } = u;
        return safeUser as DBUser;
      }
    }
    return null;
  },

  async getOrCreateUser(
    email: string,
    name: string,
    avatar: string,
    role: "admin" | "user" = "user",
  ): Promise<DBUser> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        const check = await p.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
        if (check.rows.length > 0)
          return {
            userId: check.rows[0].user_id,
            name: check.rows[0].name,
            email: check.rows[0].email,
            role: check.rows[0].role,
            avatar: check.rows[0].avatar,
            credit: check.rows[0].credits,
            createdAt: check.rows[0].created_at.toISOString(),
          };

        const userId = "usr_" + Date.now().toString();
        const res = await p.query(
          "INSERT INTO users (user_id, name, email, avatar, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [userId, name, email, avatar, role],
        );
        const r = res.rows[0];
        return {
          userId: r.user_id,
          name: r.name,
          email: r.email,
          role: r.role,
          avatar: r.avatar,
          credit: r.credits,
          createdAt: r.created_at.toISOString(),
        };
      } catch (e) {}
    }

    let existing = memoryDb.users.find((u) => u.email === email);
    if (!existing) {
      existing = {
        userId: "usr_" + Date.now().toString(),
        name,
        email,
        avatar,
        role,
        credit: 0,
        createdAt: new Date().toISOString(),
      };
      memoryDb.users.push(existing);
    }
    const { passwordHash, ...safe } = existing;
    return safe as DBUser;
  },

  async getTools(): Promise<DBTool[]> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        const res = await p.query(
          "SELECT * FROM tools WHERE deleted_at IS NULL ORDER BY created_at DESC, id ASC",
        );
        return res.rows.map((r) => ({
          id: r.id,
          title: r.title,
          type: r.type,
          image: r.image,
          videoEmbed: r.video_embed,
          description: r.description,
          url: r.url,
          createdAt: r.created_at.toISOString(),
        }));
      } catch (e) {}
    }
    return [...memoryDb.tools].reverse();
  },

  async createTool(tool: Omit<DBTool, "id" | "createdAt">): Promise<DBTool> {
    const p = getPool();
    const newId = "tool_" + Date.now().toString();
    if (p) {
      await ensureTablesExist(p);
      try {
        const res = await p.query(
          "INSERT INTO tools (id, title, type, image, video_embed, description, url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
          [
            newId,
            tool.title,
            tool.type,
            tool.image || "",
            tool.videoEmbed || "",
            tool.description,
            tool.url,
          ],
        );
        const r = res.rows[0];
        return {
          id: r.id,
          title: r.title,
          type: r.type,
          image: r.image,
          videoEmbed: r.video_embed,
          description: r.description,
          url: r.url,
          createdAt: r.created_at.toISOString(),
        };
      } catch (e) {}
    }
    const newTool: DBTool = {
      ...tool,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    memoryDb.tools.push(newTool);
    return newTool;
  },

  async updateTool(
    id: string,
    updates: Partial<DBTool>,
  ): Promise<DBTool | null> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        const currentRes = await p.query("SELECT * FROM tools WHERE id=$1", [
          id,
        ]);
        if (currentRes.rows.length > 0) {
          const curr = currentRes.rows[0];
          await p.query(
            "UPDATE tools SET title=$1, type=$2, image=$3, video_embed=$4, description=$5, url=$6 WHERE id=$7",
            [
              updates.title !== undefined ? updates.title : curr.title,
              updates.type !== undefined ? updates.type : curr.type,
              updates.image !== undefined ? updates.image : curr.image,
              updates.videoEmbed !== undefined
                ? updates.videoEmbed
                : curr.video_embed,
              updates.description !== undefined
                ? updates.description
                : curr.description,
              updates.url !== undefined ? updates.url : curr.url,
              id,
            ],
          );
          const res = await p.query("SELECT * FROM tools WHERE id=$1", [id]);
          if (res.rows.length > 0) {
            const r = res.rows[0];
            return {
              id: r.id,
              title: r.title,
              type: r.type,
              image: r.image,
              videoEmbed: r.video_embed,
              description: r.description,
              url: r.url,
              createdAt: r.created_at.toISOString(),
            };
          }
        }
      } catch (e) {
        console.error("DB Update Error:", e);
      }
    }
    const idx = memoryDb.tools.findIndex((t) => t.id === id);
    if (idx >= 0) {
      memoryDb.tools[idx] = { ...memoryDb.tools[idx], ...updates };
      return memoryDb.tools[idx];
    }
    return null;
  },

  async updateUser(userId: string, data: Partial<DBUser>): Promise<boolean> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        const currentRes = await p.query(
          "SELECT * FROM users WHERE user_id=$1",
          [userId],
        );
        if (currentRes.rows.length > 0) {
          const curr = currentRes.rows[0];
          await p.query(
            "UPDATE users SET name=$1, credits=$2 WHERE user_id=$3",
            [
              data.name !== undefined ? data.name : curr.name,
              data.credit !== undefined ? data.credit : curr.credits,
              userId,
            ],
          );
          return true;
        }
      } catch (e) {
        console.error("DB User Update Error:", e);
      }
    }
    const idx = memoryDb.users.findIndex((u) => u.userId === userId);
    if (idx >= 0) {
      memoryDb.users[idx] = { ...memoryDb.users[idx], ...data };
      return true;
    }
    return false;
  },

  async deleteTool(id: string): Promise<boolean> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        await p.query(
          "UPDATE tools SET deleted_at = CURRENT_TIMESTAMP WHERE id=$1",
          [id],
        );
        return true;
      } catch (e) {}
    }
    const initialLen = memoryDb.tools.length;
    memoryDb.tools = memoryDb.tools.filter((t) => t.id !== id);
    return memoryDb.tools.length < initialLen;
  },

  async getUsers(): Promise<DBUser[]> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        const res = await p.query(
          "SELECT * FROM users ORDER BY created_at DESC",
        );
        return res.rows.map((r) => ({
          userId: r.user_id,
          name: r.name,
          email: r.email,
          role: r.role,
          avatar: r.avatar,
          credit: r.credits,
          createdAt: r.created_at.toISOString(),
        }));
      } catch (e) {}
    }
    return memoryDb.users.map(({ passwordHash, ...safe }) => safe as DBUser);
  },

  async getSettings(): Promise<any> {
    const p = getPool();
    let config: any = {
      site_config: {
        logo: "teman kecil",
        favicon:
          "https://storage.googleapis.com/timetraq-public/other/img/Logo%20TK%20No%20BG%20ukuran%20kecil%20(2).png",
        headline: "Waktumu Terlalu Berharga Untuk Bekerja Manual.",
        subheadline:
          "Jangan biarkan potensimu tertahan rutinitas. Kami menyediakan puluhan micro-tools dan aplikasi digital cerdas yang dirancang khusus untuk memangkas waktu kerja dan melipatgandakan hasilmu.",
      },
      categories_config: {
        title: "Kategori Aplikasi",
        description:
          "Kami mengelompokkan alat produktivitas dalam dua kategori utama untuk menyesuaikan dengan workflow modern.",
        items: [
          {
            title: "AI Based Tools",
            description:
              "Asisten cerdas yang memanfaatkan kecerdasan buatan untuk mengotomatisasi generasi teks, analisis data, dan memberikan wawasan cerdas dalam hitungan detik.",
            image: "",
          },
          {
            title: "Non-AI Based Tools",
            description:
              "Alat bantu utilitas cepat bermutu tinggi untuk pemrosesan file presisi, manajemen database ringan, dan utilitas berbasis logika yang sangat andal.",
            image: "",
          },
        ],
      },
      site_setting: {
        starter_price: "49000",
        starter_credits: "5",
        pro_price: "99000",
        pro_credits: "25",
        max_price: "179000",
        max_credits: "-1",
        tutorial_youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tutorial_description: "Pelajari petunjuk penggunaan and tips produktivitas menggunakan instrumen TemanKecil.",
      }
    };
    if (p) {
      await ensureTablesExist(p);
      try {
        const res = await p.query("SELECT * FROM settings");
        res.rows.forEach(
          (r) =>
            (config[r.key as keyof typeof config] =
              typeof r.value === "string" ? JSON.parse(r.value) : r.value),
        );
      } catch (e) {}

      try {
        const res_site = await p.query("SELECT key, value FROM site_settings");
        if (res_site.rows.length > 0) {
          config.site_setting = config.site_setting || {};
          res_site.rows.forEach((r: any) => {
            config.site_setting[r.key] = r.value;
          });
        }
      } catch (e) {}
    }
    return config;
  },

  async updateSetting(key: string, value: any): Promise<boolean> {
    const p = getPool();
    if (p) {
      await ensureTablesExist(p);
      try {
        if (key === "site_setting" || key === "site_settings") {
          for (const [k, v] of Object.entries(value)) {
            await p.query(
              `INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
              [k, String(v)],
            );
          }
          return true;
        } else {
          await p.query(
            `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
            [key, JSON.stringify(value)],
          );
          return true;
        }
      } catch (e) {}
    }
    return false; // Dummy DB doesn't support persisting settings easily, so not returning false but no-oping effectively unless we add it to memoryDb. We'll just return true.
  },
};
