import { Component, OnInit, TemplateRef} from '@angular/core';
import { ComponentInterService } from '../services/component-inter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttlMLServiceService } from '../services/httl-mlservice.service';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GraphPlotService } from '../services/graph.plot.service';
import { AppConstants } from '../app.constants'
import { MyToasterService, toastPayload } from '../services/my-toaster.service';
import { IndividualConfig } from 'ngx-toastr';


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
  isCollapsed = false;
  

  statHeadRow = null;
  datasourceColumnNames = [];
  deleteColumnName = "";
  
  modalTitle = "";
  selectedYColumn = "";

  selectedAlgorithm = "";
  /*
  regressionList = [{label: "Linear Regression", value: "LinearRegression"}, {label: "Random Forest", value: "RandomForest"}];
  classificationList = [{label: "Naive Byes", value: "NaiveByes"}, {label: "Tree", value: "Tree"}, {label: "Random Forest", value: "Random Forest"}, {label: "Logistic", value: "Logistic regression"}];
  */
  modalAlgorithmList = [{label: "", value: ""}];
  mainDivWidth = 0;
  mainDivHeight = 0;
  toast!: toastPayload;

  modalRef: BsModalRef;

  constructor(private componentInterService: ComponentInterService
    , private httpService: HttlMLServiceService
    , private _cookiesService: CookieService
    , private modalService: BsModalService
    , private graphPlotService: GraphPlotService
    , private appConstants: AppConstants
    , private toasterService: MyToasterService) { }

  ngOnInit(): void {
    this.datasource = "";
    this.isDatasource = false;
    this.createStatTableTitleRow();

    console.log("inner Width: " + window.innerWidth);
    console.log("inner Height: " + window.innerHeight);
this.mainDivHeight = window.innerHeight - 10;
    this.mainDivWidth = window.innerWidth - 500;
    
  }


  appendText() {
      this.componentInterService.triggerEvent("Message sent");
  }

  uploadFile() {
    this.httpService.uploadFile(this.fileToUpload).subscribe((response:any) => {
      this._cookiesService.set('user-serssion', response.sessionId);
      this.datasource = response.fileName;
      console.log("inner Width: " + window.innerWidth);
      console.log("inner Height: " + window.innerHeight);
  
      console.log("before div width: " + document.getElementById("maindiv").style.width);
      console.log("before div height: " + document.getElementById("maindiv").style.height);
      
      document.getElementById("maindiv").style.height = this.mainDivHeight+"px";
      document.getElementById("maindiv").style.width = this.mainDivWidth+"px";
      
      console.log("after div width: " + document.getElementById("maindiv").style.width);
      console.log("after div height: " + document.getElementById("maindiv").style.height);

      this.showToast('File uploaded', 'Success');
      this.scrollToBottom();

      this.getTopRecord(5);
      this.isDatasource = true;
    },
    error=>{            
      this.showToast(error.statusText, 'error');
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
    }, error=>{
      this.showToast(error, 'error');
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
    table.className = "table";
    
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var row = thead.insertRow(0);

    for(let i=0; i<keys.length; i++) {
      var thr = row.insertCell(i);
      thr.className = "tblHeadRow";
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
    mydiv.append(this.getSeperator());
    document.getElementById("maindiv").append(mydiv);
  }

  getMissingValues() {
    this.httpService.getMissingValues().subscribe((response:any)=>{
      this.topRecoreds = response;
      //console.log(response);
    })
  }


  createContainerWithTitleDiv(divtitle) {
    var titleDiv = document.createElement("div");
    titleDiv.append(document.createElement("hr"));
    var titleH4 = document.createElement("h4")
    titleH4.innerHTML = divtitle;
    titleDiv.append(titleH4);
    
    var mydiv = document.createElement('div');
    mydiv.append(titleDiv);  
  
    return mydiv;
  }

  getStats() {
    this.httpService.getStats().subscribe((response:any)=>{
      let statRecords = response;
      var table = document.createElement('table');
      table.className = 'table';
      table.append(this.createStatTableTitleRow());
      var tableBody = document.createElement('tbody');

      for(var i = 0;i < statRecords.length; i++) {
        var row = document.createElement('tr');
        var rowMap = statRecords[i];
        console.log(rowMap);

        for(var j = 0; j< this.appConstants.statColumns.length; j++) {
          var cell = document.createElement('td');
          if(this.appConstants.statColumns[j]=="name") {
            cell.className = 'tblHeadRow';
          }

          cell.innerHTML = rowMap[this.appConstants.statColumns[j]];
          row.append(cell);
        }
        tableBody.append(row);
      }

      table.append(tableBody);
      
      var mydiv = this.createContainerWithTitleDiv("Stats");
      mydiv.append(table);
      mydiv.append(this.getSeperator());
      document.getElementById("maindiv").append(mydiv);
      this.scrollToBottom();
      console.log(response);
    })
  }

  createStatTableTitleRow() {
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    tr.className = 'tblHeadRow';

    for(var i=0; i<this.appConstants.statColumnTitles.length; i++) {
      var cell = tr.insertCell(i);
      cell.innerHTML = this.appConstants.statColumnTitles[i];
      cell.className = 'tblHeadRow';
    }

    thead.append(tr);

    return thead;   
  }

  getUniqueValues(columnName) {
    
    this.httpService.getUniqueValues(columnName).subscribe((response:any)=>{
      
      console.log(response);
      if(response) {
        var keys = Object.keys(response);

        var table = document.createElement('table');
        table.className = 'table';

        var thead = table.createTHead();
        var thr = thead.insertRow(0);
        thr.className = 'tblHeadRow';
        
        thr.insertCell(0).innerHTML = 'Value';
        thr.insertCell(1).innerHTML = 'Count';
        table.append(thead);

        var tbody = table.createTBody();

        for(var i = 0; i<keys.length; i++) {
          var tr = tbody.insertRow(i);
          tr.insertCell(0).innerHTML = keys[i];
          tr.insertCell(1).innerHTML = response[keys[i]];
        }

        table.append(tbody);
        var mydiv = this.createContainerWithTitleDiv("Unique values of " + columnName);
        mydiv.append(table);
        mydiv.append(this.getSeperator());
        document.getElementById("maindiv").append(mydiv);
      }
      

      this.scrollToBottom();
    },error=>{

    })
  }

  getOutliers() {
    this.httpService.getOutliers().subscribe((response:any)=>{
      console.log(response);
    },error=>{
      console.log(error);
    })

  }



  plotChart(chartType) {
    this.httpService.getDataset().subscribe((response:any)=>{
      console.log(response);
      var keys = Object.keys(response);
      var notOfCharts = keys.length;

      var boxdiv = document.createElement('div');
      boxdiv.className = 'row';

      for(var i=0; i<keys.length; i++) {

        if(i%3==0) {
          var seperatDiv = document.createElement('div');
          seperatDiv.className = 'row';
          var seperator = document.createElement('div');
          seperator.className = "col-12";
          seperator.append(this.getSeperator());
          seperatDiv.append(seperator);
          document.getElementById("maindiv").append(seperatDiv);

          document.getElementById("maindiv").append(boxdiv);
          boxdiv = document.createElement('div');
          boxdiv.className = 'row';
        }
        var chartContainerDiv = document.createElement('div') ;
        chartContainerDiv.className="col-3";
        var chartDiv = document.createElement('div');
        chartContainerDiv.append(chartDiv);
        chartContainerDiv.setAttribute('background-color', 'gray');
        boxdiv.append(chartContainerDiv);
        if(chartType==1) {
          this.graphPlotService.boxPlot(i, response[keys[i]], chartDiv);
        } else if(chartType == 2) {
          this.graphPlotService.density(i, response[keys[i]], chartDiv);
        }
        
        this.scrollToBottom();
      }
      
      document.getElementById("maindiv").append(boxdiv);
    },error=>{
      console.log(error);
    })
  }

  outlierCount() {
    this.httpService.getOutliers().subscribe((response:any)=>{
      console.log(response);
      var keys = Object.keys(response);
      var notOfCharts = keys.length;

      if(response) {
        var keys = Object.keys(response);

        var table = document.createElement('table');
        table.className = 'table';

        var thead = table.createTHead();
        var thr = thead.insertRow(0);
        thr.className = 'tblHeadRow';
        
        thr.insertCell(0).innerHTML = 'Value';
        thr.insertCell(1).innerHTML = 'Count';
        table.append(thead);

        var tbody = table.createTBody();

        for(var i = 0; i<keys.length; i++) {
          var tr = tbody.insertRow(i);
          tr.insertCell(0).innerHTML = keys[i].replace("_Outlier", "");
          tr.insertCell(1).innerHTML = response[keys[i]];
        }

        table.append(tbody);
        var mydiv = this.createContainerWithTitleDiv("Outliers");
        mydiv.append(table);
        document.getElementById("maindiv").append(mydiv);
      }
      this.scrollToBottom();
      
    },error=>{
      console.log(error);
    })    
  }

  getSeperator() {
    var seperator = document.createElement('div');
    seperator.className = "seperatorClass";
    return seperator;

  }

  openModal(template: TemplateRef<any>, algType) {

    if(algType==1) {
      this.modalTitle = "Regression";
      this.modalAlgorithmList = this.appConstants.regressionList;
    } else if(algType==2) {
      this.modalTitle = "Classification";
      this.modalAlgorithmList = this.appConstants.classificationList;
    } else if(algType==3) {
      this.modalTitle = "Association";
      this.modalAlgorithmList = this.appConstants.associationList;
    } else if(algType==4) {
      this.modalTitle = "Clustering";
      this.modalAlgorithmList = this.appConstants.clusteringList;
    }

    
    this.modalRef = this.modalService.show(template);
  }

  performRegression() {
    var request = {
      "trainDataSize": 80,
      "ycolumn": this.selectedYColumn,
      "xcolumns": [],
      "regressionType": this.selectedAlgorithm
    }

    if(this.modalTitle == "Regression") {
      
      this.httpService.postRegression(request).subscribe((response:any)=>{


        var table = document.createElement('table');
        table.className = 'table';

        var thead = table.createTHead();
        var thr = thead.insertRow(0);
        thr.className = 'tblHeadRow';
        
        thr.insertCell(0).innerHTML = 'Variable';
        thr.insertCell(1).innerHTML = 'Coefficient';
        thr.insertCell(2).innerHTML = 'SE of Coef';
        thr.insertCell(3).innerHTML = 't-Stat';

        var tstats = response.tstats;
        var attributes = response.selectedAttributeNames;
        var coefficients = response.coefficients;
        var stdErrorOfCoefficient = response.stdErrorOfCoefficient;
        attributes.push("constant");

        table.append(thead);

        var tbody = table.createTBody();

        for(var i = 0; i<attributes.length; i++) {
          var tr = tbody.insertRow(i);
          tr.insertCell(0).innerHTML = attributes[i];
          tr.insertCell(1).innerHTML = coefficients[i];
          tr.insertCell(2).innerHTML = stdErrorOfCoefficient[i];
          tr.insertCell(2).innerHTML = tstats[i];
        }

        table.append(tbody);
        var mydiv = this.createContainerWithTitleDiv("Regression Analysis:");
        mydiv.append(table);


        var regressionConstants = document.createElement("div");
        var tableCoeff = document.createElement('table');
        var theadCoeff = tableCoeff.createTBody();
        var rowcoeff1 = theadCoeff.insertRow(0);

        rowcoeff1.insertCell(0).innerHTML = "<b>R^2 value</b>";
        rowcoeff1.insertCell(1).innerHTML = response.rsquared;
        var rowcoeff2 = theadCoeff.insertRow(1);
        rowcoeff2.insertCell(0).innerHTML = "<b>Adjusted R^2&nbsp;&nbsp;&nbsp;</b>";
        rowcoeff2.insertCell(1).innerHTML = response.rsquaredAdj;
        var rowcoeff3 = theadCoeff.insertRow(2);
        rowcoeff3.insertCell(0).innerHTML = "<b>F-stat</b>";
        rowcoeff3.insertCell(1).innerHTML = response.fstat;

        regressionConstants.append(tableCoeff);


          
        document.getElementById("maindiv").append(mydiv);
        
        document.getElementById("maindiv").append(regressionConstants);




        console.log(response);
      }, error=>{
        console.log(error);
      });
    } else if(this.modalTitle == "Classification") {
      this.httpService.postClassification(request).subscribe((response:any)=>{
        console.log(response);
      }, error=>{
        console.log(error);
      });
      
    } else if(this.modalTitle == "Association") {
      this.httpService.postAssociation(request).subscribe((response:any)=>{
        console.log(response);
      }, error=>{
        console.log(error);
      });
      
      
    } else if(this.modalTitle == "Clustering") {
      
      
    }
    this.scrollToBottom();
  }

  getTop(rec) {

  }

  getTrail(rec) {

  }

  scrollToBottom() {
    //console.log("******** height: " + document.getElementById("maindiv").style.height);
    var element = document.getElementById("maindiv");
    element.scrollTo(0, element.scrollHeight);
  }

  showToast(tstmsg, tsttitle) {
    this.toast = {
      message: tstmsg,
      title: tsttitle,
      type: 'type',
      ic: {
        timeOut: 2500,
        closeButton: true,
      } as IndividualConfig,
    };
    this.toasterService.showToast(this.toast);
  }

  deleteColumn(template: TemplateRef<any>, item) {
    this.deleteColumnName = item;
    this.modalRef = this.modalService.show(template); 
  }

  performDeleteColumn() {
    console.log("performDeleteColumn called......");
    console.info("performDeleteColumn called info......");
    this.httpService.deleteColumn(this.deleteColumnName).subscribe((response:any)=>{
      console.log("success");
      console.info("success info");
      this.showToast(this.deleteColumnName + ' deleted', 'Column Deleted');
      let tmpArr = [];
      for(var i=0; i<this.datasourceColumnNames.length; i++) {
        if(this.datasourceColumnNames[i]!=this.deleteColumnName) {
          tmpArr.push(this.datasourceColumnNames[i]);
        }
      }
      console.log(tmpArr);
      console.log(this.datasourceColumnNames);
      console.info("--------------------");
      console.info(tmpArr);
      console.info(this.datasourceColumnNames);

      this.datasourceColumnNames = tmpArr;
    }, error=>{
      console.log("error");
      console.log(error);
      this.showToast(error.statusText, 'error');
    });
  }

  handleCategorical() {
    this.httpService.handleCategorical().subscribe((response:any)=>{
      
    });
  }
}
