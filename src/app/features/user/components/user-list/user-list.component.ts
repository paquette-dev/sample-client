import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'username',
    'department',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>([]);
  isLoading = true;
  noData = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService.users$.subscribe((users) => {
      this.dataSource.data = users;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editUser(user: User) {
    this.router.navigate(
      [
        {
          outlets: {
            modal: [user.id, 'edit'],
          },
        },
      ],
      { relativeTo: this.route }
    );
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user).subscribe((deletedUser) => {
          if (deletedUser) {
            this.dataSource.data = this.dataSource.data.filter(
              (u) => u.id !== user.id
            );
          }
        });
      }
    });
  }
}
