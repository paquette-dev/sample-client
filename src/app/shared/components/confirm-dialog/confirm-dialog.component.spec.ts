import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: spy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Test Title',
            message: 'Test Message',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
          },
        },
      ],
    });

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ConfirmDialogComponent>
    >;

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dialog actions', () => {
    it('should close with true when confirm is clicked', () => {
      component.onConfirm();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });

    it('should close with false when cancel is clicked', () => {
      component.onCancel();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });
  });
});
