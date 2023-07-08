import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@shared/components/toast/toast.service';
import { ToastType } from '@shared/components/toast/toast.type';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private readonly toastService: ToastService) {}

  public httpError(error: HttpErrorResponse) {
    // NOTE: api sends errors either as an array or as an string
    const message = Array.isArray(error.error?.message) ? error.error?.message[0] : error.error?.message;

    this.toastService.toast({
      toastType: ToastType.Error,
      title: error.statusText,
      message,
    });
  }
}
