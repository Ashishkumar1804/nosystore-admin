import { Injectable } from "@angular/core";
import { HttpcommanService } from "./httpshared.service";
import { API_CONSTANTS } from '../Constants/api.constant'
@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(
    private httpService: HttpcommanService
  ) { }

  login(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.LOGIN_URL}`, data);
  }


  changePassword(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.CHANGE_PASSWORD}`, data);
  }


  getAdminDetails() {
    return this.httpService.getCall(`${API_CONSTANTS.ADMIN_DETAILS}`);
  }

  editAdminProfile(data: any) {
    return this.httpService.patchCall(`${API_CONSTANTS.EDIT_PROFILE_DETAILS}`, data);
  }

  getDashboardDetails() {
    return this.httpService.getCall(`${API_CONSTANTS.DASHBOARD_DETAILS}`);
  }

  forgetPassword(data: any) {
    return this.httpService.postCall(`${API_CONSTANTS.FORGET_PASSWORD}`, data);
  }

  resetPassword(data: any, token: string) {
    return this.httpService.resetAdminPassword(`${API_CONSTANTS.RESET_PASSWORD}`, token, data);
  }

}
