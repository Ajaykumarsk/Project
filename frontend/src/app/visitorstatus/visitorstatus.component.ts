import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitorService } from '../visitor.service';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import { Visitor } from '../visitor';
import { UserService } from '../app.service';

@Component({
  selector: 'app-visitorstatus',
  templateUrl: './visitorstatus.component.html',
  styleUrl: './visitorstatus.component.scss'
})
export class VisitorstatusComponent implements OnInit {
  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.visitors = this.visitors.filter(visitor =>
        visitor.visitor_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadVisitors();
    }
  }

  applyFilter(): void {
    // Reset visitors array to full list
    this.loadVisitors();

    if (this.filterValues && this.filterValues.department) {
      this.visitors = this.visitors.filter(visitor =>
        visitor.host_department.toLowerCase().includes(this.filterValues.department.toLowerCase())
      );
    }

    if (this.startDate && this.endDate) {
      this.visitors = this.visitors.filter(visitor =>
        visitor.check_in_time &&
        visitor.check_in_time >= this.startDate &&
        visitor.check_in_time <= this.endDate
      );
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterValues = null;
    this.loadVisitors();
  }

  onDepartmentInput($event: Event): void {
    const departmentName = ($event.target as HTMLInputElement).value;
    if (departmentName.trim() !== '') {
      this.visitors = this.visitors.filter(visitor =>
        visitor.host_department.toLowerCase().includes(departmentName.toLowerCase())
      );
    } else {
      this.loadVisitors();
    }
  }
  startDate!: Date;
  endDate!: Date;
  visitors: Visitor[] = [];
searchQuery: any;
filterValues: any;
departments: any;

  constructor(
    private visitorService: VisitorService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      alert('You need to log in');
      this.router.navigate(['login']);
      return;
    }
    this.loadVisitors();
     // Set interval to refresh visitors list every 5 seconds (5000 milliseconds)
     setInterval(() => {
      this.loadVisitors();
    }, 5000);
   
  }


  loadVisitors(): void {
    this.visitorService.getVisitors().subscribe(
        (data: Visitor[]) => {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

            this.visitors = data.filter(visitor => {
                if (visitor.created) {
                    const createdTime = new Date(visitor.created);

                    // Filter visitors based on creation date and verified/approved status
                    return (
                        createdTime >= startOfDay &&
                        createdTime <= endOfDay &&
                        !(visitor.is_verified && visitor.is_approved) // Exclude if both true
                    );
                }
                return false;
            }).sort((a, b) => {
                return new Date(b.created).getTime() - new Date(a.created).getTime();
            });

            console.log(this.visitors);
        },
        (error: any) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching visitors' });
            console.error('Error fetching visitors:', error);
        }
    );
}



  
  calculateStayHours(checkInTime: Date, checkOutTime: Date): string {
    if (checkInTime && checkOutTime) {
      const checkIn = new Date(checkInTime);
      const checkOut = new Date(checkOutTime);
      const durationInSeconds = (checkOut.getTime() - checkIn.getTime()) / 1000; // Convert milliseconds to seconds
      
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = Math.floor(durationInSeconds % 60);

      // Pad with leading zeros for consistent formatting
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    return '00:00:00';
  }
  exportVisitors(): void {
    const start = this.startDate ? this.startDate.toISOString().split('T')[0] : '';
    const end = this.endDate ? this.endDate.toISOString().split('T')[0] : '';

    this.visitorService.exportVisitors(start, end).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'visitors.xlsx');
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error exporting visitors' });
        console.error('Error exporting visitors:', error);
      }
    );
  }
  
  getVisitorType(validpass_from: Date): string {
    const now = new Date();
    if (validpass_from && new Date(validpass_from) > now) {
        return 'Pre-Registered';
    } else {
        return 'Walk-in';
    }
}


}
