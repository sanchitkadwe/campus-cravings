import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../services/category/categories.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgModel } from '@angular/forms';
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
    .subscribe({
      next: (response: any) => {
        this.showDialog(true,'Category updated successfully')
        this.getCategory()
      },
      error: (err: any) => {
        this.showDialog(false,'Unable to update. Please try again')
      }
    })
  }

  createCategory(name : string){
    this.categoryservice.createCategory(name)
    .subscribe({
      next: (response: any) => {
        this.getCategory()
        this.showDialog(true,'New category has been created !')
      },
      error: (err: any) => {
        this.showDialog(false,'Could not create new. Please try again')
      }
    })
  }

  deleteCateogory(id:number){
    this.categoryservice.deleteCategory(id)
    .subscribe({
      next: (response: any) => {
        this.showDialog(true,'Category deleted successfully')
        this.getCategory()
      },
      error: (err: any) => {
        this.showDialog(false,'Unable to delete. Please try again')
      }
    })
  }

  showDialog(status:boolean,detail:string){
    if(status){
      this.messageservice.add({severity:'success',summary:'Successful',detail:detail,key:'br',life:2500})
    }
    else{
      this.messageservice.add({severity:'error',summary:'Failed !',detail:detail,key:'br',life:2500})

    }
  }
}
