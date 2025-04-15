import { Injectable } from '@angular/core';
import { User } from '../user.types';
import { MOCK_USERS } from '../mocks/user.mocks';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUsers(): User[] {
    return MOCK_USERS;
  }
}
