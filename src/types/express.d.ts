import { UserPayload } from '@utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

BigInt.prototype.toJSON = function() {
  return this.toString();
}; 