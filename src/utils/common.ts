const generatePlayerUserName = (id: number): string => {
  return `PL${id.toString().padStart(6, "0")}`;
};

const generateAgentUserName = (id: number): string => {
  return `AG${id.toString().padStart(6, "0")}`;
};

const generateOwnerUserName = (id: number): string => {
  return `OW${id.toString().padStart(6, "0")}`;
};

const generateAgentCode = (id: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let randomString = "";
  for (let i = 0; i < 7 - id.toString().length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return `${randomString}${id}`;
};

const generateSecureInvoiceNumber = (unique_value: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0");

  return `INV-${year}${month}${day}-${hours}${minutes}${seconds}-${unique_value}${random}`;
};

export {
  generatePlayerUserName,
  generateAgentUserName,
  generateOwnerUserName,
  generateAgentCode,
  generateSecureInvoiceNumber,
};
