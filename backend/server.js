require('dotenv').config();

const app = require('./src/app');
const prisma = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Test database connection and start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Auto-seed ONLY on truly empty database (first run)
    // Never re-seeds if any data exists — admin changes are permanent
    try {
      const [userCount, categoryCount, productCount] = await Promise.all([
        prisma.user.count(),
        prisma.category.count(),
        prisma.product.count(),
      ]);
      if (userCount === 0 && categoryCount === 0 && productCount === 0) {
        console.log('📦 Empty database detected — running initial seed...');
        const { execSync } = require('child_process');
        execSync('node prisma/seed-20products.js', {
          cwd: __dirname,
          stdio: 'inherit',
        });
        console.log('✅ Initial seed completed');
      } else {
        console.log(`📊 Database: ${userCount} users, ${categoryCount} categories, ${productCount} products`);
      }
    } catch (seedErr) {
      console.warn('⚠️  Auto-seed check skipped:', seedErr.message);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
