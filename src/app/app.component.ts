import { Component,OnInit} from '@angular/core';
import { ChartService } from './chart.service';
import { Chart } from './chart';
import { Http,Response,Headers,RequestOptions } from '@angular/http';


declare var jQuery:any;

@Component({
  selector: 'my-app',
  providers : [ChartService],
  template: `
<div class="container">
  <div class="row">
    <div class="col-md-8">
    <h2>Chart Maker from CSV</h2>
      <form enctype="multipart/form-data" method="post"  >
        <div class="file-group">
          <label>File</label>
          <input type="file" name="myfile"(change)="changeListener($event)" >
        </div>     
      </form>
    <div *ngIf="fileUpload">  
      <label>Select Type</label>
      <select class="form-control" (change) = "chartOpt(filter)" [(ngModel)]="filter">
        <option [selected]="1 == 1" [ngValue]="clickthrough">Clickthrough</option>
        <option [ngValue]="visit">Visit</option>
        <option [ngValue]="conversion">Conversion</option>
      </select>
    </div>  
    </div>
    <div class="col-md-8">
      <div id="container1"></div>
      <div id="container2"></div>
      <div id="container3"></div>
    </div>
  </div>  
</div>  
`
  ,
})
export class AppComponent {
  public fileUpload : boolean = false;
  public dataManipulated : Array<Object> = [];
  public visitVals : Array<number> = [];
  public visitDates : Array<Date> = [];
  public ctVals : Array<number> = [];
  public ctDates : Array<Date> = [];
  public conVals : Array<number> = [];
  public conDates : Array<Date> = [];
  charts : Chart[];
  public selectedFilter : string = 'clickthrough';
  errorMessage: string;

   constructor (private http:Http, private chartService : ChartService){}

   chartOpt(filter : string){
     this.selectedFilter = filter;
     if( filter  == 'visit'){
       this.dataManipulated = [
        {
          name : 'Visit',
          data : this.visitVals
      }];
      this.renderChart("#container1",'line');
      this.renderPieChart("#container2",'pie');
      this.renderChart("#container3",'column');
      
     }
     if( filter  == 'clickthrough'){
       this.dataManipulated = [
        {
          name : 'Clickthrough',
          data : this.ctVals
      }];
      this.renderChart("#container1",'line');
      this.renderPieChart("#container2",'pie');
      this.renderChart("#container3",'column');
     }
     if( filter  == 'conversion'){
       this.dataManipulated = [
        {
          name : 'Conversion',
          data : this.conVals
      }];
      this.renderChart("#container1",'line');
      this.renderPieChart("#container2",'pie');
      this.renderChart("#container3",'column');
     }
     console.log(filter);     
   }
   transformData(data : Chart[]){
      for(var i = 0; i < data.length; i++){
                if (data[i].Type == 'visit'){
                    this.visitVals.push(Number(data[i].Values));
                    this.visitDates.push(data[i].Date);
                }
                if (data[i].Type == 'clickthrough'){
                    this.ctVals.push(Number(data[i].Values));
                    this.ctDates.push(data[i].Date);
                }
                if (data[i].Type == 'conversion'){
                    this.conVals.push(Number(data[i].Values));
                    this.conDates.push(data[i].Date);
                }
              
        }
    }
    transformPieData(data : Chart[],filter : string): Array<Object>{
      let selectedLength : number;
      let pieDataManipulated : Array<Object> = [];
      if(filter == "clickthrough"){
          selectedLength = this.ctDates.length;
          for(var i = 0; i < selectedLength; i++){
           pieDataManipulated.push({"name" : this.ctDates[i],"y" : this.ctVals[i]});          
          }
      }
      if(filter == "visit"){
          selectedLength = this.visitDates.length;
          for(var i = 0; i < selectedLength; i++){
           pieDataManipulated.push({"name" : this.visitDates[i],"y" : this.visitVals[i]});          
          }
      }
      if(filter == "conversion"){
          selectedLength = this.conDates.length;
          for(var i = 0; i < selectedLength; i++){
           pieDataManipulated.push({"name" : this.conDates[i],"y" : this.conVals[i]});          
          }
      }
      console.log(pieDataManipulated);
      return pieDataManipulated;
    }
    renderPieChart(container : string, chartType : string ){
      console.log("Current selection is " + this.selectedFilter);
      var seriesData : Array<Object>;
      seriesData = this.transformPieData(this.charts,this.selectedFilter);
      
    	jQuery(container).highcharts({
	        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: chartType
        },
        title: {
            text: 'User App Usage'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: this.selectedFilter,
            colorByPoint: true,
            data: seriesData
        }]
	    });
    }
    renderChart(container : string ,chartType : string ){
    	jQuery(container).highcharts({
	        chart: {
        type: chartType
        },
        title: {
            text: 'User App Usage'
        },
        subtitle: {
            text: 'Vortech Innovations'
        },
        xAxis: {
            categories: this.ctDates,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Values'
            }
        },
	        tooltip: {
	            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b>'
	        },
	        plotOptions: {
	            area: {
	                pointStart: 1940,
	                marker: {
	                    enabled: false,
	                    symbol: 'circle',
	                    radius: 2,
	                    states: {
	                        hover: {
	                            enabled: true
	                        }
	                    }
	                }
	            }
	        },
	        series: this.dataManipulated
	    });
    }
   changeListener($event : any ): void {
    this.fileUpload = true;
    console.log(this.fileUpload);
    let fileList: FileList = $event.target.files;
    let file: File = fileList[0];
    let formData:FormData = new FormData();
    formData.append('myfile', file, file.name);
            this.http.post('http://localhost:3000/csv', formData)
                .map(res => res.json())
                .subscribe(
                    data => [
                      this.charts = data,
                      this.transformData(data),
                      this.dataManipulated = [
                        {
                          name : 'clickthrough',
                          data : this.ctVals
                      }],
                      console.log(this.ctVals,[1,2,34,4],this.ctDates,this.dataManipulated),
                      this.renderChart("#container1",'line'),
                      this.renderPieChart("#container2",'pie'),
                      this.renderChart("#container3",'column'),            
                      ],
                    error => console.log(error)
                );
    } 
}
