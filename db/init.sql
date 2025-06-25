-- db/init.sql
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- ต้องมี 2 บรรทัดนี้
    due_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High'))
);
-- ... (ส่วน INSERT INTO)

-- ใส่ข้อมูลตัวอย่าง (ถ้ามีอยู่แล้วจะถูกข้ามไป)
INSERT INTO todos (title, description, is_completed, due_date, priority) VALUES
('Learn Docker Compose', 'Understand how to orchestrate multiple services', TRUE, '2025-07-01 23:59:59+07', 'High'),
('Build Next.js Frontend', 'Integrate with Tailwind CSS and DaisyUI.', FALSE, '2025-06-30 17:00:00+07', 'High'),
('Refactor Backend API', 'Ensure all CRUD operations are robust.', TRUE, '2025-06-28 12:00:00+07', 'Medium')
ON CONFLICT (id) DO NOTHING; -- ป้องกัน error ถ้า id ซ้ำในการ insert ครั้งที่ 2 ขึ้นไป

-- เพิ่มข้อมูลตัวอย่างใหม่ถ้าต้องการ
-- INSERT INTO todos (title, description, is_completed, due_date, priority) VALUES
-- ('Plan Summer Vacation', 'Research destinations and book flights.', FALSE, '2025-07-15 09:00:00+07', 'Medium'),
-- ('Read "Clean Code"', 'Finish the book and apply principles.', FALSE, '2025-08-01 23:59:59+07', 'Low')
-- ON CONFLICT (id) DO NOTHING;