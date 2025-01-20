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
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  let randomString = '';
  for (let i = 0; i < 7- id.toString().length ; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${randomString}${id}`;
};

export { generatePlayerUserName, generateAgentUserName, generateOwnerUserName, generateAgentCode };
