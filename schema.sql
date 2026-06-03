-- PostgreSQL Database Schema for TemanKecil

DROP TABLE IF EXISTS "usage_logs" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;
DROP TABLE IF EXISTS "tools" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "tool_stats" CASCADE;

CREATE TABLE "users" (
    "user_id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255),
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "avatar" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

CREATE INDEX "idx_users_email" ON "users" ("email");

CREATE TABLE "tools" (
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

CREATE TABLE "settings" (
    "key" VARCHAR(255) PRIMARY KEY,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tool_stats" (
    "id" VARCHAR(255) PRIMARY KEY,
    "tool_id" VARCHAR(255) NOT NULL REFERENCES "tools"("id"),
    "views" INTEGER NOT NULL DEFAULT 0,
    "last_accessed" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "users" ("user_id", "name", "email", "password_hash", "role", "avatar")
VALUES ('admin_01', 'Super Admin', 'admin@temankecil.id', 'R4H4514', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')
ON CONFLICT ("email") DO NOTHING;

-- Default Settings
INSERT INTO "settings" ("key", "value") VALUES 
('site_config', '{"logo": "TK", "headline": "Waktumu Terlalu Berharga Untuk Bekerja Manual.", "subheadline": "Jangan biarkan potensimu tertahan rutinitas. Kami menyediakan puluhan micro-tools dan aplikasi digital cerdas yang dirancang khusus untuk memangkas waktu kerja dan melipatgandakan hasilmu."}'),
('showcase_tools', '[]'),
('testimonials', '[
    {"text": "Berkat TemanKecil, pekerjaan copywrite untuk produk ratusan SKU bisa selesai dalam 2 hari. Benar-benar game changer!", "name": "Sarah M.", "role": "Digital Marketer", "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"},
    {"text": "Invoice generator dan CRM sederhananya ngurangin pusing ngurus klien freelance. Sumpah ini UI-nya enak dan ga bikin ribet.", "name": "Deni Pratama", "role": "Freelance Designer", "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Deni"},
    {"text": "Banyak tools yang harganya mahal, tapi di sini bundled dan efektif banget bikin startup kecil kayak kami bisa sprint lebih cepat.", "name": "Reza F.", "role": "Founder Startup", "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Reza"}
]')
ON CONFLICT ("key") DO NOTHING;

