import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = 'http://localhost:3500/api/addresses';

  constructor(private http: HttpClient) { }

  getAddresses(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  addAddress(address: any): Observable<any> {
    return this.http.post(this.baseUrl, address);
  }

  updateAddress(id: string, address: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, address);
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
