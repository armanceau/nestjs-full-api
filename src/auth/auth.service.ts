import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return '<p>Signup</p>';
  }
  signin() {
    return '<p>Signin</p>';
  }
}
