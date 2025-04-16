import { Injectable } from '@angular/core';
import { User } from '../user.types';
import { MOCK_USERS } from '../mocks/user.mocks';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = MOCK_USERS;
  private usersSubject = new BehaviorSubject<User[]>(this.users);

  constructor() {}

  users$ = this.usersSubject.asObservable();

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return MOCK_USERS.find((user) => user.id === id);
  }

  createUser(user: User): User {
    this.users.push(user);
    this.usersSubject.next(this.users);
    return user;
  }

  deleteUser(user: User): void {
    this.users = this.users.filter((u) => u.id !== user.id);
    this.usersSubject.next(this.users);
  }

  updateUser(user: User): User[] {
    const index = MOCK_USERS.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      this.usersSubject.next(this.users);
    }
    return this.users;
  }

  getNextId(): string {
    return (this.users.length + 1).toString();
  }
}
