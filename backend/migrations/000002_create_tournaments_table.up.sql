CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'upcoming',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    max_teams INTEGER NOT NULL DEFAULT 8,
    prize_pool VARCHAR(100),
    banner_url VARCHAR(255),

    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tournaments_status ON tournaments (status);