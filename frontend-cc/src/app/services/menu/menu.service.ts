import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpclient : HttpClient) {}

  private menuUrl = 'http://localhost:8000/app/menu-items/'; 

  getMenu(category:string|null):Observable<any>{
    let params = new HttpParams()

    if(category){
      params = params.set('category',category)
    }
    return this.httpclient.get(this.menuUrl+'getmenu/',{params});
  }

  updatemenuItem(info:any){
    return this.httpclient.put(this.menuUrl,info,{withCredentials:true})
  
  }

  createmenuItem(info:any){
    return this.httpclient.post(this.menuUrl,info,{withCredentials:true})
  }

  deletemenuItem(id:number){
    return this.httpclient.delete(this.menuUrl,{withCredentials:true})
  }





}
