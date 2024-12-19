import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../Module/material.module';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../SubscriptionService/subscription.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../../../services/Toaster/alert.service';
import { ConfirmDialogComponent } from '../../../../commonComponent/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create-subscription',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-subscription.component.html',
  styleUrl: './create-subscription.component.scss'
})
export class CreateSubscriptionComponent implements OnInit {
  CreatePlanform!: FormGroup;

  featuresList: string[] = [
    'Branded Card', 'Profile Customization', 'Personal Landing Page',
    'Social Links', 'Contact Card', 'Number of Profiles', 'Limitless Link',
    'Lead Generation', 'Upload Videos', 'Upload Photos', 'Downloadable Content',
    'Profile Redirect', 'Profile Sharing', 'Metrics and Analysis',
    'Design Templates', 'CRM Integration'
  ];
  selectedFeatures: string[] = [];
  constructor(private fb: FormBuilder,
    private _subscriptionService: SubscriptionService,
    private ref: MatDialogRef<CreateSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _alertService: AlertService) { }

  ngOnInit(): void {
    this.initFormIntialize()
    if (this.data?.key == 'edit') {
      this.CreatePlanform.patchValue({
        planType: this.data.data.planType.toString(),
        members: this.data.data.members,
        planTitle: this.data.data.planTitle,
        price: this.data.data.price,
        discount: this.data.data.discount,
        validity: this.data.data.validity,
      });

      this.selectedFeatures = this.data.data.features || [];


    }

  }

  isFeatureSelected(feature: string): boolean {
    return this.selectedFeatures.includes(feature);
  }


  initFormIntialize() {
    this.CreatePlanform = this.fb.group({
      planType: this.fb.control(''),
      members: this.fb.control(''),
      planTitle: this.fb.control('', Validators.required),
      price: this.fb.control('', Validators.required),
      discount: this.fb.control(''),
      features: this.fb.control(''),
      validity: this.fb.control('', Validators.required)
    })
  }


  onCheckboxChange(feature: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedFeatures.push(feature);
    } else {
      const index = this.selectedFeatures.indexOf(feature);
      if (index >= 0) {
        this.selectedFeatures.splice(index, 1);
      }
    }
  }

  editCreatePlan() {
    if (this.CreatePlanform.invalid) {
      return;
    }
    // if (!this.CreatePlanform.value.discount && this.CreatePlanform.value.planType == 2) {
    //   this.CreatePlanform.get('discount')?.addValidators(Validators.required);
    //   this._alertService.error("please add discount!")
    //   return;
    // }
    const planobj = {
      planType: Number(this.CreatePlanform.value.planType),
      members: Number(this.CreatePlanform.value.members),
      planTitle: this.CreatePlanform.value.planTitle as string,
      price: Number(this.CreatePlanform.value.price),
      discount: this.CreatePlanform.value.discount,
      features: this.selectedFeatures,
      validity: +this.CreatePlanform.value.validity
    }

    if (this.selectedFeatures.length > 0) {
      this._subscriptionService.editSubscriptionPlan(planobj, this.data.data._id).subscribe((res: any) => {
        if (res) {
          this._alertService.success(res.message);
          this.ref.close();
        }
      }, (error) => {
        this._alertService.error(error)
      })
    } else {
      this._alertService.error("please add one feature atleast!")
    }
  }


  submitCreatePlan() {
    if (this.CreatePlanform.invalid) {
      return;
    }
    console.log(this.CreatePlanform.value.planType)
    // if (!this.CreatePlanform.value.discount && this.CreatePlanform.value.planType == 2) {
    //   this.CreatePlanform.get('discount')?.addValidators(Validators.required);
    //   this._alertService.error("please add discount!")
    //   return;
    // }
    const planobj = {
      planType: Number(this.CreatePlanform.value.planType),
      members: Number(this.CreatePlanform.value.members ? this.CreatePlanform.value.members : 1),
      planTitle: this.CreatePlanform.value.planTitle as string,
      price: Number(this.CreatePlanform.value.price),
      discount: this.CreatePlanform.value.discount ? this.CreatePlanform.value.discount : 0,
      features: this.selectedFeatures,
      validity: +this.CreatePlanform.value.validity
    }
    if (this.selectedFeatures.length > 0) {
      this._subscriptionService.createSubscriptionPlan(planobj).subscribe((res: any) => {
        if (res) {
          this._alertService.success(res.message);
          this.ref.close();
        }
      }, (error) => {
        this._alertService.error(error)
      })
    } else {
      this._alertService.error("please add one feature atleast!")
    }
  }
  closeDialogbox() {
    this.ref.close();
  }





}
