import { Injectable } from '@angular/core';
import { API_CONSTANTS } from '../../Constants/api.constant';
import { HttpcommanService } from '../../services/httpshared.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  getOrderDetail(orderId: any) {
    let url = `${API_CONSTANTS.ORDER_LIST}/${orderId}`;
    return this.httpService.getCall(`${url}`)
  }

  constructor(private httpService: HttpcommanService) { }


  getOrderList(page: number, limit: number, search: string) {
    let url = `${API_CONSTANTS.ORDER_LIST}?limit=${limit}&page=${page}&search=${search}`;
    return this.httpService.getCall(`${url}`)
  }

  updateStatus(id:any, data:any){
    let url = `${API_CONSTANTS.ORDER_LIST}/change-status/${id}`;
    console.log(url)
    return this.httpService.patchCall(`${url}`,data)
  }
  
  getUserOrderList(userId: string, page: number, limit: number, search: string) {
    let url = `${API_CONSTANTS.ORDER_LIST}/user-order/${userId}?limit=${limit}&page=${page}&search=${search}`;
    return this.httpService.getCall(`${url}`)
  }
}
