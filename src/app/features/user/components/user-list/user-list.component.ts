import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../user.types';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.userService.users$.subscribe((users) => {
      console.log(users);
      this.dataSource.data = users;
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
}
