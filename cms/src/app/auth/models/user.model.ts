import { AuthModel } from './auth.model';


export class ResponseUserModel {
  success: boolean;
  message?: string;
  data: UserModel;
}

export class UserModel extends AuthModel {
  id: string;
  name: string;
  email: string;
  roles = [];
  permissions = [];
}

export const PARTNER_TOKEN = 'partner_token';
