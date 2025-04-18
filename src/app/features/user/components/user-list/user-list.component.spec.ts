import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { MOCK_USERS } from '../../mocks/user.mocks';
import { toUser } from '../../utils/mapper';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['users$', 'deleteUser']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserService, useValue: spy },
        { provide: MatDialog, useValue: dialogSpyObj },
      ],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    userServiceSpy.users$ = of(MOCK_USERS.map(toUser));

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load users on init', () => {
      fixture.detectChanges();

      expect(component.dataSource.data.length).toBe(MOCK_USERS.length);
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('user actions', () => {
    it('should open a confirmation dialog when deleting a user', () => {
      fixture.detectChanges();
      const user = component.dataSource.data[0];
      const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpyObj.afterClosed.and.returnValue(of(false));
      dialogSpy.open.and.returnValue(dialogRefSpyObj);

      component.deleteUser(user);

      expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: jasmine.objectContaining({
          title: 'Delete User',
          message: 'Are you sure you want to delete this user?',
        }),
      });
    });

    it('should delete a user when confirmed', () => {
      fixture.detectChanges();
      const user = component.dataSource.data[0];
      const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpyObj.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpyObj);
      userServiceSpy.deleteUser.and.returnValue(of(user));

      component.deleteUser(user);

      expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(user);
    });
  });
});
