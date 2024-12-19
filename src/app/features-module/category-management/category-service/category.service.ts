import { Injectable } from '@angular/core';
import { HttpcommanService } from '../../../services/httpshared.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  
  constructor(
    private httpService: HttpcommanService
  ) {
    
   }

  getCategoryList(page: number, limit: number, userType: string, search: string) {
    let url = `${API_CONSTANTS.CATEGORY}?limit=${limit}&page=${page}&search=${search}`;
    if (userType) {
      url += `&userType=${userType}`;
    }
    return this.httpService.getCall(`${url}`)
  }

  getCategoryDetails(id:any) {
    return this.httpService.getCall(`${API_CONSTANTS.CATEGORY}/${id}`);
  }

  saveData(data:any){
    
    return this.httpService.postCall(`${API_CONSTANTS.CATEGORY}`,data);

  }

  getPincodeById(id:String){
    return this.httpService.getCall(`${API_CONSTANTS.PINCODE}/${id}`)
  }

  updateCategoryById(id:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.CATEGORY}/${id}`, data)
  }

  deleteById(id:string){
    return this.httpService.deleteCall(`${API_CONSTANTS.CATEGORY}`,id)
  }

  addAttribute(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.ATTRIBUTE}/add-category-attribute`,data);
  }

  updateAttribute(attributeId:string, data:any){
    return this.httpService.putCall(`${API_CONSTANTS.ATTRIBUTE}/update-attribute/${attributeId}`,data);
  }

  attributeDetails(id:any){
    return this.httpService.getCall(`${API_CONSTANTS.ATTRIBUTE}/details/${id}`);
  }

  attributeValuesList(id:any,page:number, limit:number, sort:string, search:string = ''){

    return this.httpService.getCall(`${API_CONSTANTS.ATTRIBUTE}/value-list/${id}`);

  }

  addAttributeValue(attributeId: string, data: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.ATTRIBUTE}/value/add/${attributeId}`, data)
  }

  updateAttributeValue(attributeId: string, valueId: string, data: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.ATTRIBUTE}/update-attribute-value/${attributeId}/${valueId}`, data)
  }
  

  
}