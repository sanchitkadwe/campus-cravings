import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-orderview',
  imports: [CommonModule],
  templateUrl: './orderview.component.html',
  styleUrl: './orderview.component.css'
})
export class OrderviewComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private location: Location,
  ) { }

  order : any ;
  orderId: any;
  loading = true;
  platform_fee : number = 10;

  ngOnInit(): void {
    this.orderId = this.route.queryParamMap.subscribe(
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

        },
        error: (err: any) => {
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
