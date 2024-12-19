import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/Toaster/alert.service';
import { ProductService } from '../product-service/product.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule]
})
export class ProductImageComponent implements OnInit, OnDestroy {
  @ViewChild('frontView') frontView!: ElementRef<HTMLElement>;
  @ViewChild('backView') backView!: ElementRef<HTMLElement>;
  @ViewChild('sideView') sideView!: ElementRef<HTMLElement>;
  @ViewChild('closeUpView') closeUpView!: ElementRef<HTMLElement>;
  @ViewChild('exPhoto1View') exPhoto1View!: ElementRef<HTMLElement>;
  @ViewChild('exPhoto2View') exPhoto2View!: ElementRef<HTMLElement>;
  @ViewChild('photoView') photoView!: ElementRef<HTMLElement>;

  imagesForm: FormGroup;
  defaultImgSrc = '../../../../assets/images/productImage.png';
  
  el: HTMLElement | undefined;
  currentType: string = 'Photo View';

  coverImage: File | null = null;
  frontImage: File | null = null;
  backImage: File | null = null;
  sideImage: File | null = null;
  closeUpImage: File | null = null;
  photoImage: File | null = null;
  ex1Image: File | null = null;
  ex2Image: File | null = null;
  coverImageSrc: string | undefined | null;

  frontImageSrc: string | undefined | null;
  backImageSrc: string | undefined  | null;
  sideImageSrc: string | undefined  | null;
  closeUpImageSrc: string | undefined  | null;
  photoImageSrc: string | undefined  | null;
  ex1ImageSrc: string | undefined  | null;
  ex2ImageSrc: string | undefined  | null;
  previewImgSrc: string | undefined  | null;

  submit = false;
  idType = 'frontView';

  productData: any;
  imageUrl = environment.baseUrl;
  productId: string = '';
  variantId: string = '';
  isSubmitting = false;
  productDataSubs: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.imagesForm = new FormGroup({
      coverPhoto: new FormControl('', Validators.required),
      frontPhoto: new FormControl(''),
      sidePhoto: new FormControl(''),
      photo: new FormControl('', Validators.required),
      closeUpPhoto: new FormControl(''),
      exPhoto1: new FormControl(''),
      exPhoto2: new FormControl(''),
      backPhoto: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productId = params['id'];
      this.variantId = params['variantId'];
    });

