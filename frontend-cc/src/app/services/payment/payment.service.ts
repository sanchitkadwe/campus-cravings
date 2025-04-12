// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8000/app'; // Django API URL

  constructor(private http: HttpClient) { }

  initiatePayment(amount: number, orderId?: string): Observable<any> {
    const payload: any = { amount };
    if (orderId) {
      payload.order_id = orderId;
    }
    return this.http.post(`${this.apiUrl}/payments/initiate/`, payload,{withCredentials:true});
  }
}