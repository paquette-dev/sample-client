import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  exports: [ConfirmDialogComponent],
})
export class SharedModule {}
