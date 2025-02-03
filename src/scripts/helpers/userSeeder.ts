import prisma from "../../models/prisma";
import { hashPassword } from "../../utils/jwtUtils";

const userSeeder = async () => {
  const role = await prisma.roles.findUnique({
    where: { name: "system" },
  });
  if (!role) return;
  const admin_role = await prisma.roles.findUnique({
    where: { name: "super_admin" }
  });
  if (!admin_role) return;
  const password = await hashPassword("delightmyanmar");
  const users = [
    {
      name: "System",
      username: "System",
      password: password,
      role_id: role?.id,
      phone_number: "0900000000",
    },
    {
      name: "Super Admin",
      username: "slotmaker",
      password: password,
      role_id: admin_role?.id,
      phone_number: "0911111111",
    }
  ];

  for (const user of users) {
    await prisma.users.upsert({
      where: {
        username: user.username,
      },
      update: {},
      create: user,
    });
  }

  console.log("Users seeding completed!");
};

export default userSeeder;
