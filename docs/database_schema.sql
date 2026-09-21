-- ==============================================================================
-- SISTEM PLANNED MAINTENANCE SYSTEM (PMS) KAPAL ENTERPRISE
-- PT. PELAYARAN BAHARIMAS KALIMANTAN
-- Production Database DDL Schema (PostgreSQL 14+)
-- Standar: IMO ISM Code Section 10 & Biro Klasifikasi Indonesia (BKI)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & AUTENTIKASI (RBAC)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    vessel_id VARCHAR(50),
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. ARMADA KAPAL (VESSELS & FLEET)
-- ------------------------------------------------------------------------------
CREATE TABLE vessels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    ownership_status VARCHAR(50) DEFAULT 'As Owner',
    charterer_name VARCHAR(100),
    flag VARCHAR(50) DEFAULT 'Indonesia',
    call_sign VARCHAR(30),
    imo_number VARCHAR(30),
    registration_port VARCHAR(50) DEFAULT 'Pontianak',
    gross_tonnage INTEGER NOT NULL,
    net_tonnage INTEGER,
    deadweight_tonnage INTEGER,
    length_overall NUMERIC(8, 2),
    breadth NUMERIC(8, 2),
    depth NUMERIC(8, 2),
    draft_max NUMERIC(8, 2),
    year_built INTEGER,
    builder VARCHAR(150),
    classification_society VARCHAR(50) DEFAULT 'Biro Klasifikasi Indonesia (BKI)',
    bki_register_number VARCHAR(50),
    main_engine_type VARCHAR(150),
    main_engine_power VARCHAR(100),
    aux_engine_type VARCHAR(150),
    status VARCHAR(50) DEFAULT 'Operational',
    location VARCHAR(100),
    current_voyage VARCHAR(150),
    master_captain VARCHAR(100),
    chief_engineer VARCHAR(100),
    photo_url TEXT,
    particulars_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vessels_status ON vessels(status);
CREATE INDEX idx_vessels_type ON vessels(type);

-- ------------------------------------------------------------------------------
-- 3. MASTER EQUIPMENT & RUNNING HOURS
-- ------------------------------------------------------------------------------
CREATE TABLE equipment (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100),
    maker VARCHAR(100),
    location VARCHAR(100) DEFAULT 'Engine Room',
    running_hours NUMERIC(10, 2) DEFAULT 0,
    last_maintenance_hours NUMERIC(10, 2) DEFAULT 0,
    next_service_hours NUMERIC(10, 2) DEFAULT 500,
    status VARCHAR(30) DEFAULT 'Normal',
    criticality VARCHAR(30) DEFAULT 'Tinggi',
    is_critical_equipment BOOLEAN DEFAULT FALSE,
    installed_date DATE,
    sub_components JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_equipment_vessel_code UNIQUE(vessel_id, code)
);

