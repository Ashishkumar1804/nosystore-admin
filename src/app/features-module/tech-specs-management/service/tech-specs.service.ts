import { Injectable } from '@angular/core';
import { HttpcommanService } from '../../../services/httpshared.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class TechSpecsService {

  constructor(
    private httpService: HttpcommanService
  ) {
    
   }

  getList(page: number, limit: number, userType: string, search: string) {
    let url = `${API_CONSTANTS.TECH_SPECS}?limit=${limit}&page=${page}&search=${search}`;
    if (userType) {
      url += `&userType=${userType}`;
    }
    return this.httpService.getCall(`${url}`)
  }

  getDetails(id:any) {
    return this.httpService.getCall(`${API_CONSTANTS.TECH_SPECS}/${id}`);
  }

  saveData(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.TECH_SPECS}`,data);

  }


  update(id:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.TECH_SPECS}/${id}`, data)
  }

  deleteById(id:string){
    return this.httpService.deleteCall(`${API_CONSTANTS.TECH_SPECS}`,id)
  }
}
