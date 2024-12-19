import { Routes } from '@angular/router';

import { ContainerComponent } from './commonComponent/container/container.component';
import { DashboardComponent } from './commonComponent/dashboard/dashboard.component';
import { ProtectGuard } from './guards/protect.guard';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './features-module/forget-password/forget-password.component';
import { LoginComponent } from './features-module/login/login.component';
import { ResetPasswordComponent } from './features-module/reset-password/reset-password.component';
import { ChangePasswordComponent } from './features-module/change-password/change-password.component';
import { ProfileComponent } from './features-module/profile/profile.component';
import { SubscriptionManagementComponent } from './features-module/subscription-management/subscription-management.component';
import { UserManagementComponent } from './features-module/user-management/user-management.component';
import { ViewUserComponent } from './features-module/user-management/view-user/view-user.component';
import { SamsungWalletButtonComponent } from './commonComponent/samsung-wallet-button/samsung-wallet-button.component';
import { OrdersComponent } from './features-module/orders/orders.component';
import { CreatePincodeComponent } from './features-module/pincode-management/create-pincode/create-pincode.component';
import { PincodeManagementComponent } from './features-module/pincode-management/pincode-management.component';
import { ViewPincodeComponent } from './features-module/pincode-management/view-pincode/view-pincode.component';
import { CategoryManagementComponent } from './features-module/category-management/category-management.component';
import { CreateCategoryComponent } from './features-module/category-management/create-category/create-category.component';
import { ViewCategoryComponent } from './features-module/category-management/view-category/view-category.component';
import { BrandManagementComponent } from './features-module/brand-management/brand-management.component';
import { CreateBrandComponent } from './features-module/brand-management/create-brand/create-brand.component';
import { CreateProductComponent } from './features-module/product-management/create-product/create-product.component';
import { ProductManagementComponent } from './features-module/product-management/product-management.component';
import { CategoryComponent } from './features-module/product-management/category/category.component';
import { BrandComponent } from './features-module/product-management/brand/brand.component';
import { AttributeComponent } from './features-module/product-management/attribute/attribute.component';
import { ProductImageComponent } from './features-module/product-management/product-image/product-image.component';
import { PriceInventoryComponent } from './features-module/product-management/price-inventory/price-inventory.component';
import { ManufacturingDetailsComponent } from './features-module/product-management/manufacturing-details/manufacturing-details.component';
import { SearchKeywordComponent } from './features-module/product-management/search-keyword/search-keyword.component';
import { ReturnPolicyComponent } from './features-module/product-management/return-policy/return-policy.component';
import { WarrantyManagementComponent } from './features-module/warranty-management/warranty-management.component';
import { WarrantyComponent } from './features-module/product-management/warranty/warranty.component';
import { AddOnComponent } from './features-module/product-management/add-on/add-on.component';
import { ViewBrandComponent } from './features-module/brand-management/view-brand/view-brand.component';
import { CreateVariantComponent } from './features-module/product-management/create-variant/create-variant.component';
import { CategoryDetailComponent } from './features-module/category-management/category-detail/category-detail.component';
import { CreateWarrantyComponent } from './features-module/warranty-management/create-warranty/create-warranty.component';
import { ViewWarrantyComponent } from './features-module/warranty-management/view-warranty/view-warranty.component';
import { TechSpecsManagementComponent } from './features-module/tech-specs-management/tech-specs-management.component';
import { CreateTechSpecsComponent } from './features-module/tech-specs-management/create-tech-specs/create-tech-specs.component';
import { EditTechSpecsComponent } from './features-module/tech-specs-management/edit-tech-specs/edit-tech-specs.component';
import { ProductDetailComponent } from './features-module/product-management/product-detail/product-detail.component';
import { ViewProductComponent } from './features-module/product-management/view-product/view-product.component';
import { OrderManagementComponent } from './features-module/order-management/order-management.component';
import { OrderDetailComponent } from './features-module/order-management/order-detail/order-detail.component';
import { UserOrderComponent } from './features-module/user-management/user-order/user-order.component';


export const routes: Routes = [
  {
    path: 'login',
    canActivate: [ProtectGuard],
    component: LoginComponent,
  },
  {
    path: '',
    component: ContainerComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'profile', component: ProfileComponent },
      // { path: 'subscription', component: SubscriptionManagementComponent },
      { path: 'user', component: UserManagementComponent },
      { path: 'user-details/:id', component: ViewUserComponent },
      { path: 'user/order/:userId/:deletedType', component: UserOrderComponent },
      // { path: 'samsung-wallet', component: SamsungWalletButtonComponent },
      { path: 'order', component: OrdersComponent },

      //pincode
      { path: 'pincode-management', component: PincodeManagementComponent },
      { path: 'pincode-management/create', component: CreatePincodeComponent },
      { path: 'pincode-management/:id', component: ViewPincodeComponent },

      //category
      { path: 'category-management', component: CategoryManagementComponent },
      { path: 'category-management/create-category', component: CreateCategoryComponent },
      { path: 'category-management/view/:id', component: ViewCategoryComponent },
      { path: 'category-management/attribute/:id', component: CategoryDetailComponent },

      // Brand
      { path: 'brand-management', component: BrandManagementComponent },
      { path: 'brand-management/create', component: CreateBrandComponent },
      { path: 'brand-management/view/:id', component: ViewBrandComponent },

      // Brand
      { path: 'tech-specs', component: TechSpecsManagementComponent },
      { path: 'tech-specs/create', component: CreateTechSpecsComponent },
      { path: 'tech-specs/view-edit/:id', component: EditTechSpecsComponent },

      //Product
      { path: 'product-management', component: ProductManagementComponent },
      { path: 'product/create', component: CreateProductComponent , 
      children:[
        {path: "", redirectTo:"product-category", pathMatch:'full'},
        { path: 'product-category', component: CategoryComponent},
        { path: 'product-brand/:id', component: BrandComponent},
        { path: 'product-attribute/:id/:variantId', component: AttributeComponent},
        { path: 'product-attribute/:id', component: AttributeComponent},
        // { path: 'product-image/:id/:variantId', component: ProductImageComponent},
        // { path: 'product-price-inventory/:id/:variantId', component: ProductImageComponent},
        { path: 'product-image/:id/:variantId', component: ProductImageComponent},
        { path: 'product-price-inventory/:id/:variantId', component: PriceInventoryComponent},
        { path: 'product-manufacturing-detail/:id', component: ManufacturingDetailsComponent},
        { path: 'product-search-keyword/:id', component: SearchKeywordComponent},
        { path: 'product-return-policy/:id', component: ReturnPolicyComponent},
        { path: 'product-warranty/:id', component: WarrantyComponent},
        { path: 'product-add-on/:id', component: AddOnComponent},

        { path: 'variant/:id', component: CreateVariantComponent},
      ]},
      { path: 'product-management/product-detail/:id', component: ProductDetailComponent},
      // { path: 'product-detail/:id', component: ViewProductComponent },
      { path: 'warranty-management', component: WarrantyManagementComponent },
      { path: 'warranty-management/create', component: CreateWarrantyComponent },
      { path: 'warranty-management/detail/:id', component: ViewWarrantyComponent },

      //Order Management
      { path: 'order-management', component: OrderManagementComponent },
      { path: 'order-management/order-detail/:id', component: OrderDetailComponent },
      
    ],
  },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent }

];
