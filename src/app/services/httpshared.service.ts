import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Router, RouterLink } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class HttpcommanService {
  baseUrl = environment.apiUrl;
  mobileBaseUrl = environment.apiUrl;
  //baseUrl = environment.baseUrlLocalhost;
  constructor(private _http: HttpClient) { }

  postCall(routeUrl: string, data: any): Observable<any> {
    return this._http.post<any>(`${this.baseUrl}${routeUrl}`, data);
  }

  postMobileCall(routeUrl: string, data: any): Observable<any> {
    return this._http.post<any>(`${this.mobileBaseUrl}${routeUrl}`, data);
  }
  getCall(routeUrl: string): Observable<any> {
    return this._http.get<any>(`${this.baseUrl}${routeUrl}`);
  }

  putCall(routeUrl: string, data: any): Observable<any> {
    return this._http.put<any>(`${this.baseUrl}${routeUrl}`, data);
  }

  patchCall(routeUrl: string, data: any): Observable<any> {
    return this._http.patch<any>(`${this.baseUrl}${routeUrl}`, data);
  }
  deleteCall(routeUrl: string, id: any): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}${routeUrl}/${id}`);
  }

  resetAdminPassword(routeUrl: string, token: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this._http.post<any>(`${this.baseUrl}${routeUrl}`, data, { headers: headers })
  }

}
