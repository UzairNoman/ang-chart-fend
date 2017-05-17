import { Component,OnInit } from '@angular/core';
import { ChartService } from './chart.service';
import { Chart } from './chart';
import { Http,Response,Headers,RequestOptions } from '@angular/http';


declare var jQuery:any;

@Component({
  selector: 'my-app',
  providers : [ChartService],
  template: `
<form  enctype="multipart/form-data" method="post" >
<input type="file" name="myfile"(change)="changeListener($event)" >Upload
</form>
<select (change) = "chartOpt(filter)" [(ngModel)]="filter">
  <option value="clickthrough">Clickthrough</option>
  <option value="visit">Visit</option>
  <option value="conversion">Conversion</option>
</select>
<button (click) = "wow()">Googgle</button>
<div style="width:60%" id="container"></div>

  `
  ,
})
export class AppComponent implements OnInit {
  private data2 = [ { Date: '12/5/2017', Type: 'clickthrough', Values: '1' },
  { Date: '12/6/2017', Type: 'visit', Values: '2' },
  { Date: '13/5/2017', Type: 'clickthrough', Values: '2' },
  { Date: '5/5/2017', Type: 'visit', Values: '1' },
  { Date: '16/5/2017', Type: 'clickthrough', Values: '2' },
  { Date: '21/5/2017', Type: 'visit', Values: '3' },
  { Date: '23/6/2017', Type: 'visit', Values: '5' },
  { Date: '12/7/2017', Type: 'clickthrough', Values: '62' },
  { Date: '24/5/2017', Type: 'conversion', Values: '1' },
  { Date: '4/6/2017', Type: 'conversion', Values: '2' },
  { Date: '12/7/2017', Type: 'conversion', Values: '4' },
  { Date: '11/5/2017', Type: 'visit', Values: '6' },
  { Date: '7/6/2017', Type: 'clickthrough', Values: '81' },
  { Date: '26/7/2017', Type: 'conversion', Values: '12' },
  { Date: '1/5/2017', Type: 'conversion', Values: '3' },
  { Date: '13/6/2017', Type: 'conversion', Values: '45' },
  { Date: '26/5/2017', Type: 'conversion', Values: '12' } ];

  private dataManipulated = [
    {
      name : 'clickthrough',
      data : [1,2,2,62,81]
  }];
  // {
  //     name : 'visit',
  //     data : [2,1,3,5,6]
  //   },{
  //     name : 'conversion',
  //     data : [1,2,4,12,3,45,12]
  //   }
  //   ];

  charts : Chart[];
  errorMessage: string;
   name : any;
   clickMessage = '';
   constructor (private http:Http, private chartService : ChartService){
    
   }
   chartOpt(filter : string){
     console.log(filter);
   }
   wow(){
     var visitVals = [];
     var visitDates = [];
     var ctVals = [];
     var ctDates = [];
     var conVals = [];
     var conDates = [];
     //console.log(this.data1.length);
        for(var i = 0; i < this.charts.length; i++){
          if (this.charts[i].Type == 'visit'){
              visitVals.push(this.charts[i].Values);
              visitDates.push(this.charts[i].Date);
          }
          if (this.charts[i].Type == 'clickthrough'){
              ctVals.push(this.charts[i].Values);
              ctDates.push(this.charts[i].Date);
          }
          if (this.charts[i].Type == 'conversion'){
              conVals.push(this.charts[i].Values);
              conDates.push(this.charts[i].Date);
          }
        
      }
      console.log(visitVals);
       console.log(this.charts);
       console.log(this.charts[0].Type);
   }
   ngOnInit(){

   }
   ngAfterViewInit() {
        this.renderChart();
    }
    renderChart(){
    	jQuery('#container').highcharts({
	        chart: {
        type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                '12/5',
         //       '12/6',
                '13/5',
                // '5/5',
                 '16/5',
                // '21/5',
                // '23/6',
                '12/7',
                // '24/5',
                // '4/6',
                // '12/7',
                // '11/5',
                '7/6',
                // '26/7',
                // '1/5',
                // '13/6',
                // '26/5'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Values'
            }
        },
	        tooltip: {
	            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b>' +
	            			 '<br/>warheads in {point.x}'
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

    let fileList: FileList = $event.target.files;
    let file: File = fileList[0];
    let formData:FormData = new FormData();
    formData.append('myfile', file, file.name);
    console.log(formData);
   // let headers = new Headers();
    //    headers.append('Content-Type', 'multipart/form-data');
    //      headers.append('Accept', 'application/json');
         // let options = new RequestOptions({ headers: headers });
            this.http.post('http://localhost:3000/csv', formData)
                .map(res => res.json())
                .subscribe(
                    data => this.charts = data,
                    error => console.log(error)
                );
}
   onClickMe(event : any ) {
     console.log(event.target);
     let fileList: FileList = event.target.files;
     let formData : FormData = new FormData();
    

    

        // let formData = new FormData();
        // formData.append("file", file, file.name);

    // if(fileList.length > 0) {
    //     let file: File = fileList[0];
    //     let formData:FormData = new FormData();
    //     formData.append('myfile', file, file.name);
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'multipart/form-data');
    //     headers.append('Accept', 'application/json');
    //     let options = new RequestOptions({ headers: headers });
    //     console.log(formData);
    //     this.http.post('http://localhost:3000/csv', formData, options)
    //         .map(res => res.json())
    //         .subscribe(
    //             data => console.log('success'),
    //             error => console.log(error)
    //         )
    // }
    //  this.chartService.getData(evt).subscribe(
    //   charts => console.log(charts),
    //   error => this.errorMessage = <any>error
    // )
  } 


}
