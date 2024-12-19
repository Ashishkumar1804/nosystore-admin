import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { HttpcommanService } from '../../../services/httpshared.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  getColorsList() {
    return this.httpService.getCall(`${API_CONSTANTS.COLOR}`);
  }
  getAttributeList(categoryId: any) {
    console.log('================1')
    return this.httpService.getCall(`${API_CONSTANTS.ATTRIBUTE}/${categoryId}`);
  }
  addAttributes(productId: string, reqData: any, variantId: string) {



    let url = `${API_CONSTANTS.ATTRIBUTE}/${productId}`;
    if (variantId) url = `${url}/${variantId}`;
    return this.httpService.patchCall(url, reqData);


//  return this.httpService.patchCall(`${API_CONSTANTS.ATTRIBUTE}/${productId}/${variantId}`,reqData);}
  }
  getProductDetails(productId: string) {
    return this.httpService.getCall(`${API_CONSTANTS.PRODUCT}/details/${productId}`);
  }
  getProductDetailsWithVariant(productId: string) {
    return this.httpService.getCall(`${API_CONSTANTS.PRODUCT_VARIANT}/${productId}`);
  }
  setProductData(data: any): void {
    console.log('==============data',data)
    localStorage.setItem('productData', JSON.stringify(data));
    this.getProductData();
  }

  clearProductData(): void {
    localStorage.removeItem('productData')
  }

  private getProductData(): void {
    const isSaveProductData = localStorage.getItem('productData');
    if (isSaveProductData) {
      this.productData.next(JSON.parse(isSaveProductData));
    }
  }


  selectedVariant = new BehaviorSubject<number>(0);
  productData = new BehaviorSubject<any>(null);
  constructor(
    private httpService: HttpcommanService,
    
  ) {
    this.getProductData();
   }

  getList(page: number, limit: number, userType: string, search: string, sortColumn:string, sortDirection:string) {
    let url = `${API_CONSTANTS.PRODUCT}?limit=${limit}&page=${page}&search=${search}&sortKey=${sortColumn}&sortKeyValue=${sortDirection}`;
    if (userType) {
      url += `&userType=${userType}`;
    }
    return this.httpService.getCall(`${url}`)
  }

  getDetails(id:any) {
    return this.httpService.getCall(`${API_CONSTANTS.PRODUCT}/${id}`);
  }

  saveData(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.PRODUCT}`,data);

  }

  getPincodeById(id:String){
    return this.httpService.getCall(`${API_CONSTANTS.PINCODE}/${id}`)
  }

  update(id:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/${id}`, data)
  }

  deleteById(id:string){
    return this.httpService.deleteCall(`${API_CONSTANTS.PRODUCT}`,id)
  }

  getCategoriesList(search:string=""){
    search  = search ? search : ''
    return this.httpService.getCall(`${API_CONSTANTS.CATEGORY}?page=1&limit=100&search=${search}`)
  }

  addCategory(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.PRODUCT}`, data)
  }

  brandList(categoryId:any){
    return this.httpService.getCall(`${API_CONSTANTS.GET_BRAND}/${categoryId}`);
  }

  generalInfo(productId:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/general-info/${productId}`, data);
  }

  addPriceAndInventory(productId:any, varientId:any, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/price-inventory/${productId}/${varientId}`, data);
  }

  addManufactureData(productId:any, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/manufacturing-details/${productId}`, data);
  }

  addSearchKeywords( data:any, productId:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/search-keyword/${productId}`, data);
  }

  addProductImages(productId:any, varientId:any, data:any){
    return this.httpService.putCall(`${API_CONSTANTS.PRODUCT}/photos/${productId}/${varientId}`, data);
  }

  deleteImages(productId:any, varientId:any, deleteProductArray:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/delete-images/${productId}/${varientId}`, deleteProductArray);
  }

  getProductList(){
    let url = `${API_CONSTANTS.PRODUCT}?limit=${100}&page=${1}`;

    return this.httpService.getCall(`${url}`)

    // return this.httpService.getCall(`${API_CONSTANTS.PRODUCT}`);
  }

  getWarrantyList(){
    return this.httpService.getCall(`${API_CONSTANTS.WARRANTY}`);
  }

  getTechSpecList(){
    return this.httpService.getCall(`${API_CONSTANTS.TECH_SPECS}`);
  }

  saveAddOnData(productId:any,data:any,variantId?:any, ){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/add-addon/${productId}/${variantId}`, data)
  }
  setProductPriority(id:any, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/update-rank/${id}`,data)
  }
  changeProductStatus(_id: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.PRODUCT}/status/${_id}`, {})
  }


  addColor(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.COLOR}`,data)
  }

}
