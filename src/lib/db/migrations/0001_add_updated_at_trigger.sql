-- 1. Create the shared function (Only needs to exist once in your DB)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Create the triggers for your specific tables
CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_exchange_rates_updated_at
BEFORE UPDATE ON exchange_rates
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();