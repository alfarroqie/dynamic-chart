import React, {useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";  
import * as am4charts from "@amcharts/amcharts4/charts";  
import am4themes_animated from "@amcharts/amcharts4/themes/animated";  
import { useLayoutEffect } from "react";
import dummyData from './data/dummyData.json'

export default function App() {
    const c = useRef(null);
    useLayoutEffect(() => {
        am4core.useTheme(am4themes_animated);  
        let chart = am4core.create("Chart", am4charts.XYChart);
        // Add data to chart
        chart.data = dummyData;
        //Create dateAxis (X Axis)
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dataFields.category = "date";
        dateAxis.renderer.minGridDistance = 50;
        //Function to make series
        function createLineSeries(nameSeries){
          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          if(chart.yAxes.indexOf(valueAxis) !== 0){
            valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
          }
          //configure line series data
          var series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = nameSeries;
          series.dataFields.dateX = "date";
          series.strokeWidth = 2;
          series.yAxis = valueAxis;
          series.name = nameSeries;
          series.tooltipText = "[bold]{name}[/]\n[font-size:12px]{categoryX}: {valueY}";
          series.tensionX = 0.8;
          series.showOnInit = true;
          //bullet
          let bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.strokeWidth = 1;
          //scale number in y axes
          valueAxis.renderer.line.strokeOpacity = 1;
          valueAxis.renderer.line.strokeWidth = 1;
          valueAxis.renderer.line.stroke = series.stroke;
          valueAxis.renderer.labels.template.fill = series.stroke;
        }
        function createColumnSeries(nameStack){
          //configure column series data
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = nameStack;
          series.dataFields.dateX = "date";
          series.name = nameStack;
          series.sequencedInterpolation = true;
          // Make it stacked
          series.stacked = true;
          // Configure columns label
          series.columns.template.width = am4core.percent(60);
          series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:12px]{categoryX}: {valueY}";
        }
        //Function to view type chart
        function handleMultipleLineView(){
          chart.series.clear();
          chart.yAxes.clear();
          createLineSeries("visits"); createLineSeries("hits"); createLineSeries("views");
        }
        function handleStackedColumnsView(){
          chart.series.clear();
          chart.yAxes.clear();
          chart.yAxes.push(new am4charts.ValueAxis());
          createColumnSeries("visits"); createColumnSeries("hits"); createColumnSeries("views");
        }
        //Button to trigger view type of chart
        let buttonStackedColumn = chart.chartContainer.createChild(am4core.Button);
        buttonStackedColumn.label.text = "Stacked Column";
        buttonStackedColumn.padding(5, 5, 5, 5);
        // buttonStackedColumn.align = "bottom";
        buttonStackedColumn.events.on("hit", function() {
          handleStackedColumnsView();
        });
        let buttonMultipleLine = chart.chartContainer.createChild(am4core.Button);
        buttonMultipleLine.label.text = "Multiple Line";
        // buttonMultipleLine.align = "bottom";
        buttonMultipleLine.events.on("hit", function() {
          handleMultipleLineView();
        });
        
        //add cursor and legend
        chart.cursor = new am4charts.XYCursor();
        chart.legend = new am4charts.Legend();

        // default view type of chart
        handleMultipleLineView();
        c.current = chart;
        
        return () => {
          chart.dispose();
        };

    }, [])

    return (
      <>
        <div id="Chart" style={{ width: "100%", height: "500px" }}></div>
      </>
    )
}