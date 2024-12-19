import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
//import * as jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  static helper = new JwtHelperService();

  static DecodeToken(token: string) {
    return this.helper.decodeToken(token);
  }
}
