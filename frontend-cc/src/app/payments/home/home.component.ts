import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class PaymentHomeComponent {

  constructor (private router:Router){}

  gotoConfirmed(){
    this.router.navigate(['orderconfirmed'])
  }

}
