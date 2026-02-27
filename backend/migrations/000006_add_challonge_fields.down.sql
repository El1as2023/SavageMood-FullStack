ALTER TABLE tournaments
    DROP COLUMN IF EXISTS challonge_id,
    DROP COLUMN IF EXISTS challonge_url;