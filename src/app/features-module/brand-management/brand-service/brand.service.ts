import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { HttpcommanService } from '../../../services/httpshared.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private httpService: HttpcommanService
  ) {
    
   }

  getList(page: number, limit: number, userType: string, search: string) {
    let url = `${API_CONSTANTS.BRAND}?limit=${limit}&page=${page}&search=${search}`;
    if (userType) {
      url += `&userType=${userType}`;
    }
    return this.httpService.getCall(`${url}`)
  }

  getDetails(id:any) {
    return this.httpService.getCall(`${API_CONSTANTS.BRAND}/${id}`);
  }

  saveData(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.BRAND}`,data);

  }

  getPincodeById(id:String){
    return this.httpService.getCall(`${API_CONSTANTS.PINCODE}/${id}`)
  }

  update(id:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.BRAND}/${id}`, data)
  }

  deleteById(id:string){
    return this.httpService.deleteCall(`${API_CONSTANTS.BRAND}`,id)
  }
}
