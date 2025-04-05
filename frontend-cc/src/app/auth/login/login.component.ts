import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterModule,CommonModule, Dialog, ButtonModule, InputTextModule, FormsModule,ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor (
    private authservice : AuthService,
    private messageservice : MessageService,
    private router: Router,
    private fb: FormBuilder,
  ){}


  

  login_data = { 
    phone_number: '', 
    password: '' 
  };

  sign_data = { 
    name: '', 
    hostel: '', 
    phone_number: '', 
    password: '' 
  };


  ngOnInit(): void {
  }

  login(){
    this.authservice.login(this.login_data)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.closeDialog()
        localStorage.setItem('role',response.role)
        localStorage.setItem('isLoggedIn', '1');
        this.authservice.changeLoginStatus(true);
        this.authservice.changeUsertatus( response.role)
        this.router.navigate(['']);
        this.showDialog(true,'Yay!','You\'ve logged in successfully !')


      },
      error: (err: any) => {
        console.error(err);
        this.login_data.phone_number = ""
        this.login_data.password= ""
        this.showDialog(false,'Oops!','Login failed. Please try again')
      }
    })

  }


  signup(){
    this.authservice.signup(this.sign_data)
    .subscribe({
      next: (response: any) => {
        this.closeDialog()
        this.showDialog(true,'Yay!','Signed up successfully')
  
      },
      error: (err: any) => {
        this.sign_data.hostel= ""
        this.sign_data.name=""
        this.sign_data.password=""
        this.sign_data.phone_number=""
        this.showDialog(false,'Oops!','Signup failed. Please try again')
      }
    })
  }

 togglebutton : boolean = false;

  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>(); 


  toggleView(){
    this.togglebutton = !this.togglebutton;
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible)
    this.close.emit();
  }

  showDialog(status:boolean,summary:string,detail:string){
    if(status){
      this.messageservice.add({severity:'success',summary,detail: detail,key:'br',life:2500})
    }
    else{
      this.messageservice.add({severity:'error',summary:summary ,detail: detail ,key:'br',life:2500})

    }
  }
} 

