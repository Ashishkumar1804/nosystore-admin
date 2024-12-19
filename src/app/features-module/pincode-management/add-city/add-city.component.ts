import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SidebarComponent } from '../../../commonComponent/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-city',
  standalone: true,
  imports:  [MatDialogModule, FormsModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.scss'
})
export class AddCityComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SidebarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    city: string = '';

    close(result: boolean) {
      if (result) {
        this.dialogRef.close(this.city); // Pass city to close method
      } else {
        this.dialogRef.close(null); // Pass null if cancelled
      }
    }
 
  ngOnInit() {

  }
}
