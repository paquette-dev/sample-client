import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

import { UserModalComponent } from './user-modal.component';
import { UserService } from '../../services/user.service';
import { MOCK_USERS } from '../../mocks/user.mocks';
import { User } from '../../models/user.model';
import { toUser } from '../../utils/mapper';

describe('UserModalComponent', () => {
  let component: UserModalComponent;
  let fixture: ComponentFixture<UserModalComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserModalComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', [
      'getUserById',
      'createUser',
      'updateUser',
    ]);
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Set up default return values for the spy methods
    spy.getUserById.and.returnValue(of(null));
    spy.createUser.and.returnValue(of(null));
    spy.updateUser.and.returnValue(of(null));

    TestBed.configureTestingModule({
      declarations: [UserModalComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
      ],
      providers: [
        { provide: UserService, useValue: spy },
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<UserModalComponent>
    >;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    fixture = TestBed.createComponent(UserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form in create mode by default', () => {
      fixture = TestBed.createComponent(UserModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.title).toBe('Create User');
      expect(component.title).not.toContain('Edit');
    });

    it('should load user data in edit mode', () => {
      // Setup for edit mode with user ID
      const mockRawUser = MOCK_USERS[0];
      const mockUser = toUser(mockRawUser);
      userServiceSpy.getUserById.and.returnValue(of(mockUser));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [UserModalComponent],
        imports: [
          ReactiveFormsModule,
          NoopAnimationsModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatIconModule,
        ],
        providers: [
          { provide: UserService, useValue: userServiceSpy },
          { provide: MatDialogRef, useValue: dialogRefSpy },
          { provide: MAT_DIALOG_DATA, useValue: { userId: '1' } },
          { provide: Router, useValue: routerSpy },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ id: '1' }),
              snapshot: {
                paramMap: convertToParamMap({ id: '1' }),
              },
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UserModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.title).toBe('Edit User');
      expect(userServiceSpy.getUserById).toHaveBeenCalledWith('1');
    });
  });

  describe('form submission', () => {
    it('should create a new user when form is submitted in create mode', () => {
      const newUser: User = {
        firstName: 'New',
        lastName: 'User',
        email: 'new.user@company.com',
        username: 'newuser',
        department: 'Marketing',
        status: 'Active',
      };

      // The expected user that will be passed to createUser (includes empty id)
      const expectedUserArg = {
        id: '',
        ...newUser,
      };

      userServiceSpy.createUser.and.returnValue(
        of({
          id: '123',
          ...newUser,
        })
      );

      fixture = TestBed.createComponent(UserModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.userForm.setValue(newUser);
      component.onSubmit();

      expect(userServiceSpy.createUser).toHaveBeenCalledWith(expectedUserArg);
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        success: true,
        data: jasmine.any(Object),
      });
    });

    it('should update an existing user when form is submitted in edit mode', () => {
      // Setup for edit mode
      const mockRawUser = MOCK_USERS[0];
      const mockUser = toUser(mockRawUser);
      userServiceSpy.getUserById.and.returnValue(of(mockUser));
      userServiceSpy.updateUser.and.returnValue(of(mockUser));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [UserModalComponent],
        imports: [
          ReactiveFormsModule,
          NoopAnimationsModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatIconModule,
        ],
        providers: [
          { provide: UserService, useValue: userServiceSpy },
          { provide: MatDialogRef, useValue: dialogRefSpy },
          { provide: MAT_DIALOG_DATA, useValue: { userId: '1' } },
          { provide: Router, useValue: routerSpy },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({ id: '1' }),
              snapshot: {
                paramMap: convertToParamMap({ id: '1' }),
              },
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UserModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.onSubmit();

      expect(userServiceSpy.updateUser).toHaveBeenCalled();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        success: true,
        data: jasmine.any(Object),
      });
    });
  });
});
