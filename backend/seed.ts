// import 'reflect-metadata';
// import { dataSource } from './src/data-source';
// import { User } from './src/entities/user.entity';
// import { Product } from './src/entities/product.entity';
// import { Category } from './src/entities/category.entity';
// import { Order } from './src/entities/order.entity';
// import { OrderItem } from './src/entities/order-item.entity';

// async function seed() {
//   await dataSource.initialize();
//   const manager = dataSource.manager;

//   // 🔍 Get existing user
//   const user = await manager.findOne(User, {
//     where: { username: 'TheIceNarc' },
//   });

//   if (!user) {
//     throw new Error('User "TheIceNarc" not found.');
//   }

//   // 📦 Create categories
//   const electronics = manager.create(Category, { name: 'Electronics' });
//   const books = manager.create(Category, { name: 'Books' });
//   const clothing = manager.create(Category, { name: 'Clothing' });
//   await manager.save([electronics, books, clothing]);

//   // 🛍️ Create products and assign categories
//   const speaker = manager.create(Product, {
//     name: 'Bluetooth Speaker',
//     description: 'Portable speaker with 12h battery life.',
//     price: 59.99,
//     stock: 50,
//     categories: [electronics],
//   });

//   const book = manager.create(Product, {
//     name: 'JavaScript Deep Dive',
//     description: 'Advanced JS topics for developers.',
//     price: 39.95,
//     stock: 100,
//     categories: [books],
//   });

//   const hoodie = manager.create(Product, {
//     name: 'Zipped Hoodie',
//     description: 'Comfortable hoodie in various sizes.',
//     price: 29.99,
//     stock: 75,
//     categories: [clothing],
//   });

//   await manager.save([speaker, book, hoodie]);

//   // 🧾 Create an order
//   const order = manager.create(Order, {
//     user,
//     customerName: user.username,
//     shippingAddress: '123 Seeding Street, DevTown',
//     totalAmount: speaker.price + hoodie.price,
//     createdAt: new Date(),
//   });

//   await manager.save(order);

//   // 🛒 Add order items
//   const orderItems = [
//     manager.create(OrderItem, {
//       order,
//       product: speaker,
//       quantity: 1,
//     }),
//     manager.create(OrderItem, {
//       order,
//       product: hoodie,
//       quantity: 2,
//     }),
//   ];

//   await manager.save(orderItems);

//   console.log('✅ Seed completed for user "TheIceNarc".');
//   await dataSource.destroy();
// }

// seed().catch((err) => {
//   console.error('❌ Seeding failed:', err);
//   process.exit(1);
// });
