import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserStatus } from '../../utils/constants';

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
  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    department: new FormControl(''),
    status: new FormControl('Active'),
  });
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Optional() private dialogRef: MatDialogRef<UserModalComponent>,
    private userService: UserService
  ) {}

  private generateUsernameAndEmail(): void {
    const firstName = this.userForm.get('firstName')?.value || '';
    const lastName = this.userForm.get('lastName')?.value || '';

    if (firstName && lastName) {
      const username = (firstName.charAt(0) + lastName)
        .toLowerCase()
        .replace(/\s+/g, '');

      const email =
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`.replace(
          /\s+/g,
          ''
        );

      if (!this.userForm.get('username')?.dirty) {
        this.userForm.get('username')?.setValue(username);
      }

      if (!this.userForm.get('email')?.dirty) {
        this.userForm.get('email')?.setValue(email);
      }
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.userId = params['id'];
        this.isEdit = true;
        this.title = 'Edit User';

        if (this.userId) {
          this.userService.getUserById(this.userId).subscribe((user) => {
            if (user) {
              this.userForm.patchValue(user);
              this.user = user;
            }
          });
        }
      } else {
        this.userForm.get('firstName')?.valueChanges.subscribe(() => {
          this.generateUsernameAndEmail();
        });

        this.userForm.get('lastName')?.valueChanges.subscribe(() => {
          this.generateUsernameAndEmail();
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const formData = this.userForm.value;
      const user: User = {
        id: this.user?.id || '',
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        username: formData.username || '',
        department: formData.department || '',
        status: formData.status || UserStatus.Active,
      };

      if (this.isEdit && this.user) {
        this.userService.updateUser(user).subscribe({
          next: (updatedUser) => {
            this.isSubmitting = false;
            if (updatedUser) {
              if (this.dialogRef) {
                this.dialogRef.close({ success: true, data: updatedUser });
              } else {
                this.router.navigate(['/users']);
              }
            } else {
              this.errorMessage = 'Failed to update user. Please try again.';
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage =
              error.message ||
              'An error occurred while updating the user. Please try again.';
          },
        });
      } else {
        this.userService.createUser(user).subscribe({
          next: (...args) => {
            this.isSubmitting = false;
            console.log(args);
            if (args[0]) {
              if (this.dialogRef) {
                this.dialogRef.close({ success: true, data: args[0] });
              } else {
                this.router.navigate(['/users']);
              }
            } else {
              this.errorMessage = 'Failed to create user. Please try again.';
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage =
              error.message ||
              'An error occurred while creating the user. Please try again.';
          },
        });
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
