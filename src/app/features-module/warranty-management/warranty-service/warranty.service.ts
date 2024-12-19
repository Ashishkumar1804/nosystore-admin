import { Injectable } from '@angular/core';
import { HttpcommanService } from '../../../services/httpshared.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {
  constructor( private httpService: HttpcommanService ) { }

  getList(page: any, limit: any, search: any) {
    let url = `${API_CONSTANTS.WARRANTY}/?limit=${limit}&page=${page}&search=${search}`;
    return this.httpService.getCall(`${url}`);
  }

  saveData(data:any){
    return this.httpService.postCall(`${API_CONSTANTS.WARRANTY}`, data);
  }

  getDetails(id:string){
    return this.httpService.getCall(`${API_CONSTANTS.WARRANTY}/${id}`);
  }

  update(id:string, data:any){
    return this.httpService.patchCall(`${API_CONSTANTS.WARRANTY}/update/${id}`, data);
  }
}

