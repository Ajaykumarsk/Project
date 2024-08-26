import { Component, OnInit } from '@angular/core';
import { IsBrowserService } from '../is-browser.service';
import { WebcamImage } from 'ngx-webcam';
import { WebcamInitError } from 'ngx-webcam';
import { Observable } from 'rxjs';
import { VisitorService } from '../visitor.service';
import { Visitor } from '../visitor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
visitorName: any;
visitorType: any;
companyName: any;
whomToMeet: any;
visitingPurpose: any;
visitDate: any;
handleVisitorPhoto($event: WebcamImage) {
throw new Error('Method not implemented.');
}
cameraWasSwitched($event: string) {
throw new Error('Method not implemented.');
}
handleInitError($event: WebcamInitError) {
throw new Error('Method not implemented.');
}
resetVisitorPhoto() {
throw new Error('Method not implemented.');
}
triggerVisitorSnapshot() {
throw new Error('Method not implemented.');
}
headcount: any;
checkedIn: any;
checkedOut: any;

barData: any;
barOptions: any;
barData2: any;
barOptions2: any;
lineData: any;
lineOptions: any;
pieData: any;
pieOptions: any;
doughnutData: any;
doughnutOptions: any;
  triggerVisitorObservable!: Observable<void>;
showVisitorWebcam: any;
  allowCameraSwitch!: boolean;
  nextWebcamObservable!: Observable<string | boolean>;
  videoOptions!: MediaTrackConstraints;
visitorPhoto: any;

constructor(private isBrowserService: IsBrowserService,private visitorService: VisitorService) {}

ngOnInit() {
  if (this.isBrowserService.isBrowser()) {
    
    this.loadVisitorData();
  }
}

loadVisitorData() {
    this.visitorService.getVisitors().subscribe(
      (data: Visitor[]) => {
        this.headcount = data.length;
        this.checkedIn = data.filter(visitor => visitor.check_in_time).length;
        this.checkedOut = data.filter(visitor => visitor.check_out_time).length;
        this.initCharts(data);
        
      },
      (error: any) => {
        console.error('Error fetching visitor data:', error);
      }
    );
  }
  initCharts(visitors: Visitor[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const visitorTypes = ['DAY PASS', 'MULTIPLE DAY PASS'];
// Calculate visitor counts for each type
const dayPassCount = visitors.filter(v => v.type_of_visitor === 'DAY PASS').length;
const multipleDaysPassCount = visitors.filter(v => v.type_of_visitor === 'MULTIPLE DAY PASS').length;

this.barData = {
  labels: ['Type of Visitor'],
  datasets: [
      {
          label: 'DAY PASS',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [dayPassCount],
          barThickness: 60,
          barPercentage: 0.5, // Adjust the space between bars of the same dataset
          categoryPercentage: 0.8 // Adjust the space between bars of different datasets
      },
      {
          label: 'MULTIPLE DAY PASS',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [multipleDaysPassCount],
          barThickness: 60,
          barPercentage: 0.5, // Adjust the space between bars of the same dataset
          categoryPercentage: 0.8 // Adjust the space between bars of different datasets
      }
  ]
};

this.barOptions = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
      legend: {
          labels: {
              color: textColor
          }
      }
  },
  scales: {
      x: {
          ticks: {
              color: textColorSecondary,
              font: {
                  weight: 500
              }
          },
          grid: {
              color: surfaceBorder,
              drawBorder: false
          }
      },
      y: {
          ticks: {
              color: textColorSecondary
          },
          grid: {
              color: surfaceBorder,
              drawBorder: false
          }
      }

  }
};

    const preVisitorTypes = ['DAY PASS', 'MULTIPLE DAY PASS'];

    // Calculate visitor counts for each type with valid_pass_from in the future
    const today = new Date().setHours(0, 0, 0, 0); // Today's date at midnight
    const preVisitorCounts = preVisitorTypes.map(type =>
      visitors.filter(v =>
        v.type_of_visitor === type &&
        new Date(v.valid_pass_from).setHours(0, 0, 0, 0) > today
      ).length
    );
    
    this.barData2 = {
      labels:['Type of Pre-Visitor'],
      datasets: [
        {
          label: 'DAY PASS',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [preVisitorCounts[0]],
          barThickness: 60,
          barPercentage: 0.5, // Adjust the space between bars of the same dataset
          categoryPercentage: 0.8 // Adjust the space between bars of different datasets
        },
        {
          label: 'MULTIPLE DAY PASS',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [preVisitorCounts[1]],
          barThickness: 60,
          barPercentage: 0.5, // Adjust the space between bars of the same dataset
          categoryPercentage: 0.8 // Adjust the space between bars of different datasets
        }
      ]
    };
    
    this.barOptions2 = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
    
      }
    };
    
  
    const pieVisitorTypes = ['PERSONAL', 'OFFICIAL', 'AMC VISIT', 'PARENT', 'VENDOR', 'P&T MEETING', 'DAY PASS', 'MULTIPLE DAY PASS'];

    // Calculate visitor counts for each type or meeting purpose
    const pieVisitorCounts = pieVisitorTypes.map(type =>
      visitors.filter(v => v.type_of_visitor === type || v.meeting_purpose === type).length
    );
    
    this.pieData = {
      labels: pieVisitorTypes,
      datasets: [
        {
          data: pieVisitorCounts,
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--teal-500'),
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--green-500'), // Add more colors if needed
            documentStyle.getPropertyValue('--blue-500')   // Add more colors if needed
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--indigo-400'),
            documentStyle.getPropertyValue('--purple-400'),
            documentStyle.getPropertyValue('--teal-400'),
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--green-400'), // Add more colors if needed
            documentStyle.getPropertyValue('--blue-400')   // Add more colors if needed
          ]
        }
      ]
    };
    
    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    
// Assuming visitors is your array of visitor objects from backend

const currentDate = new Date(); // Current date with time

// Function to normalize date to only consider date part
const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const validVisitors = visitors.filter(v => {
    const validToDate = new Date(v.valid_pass_to);
    
    // Normalize dates to compare only date part
    const normalizedValidToDate = normalizeDate(validToDate);
    const normalizedCurrentDate = normalizeDate(currentDate);
    
    // Check if valid_pass_to date is greater than or equal to current date's date part
    return normalizedValidToDate >= normalizedCurrentDate;
});

const invalidVisitors = visitors.filter(v => {
    const validToDate = new Date(v.valid_pass_to);
    
    // Normalize dates to compare only date part
    const normalizedValidToDate = normalizeDate(validToDate);
    const normalizedCurrentDate = normalizeDate(currentDate);
    
    // Check if valid_pass_to date is less than current date's date part
    return normalizedValidToDate < normalizedCurrentDate;
});

const doughnutVisitorTypes = ['Valid Visitors', 'Invalid Visitors'];
const doughnutVisitorCounts = [
    validVisitors.length,
    invalidVisitors.length
];



this.doughnutData = {
  labels: doughnutVisitorTypes,
  datasets: [
      {
          data: doughnutVisitorCounts,
          backgroundColor: [
              documentStyle.getPropertyValue('--green-500'),
              documentStyle.getPropertyValue('--red-500')
              
          ],
          hoverBackgroundColor: [
              documentStyle.getPropertyValue('--green-400'),
              documentStyle.getPropertyValue('--red-400')
          ]
      }]
};

this.doughnutOptions = {
  plugins: {
      legend: {
          labels: {
              usePointStyle: true,
              color: textColor
          }
      }
  }
};
}

}
