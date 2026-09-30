# Database Migrations

## Migration Strategy for Render Deployment

This project has been **converted from SQLite to PostgreSQL** for production deployment on Render.

### How Migrations Work on Render

When you deploy to Render, the build command includes:
```bash
npm run build
# which runs: prisma generate && prisma migrate deploy
```

This will:
1. Generate Prisma Client
2. Apply all pending migrations to your PostgreSQL database
3. Create all tables according to the schema

### Existing Migration Files

The migration files in this directory were created for SQLite during development. 

**For PostgreSQL deployment on Render:**
- Render will automatically create the schema from `schema.prisma`
- The `migration_lock.toml` has been updated to `provider = "postgresql"`
- No manual migration needed on your part!

### After First Deployment

Once deployed to Render, you can:
1. **Seed the database** by running in Render Shell:
   ```bash
   npm run db:seed
   ```

2. **View your data** using Prisma Studio locally:
   ```bash
   # Update DATABASE_URL in .env to Render's PostgreSQL URL
   npm run db:studio
   ```

3. **Create new migrations** (future changes):
   ```bash
   npx prisma migrate dev --name your_migration_name
   git add .
   git commit -m "Add migration: your_migration_name"
   git push
   # Render will auto-deploy and apply migration
   ```

### Database Schema Overview

The schema includes:
- ✅ Users (customers & admins)
- ✅ Products & Categories
- ✅ Cart Items
- ✅ Orders & Order Items
- ✅ Payments
- ✅ Reviews
- ✅ Addresses
- ✅ Inventory Logs
- ✅ Contact Messages
- ✅ Refresh Tokens

All tables will be created automatically when you deploy to Render!
