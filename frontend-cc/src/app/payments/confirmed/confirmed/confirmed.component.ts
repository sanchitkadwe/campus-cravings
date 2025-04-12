import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-confirmed',
  imports: [CommonModule],
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.css'
})
export class ConfirmedComponent implements OnInit{

  constructor (
    private router: Router,
    private route: ActivatedRoute
  ) {}

  
  paymentSuccess: string | null = null;
  transactionId: string | null = null;
  errorMessage: string | null = null;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['code'] === 'PAYMENT_SUCCESS') {
        this.paymentSuccess = 'SUCCESS';
        this.transactionId = params['transactionId'];
      } else {
        this.paymentSuccess = 'FAILURE';
        this.errorMessage = params['message'] || 'Unknown error';
      }
    });
  }
  
  gotoHome(){
    this.router.navigate([''])
  }

  retryPayment(){}

}
