import { Component } from '@angular/core';

@Component({
  selector: 'chart-draw',
  styles: [`
    .chart {
      display: block;
    }
  `],
  template: `
    <p>bitch</p>
  `
})
export class AppComponent {
  private datasets = [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3]
    }
  ];

  private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  private options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
}
