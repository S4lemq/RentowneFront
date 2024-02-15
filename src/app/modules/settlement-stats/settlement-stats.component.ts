import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartData, registerables } from 'chart.js';
import { SettlementService } from '../single-rented-object-settlement-list/settlement.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settlement-stats',
  templateUrl: './settlement-stats.component.html',
  styleUrls: ['./settlement-stats.component.scss']
})
export class SettlementStatsComponent implements AfterViewInit, OnDestroy {

  private killer$ = new Subject<void>();
  @ViewChild("stats") private stats!: ElementRef;
  chart!: Chart;

  private data = {
    labels: [],
    datasets: [
      {
        label: 'Najemcy',
        data: [],
        borderColor: '#FF3F7C',
        backgroundColor: '#FF7A9F',
        order: 1,
        yAxisID: 'y'
      },
      {
        label: 'Kwota całkowita',
        data: [],
        borderColor: '#0088FF',
        backgroundColor: '#00A1FF ',
        type: 'line',
        order: 0,
        yAxisID: 'y1'
      }
    ]
  } as ChartData;
  

  constructor(private settlementService: SettlementService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.setupChart();
    this.getSettlementStatistics();
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  getSettlementStatistics() {
    this.settlementService.getSettlementStatistics()
      .pipe(takeUntil(this.killer$))
      .subscribe(stats => {
        this.data.labels = stats.label;
        this.data.datasets[0].data = stats.tenant;
        this.data.datasets[1].data = stats.totalAmount;
        this.chart.update();
      });
  }

  setupChart() {
    this.chart = new Chart(this.stats.nativeElement, {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Wykres rozliczeń'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
                // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          }
        }
      }
    });
  }

}
