import { Injectable } from '@angular/core';
import {IndividualConfig, ToastrService} from 'ngx-toastr';

export interface toastPayload {
  message: string;
  title: string;
  ic: IndividualConfig;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class MyToasterService {

  constructor(private toastr: ToastrService) {}

  showToast(toast: toastPayload) {
    this.toastr.show(
      toast.message,
      toast.title,
      toast.ic,
      'toast-' + toast.type
    );
  }
}
