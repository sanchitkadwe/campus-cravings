import { Component } from '@angular/core';
import { AdminsidebarComponent } from '../adminsidebar/adminsidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adminlayout',
  imports: [AdminsidebarComponent,RouterModule  ],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.css'
})
export class AdminlayoutComponent {


}
