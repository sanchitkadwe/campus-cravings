import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { LoginComponent } from '../../auth/login/login.component';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-cartbase',
  imports: [CommonModule,LoginComponent,RouterModule,ToastModule,SkeletonModule ],
  templateUrl: './cartbase.component.html',
  styleUrl: './cartbase.component.css',
  providers:[MessageService]
})
export class CartbaseComponent {
  
  constructor(
    private cartservice :CartService,
    private messageservice: MessageService,
    private router :Router,
   ) { }
  // private apiUrl = 'http://localhost:8000/app/cart/mycart/';
  cartitems: any[] = [];
  openLoginBox = false;
  total_price : number = 0;
  platform_fee :number = 5;
  loading= true;

  isLoggedIn= false;

  ngOnInit(): void {
    this.getCart();
  }

 

  getCart() {
    this.cartservice.getcart()
      .subscribe({
        next: (response: any) => {
          this.cartitems = response.items;
          this.total_price = response.total_price
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        }
      })
  }

  deleteitem(item_id:number){
    this.cartservice.deleteitem(item_id)
    .subscribe({
      next: (response: any) => {
        this.getCart()
        this.showDialog(true)
      },
      error: (err: any) => {
        console.log(err)
        this.showDialog(false)
      }
    })
  }

  updateQuantity(item_id:number,action:string){
    this.cartservice.updatQuantity(item_id,action)
    .subscribe({
      next: (response: any) => {
        this.getCart()
        
      },
      error: (err: any) => {

      }
    })

  }

  goToLogin() {
    this.openLoginBox = true;
  }
  closeLogin(){
  } 

  gotoPayments(){
    this.router.navigate(['payment'])

  }

  showDialog(status:boolean){
    if(status){
      this.messageservice.add({severity:'success',summary:'Successful',detail:'Item deleted from the cart',key:'br',life:2500})
    }
    else{
      this.messageservice.add({severity:'error',summary:'Failed !',detail:'Could not delete item from the cart. Please try again',key:'br',life:2500})

    }
  }


}

