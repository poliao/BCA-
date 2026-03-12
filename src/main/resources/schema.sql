-- Create Tables for User and Menu Management with RBAC

-- 1. Menus Table
CREATE TABLE menus (
    menu_code VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    url VARCHAR(200),
    main_menu VARCHAR(50), -- Self-referencing menu_code
    program_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_main_menu FOREIGN KEY (main_menu) REFERENCES menus(menu_code)
);

-- 2. Role Permissions Table (Authorizeds)
-- Stores what each role can do in each menu
CREATE TABLE role_permissions (
    role_code VARCHAR(50),
    menu_code VARCHAR(50),
    auth_read_only BOOLEAN DEFAULT FALSE,
    auth_create BOOLEAN DEFAULT FALSE,
    auth_edit BOOLEAN DEFAULT FALSE,
    auth_cancel BOOLEAN DEFAULT FALSE,
    auth_delete BOOLEAN DEFAULT FALSE,
    auth_varify BOOLEAN DEFAULT FALSE,
    auth_approve BOOLEAN DEFAULT FALSE,
    auth_print BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (role_code, menu_code),
    CONSTRAINT fk_perm_menu FOREIGN KEY (menu_code) REFERENCES menus(menu_code)
);

-- 3. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name_th VARCHAR(100),
    last_name_th VARCHAR(100),
    first_name_en VARCHAR(100),
    last_name_en VARCHAR(100),
    email VARCHAR(100),
    role_code VARCHAR(50), -- References role_code in role_permissions
    is_active BOOLEAN DEFAULT TRUE
);

-- Sample Data (Based on user's JSON)
INSERT INTO menus (menu_code, title, icon, url, main_menu, program_code, is_active) VALUES
('01DB00000', 'ข้อมูลหลัก', 'fas fa-database', NULL, NULL, NULL, TRUE),
('01DB00020', 'ตำแหน่ง', 'far fa-circle fa-xs', '/db/dbmt02', '01DB00000', 'DBMT02', TRUE),
('01DB00030', 'แผนก', 'far fa-circle fa-xs', '/db/dbmt03', '01DB00000', 'DBMT03', TRUE),
('99SU00000', 'กำหนดสิทธิ์เข้าใช้งาน', 'fas fa-cog', NULL, NULL, NULL, TRUE),
('99SU10005', 'จัดการระบบ', 'far fa-circle fa-xs', '/su/sumt01', '99SU00000', 'SUMT01', TRUE);

-- Sample Role Permissions for 'ADMIN'
INSERT INTO role_permissions (role_code, menu_code, auth_read_only, auth_create, auth_edit, auth_cancel, auth_delete, auth_varify, auth_approve, auth_print) VALUES
('ADMIN', '01DB00000', TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE),
('ADMIN', '01DB00020', TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE),
('ADMIN', '01DB00030', TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE),
('ADMIN', '99SU00000', TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE),
('ADMIN', '99SU10005', TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE);

-- Sample User
INSERT INTO users (username, password, first_name_th, last_name_th, first_name_en, last_name_en, email, role_code, is_active) VALUES
('admin_user', 'hashed_password', 'แอดมิน', 'ระบบ', 'Admin', 'System', 'admin@example.com', 'ADMIN', TRUE);
