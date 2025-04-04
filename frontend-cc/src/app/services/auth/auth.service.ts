import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiurl : string = "http://localhost:8000/app/users/";
  private storeurl : string = "http://localhost:8000/app/store/";

  constructor(private httpclient : HttpClient) {
    if(localStorage.getItem('isLoggedIn') === '1') {
      this.changeLoginStatus(true);
    }
    if(localStorage.getItem('role')=='true'){
      this.changeUsertatus(true)
    }
    // if(localStorage.getItem(''))
  }
  
  private isLoggedIn= new BehaviorSubject<boolean>(false);
  private isAdmin= new BehaviorSubject<boolean>(false);
  private isStoreOpen = new BehaviorSubject <boolean>(false);
  currentStoreStatus = this.isStoreOpen.asObservable();
  currentStatus = this.isLoggedIn.asObservable();
  currentUser= this.isAdmin.asObservable();

  changeUsertatus(status : boolean){
    this.isAdmin.next(status)
  }
  
  getUserStatus():boolean{
    return this.isAdmin.value;
  }

  changeLoginStatus(status : boolean){
    this.isLoggedIn.next(status)
  }
  
  getCurrentLoginStatus():boolean{
    return this.isLoggedIn.value;
  }

  fetchStoreStatus():boolean{
    return this.isStoreOpen.value;
  }

  toggleStore():Observable<any>{
    return this.httpclient.put(this.storeurl+'togglestore/',{},{withCredentials:true})
  }

  login(login_data:any):Observable<any>{
    return this.httpclient.post(this.apiurl+"login/",login_data,{withCredentials:true})
  }

  logout():Observable<any>{
    return this.httpclient.post(this.apiurl+"logout/",{},{withCredentials:true})
  }

  signup(signup_data:any):Observable<any>{
    return this.httpclient.post(this.apiurl+"signup/",signup_data)
  }

  myinfo():Observable<any>{
    return this.httpclient.get(this.apiurl+"myinfo/",{withCredentials:true})
  }

  deleteaccount():Observable<any>{
    return this.httpclient.get(this.apiurl+"deleteaccount/",{withCredentials:true})
  }

  getStoreStatus():Observable<any>{
    return this.httpclient.get(this.storeurl+'getstorestatus/',{withCredentials:true})
  }



  
}
