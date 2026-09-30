const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Limit connection pool for Supabase free tier
  log: [],
});

// Helper: run creates in batches to avoid connection pool exhaustion
async function createInBatches(createFns, batchSize = 3) {
  const results = [];
  for (let i = 0; i < createFns.length; i += batchSize) {
    const batch = createFns.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn => fn()));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  console.log('🌱 Seeding database with 21 legit grocery products...');

  // Clear existing data (except manually-created user accounts)
  try {
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
    // Only delete seed-created users, preserve manually registered accounts
    const seedEmails = [
      'admin@groceryshop.com', 'customer@example.com', 'jane@example.com',
      'priya@example.com', 'rahul@example.com', 'anita@example.com',
      'vikram@example.com', 'meera@example.com', 'arjun@example.com',
    ];
    await prisma.user.deleteMany({ where: { email: { in: seedEmails } } });
    console.log('✅ Cleared existing data (preserved manually-created accounts)');
  } catch (e) {
    console.log('⚠️  Some tables may not exist yet');
  }

  // Create Users
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
  console.log('✅ Created admin user (admin@groceryshop.com / admin123)');

  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      firstName: 'Rajesh',
      lastName: 'Verma',
      phone: '9876543211',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Created customer user (customer@example.com / customer123)');

  // Create Kavita customer
  const janePassword = await bcrypt.hash('jane123', 10);
  const jane = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      passwordHash: janePassword,
      firstName: 'Kavita',
      lastName: 'Iyer',
      phone: '9876543212',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Created Jane user (jane@example.com / jane123)');

  // Create additional reviewer accounts for diverse reviews
  const reviewerPassword = await bcrypt.hash('reviewer123', 10);
  const reviewerData = [
    { email: 'priya@example.com', firstName: 'Priya', lastName: 'Sharma', phone: '9876543213' },
    { email: 'rahul@example.com', firstName: 'Rahul', lastName: 'Kumar', phone: '9876543214' },
    { email: 'anita@example.com', firstName: 'Anita', lastName: 'Patel', phone: '9876543215' },
    { email: 'vikram@example.com', firstName: 'Vikram', lastName: 'Singh', phone: '9876543216' },
    { email: 'meera@example.com', firstName: 'Meera', lastName: 'Nair', phone: '9876543217' },
    { email: 'arjun@example.com', firstName: 'Arjun', lastName: 'Reddy', phone: '9876543218' },
  ];
  const reviewers = [];
  for (const data of reviewerData) {
    const reviewer = await prisma.user.create({
      data: { ...data, passwordHash: reviewerPassword, role: 'CUSTOMER' },
    });
    reviewers.push(reviewer);
  }
  console.log('✅ Created 6 additional reviewer accounts');

  // Create Address for customer
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
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
  console.log('✅ Created customer address');

  // Create Address for Jane
  const janeAddress = await prisma.address.create({
    data: {
      userId: jane.id,
      fullName: 'Kavita Iyer',
      phone: '9876543212',
      street: '456 Park Avenue, Floor 2',
      landmark: 'Opposite Central Garden',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      isDefault: true,
    },
  });
  console.log('✅ Created Jane address');

  // ==================== CATEGORIES ====================
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
        imageUrl: 'https://i.ibb.co/zhMVCVDB/Amul-Butter.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Grains & Staples',
        slug: 'grains-staples',
        description: 'Rice, flour, oil and daily essentials',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        slug: 'beverages',
        description: 'Tea, coffee, juices and drinks',
        imageUrl: 'https://i.ibb.co/gLKRpYXq/Green-Tea.webp',
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
  ]);
  console.log('✅ Created 5 categories');

  // ==================== PRODUCTS (20 ITEMS) ====================
  const productCreateFns = [
    // Fruits & Vegetables (5)
    () => prisma.product.create({
      data: {
        name: 'Fresh Apples',
        slug: 'fresh-apples',
        description: 'Premium quality red apples, naturally sweet and crispy',
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
    () => prisma.product.create({
      data: {
        name: 'Organic Bananas',
        slug: 'organic-bananas',
        description: 'Ripe organic bananas, perfect for breakfast and smoothies',
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
    () => prisma.product.create({
      data: {
        name: 'Fresh Tomatoes',
        slug: 'fresh-tomatoes',
        description: 'Farm fresh red tomatoes, perfect for cooking',
        price: 40.00,
        sku: 'FV003',
        categoryId: categories[0].id,
        stockQuantity: 200,
        unit: 'kg',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/ymwPQr5S/Tomato.webp', isPrimary: true, altText: 'Fresh tomatoes' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Carrots Bundle',
        slug: 'carrots-bundle',
        description: 'Fresh orange carrots, great for salads and cooking',
        price: 35.00,
        sku: 'FV004',
        categoryId: categories[0].id,
        stockQuantity: 120,
        unit: 'kg',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/kV6XvvMr/Carrot.jpg', isPrimary: true, altText: 'Fresh carrots' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Spinach Bundle',
        slug: 'spinach-bundle',
        description: 'Fresh green spinach leaves, nutrient-rich',
        price: 30.00,
        sku: 'FV005',
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

    // Dairy & Eggs (5)
    () => prisma.product.create({
      data: {
        name: 'Farm Fresh Milk',
        slug: 'farm-fresh-milk',
        description: 'Pure and fresh pasteurized cow milk, 1 liter',
        price: 65.00,
        sku: 'DE001',
        categoryId: categories[1].id,
        stockQuantity: 100,
        unit: 'liter',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', isPrimary: true, altText: 'Fresh milk' },
          ],
        },
      },
    }),
    () => prisma.product.create({
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
    () => prisma.product.create({
      data: {
        name: 'Greek Yogurt',
        slug: 'greek-yogurt',
        description: 'Creamy Greek yogurt, 500g pack',
        price: 120.00,
        sku: 'DE003',
        categoryId: categories[1].id,
        stockQuantity: 60,
        unit: 'piece',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/2Yprc1Z7/Greek-Yogurt.jpg', isPrimary: true, altText: 'Greek yogurt' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Cheddar Cheese',
        slug: 'cheddar-cheese',
        description: 'Mild cheddar cheese, 200g pack',
        price: 150.00,
        sku: 'DE004',
        categoryId: categories[1].id,
        stockQuantity: 50,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/0jqwRPhM/Cheese.png', isPrimary: true, altText: 'Cheddar cheese' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Amul Butter',
        slug: 'amul-butter',
        description: 'Premium Amul butter, 500g pack - rich and creamy',
        price: 250.00,
        comparePrice: 280.00,
        sku: 'DE005',
        categoryId: categories[1].id,
        stockQuantity: 75,
        unit: 'pack',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/zhMVCVDB/Amul-Butter.jpg', isPrimary: true, altText: 'Amul butter' },
          ],
        },
      },
    }),

    // Grains & Staples (5)
    () => prisma.product.create({
      data: {
        name: 'Basmati Rice',
        slug: 'basmati-rice',
        description: 'Premium aged basmati rice, 5kg bag',
        price: 450.00,
        comparePrice: 500.00,
        sku: 'GS001',
        categoryId: categories[2].id,
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
    () => prisma.product.create({
      data: {
        name: 'Whole Wheat Flour',
        slug: 'whole-wheat-flour',
        description: 'Stone ground whole wheat flour (Atta), 5kg bag',
        price: 280.00,
        sku: 'GS002',
        categoryId: categories[2].id,
        stockQuantity: 100,
        unit: 'bag',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=400', isPrimary: true, altText: 'Whole wheat flour' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Refined Sunflower Oil',
        slug: 'sunflower-oil',
        description: 'Pure refined sunflower oil, 1 liter bottle',
        price: 180.00,
        sku: 'GS003',
        categoryId: categories[2].id,
        stockQuantity: 75,
        unit: 'bottle',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', isPrimary: true, altText: 'Sunflower oil' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Iodized Salt',
        slug: 'iodized-salt',
        description: 'Pure iodized table salt, 1kg pack',
        price: 25.00,
        sku: 'GS004',
        categoryId: categories[2].id,
        stockQuantity: 200,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/YFsKYHW1/Iodized-Salt.jpg', isPrimary: true, altText: 'Iodized salt' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Black Gram Lentils',
        slug: 'black-gram-lentils',
        description: 'High quality black gram (urad), 1kg bag',
        price: 90.00,
        sku: 'GS005',
        categoryId: categories[2].id,
        stockQuantity: 60,
        unit: 'bag',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/gFLL3Hww/Black-Gram.jpg', isPrimary: true, altText: 'Black gram lentils' },
          ],
        },
      },
    }),

    // Beverages (3)
    () => prisma.product.create({
      data: {
        name: 'Green Tea Bags',
        slug: 'green-tea-bags',
        description: 'Premium green tea bags, 25 sachets',
        price: 180.00,
        comparePrice: 220.00,
        sku: 'BV001',
        categoryId: categories[3].id,
        stockQuantity: 90,
        unit: 'box',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/vCfWcxSr/Green-Tea-Bags.jpg', isPrimary: true, altText: 'Green tea bags' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Ground Coffee',
        slug: 'ground-coffee',
        description: 'Freshly ground arabica coffee, 250g pack',
        price: 250.00,
        sku: 'BV002',
        categoryId: categories[3].id,
        stockQuantity: 70,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/8QFW4g3/Coffee.jpg', isPrimary: true, altText: 'Ground coffee' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Orange Juice',
        slug: 'orange-juice',
        description: 'Fresh squeezed orange juice, 1L bottle',
        price: 110.00,
        sku: 'BV003',
        categoryId: categories[3].id,
        stockQuantity: 80,
        unit: 'bottle',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', isPrimary: true, altText: 'Orange juice' },
          ],
        },
      },
    }),

    // Bakery (3)
    () => prisma.product.create({
      data: {
        name: 'Whole Wheat Bread',
        slug: 'whole-wheat-bread',
        description: 'Freshly baked whole wheat bread, 400g',
        price: 45.00,
        sku: 'BK001',
        categoryId: categories[4].id,
        stockQuantity: 50,
        unit: 'piece',
        isFeatured: true,
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', isPrimary: true, altText: 'Whole wheat bread' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Butter Croissants',
        slug: 'butter-croissants',
        description: 'Flaky butter croissants, pack of 4',
        price: 160.00,
        sku: 'BK002',
        categoryId: categories[4].id,
        stockQuantity: 40,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', isPrimary: true, altText: 'Butter croissants' },
          ],
        },
      },
    }),
    () => prisma.product.create({
      data: {
        name: 'Multigrain Biscuits',
        slug: 'multigrain-biscuits',
        description: 'Healthy multigrain digestive biscuits, 250g pack',
        price: 80.00,
        sku: 'BK003',
        categoryId: categories[4].id,
        stockQuantity: 110,
        unit: 'pack',
        images: {
          create: [
            { imageUrl: 'https://i.ibb.co/qFBTBZVT/Multigrain-Biscuits.jpg', isPrimary: true, altText: 'Multigrain biscuits' },
          ],
        },
      },
    }),
  ];
  const products = await createInBatches(productCreateFns, 3);
  console.log('✅ Created 21 legitimate grocery products');

  // Create comprehensive reviews for ALL products with diverse reviewers
  // Note: Each user can only review a product once (unique constraint)
  const reviewTexts = [
    { rating: 5, title: 'Absolutely love it!', comment: 'Fresh and crispy, exactly what I wanted. Best quality I have ever purchased!' },
    { rating: 4, title: 'Really good quality', comment: 'Good quality and value for money. Satisfied with the purchase, will buy again.' },
    { rating: 5, title: 'My family loves this', comment: 'Outstanding product! My kids and family love it. Highly recommended to everyone.' },
    { rating: 3, title: 'Decent but could be better', comment: 'Product is okay, nothing extraordinary. Packaging could be improved a bit.' },
    { rating: 5, title: 'Premium quality!', comment: 'Worth every penny! The freshness and quality is unmatched. Five stars!' },
    { rating: 4, title: 'Great value for price', comment: 'Really good for the price point. Fresh and well packaged. Happy customer.' },
    { rating: 5, title: 'Best I have found online', comment: 'Been searching for quality products and this is the best. Ordering again!' },
    { rating: 4, title: 'Impressed with freshness', comment: 'Arrived fresh and well-packed. Lasted longer than expected. Good buy.' },
    { rating: 5, title: 'Superb taste!', comment: 'The taste is amazing, like buying from a local farm. Truly organic quality.' },
    { rating: 4, title: 'Quick delivery, good product', comment: 'Delivered on time and product quality is great. Would recommend to friends.' },
    { rating: 5, title: 'Perfect for daily use', comment: 'Using this daily and loving it. Consistent quality every time I order.' },
    { rating: 3, title: 'Average quality', comment: 'Expected better based on reviews. Quality is fine but not exceptional.' },
    { rating: 5, title: 'Cannot live without this!', comment: 'This has become a staple in our household. Amazing product, never disappoints!' },
    { rating: 4, title: 'Good product, fast shipping', comment: 'Product came quickly and in good condition. Taste is authentic and fresh.' },
    { rating: 5, title: 'Top notch!', comment: 'Excellent quality at a reasonable price. My go-to choice from now on.' },
    { rating: 4, title: 'Satisfied customer', comment: 'Product met my expectations. Good quality and decent packaging.' },
    { rating: 5, title: 'Highly recommended!', comment: 'Everyone should try this! Amazing freshness and unbeatable quality.' },
    { rating: 3, title: 'Okay for the price', comment: 'Its fine, does the job. Not the best I have had but reasonable for the cost.' },
    { rating: 4, title: 'Very fresh and tasty', comment: 'Pleasantly surprised by the quality. Will definitely be a repeat customer.' },
    { rating: 5, title: 'Exceeded expectations', comment: 'Did not expect this level of quality at this price. Absolutely delighted!' },
  ];

  // All available reviewers (8 total: customer, jane, + 6 additional)
  const allReviewers = [customer, jane, ...reviewers];

  // Add 3-5 reviews per product from different random reviewers
  const reviews = [];
  for (let i = 0; i < products.length; i++) {
    // Determine how many reviews (3-5) using a deterministic pattern
    const numReviews = 3 + (i % 3); // 3, 4, 5, 3, 4, 5, ...
    
    // Pick different reviewers for each product (shuffle using product index)
    const shuffledReviewers = [...allReviewers].sort((a, b) => {
      const ha = (a.id.charCodeAt(0) + i * 7) % 100;
      const hb = (b.id.charCodeAt(0) + i * 7) % 100;
      return ha - hb;
    });

    for (let j = 0; j < numReviews; j++) {
      const reviewer = shuffledReviewers[j % shuffledReviewers.length];
      const reviewIndex = (i * 3 + j * 7) % reviewTexts.length; // Pick varied review text
      reviews.push(
        () => prisma.review.create({
          data: {
            userId: reviewer.id,
            productId: products[i].id,
            rating: reviewTexts[reviewIndex].rating,
            title: reviewTexts[reviewIndex].title,
            comment: reviewTexts[reviewIndex].comment,
          },
        })
      );
    }
  }
  
  await createInBatches(reviews, 3);
  console.log(`✅ Created ${reviews.length} reviews with diverse reviewers across all products`);

  // Create sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-0001',
      userId: customer.id,
      addressId: address.id,
      subtotal: 240.00,
      tax: 43.20,
      shippingCharge: 40.00,
      discount: 0,
      totalAmount: 323.20,
      status: 'DELIVERED',
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 180.00,
            total: 180.00,
          },
          {
            productId: products[5].id,
            quantity: 1,
            unitPrice: 65.00,
            total: 65.00,
          },
        ],
      },
      payment: {
        create: {
          amount: 323.20,
          method: 'CARD',
          status: 'COMPLETED',
          transactionId: 'TXN_DUMMY_001',
          paidAt: new Date(),
        },
      },
    },
  });

  console.log('✅ Created sample order');

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - Categories: 5');
  console.log('   - Products: 21 legit grocery items');
  console.log('   - Users: 9 (1 admin, 8 customers)');
  console.log('\n📝 Test Credentials:');
  console.log('   Admin: admin@groceryshop.com / admin123');
  console.log('   Customer: customer@example.com / customer123');
  console.log('   Jane: jane@example.com / jane123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
