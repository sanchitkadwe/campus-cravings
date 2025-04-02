import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-otp',
  imports: [ConfirmDialogModule, ButtonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})


export class OtpComponent {
  constructor(private confirmationService: ConfirmationService,) { }

  confirmAction() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        console.log('Confirmed!');
      },
      reject: () => {
        console.log('Rejected!');
      },
      key: "confirmDialog",
    });
  }

}
