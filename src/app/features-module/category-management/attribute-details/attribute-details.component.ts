import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category-service/category.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AttributeValuesComponent } from '../attribute-values/attribute-values.component';

@Component({
  selector: 'app-attribute-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    AttributeValuesComponent
  ],
  templateUrl: './attribute-details.component.html',
  styleUrls: ['./attribute-details.component.scss']
})
export class AttributeDetailsComponent implements OnInit {
  attributeId: string = '';
  isLoading = false;
  attribute: any;
  categoryData: any;
  attributesValues: any;

  constructor(    
    private dialogRef: MatDialogRef<AttributeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private categoryService: CategoryService
  ) {
    if (data) {
      console.log(data,'data>>>>>>>>>>>')
      this.attributeId = data.attributeId;
      
      this.categoryData = data.categoryData;
    }

    // console.log(this.attributeId, 'attruibute>>>>>>');
  }

  ngOnInit(): void {
    this.getAttributeDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in the attributeId
    if (changes['attributeId'] && changes['attributeId'].currentValue) {
      this.getAttributeValuesList();
    }
  }

  private getAttributeValuesList(): void {
    if (!this.attributeId) {
      return;
    }

    this.isLoading = true;
    this.categoryService.attributeValuesList(this.attributeId, 1, 10, '-createdAt', '')
      .subscribe(
        (res: any) => {
          this.attributesValues = res.data.list;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  private getAttributeDetails() {
    this.isLoading = true;
    this.categoryService.attributeDetails(this.attributeId).subscribe(
      (res: any) => {
        console.log(res, 'resssssssss>>>>')
        this.isLoading = false;
        this.attribute = res.data[0];
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
