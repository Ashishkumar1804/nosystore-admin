import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { HttpcommanService } from '../../../services/httpshared.service';

@Injectable({
  providedIn: 'root'
})
export class PincodeService {

  constructor(
    private httpService: HttpcommanService
  ) {
    
   }

  getPincodeList(page: number, limit: number, userType: string, search: string) {
    let url = `${API_CONSTANTS.PINCODE}?limit=${limit}&page=${page}&search=${search}`;
    if (userType) {
      url += `&userType=${userType}`;
    }
    return this.httpService.getCall(`${url}`)
  }

  getPincodeDetails(pincode:any) {
    return this.httpService.getCall(`${API_CONSTANTS.PINCODE}/get-pincode/${pincode}`);
  }

  savePincodeData(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.PINCODE}`,data);

  }

  getPincodeById(id:String){
    return this.httpService.getCall(`${API_CONSTANTS.PINCODE}/${id}`)
  }

  updatePincodeById(id:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.PINCODE}/update/${id}`, data)
  }

  deletePincodeById(id:string){
    return this.httpService.deleteCall(`${API_CONSTANTS.PINCODE}/delete`,id)
  }

  updatePincodeStatus(id:string){
    return this.httpService.patchCall(`${API_CONSTANTS.PINCODE}/change-status/${id}`,id)

  }
}
