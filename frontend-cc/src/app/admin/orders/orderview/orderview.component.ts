import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderviewComponent } from '../../../orders/orderview/orderview.component';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order/order.service';
@Component({
  selector: 'app-adminorderview',
  imports: [CommonModule,OrderviewComponent,],
  templateUrl: './orderview.component.html',
  styleUrl: './orderview.component.css'
})
export class AdminOrderviewComponent implements OnInit {

  orderId: any;
  order : any ;

  constructor(
    private activatedrouter: ActivatedRoute,
    private orderservice : OrderService,
  ) { }
  ngOnInit(): void {
    this.orderId = this.activatedrouter.queryParamMap.subscribe(
      (params) => {
        this.orderId = params.get('id');
        console.log('Query param id:', this.orderId);
    
      }
    )
  }


  // @Input() order: any;
  orderStatus: string = ''; // 'accepted', 'rejected', 'delivered'
  orderStatusChanged: boolean = false;

  onAccept() {
    this.orderStatus = 'accepted';
    this.orderStatusChanged = true;
    // Here you would typically call a service to update the order status
    console.log('Order accepted');
  }

  onReject() {
    this.orderStatus = 'rejected';
    this.orderStatusChanged = true;
    // Here you would typically call a service to update the order status
    console.log('Order rejected');
  }

  onDelivered() {
    this.orderStatus = 'delivered';
    // Here you would typically call a service to update the order status
    console.log('Order marked as delivered');
  }



}
