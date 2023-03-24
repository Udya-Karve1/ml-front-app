import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentInterService } from '../services/component-inter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttlMLServiceService } from '../services/httl-mlservice.service';
import { CookieService } from 'ngx-cookie-service';
import * as d3 from 'src/assets/js/d3.js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


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
  statColumns = ["name","date","nominal","numeric","regular","averagable","dateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
  statColumnTitles = ["Name","isDate","isNominal","isNumeric","isRegular","isAveragable","DateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
  datasourceColumnNames = [];

  

  regressionList = [{label: "Linear Regression", value: "LinearRegression"}, {label: "Random Forest", value: "RandomForest"}];
  classificationList = [{label: "Naive Byes", value: "NaiveByes"}, {label: "Tree", value: "Tree"}, {label: "Random Forest", value: "Random Forest"}, {label: "Logistic", value: "Logistic regression"}];
  modalAlgorithmList = [{label: "", value: ""}];


  modalRef: BsModalRef;

  constructor(private componentInterService: ComponentInterService
    , private httpService: HttlMLServiceService
    , private _cookiesService: CookieService
    , private modalService: BsModalService) { }

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

        for(var j = 0; j< this.statColumns.length; j++) {
          var cell = document.createElement('td');
          if(this.statColumns[j]=="name") {
            cell.className = 'tblHeadRow';
          }

          cell.innerHTML = rowMap[this.statColumns[j]];
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

    for(var i=0; i<this.statColumnTitles.length; i++) {
      var cell = tr.insertCell(i);
      cell.innerHTML = this.statColumnTitles[i];
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
          this.boxPlot(i, response[keys[i]], chartDiv);
        } else if(chartType == 2) {
          this.density(i, response[keys[i]], chartDiv);
        }
        

      }
      
      document.getElementById("maindiv").append(boxdiv);
    },error=>{
      console.log(error);
    })
  }

  boxPlot(index, data, chartDiv) {
    
    var data_sorted = data.sort(d3.ascending);
    
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 300 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    var svg = d3.select(chartDiv)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data_sorted = data.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange
      
    var y = d3.scaleLinear()
        .domain([0,d3.max(data_sorted)])
        .range([height, 0]);
     svg.call(d3.axisLeft(y))
      
    var center = width/2;
    var width = 100

    svg
      .append("line")
        .attr("x1", center)
        .attr("x2", center)
        .attr("y1", y(min) )
        .attr("y2", y(max) )
        .attr("stroke", "black")
      
    svg
      .append("rect")
        .attr("x", center - width/2)
        .attr("y", y(q3) )
        .attr("height", (y(q1)-y(q3)) )
        .attr("width", width )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
      
      // show median, min and max horizontal lines
      svg
      .selectAll("toto")
      .data([min, median, max])
      .enter()
      .append("line")
        .attr("x1", center-width/2)
        .attr("x2", center+width/2)
        .attr("y1", function(d){ return(y(d))} )
        .attr("y2", function(d){ return(y(d))} )
        .attr("stroke", "black")
        
        var jitterWidth = 50
        svg
          .selectAll("indPoints")
          .data(data)
          .enter()
          .append("circle")
            //.attr("cx", function(d){return(x(d.Species) - jitterWidth/2 + Math.random()*jitterWidth )})
            .attr("cx", function(d){return(center)})
            .attr("cy", function(d){return(y(d))})
            .attr("r", 4)
            .style("fill", "gray")
            .attr("stroke", "black")
  }

  density(index, data, chartDiv) {

    var margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select(chartDiv)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleLinear().domain([-10,15])
          .range([0, width]);
    
          svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
    
      // add the y Axis
      var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, 0.12]);
      svg.append("g")
          .call(d3.axisLeft(y));
    
      // Compute kernel density estimation
      var kde = this.kernelDensityEstimator(this.kernelEpanechnikov(7), x.ticks(60))
      var density1 =  kde(data
          .filter( function(d){return d.type === "variable 1"} )
          .map(function(d){  return d.value; }) )

      // Plot the area
      svg.append("path")
          .attr("class", "mypath")
          .datum(density1)
          .attr("fill", "#69b3a2")
          .attr("opacity", ".6")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .attr("stroke-linejoin", "round")
          .attr("d",  d3.line()
            .curve(d3.curveBasis)
              .x(function(d) { return x(d[0]); })
              .y(function(d) { return y(d[1]); })
          );
    
          svg.append("circle").attr("cx",300).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
          svg.append("circle").attr("cx",300).attr("cy",60).attr("r", 6).style("fill", "#404080")
          svg.append("text").attr("x", 320).attr("y", 30).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
          svg.append("text").attr("x", 320).attr("y", 60).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")

  }

  kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
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
      this.modalAlgorithmList = this.regressionList;
    } else if(algType==2) {
      this.modalAlgorithmList = this.classificationList;
    }
    
    this.modalRef = this.modalService.show(template);
  }

  performRegression() {
    var request = {
      "trainDataSize": 80,
      "ycolumn": "charges",
      "xcolumns": [],
      "regressionType": "LinearRegression"
    }

    this.httpService.postRegression(request).subscribe((response:any)=>{
      console.log(response);
    }, error=>{
      console.log(error);
    });
  }
}


