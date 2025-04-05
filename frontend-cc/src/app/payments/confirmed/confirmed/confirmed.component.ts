import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmed',
  imports: [],
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.css'
})
export class ConfirmedComponent {

  constructor (private router: Router){}

  gotoHome(){
    this.router.navigate([''])
  }

}
