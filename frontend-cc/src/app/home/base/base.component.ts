import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';



@Component({
  selector: 'app-base',
  imports: [RouterModule, ButtonModule, FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  title = 'frontend_canteen';

  searchQuery: string = '';
  cartItems: number = 3;
  foodImage: string = 'https://storage.googleapis.com/a1aa/image/b_V3pLJJP-xb6200CKqkTQrTApuwU17cfUwBzFghqOg.jpg';
  logoImage: string = 'https://storage.googleapis.com/a1aa/image/2Ye4tjPkSYjLGOWUgCLcCBxZADn8Oy7kgRO9cVo0TFQ.jpg';

  constructor(private router: Router) {}

  goToMenu() {    
    this.router.navigate(['menu'])
  }

}

