CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid (),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    inventories (
        id SERIAL PRIMARY KEY,
        public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid (),
        item_name VARCHAR(150) NOT NULL,
        total_stock INT NOT NULL CHECK (total_stock >= 0),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NOT NULL
    );

CREATE TABLE
    requests (
        id SERIAL PRIMARY KEY,
        public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid (),
        user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        item_id INT NOT NULL REFERENCES inventories (id) ON DELETE RESTRICT,
        quantity INT NOT NULL CHECK (quantity > 0),
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
        reviewed_by INT REFERENCES users (id),
        reviewed_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    inventory_transactions (
        id SERIAL PRIMARY KEY,
        public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid (),
        item_id INT NOT NULL REFERENCES inventories (id) ON DELETE CASCADE,
        request_id INT REFERENCES requests (id) ON DELETE SET NULL,
        transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('stock_in', 'stock_out')),
        quantity INT NOT NULL CHECK (quantity > 0),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );