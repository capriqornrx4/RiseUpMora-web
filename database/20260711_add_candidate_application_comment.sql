BEGIN;

ALTER TABLE candidates
    ADD COLUMN IF NOT EXISTS application_comment TEXT;

COMMIT;
