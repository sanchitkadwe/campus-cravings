import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../../auth/login/login.component';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, ToastModule, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [MessageService]
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private cartservice: CartService,
    private authservice: AuthService,
    private messageservice: MessageService,

  ) { }
  isLoggedIn: boolean = false;;
  cartItems = 0;
  isMenuOpen = false;

  ngOnInit(): void {
    this.authservice.currentStatus.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.itemcount()
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  closeMenuAndNavigate(route: string) {
    this.closeMenu();
    this.router.navigate([route]);
  }

  navigateToHome() {
    this.closeMenu();
    this.router.navigate(['/']);
  }

  openLoginBox = false;
  showDialog() {
    this.openLoginBox = true;
  }


  itemcount() {
    this.cartservice.itemcount()
      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.cartItems = response.count || 0;
        },
        error: (err: any) => {
        }
      })

  }

  showPopDialog(status: boolean, summary: string, detail: string) {
    if (status) {
      this.messageservice.add({ severity: 'success', summary: summary, detail: detail, key: 'br', life: 2500 })
    }
    else {
      this.messageservice.add({ severity: 'error', summary: summary, detail: detail, key: 'br', life: 2500 })

    }
  }
  logout() {
    this.authservice.logout().subscribe({
      next: (response: any) => {
        localStorage.clear();
        this.authservice.changeLoginStatus(false);
        this.cartItems=0;
        this.router.navigate(['']);
        this.showPopDialog(true, 'Successful', 'You\'ve been logged out successfully!');
      },
      error: (err: any) => {
        this.showPopDialog(false, 'Oops!', 'Logout failed. Please try again');
      }
    });
  }
  navigateOrder() {
    console.log(this.authservice.getUserStatus())
    if (this.authservice.getUserStatus() == true) {
      this.router.navigate(['/admin/allorders/'])
      console.log("admin orders page clicked")
    }
    else {
      this.router.navigate(['/orders/'])
      console.log("User order page clicked")
    }
  }

}

