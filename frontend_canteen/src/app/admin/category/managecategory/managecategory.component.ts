import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/category/categories.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-managecategory',
  imports: [CommonModule,ToastModule],
  templateUrl: './managecategory.component.html',
  styleUrl: './managecategory.component.css',
  providers:[MessageService]
})
export class ManagecategoryComponent implements OnInit {

  constructor ( 
    private categoryservice: CategoriesService,
    private messageservice : MessageService,
  ){  }

  categories : any []=[]
  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(){
    this.categoryservice.getCategories()
    .subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: (err: any) => {
      }
    })
  }

  updateCategory(id:number,name :string){
    this.categoryservice.updateCategory(id,name)
  }

  createCategory(name : string){
    this.categoryservice.createCategory(name)
    .subscribe({
      next: (response: any) => {
        this.categories = response;
        this.getCategory()
        this.showDialog(true)
      },
      error: (err: any) => {
        this.showDialog(false)
      }
    })
  }

  deleteCateogory(id:number){
    this.categoryservice.deleteCategory(id)
    this.getCategory()
  }

  showDialog(status:boolean){
    if(status){
      this.messageservice.add({severity:'success',summary:'Successful',detail:'New category has been created !',key:'br',life:2500})
    }
    else{
      this.messageservice.add({severity:'error',summary:'Failed !',detail:'Could not create new. Please try again',key:'br',life:2500})

    }
  }
}
