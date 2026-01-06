-- ============================================
-- Insert Panels Script
-- ============================================
-- This script inserts initial panels
-- ============================================

INSERT INTO "Panel" ("Name_Panel") 
VALUES ('GL 01')
ON CONFLICT DO NOTHING;

INSERT INTO "Panel" ("Name_Panel") 
VALUES ('GL 02')
ON CONFLICT DO NOTHING;

INSERT INTO "Panel" ("Name_Panel") 
VALUES ('GOR 01')
ON CONFLICT DO NOTHING;

INSERT INTO "Panel" ("Name_Panel") 
VALUES ('GOR 02')
ON CONFLICT DO NOTHING;

INSERT INTO "Panel" ("Name_Panel") 
VALUES ('Modular 01')
ON CONFLICT DO NOTHING;

-- Verify inserted panels
SELECT * FROM "Panel" ORDER BY "id_Panel";

