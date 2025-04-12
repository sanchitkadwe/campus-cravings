import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment/payment.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class PaymentHomeComponent {

  constructor(
    private router: Router,
    private paymentService: PaymentService) { }



  amount: number = 100; // Default test amount
  loading = false;
  error: string | null = null;


  initiatePayment() {
    this.loading = true;
    this.error = null;

    this.paymentService.initiatePayment(this.amount).subscribe({
      next: (response) => {
        if (response.success) {
          window.location.href = response.payment_url;
        } else {
          this.error = 'Failed to initiate payment';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error connecting to server';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
