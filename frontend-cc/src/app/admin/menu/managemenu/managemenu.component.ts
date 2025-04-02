import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu/menu.service';
import { CategoriesService } from '../../../services/category/categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-managemenu',
  imports: [CommonModule],
  templateUrl: './managemenu.component.html',
  styleUrl: './managemenu.component.css'
})
export class ManagemenuComponent implements OnInit{

  constructor (
    private menuservice :MenuService,
    private categoryservice : CategoriesService,

  ){}

  categories : any[]=[];
  menuItems : any[]=[];

  ngOnInit(): void {
      this.getMenu();

  }

  getMenu(){
    this.menuservice.getMenu('all')
    .subscribe({
      next: (response: any) => {
        this.menuItems = response;
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
      },
      error: (err: any) => {
      }
    })
  }

  deletemenuItem(id:number){
    this.menuservice.deletemenuItem(id)
    .subscribe({
      next: (response: any) => {
        this.categories = response;
      },
      error: (err: any) => {
      }
    })
  }


}
