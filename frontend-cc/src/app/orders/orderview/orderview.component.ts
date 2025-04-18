import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { CommonModule, Location } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-orderview',
  imports: [CommonModule,SkeletonModule],
  templateUrl: './orderview.component.html',
  styleUrl: './orderview.component.css'
})
export class OrderviewComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private location: Location,
  ) { }

  @Output() onOrderDataChange = new EventEmitter<any>();
  order : any ;
  orderId: any;
  isLoading = true;
  platform_fee : number = 10;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(
      (params) => {
        this.orderId = params.get('id');
        this.getOrder(this.orderId);
      }
    )
  }

  getOrder(id: any) {
    if (id == null || id == '') {
      return;
    }
    this.orderService.getOrder(id)
      .subscribe({
        next: (response: any) => {
          this.order = response
          this.onOrderDataChange.emit(this.order);
          this.isLoading=false;

        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('HTTP Error:', {
            status: err?.status,
            message: err?.message,
            error: err?.error, // if server sends a response body
          });  
          
        }
      })

  }

  cancelOrder() {

  }


  printOrder(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }

  isStoreManager = true;
  showCancelDialog = false;
  updateStatus(status: any) { }
  getProgressWidth(status: any) { }
  getStatusStep(status: any) { }


}