    this.setDataForUpdate();
  }

  setDataForUpdate(): void {
    this.productService.productData.pipe(delay(0)).subscribe((data: any) => {
      this.productData = data;
      this.coverImageSrc = this.productData?.product?.coverPhoto ? `${this.imageUrl}${this.productData.product.coverPhoto}` : null;
      this.photoImageSrc = this.productData?.variant?.photo ? `${this.imageUrl}${this.productData.variant.photo}` : null;
      this.frontImageSrc = this.productData?.variant?.frontViewPhoto ? `${this.imageUrl}${this.productData.variant.frontViewPhoto}` : null;
      this.backImageSrc = this.productData?.variant?.backViewPhoto ? `${this.imageUrl}${this.productData.variant.backViewPhoto}` : null;
      this.sideImageSrc = this.productData?.variant?.sideViewPhoto ? `${this.imageUrl}${this.productData.variant.sideViewPhoto}` : null;
      this.closeUpImageSrc = this.productData?.variant?.closeUpPhoto ? `${this.imageUrl}${this.productData.variant.closeUpPhoto}` : null;
      this.ex1ImageSrc = this.productData?.variant?.extPhoto1 ? `${this.imageUrl}${this.productData.variant.extPhoto1}` : null;
      this.ex2ImageSrc = this.productData?.variant?.extPhoto2 ? `${this.imageUrl}${this.productData.variant.extPhoto2}` : null;
    });
  }

  checkValid(): boolean {
    return (!this.coverImageSrc && !this.coverImage) || (!this.photoImage && !this.photoImageSrc);
  }

  onSelectImage(event: any, type?: any): void {
    if (event.target.files && event.target.files[0]) {
      const targetFile = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          this.assignImage(event, type, targetFile);
        }
      };

      reader.readAsDataURL(targetFile);
    }
  }

  assignImage(event: any, type: string, file: File) {
    const src = event.target.result;
    switch (type) {
      case 'frontView':
        this.frontImageSrc = src;
        this.frontImage = file;
        this.previewImgSrc = src;
        break;
      case 'backView':
        this.backImage = file;
        this.backImageSrc = src;
        this.previewImgSrc = src;
        break;
      case 'sideView':
        this.sideImage = file;
        this.sideImageSrc = src;
        this.previewImgSrc = src;
        break;
      case 'closeUpView':
        this.closeUpImage = file;
        this.closeUpImageSrc = src;
        this.previewImgSrc = src;
        break;
      case 'exPhoto1View':
        this.ex1Image = file;
        this.ex1ImageSrc = src;
        this.previewImgSrc = src;
        break;
      case 'exPhoto2View':
        this.ex2Image = file;
        this.ex2ImageSrc = src;
        this.previewImgSrc = src;
        break;
      case 'photoView':
        this.photoImage = file;
        this.photoImageSrc = src;
        this.previewImgSrc = src;
        break;
      case 'coverView':
        this.coverImage = file;
        this.coverImageSrc = src;
        break;
    }
  }

  onSubmit() {
    this.submit = true;
    console.log('2323232',this.photoImageSrc,this.coverImageSrc)
    if(!this.coverImageSrc || !this.photoImageSrc || this.photoImageSrc==null)    {

      this.alertService.error('Cover Photo  and Photo view are mandatory')
      return
    }

    let deletedata=[];
    if(this.imagesForm.value.backPhoto==null) deletedata.push('backViewPhoto');
    if(this.imagesForm.value.frontPhoto==null) deletedata.push('frontViewPhoto');
    if(this.imagesForm.value.sidePhoto==null) deletedata.push('sideViewPhoto');
    if(this.imagesForm.value.photo==null) deletedata.push('photo');
    if(this.imagesForm.value.closeUpPhoto==null) deletedata.push('closeUpView');
    if(this.imagesForm.value.exPhoto1==null) deletedata.push('exPhoto1');
    if(this.imagesForm.value.exPhoto2==null) deletedata.push('extPhoto2');

    this.productService.deleteImages(this.productId, this.variantId, deletedata).subscribe(
      (data:any) => {

        console.log(data);
      },
      (err:any) => {
        // this.alertService.danger(err.message);
        this.submit = false;
        this.isSubmitting = false;
      }
    );


    const formData = new FormData();

    if (this.backImage) formData.append('backViewPhoto', this.backImage as Blob);
    if (this.frontImage) formData.append('frontViewPhoto', this.frontImage as Blob);
    if (this.sideImage) formData.append('sideViewPhoto', this.sideImage);
    if (this.photoImage) formData.append('photo', this.photoImage);
    if (this.closeUpImage) formData.append('closeUpView', this.closeUpImage);
    if (this.ex1Image) formData.append('exPhoto1', this.ex1Image);
    if (this.ex2Image) formData.append('extPhoto2', this.ex2Image);
    if (this.coverImage) formData.append('coverPhoto', this.coverImage);

    this.isSubmitting = true;

    // formData.forEach(element => {
    //   console.log(element)
    // });

    console.log(this.variantId, 'varientId>>>>?')

    this.productService.addProductImages(this.productId, this.variantId, formData).subscribe(
      (data) => {
        console.log(data, 'addProductImages>>>>');

        if (data) {
          this.variantId = data?.data?.variant?._id;

          this.alertService.success(data.message);
          this.imagesForm.reset();
          this.submit = false;
          this.isSubmitting = false;
          this.updateProductData(data.data);

          this.productData.product.coverPhoto = data.data.product.coverPhoto;
          this.productData.variant.frontViewPhoto = data.data.variant?.frontViewPhoto;
          this.productData.variant.photo = data.data.variant?.photo;
          this.productData.variant.backViewPhoto = data.data.variant?.backViewPhoto;
          this.productData.variant.sideViewPhoto = data.data.variant?.sideViewPhoto;
          this.productData.variant.closeUpView = data.data.variant?.closeUpView;
          this.productData.variant.extPhoto1 = data.data.variant?.extPhoto1;
          this.productData.variant.extPhoto2 = data.data.variant?.extPhoto2
          console.log(this.productData)
          this.productService.clearProductData();
          this.productService.setProductData(this.productData);
  
          // this.router.navigate(`/products/${this.productId}/${this.variantId}`);
          // this.router.navigate([`${API_CONSTANTS.PRODUCT_PRICE_INVENTORY}/${this.productId}/${this.variantId}`]);
          const url = `${API_CONSTANTS.PRODUCT_PRICE_INVENTORY}/${this.productId}/${this.variantId}`;
          this.router.navigateByUrl(url);

        }
      },
      (err) => {
        // this.alertService.danger(err.message);
        this.submit = false;
        this.isSubmitting = false;
      }
    );

  }


  private updateProductData(data: any): void {
    // Update data for form reset if needed
  }

  triggerToMain(type: string) {
    const viewMapping: { [key: string]: string } = {
      frontView: 'Front View',
      backView: 'Back View',
      sideView: 'Side View',
      closeUpView: 'Close Up View',
      exPhoto1View: 'Extra Photo 1 View',
      exPhoto2View: 'Extra Photo 2 View',
      photoView: 'Photo View'
    };

    this.currentType = viewMapping[type] || 'Photo View';
    

    // this.previewImgSrc = this[`${type}Src`] as string | undefined;
    this.previewImgSrc = (this as any)[`${type}Src`] as string | undefined;
    // this.el = this[`${type}` as keyof this].nativeElement;

    // console.log( this[`${type}` as keyof this], 'nnnnnnnnn');



  }

  // uploadPhoto() {
  //   this.el ? this.el.click() : this.photoView.nativeElement.click();
  // }

  uploadPhoto(type: string) {
    const inputElement = this[`${type}` as keyof this] as ElementRef;
    inputElement.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.productDataSubs?.unsubscribe();
  }

  deletePhoto(imageKey: keyof this, imageSrcKey: keyof this,formControlKey:string): void {
    (this as any)[imageKey] = null;
    (this as any)[imageSrcKey] = null;
    
    this.previewImgSrc = null;
    console.log(imageKey,imageSrcKey,formControlKey)

    if (this.imagesForm.controls[formControlKey]) {
      this.imagesForm.controls[formControlKey].setValue(null);
      this.imagesForm.controls[formControlKey].clearValidators();
      this.imagesForm.controls[formControlKey].updateValueAndValidity();
    }
    console.log(this.imagesForm.value)
  
  }
      }
