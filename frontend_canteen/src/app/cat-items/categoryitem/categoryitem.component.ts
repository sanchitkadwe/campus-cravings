import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/category/categories.service';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-categoryitem',
  imports: [CommonModule,RouterModule,SkeletonModule],
  templateUrl: './categoryitem.component.html',
  styleUrl: './categoryitem.component.css'
})
export class CategoryitemComponent implements OnInit {
  constructor(private categoryservice: CategoriesService) { }

  user: string = localStorage.getItem('name') || "user";  
  categories: any[] = [];
  isLoading :boolean = true;
  ngOnInit(): void {
   
    this.getcategories();
  }

  getcategories() {
    this.categoryservice.getCategories()
      .subscribe({
        next: (response: any) => {
          this.categories = response;
          this.isLoading=false;
        },
        error: (err: any) => {
          console.error(err);
        }
      })
  }

  gotocategory(){

  }
}
