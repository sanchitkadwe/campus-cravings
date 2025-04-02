import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from '../../auth/login/login.component';


@Component({
  selector: 'app-details',
  imports: [CommonModule, DialogModule, ButtonModule,LoginComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  constructor (private authservice : AuthService,private router:Router){}
  isLoggedIn : boolean = false;
  user : any = [];
  visible: boolean = false;
  openLoginBox = false;

  ngOnInit(): void {
    this.authservice.currentStatus.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.getinfo()

  }

  getinfo(){
    this.authservice.myinfo()
    .subscribe({
      next: (response: any) => {
        this.user= response 
        this.isLoggedIn= true;
  
      },
      error: (err: any) => {
        console.error(err);
      }
    })

  }

  logout(){
    this.authservice.logout()
    .subscribe({
      next: (response: any) => {
        this.isLoggedIn= false;
        localStorage.clear();
        this.authservice.changeLoginStatus(false)
        this.router.navigate(['/'])
      },
      error: (err: any) => {
        this.isLoggedIn = true;
      }
    })

  }

  editDetails(){
    this.router.navigate(['account/editdetails'])
  }

  deleteAccount(){
    this.visible = false;
    this.authservice.deleteaccount()
    .subscribe({
      next: (response: any) => {
        this.isLoggedIn= false;
        localStorage.clear();
        this.router.navigate(['/'])
      },
      error: (err: any) => {
        this.isLoggedIn = true;
      }
    })

  }
  showDialog() {
    this.visible = true;
  }

  goToLogin() {
    this.openLoginBox = true;
  }
  closeLogin(){
  } 

}
