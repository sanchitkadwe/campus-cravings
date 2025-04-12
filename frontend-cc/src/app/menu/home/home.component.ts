import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CategoriesService } from '../../services/category/categories.service';
import { MenuService } from '../../services/menu/menu.service';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { CartService } from '../../services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    DataViewModule,
    TabsModule,
    ToastModule,
    FormsModule,
    SkeletonModule

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers :[MessageService],
})
export class HomeComponent implements OnInit, OnChanges {
  
  @Input() menuItems: any[] = [];
    
  isLoading= true;
  category: string | null = null;
  selectedCategory: string = 'all';
  itemQuantities: { [itemId: number]: number } = {};
  numbers: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  categories: any[] = [];

  constructor(
    private categoryservice: CategoriesService,
    private menuservice: MenuService,
    private cartservice: CartService,
    private router: ActivatedRoute,
    private redirectrouter: Router,
    private messageService : MessageService
  ) { }

  ngOnInit(): void {
    this.category = this.router.snapshot.queryParamMap.get('category');
    this.selectedCategory = this.category || 'all';

    if (this.category == null) {
      this.redirectrouter.navigate(['/menu']);
    }

    this.getmenu();
    this.getcategories();
    
      
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItems']) {
      console.log('Menu items changed:', this.menuItems);
    }
  }

  getcategories(): void {
    this.categoryservice.getCategories()
      .subscribe({
        next: (response: any) => {
          this.categories = response;
        },
        error: (err: any) => {
        }
      });
  }

  getmenu(): void {
    this.menuservice.getMenu(this.selectedCategory)
      .subscribe({
        next: (response: any) => {
          this.menuItems = response;
          this.menuItems.forEach(item => {
            this.itemQuantities[item.id] = 1;
          });
          this.isLoading=false;
        },
        error: (err: any) => {
          console.error('Error fetching menu:', err);
          this.isLoading= false;
        }
      });
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category || 'all';
  }

  addtoCart(item_id: number, quantity: number,name :string): void {
    this.cartservice.addtocart({ 'id': item_id, 'quantity': quantity })
      .subscribe({
        next: (response: any) => {
          console.log('Added to cart:', response);
          this.showPopUp(name,quantity);
        
        },
        error: (err: any) => {
          this.showErrorPopUp();          
        }
      });
  }

  showPopUp(name:string, quantity:number) {
    this.messageService.add({ severity: 'success', summary: 'Yay! It\'s in your cart 🛒', detail: quantity+' X '+name+'\nAdded to your cart', key:'br', life: 2000 });
  }
  
  showErrorPopUp(){
    this.messageService.add({severity: 'error', summary: 'Oops !', detail:'Failed to add item to cart !', key:'br', life: 2000 })
  }
  goToCheckout(){
    this.redirectrouter.navigate(['/cart/'])
  }



  
}