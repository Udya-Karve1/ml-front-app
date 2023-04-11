import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { AppConstants } from '../app.constants';
import { ComponentInterService } from '../services/component-inter.service';
import { GraphPlotService } from '../services/graph.plot.service';
import { HttlMLServiceService } from '../services/httl-mlservice.service';

@Component({
  selector: 'app-ml-mat',
  templateUrl: './ml-mat.component.html',
  styleUrls: ['./ml-mat.component.css']
})
export class MlMatComponent {

  fileNameCtrl = new FormControl('');
  fileToUpload: File = null;
  topRecoreds: any;
  isDatasource = false;
  datasource: string;
  isCollapsed = false;
  datasourceColumnNames = [];

  constructor(private componentInterService: ComponentInterService
    , private httpService: HttlMLServiceService
    , private _cookiesService: CookieService
    , private modalService: BsModalService
    , private graphPlotService: GraphPlotService
    , private appConstants: AppConstants) { }

  

  uploadFile() {
    this.httpService.uploadFile(this.fileToUpload).subscribe((response:any) => {
      this._cookiesService.set('user-serssion', response.sessionId);
      this.datasource = response.fileName;

      
      
      this.scrollToBottom();

      this.getTopRecord(5);
      this.isDatasource = true;
    },
    error=>{      
      alert(error);
    });
  }
  

  getTopRecord(norec) {
    this.httpService.getTopRecords(norec).subscribe((response:any)=>{
      this.topRecoreds = response;
      if(this.topRecoreds && this.topRecoreds.length>0) {
        this.datasourceColumnNames = Object.keys(this.topRecoreds[0]);
        console.log(this.datasourceColumnNames);
      }

      this.createTableObjectForData(this.topRecoreds);
      this.scrollToBottom();
    })
  }


  createTableObjectForData(dataResponse) {


  }


  scrollToBottom() {
    //console.log("******** height: " + document.getElementById("maindiv").style.height);
    var element = document.getElementById("maindiv");
    element.scrollTo(0, element.scrollHeight);
  }

  handleFileInput(event: any) {
    let files = event.target.files;
    if (files?.length > 0) {
      this.fileToUpload = null;
      let allowedFileTypes = ["text/csv"];
      if (!allowedFileTypes.includes(files.item(0).type)) {
        this.fileNameCtrl.markAsTouched();
        this.fileNameCtrl.setErrors({ 'incorrect': true });
        return;
      }
      this.fileToUpload = files.item(0);
      var reader = new FileReader();
      let self = this;

      reader.readAsDataURL(files.item(0));
    }
  }

}
