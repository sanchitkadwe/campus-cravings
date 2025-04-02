import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-editdetails',
  imports: [RouterModule, DialogModule],
  templateUrl: './editdetails.component.html',
  styleUrl: './editdetails.component.css'
})
export class EditdetailsComponent {
  constructor(private authservice: AuthService, private location: Location) { }

    cancelEdit() {
    this.location.back()
  }
  updateProfile() {

  }
  deleteProfile() {
  }

}
