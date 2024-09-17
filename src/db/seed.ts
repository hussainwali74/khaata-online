import * as schema from './schema';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  console.log('Seeding database...');

  // Seed Shops
  const shopIds = await db.insert(schema.shops).values([
    { name: faker.company.name(), address: faker.location.streetAddress(), contactNumber: faker.phone.number(), description: faker.company.catchPhrase() },
    { name: faker.company.name(), address: faker.location.streetAddress(), contactNumber: faker.phone.number(), description: faker.company.catchPhrase() },
  ]).returning({ id: schema.shops.id });

  console.log('Seeded shops');

  // Seed Shop Admins
  for (const shop of shopIds) {
    await db.insert(schema.shopAdmins).values({
      shopId: shop.id,
      userId: faker.string.uuid(), // Assuming Clerk user IDs are UUIDs
      role: 'owner',
    });
  }

  console.log('Seeded shop admins');

  // Seed Customers
  const customerIds = [];
  for (const shop of shopIds) {
    const shopCustomers = await db.insert(schema.customers).values([
      { shopId: shop.id, name: faker.person.fullName(), cnic: faker.string.numeric(13), phoneNumber: faker.phone.number(), address: faker.location.streetAddress() },
      { shopId: shop.id, name: faker.person.fullName(), cnic: faker.string.numeric(13), phoneNumber: faker.phone.number(), address: faker.location.streetAddress() },
      { shopId: shop.id, name: faker.person.fullName(), cnic: faker.string.numeric(13), phoneNumber: faker.phone.number(), address: faker.location.streetAddress() },
    ]).returning({ id: schema.customers.id, shopId: schema.customers.shopId });
    customerIds.push(...shopCustomers);
  }

  console.log('Seeded customers');

  // Seed Products
  const productIds = [];
  for (const shop of shopIds) {
    const shopProducts = await db.insert(schema.productsSchema).values([
      { 
        shopId: shop.id, 
        name: faker.commerce.productName(), 
        description: faker.commerce.productDescription(), 
        price: parseInt(faker.commerce.price()), 
        imageUrl: faker.image.url(), 
        quantity: faker.number.int({ min: 1, max: 100 }) 
      },
      { 
        shopId: shop.id, 
        name: faker.commerce.productName(), 
        description: faker.commerce.productDescription(), 
        price: parseInt(faker.commerce.price()), 
        imageUrl: faker.image.url(), 
        quantity: faker.number.int({ min: 1, max: 100 }) 
      },
      { 
        shopId: shop.id, 
        name: faker.commerce.productName(), 
        description: faker.commerce.productDescription(), 
        price: parseInt(faker.commerce.price()), 
        imageUrl: faker.image.url(), 
        quantity: faker.number.int({ min: 1, max: 100 }) 
      },
    ]).returning({ id: schema.productsSchema.id, shopId: schema.productsSchema.shopId });
    productIds.push(...shopProducts);
  }

  console.log('Seeded products');

  // Seed Invoices and Invoice Items
  for (const shop of shopIds) {
    const shopCustomers = customerIds.filter(c => c.shopId === shop.id);
    const shopProducts = productIds.filter(p => p.shopId === shop.id);

    for (let i = 0; i < 5; i++) {
      const customerId = faker.helpers.arrayElement(shopCustomers).id;
      const discountAmount = faker.number.float({ min: 0, max: 100, precision: 0.01 });
      const discountPercentage = faker.number.float({ min: 0, max: 20, precision: 0.01 });
      const dueDate = faker.date.future();
      const status = faker.helpers.arrayElement(['pending', 'paid', 'cancelled']);

      const [invoice] = await db.insert(schema.invoices).values({
        shopId: shop.id,
        customerId,
        totalAmount: '0', // Initialize with '0', will update later
        paymentReceived: '0',
        remainingAmount: '0',
        discountAmount: discountAmount.toFixed(2),
        discountPercentage: discountPercentage.toFixed(2),
        dueDate,
        status,
      }).returning();

      let totalAmount = 0;
      const numberOfItems = faker.number.int({ min: 1, max: 3 });

      for (let j = 0; j < numberOfItems; j++) {
        const productId = faker.helpers.arrayElement(shopProducts).id;
        const quantity = faker.number.int({ min: 1, max: 5 });
        const [product] = await db.select().from(schema.productsSchema).where(eq(schema.productsSchema.id, productId));
        const unitPrice = product.price;

        await db.insert(schema.invoiceItems).values({
          invoiceId: invoice.id,
          productId,
          quantity,
          unitPrice: unitPrice.toString(),
        });

        totalAmount += unitPrice * quantity;
      }

      // Apply discount
      const discountedAmount = totalAmount - discountAmount;
      const finalAmount = discountedAmount * (1 - discountPercentage / 100);

      // Simulate payment received
      const paymentReceived = status === 'paid' ? finalAmount : faker.number.float({ min: 0, max: finalAmount, precision: 0.01 });
      const remainingAmount = finalAmount - paymentReceived;

      await db.update(schema.invoices)
        .set({ 
          totalAmount: finalAmount.toFixed(2),
          paymentReceived: paymentReceived.toFixed(2),
          remainingAmount: remainingAmount.toFixed(2),
        })
        .where(eq(schema.invoices.id, invoice.id));
    }
  }

  console.log('Seeded invoices and invoice items');

  // Seed Shop Settings
  for (const shop of shopIds) {
    const [admin] = await db.select().from(schema.shopAdmins).where(eq(schema.shopAdmins.shopId, shop.id));
    await db.insert(schema.shopSettings).values({
      userId: admin.userId,
      shopName: faker.company.name(),
      shopAddress: faker.location.streetAddress(),
      shopContact: faker.phone.number(),
      description: faker.company.catchPhrase(),
    });
  }

  console.log('Seeded shop settings');
  console.log('Database seeding completed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});