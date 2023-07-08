
export interface ToastData {
  title?: string;
  message?: string;
  toastType: ToastType;
}

export enum ToastType {
  Error = 'error',
  Success = 'success'
}
