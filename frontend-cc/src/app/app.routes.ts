import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './menu/home/home.component';
import { BaseComponent } from './home/base/base.component';
import { LoginComponent } from './auth/login/login.component';
import { OtpComponent } from './auth/otp/otp.component';
import { AllorderComponent } from './orders/allorder/allorder.component';
import { DetailsComponent } from './account/details/details.component';
import { CartbaseComponent } from './cart/cartbase/cartbase.component';
import { CategoryitemComponent } from './cat-items/categoryitem/categoryitem.component';
import { EditdetailsComponent } from './account/editdetails/editdetails.component';
import { OrderviewComponent } from './orders/orderview/orderview.component';
import { ManagecategoryComponent } from './admin/category/managecategory/managecategory.component';
import { ManagemenuComponent } from './admin/menu/managemenu/managemenu.component';
import { ManageordersComponent } from './admin/orders/manageorders/manageorders.component';
import { AdminOrderviewComponent } from './admin/orders/orderview/orderview.component';
import { AdminlayoutComponent } from './admin/adminlayout/adminlayout.component';
import { PaymentHomeComponent } from './payments/home/home.component';
import { ConfirmedComponent } from './payments/confirmed/confirmed/confirmed.component';
import { PaymentloadingComponent } from './payments/paymentloading/paymentloading.component';

export const routes: Routes = [
    {
        path: '',
        component: BaseComponent
    },
    {
        path: 'categories',
        component: CategoryitemComponent
    },
    {
        path: 'login',
        component: LoginComponent   
    },
    {
        path: 'login/otp',
        component : OtpComponent
    },

    {
        path: 'cart',
        component : CartbaseComponent
    },
    {
        path: 'account',
        component : DetailsComponent
    },
    {
        path: 'menu',
        component : HomeComponent
    },
    {
        path: 'orders',
        component : AllorderComponent
    },
    {
        path: 'account/editdetails',
        component : EditdetailsComponent
    },
    {
        path: 'orders/orderdetails',
        component : OrderviewComponent
    },
    {
        path:'admin',
        component: AdminlayoutComponent,
        children:[
            {
                path:'managecategory',
                component:ManagecategoryComponent
            },
            {
                path:'managemenu',
                component:ManagemenuComponent
            },
            {
                path:'allorders',
                component:ManageordersComponent
            },
            {
                path:'allorders/orderdetails',
                component:AdminOrderviewComponent
            },

        ]
    },
    {
        path:'payment',
        component:PaymentHomeComponent
    },
    {
        path:'orderconfirmed',
        component:ConfirmedComponent,

    },
    {
        path : 'processingpayment',
        component:PaymentloadingComponent
    },
    {
        path:'**',
        redirectTo:''
    },
    

];
