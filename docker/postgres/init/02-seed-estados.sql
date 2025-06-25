-- Archivo: 02-seed-estados.sql
-- Insertar estados iniciales para el sistema de remitos
-- El orden es importante: Autorizado debe tener id=1 porque se hardcodea en el controlador

-- Conectar a la base de datos correcta
\c desApp;

-- Verificar si la tabla Estados existe antes de insertar
DO $$
BEGIN
    -- Solo insertar si la tabla existe y está vacía
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Estados') THEN
        -- Verificar si la tabla está vacía
        IF NOT EXISTS (SELECT 1 FROM "Estados" LIMIT 1) THEN
            -- Insertar estados en el orden correcto para que Autorizado tenga id=1
            INSERT INTO "Estados" (descripcion, "createdAt", "updatedAt") VALUES 
            ('Autorizado', NOW(), NOW()),
            ('Retenido', NOW(), NOW()),
            ('En preparación', NOW(), NOW()),
            ('En carga', NOW(), NOW()),
            ('En camino', NOW(), NOW()),
            ('No entregado', NOW(), NOW()),
            ('Entregado', NOW(), NOW());
            
            RAISE NOTICE 'Estados insertados correctamente';
        ELSE
            RAISE NOTICE 'La tabla Estados ya contiene datos';
        END IF;
    ELSE
        RAISE NOTICE 'La tabla Estados no existe aún';
    END IF;
END $$; 