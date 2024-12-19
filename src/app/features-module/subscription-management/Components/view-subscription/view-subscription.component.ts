import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../Module/material.module';

@Component({
  selector: 'app-view-subscription',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './view-subscription.component.html',
  styleUrl: './view-subscription.component.scss'
})
export class ViewSubscriptionComponent implements OnInit {

  constructor(private ref: MatDialogRef<ViewSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {

  }
}
