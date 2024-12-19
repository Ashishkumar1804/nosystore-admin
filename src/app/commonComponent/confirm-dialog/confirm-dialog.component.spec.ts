import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    component = new ConfirmDialogComponent(dialogRef, { message: 'Test Message' });
  });

  it('should initialize with correct data', () => {
    expect(component.data).toEqual({ message: 'Test Message' });
  });

  it('should call dialogRef.close with true on close(true)', () => {
    component.close(true);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close with false on close(false)', () => {
    component.close(false);
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  // Add more test cases as needed
});
