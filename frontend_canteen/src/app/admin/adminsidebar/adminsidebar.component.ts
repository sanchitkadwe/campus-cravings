import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminsidebar',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './adminsidebar.component.html',
  styleUrl: './adminsidebar.component.css'
})
export class AdminsidebarComponent {

  constructor(private storeService: AuthService) { }
  isStoreOpen: boolean = false;
  ngOnInit(): void {

    console.log("sidenavbar initialized")
    this.getStoreStatus();

  }

  isNavbarOpen = false;
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  getStoreStatus() {
    this.storeService.getStoreStatus()
      .subscribe({
        next: (response: any) => {
          this.isStoreOpen = response.status
        },
        error: (err: any) => {
          console.error('Error fetching store status:', err);

        }
      })

  }

  toggleStore() {
    this.storeService.toggleStore()
      .subscribe({
        next: (response: any) => {
          this.getStoreStatus();
        },
        error: (err: any) => {
          console.error('Error toggling store status:', err);

        }
      })
  }


}
