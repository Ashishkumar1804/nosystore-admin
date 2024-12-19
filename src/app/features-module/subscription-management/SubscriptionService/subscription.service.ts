import { Injectable } from '@angular/core';
import { HttpcommanService } from '../../../services/httpshared.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private httpService: HttpcommanService) { }


  getSubscriptionList(page: number, limit: number, filterType: number) {
    return this.httpService.getCall(`${API_CONSTANTS.SUBSCRIPTION_PLAN_LIST}?limit=${limit}&page=${page}&filterType=${filterType}`);
  }

  createSubscriptionPlan(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.SUBSCRIPTION_CREATE}`, data)
  }

  editSubscriptionPlan(data: any, editId: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.SUBSCRIPTION_UPDATE}/${editId}`, data)
  }

  deleteSubscriptionPlan(id: any) {
    return this.httpService.deleteCall(`${API_CONSTANTS.SUBSCRIPTION_DELETE}`, id);
  }
  toggleStatus(id: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.SUBSCRIPTION_STATUS}/${id}`, {});
  }
}
