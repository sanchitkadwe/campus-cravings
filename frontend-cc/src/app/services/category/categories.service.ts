import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoriesService  {
   private apiUrl = 'http://10.130.150.228:8000/app/categories/';  
    
  constructor(private httpclient: HttpClient) {}

  getCategories(): Observable <any> {
    return this.httpclient.get(this.apiUrl)

  }

  updateCategory(id:number,name:string){
    return this.httpclient.put(this.apiUrl,{name},{withCredentials:true})
  }

  createCategory(name: string){
    return this.httpclient.post(this.apiUrl,{"name":name},{withCredentials:true})
  }

  deleteCategory(id:number){
    this.httpclient.delete(this.apiUrl,{withCredentials:true})
  }

}
