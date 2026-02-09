CREATE TABLE IF NOT EXISTS tournament_participants(
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL  REFERENCES teams(id)  ON DELETE  CASCADE ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (tournament_id,team_id)
)