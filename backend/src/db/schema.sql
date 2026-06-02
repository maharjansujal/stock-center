-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    total_stock INT NOT NULL CHECK (total_stock >= 0),
    available_stock INT NOT NULL CHECK (available_stock >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (available_stock <= total_stock)
);

-- Requests
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reviewed_by INT REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(50) UNIQUE NOT NULL,
    item_id INT NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    transaction_type VARCHAR(30) NOT NULL CHECK (
        transaction_type IN ('stock_in', 'stock_out', 'request_approved', 'manual_adjustment')
    ),
    quantity INT NOT NULL CHECK (quantity > 0),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_public_id VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);