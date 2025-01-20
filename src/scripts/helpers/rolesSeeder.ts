import prisma from "../../models/prisma";

const roleSeeder = async () => {
  const roles = [
    { name: "super_admin" },
    { name: "owner" },
    { name: "player" },
    { name: "agent" },
    { name: "system"}
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("Roles seeding completed!");
};

export default roleSeeder;
