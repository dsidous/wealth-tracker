import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Use max: 1 for serverless – each instance keeps a single connection; use Supabase's pooled URL (port 6543)
const client = postgres(connectionString, { max: 1 });
export const db = drizzle(client, { schema, logger: true });
