import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.url.subscribe(() => {
      if (this.router.url.endsWith('create')) {
        this.openCreateUserModal();
      } else if (this.router.url.endsWith('edit')) {
        this.openEditUserModal();
      }
    });

    if (this.router.url.endsWith('/users/create')) {
      this.openCreateUserModal();
    } else if (this.router.url.endsWith('/users/edit')) {
      this.openEditUserModal();
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  createUser() {
    this.router.navigate(
      [
        {
          outlets: {
            modal: ['create'],
          },
        },
      ],
      { relativeTo: this.route }
    );
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: {
        title: 'Create User',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.userService.createUser(result);
      }
    });
  }

  openEditUserModal() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: {
        title: 'Edit User',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        this.userService.updateUser(result);
      }
    });
  }
}
