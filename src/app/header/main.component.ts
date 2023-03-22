import { Component, OnInit } from '@angular/core';
import { ComponentInterService } from '../services/component-inter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttlMLServiceService } from '../services/httl-mlservice.service';
import { CookieService } from 'ngx-cookie-service';
import { response } from 'express';

@Component({
  selector: 'app-header',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  vtext = "<div></div>";
  fileNameCtrl = new FormControl('');
  fileToUpload: File = null;
  topRecoreds: any;
  isDatasource = false;
  datasource: string;

  constructor(private componentInterService: ComponentInterService
    , private httpService: HttlMLServiceService
    , private _cookiesService: CookieService) { }

  ngOnInit(): void {
    this.datasource = "";
    this.isDatasource = false;
  }

  appendText() {
      this.componentInterService.triggerEvent("Message sent");
  }

  uploadFile() {
    this.httpService.uploadFile(this.fileToUpload).subscribe((response:any) => {
      this._cookiesService.set('user-serssion', response.sessionId);
      this.datasource = response.fileName;

      this.getTopRecord();
      this.isDatasource = true;
    },
    error=>{      
      alert(error);
    });
  }
  
  getTopRecord() {
    this.httpService.getTopRecords().subscribe((response:any)=>{
      this.topRecoreds = response;
      this.createTableObjectForData(this.topRecoreds);
      console.log(response);
    })
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

  createTableObjectForData(dataResponse) {

    let data = dataResponse[0];
    var keys = Object.keys(data);

    var table = document.createElement('table');
    
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var row = thead.insertRow(0);

    for(let i=0; i<keys.length; i++) {
      var thr = row.insertCell(i);
      thr.innerHTML = keys[i];
    }

    for(let i=0; i<dataResponse.length; i++) {
      var row = tbody.insertRow(i);

      for(let j=0; j<keys.length; j++) {
        row.insertCell(j).innerHTML = (dataResponse[i])[keys[j]]
      }
    }


    var mydiv = this.createContainerWithTitleDiv("Top 5"); //document.createElement('div');
    mydiv.append(table);
    document.getElementById("maindiv").append(mydiv);
  }

  getMissingValues() {
    this.httpService.getMissingValues().subscribe((response:any)=>{
      this.topRecoreds = response;
      console.log(response);
    })
  }


  createContainerWithTitleDiv(divtitle) {
    var titleDiv = document.createElement("div");
    titleDiv.append(document.createElement("hr"));
    var titleH4 = document.createElement("h4")
    titleH4.innerHTML = "Top 5";
    titleDiv.append(titleH4);
    
    var mydiv = document.createElement('div');
    mydiv.append(titleDiv);  
  
    return mydiv;
  }
}