CREATE INDEX idx_equipment_vessel ON equipment(vessel_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_criticality ON equipment(criticality);

-- ------------------------------------------------------------------------------
-- 4. BUKU JURNAL HARIAN MESIN (DAILY MACHINERY LOGBOOK)
-- ------------------------------------------------------------------------------
CREATE TABLE daily_machinery_logs (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    chief_engineer VARCHAR(100),
    logged_by VARCHAR(100) NOT NULL,
    verified_by_captain BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_machinery_log_entries (
    id VARCHAR(50) PRIMARY KEY,
    daily_log_id VARCHAR(50) NOT NULL REFERENCES daily_machinery_logs(id) ON DELETE CASCADE,
    equipment_id VARCHAR(50) NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    added_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
    cumulative_hours NUMERIC(10, 2) NOT NULL,
    lube_oil_pressure_bar NUMERIC(4, 2),
    cooling_water_temp_c NUMERIC(5, 2),
    exhaust_temp_c NUMERIC(5, 2),
    observations TEXT
);

CREATE INDEX idx_daily_log_vessel_date ON daily_machinery_logs(vessel_id, log_date);

-- ------------------------------------------------------------------------------
-- 5. MASTER ATURAN JADWAL PERAWATAN (MAINTENANCE SCHEDULE RULES)
-- ------------------------------------------------------------------------------
CREATE TABLE maintenance_schedules (
    id VARCHAR(50) PRIMARY KEY,
    equipment_category VARCHAR(50),
    equipment_id VARCHAR(50) REFERENCES equipment(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    interval_type VARCHAR(30) NOT NULL,
    interval_hours INTEGER,
    interval_days INTEGER,
    lead_time_days INTEGER DEFAULT 7,
    assigned_role VARCHAR(50) DEFAULT 'Teknisi / Chief Engineer',
    priority VARCHAR(30) DEFAULT 'Tinggi',
    description TEXT,
    sop_procedure_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. PERINTAH KERJA PEMELIHARAAN TEKNIS (TECHNICAL WORK ORDERS)
-- ------------------------------------------------------------------------------
CREATE TABLE technical_work_orders (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    equipment_id VARCHAR(50) NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    schedule_id VARCHAR(50) REFERENCES maintenance_schedules(id) ON DELETE SET NULL,
    work_order_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    priority VARCHAR(30) DEFAULT 'Tinggi',
    status VARCHAR(30) DEFAULT 'Scheduled',
    planned_date DATE,
    due_date DATE,
    target_running_hours NUMERIC(10, 2),
    assigned_technician VARCHAR(100),
    assigned_role VARCHAR(50),
    chief_engineer_approver VARCHAR(100),
    captain_approver VARCHAR(100),
    description TEXT,
    sop_steps JSONB DEFAULT '[]'::jsonb,
    completion_date DATE,
    executed_running_hours NUMERIC(10, 2),
    actual_man_hours NUMERIC(6, 2),
    work_done_summary TEXT,
    measured_parameters JSONB,
    is_satisfactory BOOLEAN DEFAULT TRUE,
    service_cost NUMERIC(15, 2) DEFAULT 0,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_two_vessel_status ON technical_work_orders(vessel_id, status);
CREATE INDEX idx_two_equipment ON technical_work_orders(equipment_id);

CREATE TABLE work_order_sparepart_usage (
    id VARCHAR(50) PRIMARY KEY,
    work_order_id VARCHAR(50) NOT NULL REFERENCES technical_work_orders(id) ON DELETE CASCADE,
    sparepart_id VARCHAR(50) NOT NULL,
    sparepart_name VARCHAR(150) NOT NULL,
    part_number VARCHAR(100),
    qty_used NUMERIC(8, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_cost NUMERIC(15, 2) DEFAULT 0,
    total_cost NUMERIC(15, 2) DEFAULT 0,
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. LOGISTIK, SUKU CADANG & INVENTARIS ONBOARD
-- ------------------------------------------------------------------------------
CREATE TABLE spareparts (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    vessel_id VARCHAR(50) REFERENCES vessels(id) ON DELETE CASCADE,
    target VARCHAR(30) DEFAULT 'Kapal',
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(100),
    equipment_code VARCHAR(50),
    part_number VARCHAR(100),
    maker VARCHAR(100),
    stock_onboard NUMERIC(8, 2) DEFAULT 0,
    stock_warehouse NUMERIC(8, 2) DEFAULT 0,
    min_stock_limit NUMERIC(8, 2) DEFAULT 1,
    unit VARCHAR(30) DEFAULT 'Pcs',
    unit_cost NUMERIC(15, 2) DEFAULT 0,
    storage_location VARCHAR(100),
    supplier VARCHAR(150),
    status VARCHAR(30) DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_spareparts_vessel ON spareparts(vessel_id);
CREATE INDEX idx_spareparts_status ON spareparts(status);

-- ------------------------------------------------------------------------------
-- 8. SURAT PERMINTAAN BARANG KAPAL (SPBK / STORE REQUISITION)
-- ------------------------------------------------------------------------------
CREATE TABLE requisitions (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(100),
    priority VARCHAR(30) DEFAULT 'Penting (Segera)',
    status VARCHAR(50) DEFAULT 'Diajukan',
    date_submitted DATE NOT NULL,
    needed_date DATE,
    received_date DATE,
    requester_name VARCHAR(100) NOT NULL,
    requester_role VARCHAR(50),
    master_captain VARCHAR(100),
    delivery_location VARCHAR(150),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requisition_items (
    id VARCHAR(50) PRIMARY KEY,
    requisition_id VARCHAR(50) NOT NULL REFERENCES requisitions(id) ON DELETE CASCADE,
    sparepart_id VARCHAR(50) REFERENCES spareparts(id) ON DELETE SET NULL,
    item_name VARCHAR(150) NOT NULL,
    part_number VARCHAR(100),
    qty NUMERIC(8, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    received BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- ------------------------------------------------------------------------------
-- 9. PERALATAN KRITIS & LOG PENGUJIAN DARURAT (ISM CODE 10.3)
-- ------------------------------------------------------------------------------
CREATE TABLE critical_equipment_tests (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    equipment_id VARCHAR(50) REFERENCES equipment(id) ON DELETE CASCADE,
    test_title VARCHAR(200) NOT NULL,
    test_category VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    interval_days INTEGER DEFAULT 7,
    next_test_due DATE NOT NULL,
    conducted_by VARCHAR(100) NOT NULL,
    verified_by_chief_engineer VARCHAR(100),
    test_result VARCHAR(30) NOT NULL,
    load_test_duration_minutes INTEGER,
    voltage_observed NUMERIC(6, 2),
    pressure_observed_bar NUMERIC(4, 2),
    observations TEXT,
    corrective_wo_id VARCHAR(50) REFERENCES technical_work_orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_critical_test_vessel ON critical_equipment_tests(vessel_id);

-- ------------------------------------------------------------------------------
-- 10. FORMASI AWAK KAPAL & SAFE MANNING (STCW & KEMENHUB)
-- ------------------------------------------------------------------------------
CREATE TABLE safe_manning_standards (
    id VARCHAR(50) PRIMARY KEY,
    vessel_type VARCHAR(50) NOT NULL,
    rank_title VARCHAR(100) NOT NULL,
    required_coc VARCHAR(50),
    required_cop VARCHAR(100),
    minimum_count INTEGER NOT NULL DEFAULT 1,
    department VARCHAR(30) NOT NULL
);

CREATE TABLE crew (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) REFERENCES vessels(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    rank VARCHAR(100) NOT NULL,
    seaman_book_no VARCHAR(50),
    phone VARCHAR(30),
    status VARCHAR(30) DEFAULT 'Onboard',
    sign_on_date DATE,
    sign_off_date DATE,
    emergency_contact VARCHAR(100),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crew_certificates (
    id VARCHAR(50) PRIMARY KEY,
    crew_id VARCHAR(50) NOT NULL REFERENCES crew(id) ON DELETE CASCADE,
    vessel_id VARCHAR(50) REFERENCES vessels(id) ON DELETE SET NULL,
    certificate_type VARCHAR(50) NOT NULL,
    certificate_name VARCHAR(150) NOT NULL,
    certificate_no VARCHAR(100) NOT NULL,
    issue_date DATE,
    expiry_date DATE NOT NULL,
    issuer VARCHAR(100) DEFAULT 'Kemenhub DJPL',
    status VARCHAR(30) DEFAULT 'Active',
    scan_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_crew_vessel ON crew(vessel_id);
CREATE INDEX idx_crew_cert_expiry ON crew_certificates(expiry_date);

-- ------------------------------------------------------------------------------
-- 11. SERTIFIKAT & SURAT RESMI KAPAL (STATUTORI & KLASIFIKASI)
-- ------------------------------------------------------------------------------
CREATE TABLE ship_documents (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    category_id VARCHAR(50) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    document_no VARCHAR(100) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    place_of_issue VARCHAR(100),
    mandatory_auditor VARCHAR(100),
    certificate_term VARCHAR(50) DEFAULT 'Full Term (Definitif)',
    survey_type VARCHAR(50) DEFAULT 'Annual Survey',
    survey_period_years INTEGER DEFAULT 1,
    issue_date DATE NOT NULL,
    endorsement_date DATE,
    expiry_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Active',
    category_specific_data JSONB,
    notes TEXT,
    scan_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ship_docs_vessel ON ship_documents(vessel_id);
CREATE INDEX idx_ship_docs_expiry ON ship_documents(expiry_date);

-- ------------------------------------------------------------------------------
-- 12. AUDIT & KEPATUHAN ISM CODE (DOC & SMC)
-- ------------------------------------------------------------------------------
CREATE TABLE audits (
    id VARCHAR(50) PRIMARY KEY,
    audit_no VARCHAR(50) UNIQUE NOT NULL,
    scope VARCHAR(30) NOT NULL,
    vessel_id VARCHAR(50) REFERENCES vessels(id) ON DELETE SET NULL,
    audit_type VARCHAR(50) DEFAULT 'Internal Audit',
    lead_auditor VARCHAR(100) NOT NULL,
    audit_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Completed',
    findings_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_findings (
    id VARCHAR(50) PRIMARY KEY,
    finding_no VARCHAR(50) UNIQUE NOT NULL,
    audit_id VARCHAR(50) NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    vessel_id VARCHAR(50) REFERENCES vessels(id) ON DELETE SET NULL,
    clause_code VARCHAR(30) NOT NULL,
    clause_name VARCHAR(150) NOT NULL,
    category VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'NC Open',
    description TEXT NOT NULL,
    objective_evidence TEXT,
    date_identified DATE NOT NULL,
    due_date DATE NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    auditor VARCHAR(100) NOT NULL,
    root_cause TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    evidence_file_url TEXT,
    closed_date DATE,
    auditor_review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_findings_status ON audit_findings(status);

-- ------------------------------------------------------------------------------
-- 13. MANAJEMEN BIAYA & REALISASI ANGGARAN KAPAL (COST MANAGEMENT)
-- ------------------------------------------------------------------------------
CREATE TABLE vessel_budgets (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    fiscal_year INTEGER NOT NULL,
    budget_sparepart NUMERIC(15, 2) DEFAULT 0,
    budget_maintenance NUMERIC(15, 2) DEFAULT 0,
    budget_docking NUMERIC(15, 2) DEFAULT 0,
    budget_provisions_bama NUMERIC(15, 2) DEFAULT 0,
    budget_certification NUMERIC(15, 2) DEFAULT 0,
    budget_emergency NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_vessel_fiscal_year UNIQUE(vessel_id, fiscal_year)
);

CREATE TABLE expense_transactions (
    id VARCHAR(50) PRIMARY KEY,
    vessel_id VARCHAR(50) NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    vendor_payee VARCHAR(150),
    invoice_ref VARCHAR(100),
    linked_work_order_id VARCHAR(50) REFERENCES technical_work_orders(id) ON DELETE SET NULL,
    linked_requisition_id VARCHAR(50) REFERENCES requisitions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expense_vessel_date ON expense_transactions(vessel_id, transaction_date);
