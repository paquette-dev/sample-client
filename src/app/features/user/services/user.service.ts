import { Injectable } from '@angular/core';
import { RawUser, User } from '../models/user.model';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { toRawUser, toUser } from '../utils/mapper';
import { ApiResponse } from 'src/app/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getUsers().subscribe();
  }

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<RawUser[]>>(`/api/users`).pipe(
      map((response) => {
        if ('error' in response) {
          console.error('Error fetching users:', response.error);
          return [] as RawUser[];
        }
        return response.data || [];
      }),
      map((rawUsers: RawUser[]) => rawUsers.map(toUser)),
      tap((users: User[]) => {
        this.users = users;
        this.usersSubject.next(users);
      }),
      catchError((error: any) => {
        console.error('Error fetching users:', error.error.message);
        return of([]);
      })
    );
  }

  getUserById(id: string): Observable<User | null> {
    return this.http.get<ApiResponse<RawUser>>(`/api/users/${id}`).pipe(
      map((response) => {
        if ('error' in response) {
          console.error('Error fetching user:', response.error);
          return null;
        }
        return toUser(response.data!);
      }),
      catchError((error: any) => {
        console.error('Error fetching user:', error.error.message);
        return of(null);
      })
    );
  }

  createUser(user: User): Observable<User | null> {
    const rawUser = toRawUser(user);
    const mutableRawUser = { ...rawUser };
    delete (mutableRawUser as any).user_id;
    return this.http
      .post<ApiResponse<RawUser>>('/api/users', mutableRawUser)
      .pipe(
        map((response) => {
          if ('error' in response) {
            console.error('Error creating user:', response.error);
            throw new Error(response.error || 'Failed to create user');
          }
          return toUser(response.data!);
        }),
        tap((formattedUser: User | null) => {
          if (formattedUser) {
            this.users = [...this.users, formattedUser];
            console.log('Users after creation:', this.users);
            this.usersSubject.next(this.users);
          }
        }),
        catchError((error: any) => {
          console.error('Error creating user:', error.error.message);
          return of(null);
        })
      );
  }

  deleteUser(user: User): Observable<User | null> {
    return this.http.delete<ApiResponse<User>>(`/api/users/${user.id}`).pipe(
      map((response) => {
        if ('error' in response) {
          console.error('Error deleting user:', response.error);
          return null;
        }
        return response.data || null;
      }),
      tap(() => {
        this.users = this.users.filter((u) => u.id !== user.id);
        this.usersSubject.next(this.users);
      }),
      catchError((error: any) => {
        console.error('Error deleting user:', error.error.message);
        return of(null);
      })
    );
  }

  updateUser(user: User): Observable<User | null> {
    return this.http
      .put<ApiResponse<RawUser>>(`/api/users/${user.id}`, toRawUser(user))
      .pipe(
        map((response) => {
          if ('error' in response) {
            console.error('Error updating user:', response.error);
            return null;
          }
          return response.data || null;
        }),
        map((rawUser: RawUser | null) => (rawUser ? toUser(rawUser) : null)),
        tap((updatedUser: User | null) => {
          if (updatedUser) {
            this.users = this.users.map((u) =>
              u.id === updatedUser.id ? updatedUser : u
            );
            this.usersSubject.next(this.users);
          }
        }),
        catchError((error: any) => {
          console.error('Error updating user:', error.error.message);
          return of(null);
        })
      );
  }
}
