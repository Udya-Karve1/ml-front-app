import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Observable, throwError } from "rxjs";
import { Observable } from 'rxjs'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class MyIntercepterService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(err => {
      if (err instanceof HttpErrorResponse) {

       
        
        return Observable.throw(err);
      }
      else {
        return err;
      }
    });
  }

}
