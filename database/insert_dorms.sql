-- Insert Master Dorm Data
-- NOTE: Please adjust 'gender' (PUTRA, PUTRI, CAMPUR) and 'powerCapacity' as strictly required.
-- IDs are auto-generated CUIDs in Prisma, but for SQL we can use fixed strings or generate UUIDs. 
-- Here we use simple text IDs like the name for simplicity in SQL if acceptable, OR generic UUIDs.
-- The schema defines "id" as TEXT PRIMARY KEY.

INSERT INTO "Dorm" ("id", "name", "gender", "powerCapacity", "capacity", "createdAt", "updatedAt")
VALUES
('dorm-limo', 'Limo', 'PUTRA', 2200, 50, NOW(), NOW()),
('dorm-kebon-nanas', 'Kebon Nanas', 'PUTRA', 2200, 50, NOW(), NOW()),
('dorm-an-nur', 'An Nur', 'PUTRI', 2200, 50, NOW(), NOW()),
('dorm-h-soleh-1', 'H. Soleh I', 'PUTRA', 2200, 50, NOW(), NOW()),
('dorm-sasak-2', 'Sasak II', 'PUTRI', 2200, 50, NOW(), NOW()),
('dorm-sasak-3', 'Sasak III', 'PUTRI', 2200, 50, NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;
