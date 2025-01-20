import prisma from "./prisma";

class AgentPaymentAccountModel {
  async insert({
    agent_id,
    payment_gateway_id,
    account_number,
    account_name,
  }: {
    agent_id: number;
    payment_gateway_id: number;
    account_number: string;
    account_name: string;
  }) {
    return await prisma.agent_payment_account.create({
      data: {
        account_name,
        agent_id,
        account_number,
        payment_gateway_id,
      },
    });
  }

  async update({
    id,
    payment_gateway_id,
    account_number,
    account_name,
  }: {
    id: number;
    payment_gateway_id?: number;
    account_number?: string;
    account_name?: string;
  }) {
    return await prisma.agent_payment_account.update({
      where: {
        id: id,
      },
      data: {
        payment_gateway_id,
        account_number,
        account_name,
      },
    });
  }

  async delete(id: number) {
    return await prisma.agent_payment_account.delete({
      where: { id: id },
    });
  }

  async getById(id: number) {
    return await prisma.agent_payment_account.findUnique({
      where: { id: id },
      include: {
        payment_gateway: true,
      },
    });
  }

  async getByAgentId(agent_id: number) {
    return await prisma.agent_payment_account.findMany({
      where: {
        agent_id: agent_id,
      },
      include: {
        payment_gateway: true,
      },
    });
  }
}

export default new AgentPaymentAccountModel();
