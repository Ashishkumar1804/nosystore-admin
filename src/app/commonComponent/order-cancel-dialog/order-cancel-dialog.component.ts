import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-order-cancel-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule],
  providers: [
    //   {
    //   provide: MatDialogRef,
    //   useValue: {}
    // }
  ],
  templateUrl: './order-cancel-dialog.component.html',
  styleUrl: './order-cancel-dialog.component.scss'
})
export class OrderCancelDialogComponent implements OnInit {
  reason: any;
  constructor(public dialogRef: MatDialogRef<SidebarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    close(result: boolean) {
      if (result) {
        this.dialogRef.close(this.reason); // Pass city to close method
      } else {
        this.dialogRef.close(null); // Pass null if cancelled
      }
    }
  ngOnInit() {

  }
}
