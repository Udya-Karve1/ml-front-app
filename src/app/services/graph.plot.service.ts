import { Injectable } from '@angular/core';
import * as d3 from 'src/assets/js/d3.js';

@Injectable({
  providedIn: 'root'
})
export class GraphPlotService {

  constructor() { }

  getMaxChar(myarr) {
    var len = 0;
    for(var i =0; i<myarr.length; i++) {
      if(len<myarr[i].length) {
        len = myarr[i].length;
      }
    }
    return len;
  }


  heatMap(response, chartDiv) {


    var heightwidth = response.attributes.length * 70;
    var attribu = response.attributes;

    var maxlen = this.getMaxChar(response.attributes);

    var marginleft = ((40/6) * maxlen) + 20;
    console.log('marginleft>>' + ((40/6) * maxlen));


    var margin = {top: 10, right: 30, bottom: marginleft, left: marginleft},
    width = heightwidth - margin.left - margin.right,
    height = heightwidth - margin.top - margin.bottom;

    var svg = d3.select(chartDiv)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var myGroups = response.attributes;
      var myVars = response.attributes;
      
      // Build X scales and axis:
      var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.01);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,10)rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", 12);
      
      // Build X scales and axis:
      var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.01);
      svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")          
          .style("text-anchor", "end")
          .style("font-size", 12);
      
      // Build color scale
      var myColor = d3.scaleLinear()
        .range(["white", "#69b3a2"])
        .domain([1,(myGroups.length*myGroups.length)])

        myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,(myGroups.length*myGroups.length)]);

      var data = response.correlationList;
      
        // Three function that change the tooltip when user hover / move / leave a cell

    var tooltip = d3.select(chartDiv)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.value)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

        
      svg.selectAll()
        .data(data, function(d) {return d.attribute1+':'+d.attribute2;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.attribute1) })
        .attr("y", function(d) { return y(d.attribute2) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor((d.value))} )
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
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

}
