import { PathLocationStrategy, CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { delay } from 'rxjs';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../category-service/category.service';

@Component({
  selector: 'app-add-attribute',
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
    MatSlideToggleModule
  ],
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit, AfterViewInit {

  categoryId: string = '';
  categoryName: string = '';
  attributeId: string = '';

  isLoading = false;
  isSubmitting = false;
  isColorAttributeName = false;

  category: any;
  attributes: any[] = [];

  attributeCurrent: any;

  attributeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', Validators.required),
    attributeType: new FormControl(3, [Validators.required]),
    description: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    isProperties: new FormControl(false),
    addAccess: new FormControl(true),
    useForVariants: new FormControl(true),
    properties: new FormArray([
      this.propertyField()
    ]),
    values: new FormArray([new FormControl()])
  });

  isPropertiesDisplay = false;
  isAttributeColor = false;

  constructor(
    private categoryService: CategoryService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddAttributeComponent>
  ) {
    if (data) {
      this.category = data.category;
      this.categoryId = this.category._id;
      // this.categoryName = this.category.name;
      this.attributeForm.controls['categoryId'].setValue(this.categoryId);
      if (data.attribute) {
        this.attributeId = data.attribute._id;
        this.getAttributeDetails();
      }
    }
  }

  ngOnInit(): void {}

  private getAttributeDetails() {
    this.isLoading = true;
    this.categoryService.attributeDetails(this.attributeId).subscribe((res: any) => {
      console.log(res, 'ressss>>>>>>>>>')
      this.attributeCurrent = res.data[0];
      this.isLoading = false;
      this.patchForm();
    }, err => {
      this.isLoading = false;
      this.alertService.warning(err.message);
    });
  }

  ngAfterViewInit(): void {
    this.checkValidation();
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  private checkValidation(): void {
    this.attributeForm.controls['isProperties'].valueChanges.pipe(delay(0)).subscribe((value: any) => {
      if (value) {
        this.isPropertiesDisplay = true;
      } else {
        this.isPropertiesDisplay = false;
      }
    });
    this.attributeForm.controls['attributeType'].valueChanges.pipe(delay(0)).subscribe((value: any) => {
      if (Number(value) === 1) {
        this.isAttributeColor = true;
        this.attributeForm.patchValue({name:'color'})
      } else {
        this.isAttributeColor = false;
        // this.attributeForm.patchValue({name:''})
      }
    });
  }

  private getCategoryDetails(): void {
    this.isLoading = true;
    this.categoryService.getCategoryDetails(this.categoryId).subscribe((res: any) => {
      console.log(res, 'res>>>>>>getCategoryDetails');
      this.category = res.data;
      this.isLoading = false;
      this.attributes = this.category.attributesList;
      this.attributeCurrent = this.attributes.find((e: any) => e._id === this.attributeId);
      this.attributeForm.controls['categoryId'].setValue(this.categoryId);
    }, err => {
      this.isLoading = false;
    });
  }

  private patchForm(): void {
    if (this.attributeCurrent) {
      // if(this.attributeCurrent.name=='color'){
      //   this.isColorAttributeName = true
      // }

      console.log(this.attributeCurrent, 'this.attributeCurrent>>>>>>>>')
      this.attributeForm.patchValue({
        name: this.attributeCurrent.name,
        attributeType: this.attributeCurrent.attributeType,
        isProperties: this.attributeCurrent.isProperties,
        addAccess: this.attributeCurrent.addAccess,
        useForVariants: this.attributeCurrent.useForVariants,
        description: this.attributeCurrent.description
      });

      console.log('patch form', this.attributeCurrent);

      if (this.attributeCurrent.isProperties) {
        this.isPropertiesDisplay = true;
        this.getFormArray('properties').removeAt(0);
        this.attributeCurrent.properties.forEach((e: any) => {
          this.addFields('properties', e);
        });
      } else {
        this.isPropertiesDisplay = false;
      }
    }
  }

  getFormArray(control: 'values' | 'properties'): FormArray {
    return this.attributeForm.controls[control] as FormArray;
  }

  addFields(control: 'values' | 'properties', value: any = {}) {
    if (control === 'values') {
      this.getFormArray(control).push(new FormControl());
    } else {
      this.getFormArray(control).push(this.propertyField(value.name, value._id));
    }
  }

  removeField(control: 'values' | 'properties', index: number) {
    this.getFormArray(control).removeAt(index);
  }

  private propertyField(name: string = '', _id: string = '') {
    return new FormGroup({
      _id: new FormControl(_id),
      name: new FormControl(name),
    });
  }

  cancel(): void {
    this.closeDialog();
  }

  submit(): void {
    console.log(this.attributeId, 'this.attributeId>>>>>>>>')
    if (this.attributeId) {
      this.editAttribute();
    } else {
      this.addAttribute();
    }
  }

  addAttribute() {
    this.isSubmitting = true;
    const reqData = this.attributeForm.value;

    console.log(reqData, 'reqData>>>>')
    if (reqData.attributeType === 1) {
      delete reqData.values;
      delete reqData.properties;
      reqData.isProperties = false;
    }
    if (!reqData.isProperties) {
      delete reqData.properties;
    }

    if(reqData.name?.toLowerCase()=='color' && !this.isAttributeColor){
      this.isColorAttributeName = true
      this.isSubmitting = false;

      return;
    }

    if (reqData.properties?.length) {
      reqData.properties = reqData.properties.map((e: any) => e = e.name);
    }

    reqData.attributeType = Number(reqData.attributeType);

    this.categoryService.addAttribute(reqData).subscribe((res: any) => {
      this.isSubmitting = false;
      this.alertService.success(res.message);
      console.log('res', res);
      this.dialogRef.close(res.data.attribute);
    }, err => {
      console.log(err, 'err>>>>>>>>>')
      this.alertService.warning(err.error.message);
      this.isSubmitting = false;
    });
  }

  editAttribute(): void {
    this.isSubmitting = true;
    const reqData = this.attributeForm.value;
    if(reqData.name?.toLowerCase()=='color' && !this.isAttributeColor){
      this.isColorAttributeName = true
      this.isSubmitting = false;

      return;
    }

    this.categoryService.updateAttribute(this.attributeId, reqData).subscribe((res: any) => {
      this.isSubmitting = false;
      this.alertService.success(res.message);
      this.dialogRef.close(res.data.attribute);
    }, err => {
      this.alertService.warning(err.message);
      this.isSubmitting = false;
    });
  }
}
