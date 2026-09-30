const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.inventoryLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@groceryshop.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '9876543210',
      role: 'ADMIN',
    },
  });
  console.log('👤 Created admin user');

  // Create Customer Users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      passwordHash: customerPassword,
      firstName: 'Rajesh',
      lastName: 'Verma',
      phone: '9876543211',
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      passwordHash: customerPassword,
      firstName: 'Kavita',
      lastName: 'Iyer',
      phone: '9876543212',
      role: 'CUSTOMER',
    },
  });
  console.log('👥 Created customer users');

  // Create Addresses for customers
  await prisma.address.create({
    data: {
      userId: customer1.id,
      fullName: 'Rajesh Verma',
      phone: '9876543211',
      street: '123 Main Street, Apartment 4B',
      landmark: 'Near City Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      isDefault: true,
    },
  });
  await prisma.address.create({
    data: {
      userId: customer1.id,
      fullName: 'Rajesh Verma',
      phone: '9876543211',
      street: '456 Office Complex, Floor 5',
      landmark: 'Tech Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400051',
      isDefault: false,
    },
  });
  await prisma.address.create({
    data: {
      userId: customer2.id,
      fullName: 'Kavita Iyer',
      phone: '9876543212',
      street: '789 Garden View Apartments',
      landmark: 'Opposite Central Park',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      isDefault: true,
    },
  });
  console.log('📍 Created addresses');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        description: 'Fresh fruits and vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dairy & Eggs',
        slug: 'dairy-eggs',
        description: 'Fresh dairy products and eggs',
        imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bakery',
        slug: 'bakery',
        description: 'Fresh baked goods',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        slug: 'beverages',
        description: 'Drinks and beverages',
        imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Snacks',
        slug: 'snacks',
        description: 'Chips, cookies and snacks',
        imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Grocery & Staples',
        slug: 'grocery-staples',
        description: 'Rice, flour, oil and daily essentials',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      },
    }),
  ]);
  console.log('📦 Created categories');

  // Create Products
  const products = await Promise.all([
    // Fruits & Vegetables
    prisma.product.create({
      data: {
        name: 'Fresh Apples',
        slug: 'fresh-apples',
        description: 'Premium quality red apples, perfect for healthy snacking',
        price: 180.00,
        comparePrice: 200.00,
        sku: 'FV001',
        categoryId: categories[0].id,
        stockQuantity: 100,
        unit: 'kg',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', isPrimary: true, altText: 'Fresh red apples' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Organic Bananas',
        slug: 'organic-bananas',
        description: 'Organic bananas, naturally ripened',
        price: 60.00,
        sku: 'FV002',
        categoryId: categories[0].id,
        stockQuantity: 150,
        unit: 'dozen',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', isPrimary: true, altText: 'Organic bananas' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fresh Tomatoes',
        slug: 'fresh-tomatoes',
        description: 'Farm fresh tomatoes',
        price: 40.00,
        sku: 'FV003',
        categoryId: categories[0].id,
        stockQuantity: 200,
        unit: 'kg',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1546470427-227c7369a9d8?w=400', isPrimary: true, altText: 'Fresh tomatoes' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Spinach Bundle',
        slug: 'spinach-bundle',
        description: 'Fresh green spinach leaves',
        price: 30.00,
        sku: 'FV004',
        categoryId: categories[0].id,
        stockQuantity: 80,
        unit: 'bundle',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', isPrimary: true, altText: 'Fresh spinach' },
          ],
        },
      },
    }),

    // Dairy & Eggs
    prisma.product.create({
      data: {
        name: 'Farm Fresh Milk',
        slug: 'farm-fresh-milk',
        description: 'Pure and fresh cow milk, pasteurized',
        price: 65.00,
        sku: 'DE001',
        categoryId: categories[1].id,
        stockQuantity: 50,
        unit: 'liter',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', isPrimary: true, altText: 'Fresh milk' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Free Range Eggs',
        slug: 'free-range-eggs',
        description: 'Farm fresh free-range eggs, pack of 12',
        price: 90.00,
        comparePrice: 100.00,
        sku: 'DE002',
        categoryId: categories[1].id,
        stockQuantity: 100,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', isPrimary: true, altText: 'Free range eggs' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Greek Yogurt',
        slug: 'greek-yogurt',
        description: 'Creamy Greek yogurt, 500g',
        price: 120.00,
        sku: 'DE003',
        categoryId: categories[1].id,
        stockQuantity: 60,
        unit: 'piece',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', isPrimary: true, altText: 'Greek yogurt' },
          ],
        },
      },
    }),

    // Bakery
    prisma.product.create({
      data: {
        name: 'Whole Wheat Bread',
        slug: 'whole-wheat-bread',
        description: 'Freshly baked whole wheat bread',
        price: 45.00,
        sku: 'BK001',
        categoryId: categories[2].id,
        stockQuantity: 40,
        unit: 'piece',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', isPrimary: true, altText: 'Whole wheat bread' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Butter Croissants',
        slug: 'butter-croissants',
        description: 'Flaky butter croissants, pack of 4',
        price: 160.00,
        sku: 'BK002',
        categoryId: categories[2].id,
        stockQuantity: 30,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', isPrimary: true, altText: 'Butter croissants' },
          ],
        },
      },
    }),

    // Beverages
    prisma.product.create({
      data: {
        name: 'Orange Juice',
        slug: 'orange-juice',
        description: 'Fresh squeezed orange juice, 1L',
        price: 110.00,
        sku: 'BV001',
        categoryId: categories[3].id,
        stockQuantity: 70,
        unit: 'bottle',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', isPrimary: true, altText: 'Orange juice' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Green Tea',
        slug: 'green-tea',
        description: 'Premium green tea bags, 25 sachets',
        price: 180.00,
        comparePrice: 220.00,
        sku: 'BV002',
        categoryId: categories[3].id,
        stockQuantity: 90,
        unit: 'box',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400', isPrimary: true, altText: 'Green tea' },
          ],
        },
      },
    }),

    // Snacks
    prisma.product.create({
      data: {
        name: 'Mixed Nuts',
        slug: 'mixed-nuts',
        description: 'Premium mixed nuts - almonds, cashews, walnuts, 250g',
        price: 350.00,
        sku: 'SN001',
        categoryId: categories[4].id,
        stockQuantity: 45,
        unit: 'pack',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400', isPrimary: true, altText: 'Mixed nuts' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Potato Chips',
        slug: 'potato-chips',
        description: 'Crispy salted potato chips, 150g',
        price: 50.00,
        sku: 'SN002',
        categoryId: categories[4].id,
        stockQuantity: 120,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', isPrimary: true, altText: 'Potato chips' },
          ],
        },
      },
    }),

    // Grocery & Staples
    prisma.product.create({
      data: {
        name: 'Basmati Rice',
        slug: 'basmati-rice',
        description: 'Premium aged basmati rice, 5kg',
        price: 450.00,
        comparePrice: 500.00,
        sku: 'GS001',
        categoryId: categories[5].id,
        stockQuantity: 80,
        unit: 'bag',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', isPrimary: true, altText: 'Basmati rice' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Extra Virgin Olive Oil',
        slug: 'olive-oil',
        description: 'Cold-pressed extra virgin olive oil, 500ml',
        price: 550.00,
        sku: 'GS002',
        categoryId: categories[5].id,
        stockQuantity: 35,
        unit: 'bottle',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', isPrimary: true, altText: 'Olive oil' },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Whole Wheat Flour',
        slug: 'whole-wheat-flour',
        description: 'Stone ground whole wheat flour (Atta), 5kg',
        price: 280.00,
        sku: 'GS003',
        categoryId: categories[5].id,
        stockQuantity: 100,
        unit: 'bag',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=400', isPrimary: true, altText: 'Whole wheat flour' },
          ],
        },
      },
    }),
  ]);
  console.log('🛒 Created products');

  // Get products for reviews
  const allProducts = await prisma.product.findMany();

  // Create Reviews (one by one because createMany doesn't work with relations in SQLite)
  const reviewsData = [
    {
      userId: customer1.id,
      productId: allProducts[0].id,
      rating: 5,
      title: 'Excellent quality!',
      comment: 'These apples are so fresh and crispy. Will definitely buy again!',
    },
    {
      userId: customer2.id,
      productId: allProducts[0].id,
      rating: 4,
      title: 'Good apples',
      comment: 'Nice and fresh, slightly smaller than expected.',
    },
    {
      userId: customer1.id,
      productId: allProducts[4].id,
      rating: 5,
      title: 'Best milk!',
      comment: 'Pure and fresh taste, my kids love it.',
    },
    {
      userId: customer2.id,
      productId: allProducts[7].id,
      rating: 5,
      title: 'Fresh bread',
      comment: 'Love the freshness, perfect for breakfast.',
    },
  ];
  
  for (const review of reviewsData) {
    await prisma.review.create({ data: review });
  }
  console.log('⭐ Created reviews');

  // Create a sample order for customer1
  const customer1Address = await prisma.address.findFirst({
    where: { userId: customer1.id, isDefault: true },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-0001',
      userId: customer1.id,
      addressId: customer1Address.id,
      subtotal: 330.00,
      tax: 59.40,
      shippingCharge: 40.00,
      discount: 0,
      totalAmount: 429.40,
      status: 'DELIVERED',
      orderItems: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 2,
            unitPrice: 180.00,
            total: 360.00,
          },
          {
            productId: allProducts[4].id,
            quantity: 1,
            unitPrice: 65.00,
            total: 65.00,
          },
        ],
      },
      payment: {
        create: {
          amount: 429.40,
          method: 'CARD',
          status: 'COMPLETED',
          transactionId: 'TXN_DUMMY_001',
          paidAt: new Date(),
        },
      },
    },
  });
  console.log('📋 Created sample order');

  // Create Inventory Logs (one by one because createMany doesn't work with relations in SQLite)
  const inventoryLogsData = [
    {
      productId: allProducts[0].id,
      adminId: admin.id,
      changeQty: 100,
      prevQty: 0,
      newQty: 100,
      reason: 'RESTOCK',
      notes: 'Initial stock',
    },
    {
      productId: allProducts[0].id,
      adminId: admin.id,
      changeQty: -2,
      prevQty: 100,
      newQty: 98,
      reason: 'SALE',
      notes: 'Order ORD-2026-0001',
    },
  ];
  
  for (const log of inventoryLogsData) {
    await prisma.inventoryLog.create({ data: log });
  }
  console.log('📊 Created inventory logs');

  console.log('✅ Database seeding completed!');
  console.log('\n📝 Test Credentials:');
  console.log('   Admin: admin@groceryshop.com / admin123');
  console.log('   Customer: john@example.com / customer123 (Rajesh Verma)');
  console.log('   Customer: jane@example.com / customer123 (Kavita Iyer)');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
