import {
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../layouts/sidebar/sidebar';
import { NotificationPanel } from '../../layouts/notification-panel/notification-panel';

import { DashboardServices } from '../../services/dashboardServices';
import { Graphservices } from '../../services/graphservices';
import { Socketservices } from '../../services/socketservices';
import { Vars } from '../../services/vars';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, FormsModule, CommonModule, NotificationPanel],
  templateUrl: 'dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  /* ===========================
     Core bindings (HTML SAFE)
     =========================== */

  Math = Math;
  sites = signal<Array<any>>([]);

  averageDwellTime = signal(0);
  oneDayagoDtime = signal(0);

  footfallCount = signal(0);
  onedayagofootfall = signal(0);

  showNotifications = false;

  /* ===========================
     Service injections (renamed)
     =========================== */

  private dashboardApi = inject(DashboardServices);
  private graphApi = inject(Graphservices);
   sharedVars = inject(Vars);
  socketApi = inject(Socketservices);

  /* ===========================
     Lifecycle
     =========================== */

  ngOnInit(): void {
    this.initializeSites();
  }

  /* ===========================
     Site handling
     =========================== */

  loadSites() {
    this.initializeSites();
  }

  private initializeSites(): void {
    this.dashboardApi.loadSites().subscribe({
      next: (response) => this.sites.set(response),
      error: (error) =>
        console.error('Failed to load sites:', error)
    });
  }

  /* ===========================
     Date / UTC logic
     =========================== */

  setUtcRangeForDay(day: any): void {
    const selected = new Date(day);

    selected.setHours(0, 0, 0, 0);
    this.sharedVars.fromUtc = String(selected.getTime());

    const end = new Date(selected);
    end.setHours(23, 59, 59, 999);
    this.sharedVars.toUtc = String(end.getTime());
  }

  /* ===========================
     Dwell time
     =========================== */

  onDayChange(): void {
    this.fetchDwellTime(
      this.sharedVars.fromUtc,
      this.sharedVars.toUtc,
      false
    );

    const previousRange = this.shiftUtcByOneDay();
    this.fetchDwellTime(
      previousRange.from,
      previousRange.to,
      true
    );
  }

  private fetchDwellTime(
    fromUtc: string,
    toUtc: string,
    isPrevious: boolean
  ): void {
    this.dashboardApi
      .loadDwellTime(fromUtc, toUtc, this.sharedVars.siteId)
      .subscribe({
        next: (res) => {
          isPrevious
            ? this.oneDayagoDtime.set(res.avgDwellMinutes)
            : this.averageDwellTime.set(res.avgDwellMinutes);
        },
        error: (err) =>
          console.error('Dwell time error:', err)
      });
  }

  /* ===========================
     Footfall
     =========================== */

  getFootfallData(): void {
    this.fetchFootfall(
      this.sharedVars.fromUtc,
      this.sharedVars.toUtc,
      false
    );

    const previousRange = this.shiftUtcByOneDay();
    this.fetchFootfall(
      previousRange.from,
      previousRange.to,
      true
    );
  }

  private fetchFootfall(
    fromUtc: string,
    toUtc: string,
    isPrevious: boolean
  ): void {
    this.dashboardApi
      .loadFootfallData(fromUtc, toUtc, this.sharedVars.siteId)
      .subscribe({
        next: (res) => {
          isPrevious
            ? this.onedayagofootfall.set(res.footfall)
            : this.footfallCount.set(res.footfall);
        },
        error: (err) =>
          console.error('Footfall error:', err)
      });
  }

  /* ===========================
     UI triggers (HTML SAFE)
     =========================== */

  clickfortest(day: any) {
    this.setUtcRangeForDay(day);
    this.getFootfallData();
    this.loadOccupancyData();
    this.loadDemographicsData();
    this.onDayChange();
  }

  onSitechange() {
    if (!this.sharedVars.fromUtc) return;

    this.getFootfallData();
    this.loadOccupancyData();
    this.loadDemographicsData();
    this.onDayChange();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  /* ===========================
     Occupancy chart
     =========================== */

  chartData = signal<{ labels: string[]; values: number[] }>({
    labels: [],
    values: []
  });

  loadOccupancyData(): void {
    this.graphApi
      .loadOccupancyData(
        this.sharedVars.fromUtc,
        this.sharedVars.toUtc,
        this.sharedVars.siteId
      )
      .subscribe({
        next: (res) => {
          const labels = this.formatTimeBuckets(res.buckets);
          const values = res.buckets.map((b: any) => b.avg);
          this.chartData.set({ labels, values });
        },
        error: (err) =>
          console.error('Occupancy error:', err)
      });
  }

  /* ===========================
     Demographics
     =========================== */

  demographicsData = signal<{
    local: string[];
    men: number[];
    women: number[];
  }>({
    local: [],
    men: [],
    women: []
  });

  loadDemographicsData(): void {
    this.graphApi
      .loadDemographicData(
        this.sharedVars.fromUtc,
        this.sharedVars.toUtc,
        this.sharedVars.siteId
      )
      .subscribe({
        next: (res) => {
          this.demographicsData.set({
            local: this.formatTimeBuckets(res.buckets),
            men: res.buckets.map((b: any) => b.male),
            women: res.buckets.map((b: any) => b.female)
          });
        },
        error: (err) =>
          console.error('Demographic error:', err)
      });
  }

  /* ===========================
     Helpers (internal only)
     =========================== */

  private formatTimeBuckets(buckets: any[]): string[] {
    return buckets.map((entry) => {
      const [d, t] = entry.local.split(' ');
      const [day, month, year] = d.split('/').map(Number);
      const [h, m, s] = t.split(':').map(Number);

      return new Date(year, month - 1, day, h, m, s)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  }

  private shiftUtcByOneDay() {
    const shift = 24 * 60 * 60 * 1000;
    return {
      from: String(Number(this.sharedVars.fromUtc) - shift),
      to: String(Number(this.sharedVars.toUtc) - shift),
    };
  }

  /* ===========================
     Computed values (HTML SAFE)
     =========================== */

  menSum = computed(() =>
    this.demographicsData().men.reduce((a, b) => a + b, 0)
  );

  womenSum = computed(() =>
    this.demographicsData().women.reduce((a, b) => a + b, 0)
  );

  totalSum = computed(() =>
    this.menSum() + this.womenSum()
  );

  menPercentage = computed(() =>
    this.totalSum() ? (this.menSum() / this.totalSum()) * 100 : 0
  );

  womenPercentage = computed(() =>
    this.totalSum() ? (this.womenSum() / this.totalSum()) * 100 : 0
  );

  liveOccupancy = computed(() =>
    this.socketApi.liveOccupancy()
  );

  percentChangeinDwell = computed(() => {
    const oldVal = this.oneDayagoDtime();
    const newVal = this.averageDwellTime();
    return oldVal ? ((newVal - oldVal) / oldVal) * 100 : 0;
  });

  percentChangeinFootfall = computed(() => {
    const oldVal = this.onedayagofootfall();
    const newVal = this.footfallCount();
    return oldVal ? ((newVal - oldVal) / oldVal) * 100 : 0;
  });



  //graph config data 




constructor() {

  /* ===========================
     1️⃣ OCCUPANCY LINE CHART
     =========================== */
  effect(() => {
    const occupancy = this.chartData();

    this.config.data.labels = occupancy.labels;
    this.config.data.datasets[0].data = occupancy.values;

    this.chart?.update();
  });

  /* ===========================
     2️⃣ DEMOGRAPHICS LINE CHART
     =========================== */
  effect(() => {
    const demographics = this.demographicsData();

    this.demographConfig.data.labels = demographics.local;
    this.demographConfig.data.datasets[0].data = demographics.men;
    this.demographConfig.data.datasets[1].data = demographics.women;

    this.demographChart?.update();
  });

  /* ===========================
     3️⃣ GENDER SPLIT PIE CHART
     =========================== */
  effect(() => {
    const men = this.menPercentage();
    const women = this.womenPercentage();

    this.pieConfig.data.datasets[0].data = [men, women];

    this.pieChart?.update();
  });

}













  public chart!: Chart;
public demographChart!: Chart;
public pieChart!: Chart;


  public demographConfig: ChartConfiguration<'line'> = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: false
  },
  data: {
    labels: [],
    datasets: [
      {
        label: 'Men',
        data: [],
        borderColor: '#2A7F7D99',
        tension: 0.4
      },
      {
        label: 'Women',
        data: [],
        borderColor: '#47B2B080',
        tension: 0.4
      }
    ]
  }
};


pieConfig: ChartConfiguration<'doughnut'> = {
  type: 'doughnut',
  data: {
    labels: ['Men', 'Women'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#2F8F8B', '#4FB7B3'],
        borderWidth: 0,
        spacing: 3
      }
    ]
  },
  options: {
    responsive: true
  }
};




public config: ChartConfiguration<'line'> = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      duration: 900,
      easing: 'easeOutQuart'
    },

    interaction: {
      mode: 'index',
      intersect: false
    },

    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            // weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        padding: 10,
        cornerRadius: 6
      }
    },

    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#e5e7eb',
          // drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      }
    }
  },

  data: {
    labels: [],
    datasets: [
  {
    label: 'Occupancy',
    data: [],

    borderColor: '#2F8F8B',
    backgroundColor: 'rgba(79, 183, 179, 0.25)',
    fill: true,

    tension: 0.45,

    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: '#2F8F8B',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,

    borderCapStyle: 'round',
    borderJoinStyle: 'round',

    segment: {
      borderDash: ctx =>
        ctx.p0.skip || ctx.p1.skip ? [6, 6] : undefined
    }
  }
]

  }
};


ngAfterViewInit(): void {
  this.chart = new Chart('myChart', this.config);
  this.demographChart = new Chart('demographChart', this.demographConfig);
  this.pieChart = new Chart('pieChart', this.pieConfig);
}






}
