import rolesSeeder from './helpers/rolesSeeder';
import prisma from '../models/prisma';
import paymentGatewaySeeder from './helpers/paymentGatewaySeeder';
import userSeeder from './helpers/userSeeder';

async function main() {
  // await paymentGatewaySeeder();
  // await rolesSeeder();
  await userSeeder();
  console.log('Seeding completed!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});