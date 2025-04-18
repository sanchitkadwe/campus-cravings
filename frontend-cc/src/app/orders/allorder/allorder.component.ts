import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { NgxSpinnerModule, NgxSpinnerService  } from "ngx-spinner";
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LoginComponent } from '../../auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-allorder',
  imports: [CommonModule, NgxSpinnerModule,RouterModule,FormsModule,SkeletonModule],
  templateUrl: './allorder.component.html',
  styleUrl: './allorder.component.css'
})
export class AllorderComponent implements OnInit {

  constructor (
    private orderservice : OrderService, 
    private spinner: NgxSpinnerService,
    private authservice : AuthService
  ){

  }
  allorders : any[]= []
  isLoggedIn = false;
  isDropdownOpen = false;
  openLoginBox= false;
  isLoading = true;
  // In your component.ts file
  filterOptions = [
    { id: 'allFilter', value: 'all', label: 'All', checked: true },
    { id: 'activeFilter', value: 'active', label: 'Active' },
    { id: 'cancelledFilter', value: 'cancelled', label: 'Cancelled' },
    { id: 'deliveredFilter', value: 'delivered', label: 'Delivered' },
    { id: 'rejectedFilter', value: 'rejected', label: 'Rejected' }
  ];

selectedFilter: string = 'all'; 

  ngOnInit(): void {
    this.isLoggedIn= this.authservice.getCurrentLoginStatus()
    this.getAllOrders();
  }

  getAllOrders(){
    this.orderservice.myorders()
    .subscribe({
      next: (response: any) => {
        this.allorders=response;
        this.isLoading= false;
      },
      error: (err: any) => {
        this.isLoading= false;
      }
    })
  }
  
  toggleDropdown(){
    this.isDropdownOpen=!this.isDropdownOpen;
  }

  gotoLogin(){
    this.openLoginBox=true;
  }
  closeLogin(){}

  applyFilters() {

  }

  

}
