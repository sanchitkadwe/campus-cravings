import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private allordersurl = "http://localhost:8000/app/orders/";
  constructor(private httpclient: HttpClient) {}

  myorders():Observable<any> {
    return this.httpclient.get(this.allordersurl+'my_orders/',{withCredentials:true})
  }

  getOrder(order_id:any):Observable<any>{
    const params = new HttpParams().set('id',order_id);
    return this.httpclient.get(this.allordersurl+'getorder/',{
      withCredentials :true, 
      params : params,
    });
  }

  // filterOrder(status:string):Observable<any>{
  //   const params = new HttpParams.set('status',status)
  //   return this.httpclient.get(this.allordersurl+)
  // }
}
