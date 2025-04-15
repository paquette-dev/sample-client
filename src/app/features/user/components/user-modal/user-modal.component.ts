import { Component, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit {
  title = 'Create User';

  constructor(
    private router: Router,
    @Optional() private dialogRef: MatDialogRef<UserModalComponent>
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
    this.title = 'Create User';
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      if (this.dialogRef) {
        this.dialogRef.close(this.userForm.value);
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
