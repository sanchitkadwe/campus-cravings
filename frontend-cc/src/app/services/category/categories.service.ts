import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoriesService  {
   private apiUrl = 'http://localhost:8000/app/categories/';  
    
  constructor(private httpclient: HttpClient) {}

  getCategories(): Observable <any> {
    return this.httpclient.get(this.apiUrl)

  }

  updateCategory(id:number,name:string):Observable<any>{
    return this.httpclient.put(this.apiUrl,{name},{withCredentials:true})
  }

  createCategory(name: string):Observable<any>{
    return this.httpclient.post(this.apiUrl,{"category_name":name},{withCredentials:true})
  }

  deleteCategory(id:number):Observable<any>{
    return this.httpclient.delete(this.apiUrl+{id}+'/',{withCredentials:true})
  }

}
