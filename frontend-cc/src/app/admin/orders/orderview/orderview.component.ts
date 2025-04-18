import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderviewComponent } from '../../../orders/orderview/orderview.component';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order/order.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-adminorderview',
  imports: [CommonModule, OrderviewComponent, NgxSpinnerModule],
  templateUrl: './orderview.component.html',
  styleUrl: './orderview.component.css'
})
export class AdminOrderviewComponent implements OnInit {

  @ViewChild(OrderviewComponent) orderViewComponentObj!: OrderviewComponent;

  orderId: any;
  order: any;

  constructor(
    private activatedrouter: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.activatedrouter.queryParamMap.subscribe(
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
    // this.orderStatus = 'accepted';
    // this.orderStatusChanged = true;

    // accept order and hit a post api
    this.spinner.show();
    this.orderService.manageOrder(this.orderId, "Accept").subscribe({
      next: (response: any) => {
        console.log('resp: ', response);

        this.orderViewComponentObj.getOrder(this.orderId);
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error('HTTP Error:', {
          status: err?.status,
          message: err?.message,
          error: err?.error, // if server sends a response body
        });

        this.spinner.hide();
      },
      complete: () => {
        // (Optional) Called when the observable completes
        console.log('manageOrder call completed.');
      },
    });

    // Here you would typically call a service to update the order status
    console.log('Order accepted');
  }

  onReject() {
    // this.orderStatus = 'rejected';
    // this.orderStatusChanged = true;
    // Here you would typically call a service to update the order status

    this.spinner.show();
    this.orderService.manageOrder(this.orderId, "Rejected").subscribe({
      next: (response: any) => {
        console.log(response);

        this.orderViewComponentObj.getOrder(this.orderId);
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error('HTTP Error:', {
          status: err?.status,
          message: err?.message,
          error: err?.error, // if server sends a response body
        });

        this.spinner.hide();
      },
    })
    console.log('Order rejected');
  }

  onDelivered() {
    // this.orderStatus = 'Delivered';

    // accept order and hit a post api
    this.spinner.show();
    this.orderService.manageOrder(this.orderId, "Delivered").subscribe({
      next: (response: any) => {
        console.log('resp: ', response);

        this.orderViewComponentObj.getOrder(this.orderId);
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error('HTTP Error:', {
          status: err?.status,
          message: err?.message,
          error: err?.error, // if server sends a response body
        });

        this.spinner.hide();
      },
      complete: () => {
        // (Optional) Called when the observable completes
        console.log('manageOrder call completed.');
      },
    });

    // Here you would typically call a service to update the order status
    console.log('Order marked as delivered');
  }

  onOrderDataChangesParent(updatedOrderData: any) {
    this.order = updatedOrderData;
    console.log(updatedOrderData);
  }



}
