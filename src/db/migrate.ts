import { Pool } from "@neondatabase/serverless";
import 'dotenv/config'
import {drizzle} from 'drizzle-orm/node-postgres'
import {migrate} from 'drizzle-orm/node-postgres/migrator'

const pool = new Pool({
    connectionString:process.env.NEXT_PUBLIC_DATABASE_URL!
})

const db = drizzle(pool)

async function main(){
    console.log('migration started')
    await migrate(db, {migrationsFolder:"drizzle"})
    console.log('migration completed')
    process.exit(0)
}

main().catch(err=>{
    console.log('-----------------------------------------------------');
    console.log('error in main',err);
    console.log('-----------------------------------------------------');
    process.exit(0)    
}
)


