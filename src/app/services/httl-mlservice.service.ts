import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class HttlMLServiceService {

  constructor(private httpClient: HttpClient, private _cookieService: CookieService) { }

  urlPrefix = 'http://localhost:8080/v1/ml-api';

  uploadFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    return this.httpClient.post(this.urlPrefix+ "/data-set/test", formData).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }

  getTopRecords() {
    return this.httpClient.get(this.urlPrefix+ "/top/5", {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }

  getMissingValues() {
    return this.httpClient.get(this.urlPrefix+ "/missing-values", {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }

  getStats() {
    return this.httpClient.get(this.urlPrefix+ "/stats", {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }


  getUniqueValues(columnName) {
    return this.httpClient.get(this.urlPrefix+ "/unique-values/"+columnName, {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }


  getOutliers() {
    return this.httpClient.get(this.urlPrefix+ "/outliers", {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }

  getDataset() {
    return this.httpClient.get(this.urlPrefix+ "/data-set", {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }


  getSessionHeader() {
    const headers = new HttpHeaders()
      .set('user-session', this._cookieService.get('user-serssion'));

    return headers;
  }

  postRegression(regressionBody) {
    return this.httpClient.post(this.urlPrefix+ "/regression", regressionBody, {headers: this.getSessionHeader()}).pipe(map(response=>{
      console.log(response);
      return response;
    }));
  }


}
