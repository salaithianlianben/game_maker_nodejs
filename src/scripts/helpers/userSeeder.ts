import prisma from "../../models/prisma";
import { hashPassword } from "../../utils/jwtUtils";

const userSeeder = async () => {
  const role = await prisma.roles.findUnique({
    where: { name: "system" },
  });
  if (!role) return;
  const password = await hashPassword("delightmyanmar");
  const users = [
    {
      name: "System",
      username: "System",
      password: password,
      role_id: role?.id,
      phone_number: "0900000000",
    },
  ];

  for (const user of users) {
    await prisma.users.upsert({
      where: {
        name: user.name,
        username: user.username,
        password: user.password,
        role_id: user.role_id,
        phone_number: user.phone_number,
      },
      update: {},
      create: user,
    });
  }

  console.log("Users seeding completed!");
};

export default userSeeder;
