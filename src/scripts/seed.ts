import rolesSeeder from './helpers/rolesSeeder';
import prisma from '../models/prisma';
import paymentGatewaySeeder from './helpers/paymentGatewaySeeder';

async function main() {
  await paymentGatewaySeeder();
  console.log('Seeding completed!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});