-- Step 1: Buat enum PanelCategory
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PanelCategory') THEN
        CREATE TYPE "PanelCategory" AS ENUM ('FACILITY_MANAGEMENT', 'STUDENT_HOUSING');
        RAISE NOTICE 'Enum PanelCategory berhasil dibuat';
    ELSE
        RAISE NOTICE 'Enum PanelCategory sudah ada';
    END IF;
END $$;

-- Step 2: Tambah kolom category ke tabel Panel dengan default value
ALTER TABLE "Panel" 
ADD COLUMN IF NOT EXISTS "category" "PanelCategory" DEFAULT 'FACILITY_MANAGEMENT';

-- Step 3: Update existing data (semua panel existing jadi FACILITY_MANAGEMENT)
UPDATE "Panel" 
SET "category" = 'FACILITY_MANAGEMENT' 
WHERE "category" IS NULL;

-- Verifikasi
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Panel' AND column_name = 'category';

-- Tampilkan data panel beserta category
SELECT "id_Panel", "Name_Panel", "category" 
FROM "Panel" 
ORDER BY "id_Panel";
