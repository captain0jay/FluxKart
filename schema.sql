CREATE TABLE fluxkart.contact (
    id SERIAL PRIMARY KEY,
    phone_number BIGINT,
    email VARCHAR,
    linked_id INT,
    link_precedence VARCHAR(10) CHECK (link_precedence IN (Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.PRIMARY, Constants.DB.MODELS.CONTACTS.LINK_PRECEDENCE.SECONDARY)),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL
);

ALTER TABLE fluxkart.contact
ADD CONSTRAINT fk_linked_contact
FOREIGN KEY (linked_id)
REFERENCES fluxkart.contact(id)
ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON fluxkart.contact
FOR EACH ROW
WHEN (OLD IS DISTINCT FROM NEW)
EXECUTE FUNCTION set_updated_at();
