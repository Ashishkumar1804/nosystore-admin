import { Injectable } from "@angular/core";
// import * as jwt from 'jsonwebtoken'

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor() { }

  private secertKey = 'TapCardiD'

  isLoggedIn(): boolean {
    if (sessionStorage.getItem("isLoggedIn") == "true") {
      return true;
    } else return false;
  }


  // generateCardData(cardData: any) {
  //   return jwt.sign(cardData, this.secertKey)
  // }




}
