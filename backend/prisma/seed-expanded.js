const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with expanded data...');

  // Clear existing data
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
    await prisma.user.deleteMany();
    console.log('✅ Cleared all data');
  } catch (e) {
    console.log('⚠️  Some tables may not exist yet');
  }

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
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

  // Create Address for customer
  await prisma.address.create({
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

  // ==================== CATEGORIES ====================
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fruits',
        slug: 'fruits',
        description: 'Fresh and seasonal fruits',
        imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vegetables',
        slug: 'vegetables',
        description: 'Farm fresh vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dairy & Eggs',
        slug: 'dairy',
        description: 'Fresh dairy products and eggs',
        imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bakery',
        slug: 'bakery',
        description: 'Fresh baked goods and breads',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        slug: 'beverages',
        description: 'Drinks, juices and beverages',
        imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Snacks',
        slug: 'snacks',
        description: 'Chips, biscuits and snacks',
        imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Rice & Grains',
        slug: 'rice-grains',
        description: 'Rice, wheat, pulses and grains',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Spices & Masala',
        slug: 'spices',
        description: 'Indian spices and masalas',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cooking Oil',
        slug: 'cooking-oil',
        description: 'Cooking oils and ghee',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Personal Care',
        slug: 'personal-care',
        description: 'Soaps, shampoos and personal care',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Household',
        slug: 'household',
        description: 'Cleaning and household items',
        imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Frozen Foods',
        slug: 'frozen',
        description: 'Frozen vegetables, snacks and ice cream',
        imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400',
      },
    }),
  ]);

  const [fruitsCat, vegetablesCat, dairyCat, bakeryCat, beveragesCat, snacksCat, riceCat, spicesCat, oilCat, personalCareCat, householdCat, frozenCat] = categories;
  console.log('✅ Created 12 categories');

  // ==================== PRODUCTS ====================
  
  // FRUITS
  const fruitsProducts = [
    { name: 'Fresh Red Apples', slug: 'fresh-red-apples', description: 'Premium quality Kashmir apples, sweet and crunchy. Perfect for daily consumption.', price: 180, comparePrice: 220, sku: 'FR001', unit: 'kg', isFeatured: true, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
    { name: 'Organic Bananas', slug: 'organic-bananas', description: 'Organic bananas, naturally ripened. Rich in potassium and fiber.', price: 60, sku: 'FR002', unit: 'dozen', isFeatured: true, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400' },
    { name: 'Alphonso Mangoes', slug: 'alphonso-mangoes', description: 'Premium Ratnagiri Alphonso mangoes. Sweet, aromatic and delicious.', price: 450, comparePrice: 550, sku: 'FR003', unit: 'kg', isFeatured: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
    { name: 'Fresh Oranges', slug: 'fresh-oranges', description: 'Juicy Nagpur oranges, rich in Vitamin C.', price: 120, sku: 'FR004', unit: 'kg', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400' },
    { name: 'Green Grapes', slug: 'green-grapes', description: 'Seedless Thompson green grapes, sweet and refreshing.', price: 90, comparePrice: 110, sku: 'FR005', unit: 'kg', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400' },
    { name: 'Watermelon', slug: 'watermelon', description: 'Fresh and juicy watermelon, perfect for summer.', price: 45, sku: 'FR006', unit: 'kg', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' },
    { name: 'Papaya', slug: 'papaya', description: 'Ripe papaya, good for digestion and skin health.', price: 55, sku: 'FR007', unit: 'kg', image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400' },
    { name: 'Pomegranate', slug: 'pomegranate', description: 'Fresh pomegranate, rich in antioxidants.', price: 180, comparePrice: 200, sku: 'FR008', unit: 'kg', isFeatured: true, image: 'https://images.unsplash.com/photo-1541344999736-4a86754b9052?w=400' },
    { name: 'Kiwi Fruit', slug: 'kiwi-fruit', description: 'Imported kiwi fruit, tangy and nutritious.', price: 220, sku: 'FR009', unit: 'pack', image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=400' },
    { name: 'Fresh Strawberries', slug: 'fresh-strawberries', description: 'Fresh Mahabaleshwar strawberries, sweet and aromatic.', price: 180, comparePrice: 220, sku: 'FR010', unit: 'box', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400' },
  ];

  // VEGETABLES
  const vegetablesProducts = [
    { name: 'Fresh Tomatoes', slug: 'fresh-tomatoes', description: 'Farm fresh red tomatoes, perfect for cooking.', price: 40, comparePrice: 50, sku: 'VG001', unit: 'kg', isFeatured: true, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400' },
    { name: 'Onions', slug: 'onions', description: 'Premium quality onions, essential for every kitchen.', price: 35, sku: 'VG002', unit: 'kg', image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400' },
    { name: 'Potatoes', slug: 'potatoes', description: 'Fresh potatoes, versatile for all dishes.', price: 30, sku: 'VG003', unit: 'kg', image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400' },
    { name: 'Fresh Spinach', slug: 'fresh-spinach', description: 'Organic spinach leaves, rich in iron and vitamins.', price: 25, sku: 'VG004', unit: 'bunch', isFeatured: true, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
    { name: 'Carrots', slug: 'carrots', description: 'Fresh orange carrots, great for salads and cooking.', price: 45, sku: 'VG005', unit: 'kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400' },
    { name: 'Cauliflower', slug: 'cauliflower', description: 'Fresh white cauliflower, perfect for gobi dishes.', price: 35, sku: 'VG006', unit: 'piece', image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400' },
    { name: 'Cabbage', slug: 'cabbage', description: 'Green cabbage, fresh and crispy.', price: 30, sku: 'VG007', unit: 'piece', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400' },
    { name: 'Green Capsicum', slug: 'green-capsicum', description: 'Fresh green bell peppers, crunchy and flavorful.', price: 80, comparePrice: 100, sku: 'VG008', unit: 'kg', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400' },
    { name: 'Cucumber', slug: 'cucumber', description: 'Fresh cucumbers, cool and refreshing.', price: 35, sku: 'VG009', unit: 'kg', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400' },
    { name: 'Brinjal', slug: 'brinjal', description: 'Purple brinjal, perfect for bhartha and curry.', price: 40, sku: 'VG010', unit: 'kg', image: 'https://images.unsplash.com/photo-1615484476889-f51d9abec29b?w=400' },
    { name: 'Lady Finger', slug: 'lady-finger', description: 'Fresh okra/bhindi, great for frying.', price: 50, sku: 'VG011', unit: 'kg', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400' },
    { name: 'Green Chilli', slug: 'green-chilli', description: 'Fresh green chillies, add spice to your dishes.', price: 60, sku: 'VG012', unit: 'kg', image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400' },
  ];

  // DAIRY & EGGS
  const dairyProducts = [
    { name: 'Amul Taza Milk', slug: 'amul-taza-milk', description: 'Fresh toned milk, 500ml pouch.', price: 28, sku: 'DA001', unit: 'pouch', isFeatured: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
    { name: 'Full Cream Milk', slug: 'full-cream-milk', description: 'Amul Gold full cream milk, 1L.', price: 68, sku: 'DA002', unit: 'pack', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
    { name: 'Amul Butter', slug: 'amul-butter', description: 'Amul butter, 500g pack. Perfect for bread and cooking.', price: 270, comparePrice: 290, sku: 'DA003', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400' },
    { name: 'Paneer', slug: 'paneer', description: 'Fresh cottage cheese, 200g. Great for curries and snacks.', price: 99, comparePrice: 120, sku: 'DA004', unit: 'pack', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
    { name: 'Curd', slug: 'curd', description: 'Fresh dahi/curd, 400g cup.', price: 35, sku: 'DA005', unit: 'cup', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
    { name: 'Farm Fresh Eggs', slug: 'farm-fresh-eggs', description: 'Free range eggs, 6 piece pack.', price: 60, sku: 'DA006', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400' },
    { name: 'Brown Eggs', slug: 'brown-eggs', description: 'Organic brown eggs, 12 piece tray.', price: 130, comparePrice: 150, sku: 'DA007', unit: 'tray', image: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400' },
    { name: 'Cheese Slices', slug: 'cheese-slices', description: 'Amul cheese slices, 10 pack.', price: 145, sku: 'DA008', unit: 'pack', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400' },
    { name: 'Greek Yogurt', slug: 'greek-yogurt', description: 'Creamy Greek yogurt, 200g.', price: 75, sku: 'DA009', unit: 'cup', image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400' },
    { name: 'Amul Ghee', slug: 'amul-ghee', description: 'Pure cow ghee, 500ml jar.', price: 350, comparePrice: 380, sku: 'DA010', unit: 'jar', image: 'https://images.unsplash.com/photo-1631233810899-c87e0fb6e2a1?w=400' },
  ];

  // BAKERY
  const bakeryProducts = [
    { name: 'Brown Bread', slug: 'brown-bread', description: 'Whole wheat brown bread, soft and healthy.', price: 45, sku: 'BK001', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { name: 'White Bread', slug: 'white-bread', description: 'Soft white sandwich bread.', price: 40, sku: 'BK002', unit: 'pack', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400' },
    { name: 'Milk Bread', slug: 'milk-bread', description: 'Soft milk bread, sweet and fluffy.', price: 50, sku: 'BK003', unit: 'pack', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400' },
    { name: 'Croissants', slug: 'croissants', description: 'Butter croissants, pack of 4.', price: 120, comparePrice: 140, sku: 'BK004', unit: 'pack', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
    { name: 'Pav Bread', slug: 'pav-bread', description: 'Fresh pav for vada pav and pav bhaji, 8 pieces.', price: 30, sku: 'BK005', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400' },
    { name: 'Burger Buns', slug: 'burger-buns', description: 'Soft burger buns, pack of 4.', price: 60, sku: 'BK006', unit: 'pack', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400' },
    { name: 'Chocolate Cake', slug: 'chocolate-cake', description: 'Rich chocolate truffle cake, 500g.', price: 450, comparePrice: 500, sku: 'BK007', unit: 'piece', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
    { name: 'Cookies', slug: 'cookies', description: 'Chocolate chip cookies, 200g pack.', price: 85, sku: 'BK008', unit: 'pack', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
  ];

  // BEVERAGES
  const beveragesProducts = [
    { name: 'Coca Cola', slug: 'coca-cola', description: 'Coca Cola soft drink, 2L bottle.', price: 95, sku: 'BV001', unit: 'bottle', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
    { name: 'Pepsi', slug: 'pepsi', description: 'Pepsi soft drink, 2L bottle.', price: 95, sku: 'BV002', unit: 'bottle', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400' },
    { name: 'Real Orange Juice', slug: 'real-orange-juice', description: 'Real fruit power orange juice, 1L.', price: 110, comparePrice: 125, sku: 'BV003', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
    { name: 'Mango Juice', slug: 'mango-juice', description: 'Maaza mango drink, 1L.', price: 75, sku: 'BV004', unit: 'pack', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400' },
    { name: 'Green Tea', slug: 'green-tea', description: 'Organic green tea bags, 25 pack.', price: 180, comparePrice: 200, sku: 'BV005', unit: 'box', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400' },
    { name: 'Tata Tea Gold', slug: 'tata-tea-gold', description: 'Premium tea leaves, 500g.', price: 280, sku: 'BV006', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400' },
    { name: 'Nescafe Coffee', slug: 'nescafe-coffee', description: 'Instant coffee, 200g jar.', price: 450, comparePrice: 500, sku: 'BV007', unit: 'jar', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
    { name: 'Bisleri Water', slug: 'bisleri-water', description: 'Packaged drinking water, 5L can.', price: 60, sku: 'BV008', unit: 'can', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
    { name: 'Coconut Water', slug: 'coconut-water', description: 'Fresh coconut water, 200ml.', price: 35, sku: 'BV009', unit: 'pack', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400' },
    { name: 'Lassi', slug: 'lassi', description: 'Sweet Punjabi lassi, 200ml.', price: 40, sku: 'BV010', unit: 'pack', image: 'https://images.unsplash.com/photo-1571006682960-d26a9a46c37a?w=400' },
  ];

  // SNACKS
  const snacksProducts = [
    { name: 'Lays Classic', slug: 'lays-classic', description: 'Lays classic salted chips, 52g.', price: 20, sku: 'SN001', unit: 'pack', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400' },
    { name: 'Kurkure', slug: 'kurkure', description: 'Kurkure masala munch, 100g.', price: 35, sku: 'SN002', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400' },
    { name: 'Haldiram Namkeen', slug: 'haldiram-namkeen', description: 'Mixed namkeen, 200g pack.', price: 65, sku: 'SN003', unit: 'pack', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400' },
    { name: 'Parle-G Biscuits', slug: 'parle-g-biscuits', description: 'Glucose biscuits family pack.', price: 55, sku: 'SN004', unit: 'pack', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
    { name: 'Oreo Cookies', slug: 'oreo-cookies', description: 'Oreo cream biscuits, 300g.', price: 80, comparePrice: 95, sku: 'SN005', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400' },
    { name: 'Maggi Noodles', slug: 'maggi-noodles', description: 'Instant noodles, family pack of 8.', price: 120, sku: 'SN006', unit: 'pack', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
    { name: 'Popcorn', slug: 'popcorn', description: 'Act II butter popcorn, ready to eat.', price: 40, sku: 'SN007', unit: 'pack', image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400' },
    { name: 'Dark Chocolate', slug: 'dark-chocolate', description: 'Cadbury Bournville dark chocolate, 80g.', price: 110, sku: 'SN008', unit: 'bar', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400' },
  ];

  // RICE & GRAINS
  const riceProducts = [
    { name: 'Basmati Rice', slug: 'basmati-rice', description: 'Premium aged basmati rice, 5kg.', price: 650, comparePrice: 750, sku: 'RG001', unit: 'bag', isFeatured: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { name: 'Sona Masoori Rice', slug: 'sona-masoori-rice', description: 'Light weight rice, 5kg bag.', price: 400, sku: 'RG002', unit: 'bag', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400' },
    { name: 'Wheat Flour', slug: 'wheat-flour', description: 'Aashirvaad whole wheat atta, 5kg.', price: 280, sku: 'RG003', unit: 'bag', isFeatured: true, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400' },
    { name: 'Toor Dal', slug: 'toor-dal', description: 'Arhar/Toor dal, 1kg pack.', price: 180, comparePrice: 200, sku: 'RG004', unit: 'pack', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
    { name: 'Chana Dal', slug: 'chana-dal', description: 'Split chickpea dal, 1kg.', price: 140, sku: 'RG005', unit: 'pack', image: 'https://images.unsplash.com/photo-1515543904323-893e5b9e19e4?w=400' },
    { name: 'Moong Dal', slug: 'moong-dal', description: 'Yellow moong dal, 1kg.', price: 160, sku: 'RG006', unit: 'pack', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400' },
    { name: 'Rajma', slug: 'rajma', description: 'Kashmiri rajma (kidney beans), 1kg.', price: 200, comparePrice: 220, sku: 'RG007', unit: 'pack', image: 'https://images.unsplash.com/photo-1612257416648-ee7a6c533cad?w=400' },
    { name: 'Oats', slug: 'oats', description: 'Quaker rolled oats, 1kg.', price: 220, sku: 'RG008', unit: 'pack', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400' },
  ];

  // SPICES & MASALA
  const spicesProducts = [
    { name: 'Turmeric Powder', slug: 'turmeric-powder', description: 'Pure haldi powder, 200g.', price: 65, sku: 'SP001', unit: 'pack', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400' },
    { name: 'Red Chilli Powder', slug: 'red-chilli-powder', description: 'Kashmiri red chilli powder, 200g.', price: 75, sku: 'SP002', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1599909533681-74022fcbfcd6?w=400' },
    { name: 'Coriander Powder', slug: 'coriander-powder', description: 'Fresh ground dhania powder, 200g.', price: 55, sku: 'SP003', unit: 'pack', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400' },
    { name: 'Garam Masala', slug: 'garam-masala', description: 'MDH garam masala, 100g.', price: 85, comparePrice: 95, sku: 'SP004', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400' },
    { name: 'Cumin Seeds', slug: 'cumin-seeds', description: 'Whole jeera/cumin seeds, 200g.', price: 90, sku: 'SP005', unit: 'pack', image: 'https://images.unsplash.com/photo-1599909533681-74022fcbfcd6?w=400' },
    { name: 'Black Pepper', slug: 'black-pepper', description: 'Whole black pepper, 100g.', price: 120, sku: 'SP006', unit: 'pack', image: 'https://images.unsplash.com/photo-1606890094969-a04a5b9e40b8?w=400' },
    { name: 'Kitchen King Masala', slug: 'kitchen-king-masala', description: 'All-purpose masala, 100g.', price: 75, sku: 'SP007', unit: 'pack', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400' },
    { name: 'Salt', slug: 'salt', description: 'Tata iodised salt, 1kg.', price: 25, sku: 'SP008', unit: 'pack', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400' },
  ];

  // COOKING OIL
  const oilProducts = [
    { name: 'Sunflower Oil', slug: 'sunflower-oil', description: 'Fortune sunflower oil, 1L.', price: 150, sku: 'OL001', unit: 'bottle', isFeatured: true, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
    { name: 'Mustard Oil', slug: 'mustard-oil', description: 'Pure mustard oil, 1L.', price: 180, sku: 'OL002', unit: 'bottle', image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400' },
    { name: 'Groundnut Oil', slug: 'groundnut-oil', description: 'Cold pressed groundnut oil, 1L.', price: 220, comparePrice: 250, sku: 'OL003', unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
    { name: 'Olive Oil', slug: 'olive-oil', description: 'Extra virgin olive oil, 500ml.', price: 550, sku: 'OL004', unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
    { name: 'Coconut Oil', slug: 'coconut-oil', description: 'Pure coconut oil, 1L.', price: 250, sku: 'OL005', unit: 'bottle', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400' },
    { name: 'Rice Bran Oil', slug: 'rice-bran-oil', description: 'Fortune rice bran oil, 1L.', price: 170, sku: 'OL006', unit: 'bottle', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  ];

  // PERSONAL CARE
  const personalCareProducts = [
    { name: 'Dove Soap', slug: 'dove-soap', description: 'Dove beauty bathing bar, 100g pack of 3.', price: 180, sku: 'PC001', unit: 'pack', image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400' },
    { name: 'Colgate Toothpaste', slug: 'colgate-toothpaste', description: 'Colgate strong teeth, 200g.', price: 110, sku: 'PC002', unit: 'tube', isFeatured: true, image: 'https://images.unsplash.com/photo-1628359355624-855f74a5772f?w=400' },
    { name: 'Head & Shoulders', slug: 'head-shoulders', description: 'Anti-dandruff shampoo, 340ml.', price: 350, comparePrice: 400, sku: 'PC003', unit: 'bottle', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400' },
    { name: 'Dettol Handwash', slug: 'dettol-handwash', description: 'Antibacterial handwash, 200ml.', price: 85, sku: 'PC004', unit: 'bottle', image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400' },
    { name: 'Nivea Body Lotion', slug: 'nivea-body-lotion', description: 'Nourishing body lotion, 200ml.', price: 220, sku: 'PC005', unit: 'bottle', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400' },
    { name: 'Gillette Razor', slug: 'gillette-razor', description: 'Mach3 disposable razors, pack of 4.', price: 280, sku: 'PC006', unit: 'pack', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400' },
  ];

  // HOUSEHOLD
  const householdProducts = [
    { name: 'Vim Dishwash Bar', slug: 'vim-dishwash-bar', description: 'Lemon dishwash bar, 500g.', price: 55, sku: 'HH001', unit: 'bar', image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400' },
    { name: 'Surf Excel', slug: 'surf-excel', description: 'Easy wash detergent, 1kg.', price: 250, sku: 'HH002', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400' },
    { name: 'Colin Glass Cleaner', slug: 'colin-glass-cleaner', description: 'Glass cleaner spray, 500ml.', price: 145, sku: 'HH003', unit: 'bottle', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400' },
    { name: 'Harpic', slug: 'harpic', description: 'Toilet cleaner, 500ml.', price: 110, sku: 'HH004', unit: 'bottle', image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400' },
    { name: 'Garbage Bags', slug: 'garbage-bags', description: 'Black garbage bags, pack of 30.', price: 120, sku: 'HH005', unit: 'pack', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { name: 'Kitchen Towel', slug: 'kitchen-towel', description: 'Scott kitchen towel roll, 2 pack.', price: 180, sku: 'HH006', unit: 'pack', image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400' },
  ];

  // FROZEN FOODS
  const frozenProducts = [
    { name: 'Frozen Peas', slug: 'frozen-peas', description: 'Green peas, 500g pack.', price: 75, sku: 'FF001', unit: 'pack', image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400' },
    { name: 'Frozen Corn', slug: 'frozen-corn', description: 'Sweet corn kernels, 500g.', price: 85, sku: 'FF002', unit: 'pack', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400' },
    { name: 'McCain French Fries', slug: 'mccain-french-fries', description: 'Crispy french fries, 450g.', price: 150, comparePrice: 170, sku: 'FF003', unit: 'pack', isFeatured: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20aeb4e4e9?w=400' },
    { name: 'Frozen Samosa', slug: 'frozen-samosa', description: 'Ready to fry samosas, 12 pieces.', price: 180, sku: 'FF004', unit: 'pack', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { name: 'Ice Cream Vanilla', slug: 'ice-cream-vanilla', description: 'Amul vanilla ice cream, 750ml.', price: 185, sku: 'FF005', unit: 'tub', isFeatured: true, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400' },
    { name: 'Frozen Paratha', slug: 'frozen-paratha', description: 'Ready to cook parathas, 5 pack.', price: 110, sku: 'FF006', unit: 'pack', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
  ];

  // Create all products
  const createProducts = async (products, categoryId) => {
    for (const product of products) {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice || null,
          sku: product.sku,
          categoryId: categoryId,
          stockQuantity: Math.floor(Math.random() * 100) + 50,
          unit: product.unit,
          isFeatured: product.isFeatured || false,
          images: {
            create: [{ imageUrl: product.image, isPrimary: true }],
          },
        },
      });
    }
  };

  await createProducts(fruitsProducts, fruitsCat.id);
  console.log('✅ Created 10 fruits products');

  await createProducts(vegetablesProducts, vegetablesCat.id);
  console.log('✅ Created 12 vegetables products');

  await createProducts(dairyProducts, dairyCat.id);
  console.log('✅ Created 10 dairy products');

  await createProducts(bakeryProducts, bakeryCat.id);
  console.log('✅ Created 8 bakery products');

  await createProducts(beveragesProducts, beveragesCat.id);
  console.log('✅ Created 10 beverages products');

  await createProducts(snacksProducts, snacksCat.id);
  console.log('✅ Created 8 snacks products');

  await createProducts(riceProducts, riceCat.id);
  console.log('✅ Created 8 rice & grains products');

  await createProducts(spicesProducts, spicesCat.id);
  console.log('✅ Created 8 spices products');

  await createProducts(oilProducts, oilCat.id);
  console.log('✅ Created 6 cooking oil products');

  await createProducts(personalCareProducts, personalCareCat.id);
  console.log('✅ Created 6 personal care products');

  await createProducts(householdProducts, householdCat.id);
  console.log('✅ Created 6 household products');

  await createProducts(frozenProducts, frozenCat.id);
  console.log('✅ Created 6 frozen products');

  console.log('');
  console.log('✨ Database seeded successfully!');
  console.log('📊 Summary:');
  console.log('   - 12 Categories');
  console.log('   - 98 Products');
  console.log('   - 2 Users (admin + customer)');
  console.log('');
  console.log('🔐 Login credentials:');
  console.log('   Admin: admin@groceryshop.com / admin123');
  console.log('   Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
