import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../user.types';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit {
  title = 'Create User';
  isEdit = false;
  userId: string | null = null;
  user: User | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Optional() private dialogRef: MatDialogRef<UserModalComponent>,
    private userService: UserService
  ) {}

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    department: new FormControl(''),
    status: new FormControl('Active'),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.userId = params['id'];
        this.isEdit = true;
        this.title = 'Edit User';

        if (this.userId) {
          const user = this.userService.getUserById(this.userId);
          if (user) {
            this.userForm.patchValue(user);
            this.user = user;
          }
        }
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      if (this.isEdit && this.user) {
        const updatedUser: User = {
          ...this.user,
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          username: formData.username || '',
          department: formData.department || '',
          status: formData.status || 'Active',
        };
        this.userService.updateUser(updatedUser);
      } else {
        const newUser: User = {
          id: this.userService.getNextId(),
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          username: formData.username || '',
          department: formData.department || '',
          status: formData.status || 'Active',
        };
        this.userService.createUser(newUser);
      }

      if (this.dialogRef) {
        this.dialogRef.close({
          success: true,
          data: formData,
        });
      } else {
        this.router.navigate(['/users']);
      }
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        const formControl = this.userForm.get(key);
        formControl?.markAsDirty();
      });
    }
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/users']);
    }
  }
}
