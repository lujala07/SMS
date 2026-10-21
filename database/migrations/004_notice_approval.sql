BEGIN;

ALTER TABLE notices ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE notices ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE notices ADD COLUMN reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE notices ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE notices ADD COLUMN revision INTEGER NOT NULL DEFAULT 1;

CREATE INDEX idx_notices_status ON notices(status);

COMMIT;
