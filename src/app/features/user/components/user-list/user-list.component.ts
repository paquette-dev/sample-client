import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../user.types';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  constructor(private userService: UserService) {
    this.dataSource = this.userService.getUsers();
  }

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'username',
    'department',
    'status',
    'actions',
  ];
  dataSource: User[] = [];
}
