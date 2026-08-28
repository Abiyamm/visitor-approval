const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const employee = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@company.com',
      role: 'EMPLOYEE',
      department: 'Engineering',
    },
  });

  console.log('Created test employee successfully!');
  console.log('-----------------------------------');
  console.log('Employee ID:', employee.id);
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });