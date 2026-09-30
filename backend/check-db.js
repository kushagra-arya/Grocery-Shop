const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const userCount = await prisma.user.count();
    
    console.log('📊 Database Status:');
    console.log('  Categories:', categoryCount);
    console.log('  Products:', productCount);
    console.log('  Users:', userCount);
    
    if (productCount === 0) {
      console.log('\n⚠️  No products found! Please run: node prisma/seed-expanded.js');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
