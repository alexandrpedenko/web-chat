import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ToastData, ToastType } from './toast.type';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  title!: string;
  message!: string | undefined;
  toastType!: ToastType;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private readonly data: ToastData,
    private readonly snackBar: MatSnackBar
  ) {
    if (this.data.title) {
      this.title = this.data.title;
    } else if (this.toastType === ToastType.Success){
      this.title = 'Success';
    } else if (this.toastType === ToastType.Error){
      this.title = 'Error';
    }

    this.message = this.data.message;
    this.toastType = this.data.toastType;
  }

  close() {
    this.snackBar.dismiss();
  }
}
