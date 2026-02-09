CREATE TABLE IF NOT EXISTS matches(
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
    team_a_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    team_b_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,

    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    round INTEGER NOT NULL DEFAULT 1,
    match_order INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    start_time TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);

