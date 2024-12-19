import { Injectable } from '@angular/core';
import { HttpcommanService } from '../../../services/httpshared.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpcommanService) { }


  getUserList(page: number, limit: number, userType: string, search: string, deletedType:boolean) {
    let url = `${API_CONSTANTS.USER}?deletedType=${deletedType}&limit=${limit}&page=${page}&search=${search}`;
    if (userType) {
      url += `&userType=${userType}`;
    }
    return this.httpService.getCall(`${url}`)
  }

  getUserTeamDetail(id: string, page: number, limit: number) {
    return this.httpService.getCall(`${API_CONSTANTS.TEAM_LIST}/${id}?page=${page}&limit=${limit}`)
  }

  getUserDetail(userId: string, deletedType:boolean) {
    return this.httpService.getCall(`${API_CONSTANTS.USER}/${userId}?deletedType=${deletedType}`)
  }

  updateUserStatus(id: string) {
    return this.httpService.patchCall(`${API_CONSTANTS.USER_STATUS}/${id}`, {})
  }
  


}
