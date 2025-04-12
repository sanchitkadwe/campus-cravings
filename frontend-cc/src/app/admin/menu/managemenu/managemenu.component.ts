import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu/menu.service';
import { CategoriesService } from '../../../services/category/categories.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-managemenu',
  imports: [CommonModule,ToastModule,SkeletonModule],
  templateUrl: './managemenu.component.html',
  styleUrl: './managemenu.component.css',
  providers:[MessageService]
})
export class ManagemenuComponent implements OnInit{

  constructor (
    private menuservice :MenuService,
    private categoryservice : CategoriesService,
    private messageservice : MessageService,

  ){}

  categories : any[]=[];
  menuItems : any[]=[];
  isLoading= true;

  ngOnInit(): void {
      this.getMenu();

  }

  getMenu(){
    this.menuservice.getMenu('all')
    .subscribe({
      next: (response: any) => {
        this.menuItems = response;
        this.isLoading = false;
      },
      error: (err: any) => {
      }
    })
  }

  updatemenuItem(info:any){
    this.menuservice.updatemenuItem(info)
    .subscribe({
      next: (response: any) => {
        this.categories = response;
        this.getMenu()
        this.showDialog(true,'Yay!','Menu updatd successfully')


      },
      error: (err: any) => {
        this.showDialog(true,'Failed !','Could not update menu. Please try again')

      }
    })
  }

  deletemenuItem(id:number){
    this.menuservice.deletemenuItem(id)
    .subscribe({
      next: (response: any) => {
        this.categories = response;
        this.getMenu()
        this.showDialog(true,'Deleted','Menu Item deleted successfully')
      },
      error: (err: any) => {
        this.showDialog(true,'Failed !','Could not delete Item. Please try again !')

      }
    })
  }


  showDialog(status:boolean, summary:string, detail:string){
    if(status){
      this.messageservice.add({severity:'success',summary:summary ,detail:detail,key:'br',life:2500})
    }
    else{
      this.messageservice.add({severity:'error',summary:summary,detail:detail,key:'br',life:2500})

    }
  }


}
