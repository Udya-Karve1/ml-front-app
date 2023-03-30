import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentInterService } from '../services/component-inter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttlMLServiceService } from '../services/httl-mlservice.service';
import { CookieService } from 'ngx-cookie-service';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GraphPlotService } from '../services/graph.plot.service';
import { AppConstants } from '../app.constants'

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
  /*
  statColumns = ["name","date","nominal","numeric","regular","averagable","dateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
  statColumnTitles = ["Name","isDate","isNominal","isNumeric","isRegular","isAveragable","DateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
*/
  datasourceColumnNames = [];
  /*
  associationList = [{label: "Apriori", value: "Apriori"}, {label: "Eclat", value: "Eclat"}, {label: "F-P Growth", value: "FPGrowth"}];
  clusteringList = [{label: "K-means", value: "Kmeans"}, {label: "DBSCAN", value: "DBSCAN"}
  , {label: "F-P Growth", value: "FPGrowth"}
  , {label: "Gaussian Mixture", value: "GaussianMixture"}
  , {label: "BIRCH", value: "BIRCH"}
  , {label: "Affinity Propagation", value: "AffinityPropagation"}
  , {label: "Mean-Shift", value: "MeanShift"}
  , {label: "OPTICS", value: "OPTICS"}
  , {label: "Agglomerative", value: "Agglomerative"}
];
*/
  
  modalTitle = "";
  selectedYColumn = "";

  selectedAlgorithm = "";
  /*
  regressionList = [{label: "Linear Regression", value: "LinearRegression"}, {label: "Random Forest", value: "RandomForest"}];
  classificationList = [{label: "Naive Byes", value: "NaiveByes"}, {label: "Tree", value: "Tree"}, {label: "Random Forest", value: "Random Forest"}, {label: "Logistic", value: "Logistic regression"}];
  */
  modalAlgorithmList = [{label: "", value: ""}];


  modalRef: BsModalRef;

  constructor(private componentInterService: ComponentInterService
    , private httpService: HttlMLServiceService
    , private _cookiesService: CookieService
    , private modalService: BsModalService
    , private graphPlotService: GraphPlotService
    , private appConstants: AppConstants) { }

  ngOnInit(): void {
    this.datasource = "";
    this.isDatasource = false;
    this.createStatTableTitleRow();
  }

  appendText() {
      this.componentInterService.triggerEvent("Message sent");
  }

  uploadFile() {
    this.httpService.uploadFile(this.fileToUpload).subscribe((response:any) => {
      this._cookiesService.set('user-serssion', response.sessionId);
      this.datasource = response.fileName;

      
      

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
      
      
    } else if(this.modalTitle == "Clustering") {
      
      
    }



  }

  getTop(rec) {

  }

  getTrail(rec) {

  }
}


