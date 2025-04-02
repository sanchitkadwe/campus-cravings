import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpclient : HttpClient) { }
  private apiUrl = 'http://10.130.150.228:8000/app/cart/';
 

  getcart():Observable<any>{
    return this.httpclient.get(this.apiUrl+"mycart/",{withCredentials:true})
  }

  addtocart(item:any):Observable<any>{
    return this.httpclient.post(this.apiUrl+"addtocart/",item,{withCredentials:true})
  }

  deleteitem(item_id:number):Observable<any>{
    const params = new HttpParams().set('item_id', item_id.toString());
    return this.httpclient.delete(this.apiUrl + 'deleteitem/', {
      params: params,
      withCredentials: true
  });
  }

  itemcount():Observable<any>{
    return this.httpclient.get(this.apiUrl+'itemcount/',{withCredentials:true})
  }

  updatQuantity(item_id:number, action : string){
    return this.httpclient.patch(this.apiUrl+'updatequantity/',{'item_id':item_id,'action':action},{withCredentials:true})
  }
 




}
