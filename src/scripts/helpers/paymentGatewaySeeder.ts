import prisma from "../../models/prisma";

const paymentGatewaySeeder = async () => {
  const gateways = [
    { name: "KBZ Pay", logo_path: "/uploads/images/payment/kpay-icon.jpeg" },
    { name: "AYA Pay", logo_path: "/uploads/images/payment/ayapay-icon.png" },
    { name: "CB Pay", logo_path: "/uploads/images/payment/cbpay-icon.png" },
    { name: "WAVE Pay", logo_path: "/uploads/images/payment/wavepay-icon.png" },
  ];

  for (const gateway of gateways) {
    await prisma.payment_gateway.upsert({
      where: { name: gateway.name, logo_path: gateway.logo_path },
      update: {},
      create: gateway,
    });
  }

  console.log("Payment Gateway seeding completed!");
};

export default paymentGatewaySeeder;
