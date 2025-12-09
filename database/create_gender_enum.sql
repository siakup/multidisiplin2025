-- Create ENUM type for Gender
-- Jalankan script ini di pgAdmin sebelum membuat tabel Dorm

DROP TYPE IF EXISTS "Gender" CASCADE;
CREATE TYPE "Gender" AS ENUM ('PUTRA', 'PUTRI', 'CAMPUR');

-- Verify enum created
SELECT typname, enumlabel 
FROM pg_type 
JOIN pg_enum ON pg_type.oid = pg_enum.enumtypid 
WHERE typname = 'Gender';
