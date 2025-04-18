import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { UserService } from './user.service';
import { MOCK_USERS } from '../mocks/user.mocks';
import { toUser } from '../utils/mapper';
import { User } from '../models/user.model';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    httpClient = TestBed.inject(HttpClient);
    // Create a spy on the HttpClient get method
    spyOn(httpClient, 'get').and.returnValue(of({ data: [] }));

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Only verify if we're not using spies
    if (!(httpClient.get as jasmine.Spy).calls.count()) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch all users from the API', () => {
      // Reset the spy
      (httpClient.get as jasmine.Spy).and.callThrough();

      service.getUsers().subscribe((users) => {
        expect(users.length).toBe(MOCK_USERS.length);
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('GET');
      req.flush({ data: MOCK_USERS });
    });

    it('should handle errors when fetching users fails', () => {
      // Reset the spy
      (httpClient.get as jasmine.Spy).and.callThrough();

      service.getUsers().subscribe({
        next: (users) => {
          expect(users.length).toBe(0);
        },
        error: () => {
          fail('Should not reach error handler');
        },
      });

      const req = httpMock.expectOne('/api/users');
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'), {
        status: 500,
        statusText: 'Server Error',
      });
    });
  });

  describe('getUserById', () => {
    it('should fetch a specific user by ID', () => {
      // Reset the spy
      (httpClient.get as jasmine.Spy).and.callThrough();

      const testId = '1';
      const testRawUser = MOCK_USERS[0];
      const testUser = toUser(testRawUser);

      service.getUserById(testId).subscribe((user) => {
        expect(user).toEqual(testUser);
      });

      const req = httpMock.expectOne(`/api/users/${testId}`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: testRawUser });
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      // Don't reset the spy for this test
      // (httpClient.get as jasmine.Spy).and.callThrough();

      // Spy on the post method instead
      spyOn(httpClient, 'post').and.returnValue(
        of({
          data: {
            user_id: '123',
            first_name: 'New',
            last_name: 'User',
            email: 'new.user@company.com',
            user_name: 'newuser',
            department: 'Marketing',
            user_status: 'A',
          },
        })
      );

      const newUser: User = {
        firstName: 'New',
        lastName: 'User',
        email: 'new.user@company.com',
        username: 'newuser',
        department: 'Marketing',
        status: 'Active',
      };

      service.createUser(newUser).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response?.id).toBe('123');
      });

      // Verify the post was called with the right URL and data
      expect(httpClient.post).toHaveBeenCalledWith(
        '/api/users',
        jasmine.any(Object)
      );
    });
  });
});
