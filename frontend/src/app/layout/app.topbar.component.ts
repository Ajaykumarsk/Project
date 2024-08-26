import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { UserService } from '../app.service';
import { Router } from '@angular/router';
import { VisitorService } from '../visitor.service';
import { Visitor } from '../visitor';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  newVisitorCount: number = 0;
  approvedVisitorsCount: number = 0;
  showVerificationMessage: boolean = false;
  showDropdown: boolean = false;
  showApprovedDropdown: boolean = false;
  recentVisitors: Visitor[] = [];
  approvedVisitors: Visitor[] = [];
  isDropdownVisible = false;
  isApprovedDropdownVisible = false;
  userName: string | null = '';
  userRole: string | null = '';
  intervalId: any;
  displayChairmanNotificationDialog: boolean = false;

  chairmanNotificationCount: number = 0;
  chairmanNotifications: Visitor[] = [];
  isChairmanDropdownVisible = false;

  frontOfficeNotificationCount: number = 0;
  frontOfficeNotifications: Visitor[] = [];
  displayFrontOfficeNotificationDialog: boolean = false;


  constructor(
    public layoutService: LayoutService,
    private userService: UserService,
    private router: Router,
    private visitorService: VisitorService,
    private cdr: ChangeDetectorRef
  ) {}

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.userName = localStorage.getItem('role');
    this.userRole = localStorage.getItem('role');
    
    this.visitorService.newVisitors$.subscribe(count => {
      this.newVisitorCount = count;
    });
    this.visitorService.approvedVisitors$.subscribe(count => this.approvedVisitorsCount = count);
    this.visitorService.chairmanNotifications$.subscribe(count => this.chairmanNotificationCount = count);
    if (this.userRole === 'front_office') {
      this.getFrontOfficeNotifications();
    } else if (this.userRole === 'security') {
      this.getApprovedVisitors();
    } else if (this.userRole === 'approveadmin') {
      this.getApproveAdminNotifications();
    } else if (this.userRole === 'chairman') {
      this.getChairmanNotifications();
    }
    // Set interval to refresh visitors list every 30 seconds
    this.intervalId = setInterval(() => {
      if (this.userRole === 'front_office') {
        this.getFrontOfficeNotifications();
      } else if (this.userRole === 'security') {
        this.getApprovedVisitors();
      } else if (this.userRole === 'approveadmin') {
        this.getApproveAdminNotifications();
      }else if (this.userRole === 'chairman') {
        this.getChairmanNotifications();
      }
    }, 1000); // 30 seconds
  }

  ngOnDestroy(): void {
    // Clear interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  isUserProfileVisible = false;
  showUserProfile(): void {
    this.isUserProfileVisible = !this.isUserProfileVisible;
  }


  toggleUserProfile() {
    this.isUserProfileVisible = !this.isUserProfileVisible;
  }
  handleBadgeClick() {
    if (this.newVisitorCount > 0 && this.userRole === 'front_office') {
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) {
        this.getRecentVisitors();
      }
    }
  }

  handleApprovedBadgeClick() {
    if (this.approvedVisitorsCount > 0 && this.userRole === 'security') {
      this.isApprovedDropdownVisible = !this.isApprovedDropdownVisible;
      if (this.isApprovedDropdownVisible) {
        this.getApprovedVisitors();
      }
    }
  }

  getRecentVisitors() {
    this.visitorService.getVisitors().subscribe(
      data => {
        const readVisitorIds = JSON.parse(localStorage.getItem('readVisitorIds') || '[]');
        this.recentVisitors = data.filter(visitor => 
          visitor.select_employee !== 'Chairman' && !readVisitorIds.includes(visitor.visitor_pass_no)
        );
        this.newVisitorCount = this.recentVisitors.length; // Update badge count based on filtered visitors
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching visitors:', error);
      }
    );
  }

  getApprovedVisitors() {
    this.visitorService.getVisitors().subscribe(
      data => {
        const readApprovedVisitorIds = JSON.parse(localStorage.getItem('readApprovedVisitorIds') || '[]');
        this.approvedVisitors = data.filter(visitor => visitor.is_approved && !readApprovedVisitorIds.includes(visitor.visitor_pass_no));
        this.approvedVisitorsCount = this.approvedVisitors.length; // Update badge count based on filtered approved visitors
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching approved visitors:', error);
      }
    );
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  toggleApprovedDropdown() {
    this.isApprovedDropdownVisible = !this.isApprovedDropdownVisible;
  }

  resetBadge() {
    this.newVisitorCount = 0;
    this.showVerificationMessage = false;
    this.visitorService.resetNewVisitors();
  }

  resetApprovedBadge() {
    this.approvedVisitorsCount = 0;
    this.visitorService.resetApprovedVisitors();
  }

  markAllAsRead(visitor: Visitor) {
    const readVisitorIds = JSON.parse(localStorage.getItem('readVisitorIds') || '[]');
    if (!readVisitorIds.includes(visitor.visitor_pass_no)) {
      readVisitorIds.push(visitor.visitor_pass_no);
      localStorage.setItem('readVisitorIds', JSON.stringify(readVisitorIds));
    }
    this.recentVisitors = this.recentVisitors.filter(v => v.visitor_pass_no !== visitor.visitor_pass_no);
    this.newVisitorCount = this.recentVisitors.length;
    if (this.newVisitorCount === 0) {
      this.resetBadge();
    }
  }

  markAllApprovedAsRead() {
    this.approvedVisitors = [];
    this.resetApprovedBadge();
    localStorage.setItem('readApprovedVisitorIds', JSON.stringify([]));
  }

  markAsRead(visitor: Visitor) {
    const readVisitorIds = JSON.parse(localStorage.getItem('readVisitorIds') || '[]');
    if (!readVisitorIds.includes(visitor.visitor_pass_no)) {
      readVisitorIds.push(visitor.visitor_pass_no);
      localStorage.setItem('readVisitorIds', JSON.stringify(readVisitorIds));
    }
    this.recentVisitors = this.recentVisitors.filter(v => v.visitor_pass_no !== visitor.visitor_pass_no);
    this.newVisitorCount = this.recentVisitors.length;
    if (this.newVisitorCount === 0) {
      this.resetBadge();
    }
  }

  markApprovedAsRead(visitor: Visitor) {
    const readApprovedVisitorIds = JSON.parse(localStorage.getItem('readApprovedVisitorIds') || '[]');
    if (!readApprovedVisitorIds.includes(visitor.visitor_pass_no)) {
      readApprovedVisitorIds.push(visitor.visitor_pass_no);
      localStorage.setItem('readApprovedVisitorIds', JSON.stringify(readApprovedVisitorIds));
    }
    this.approvedVisitors = this.approvedVisitors.filter(v => v.visitor_pass_no !== visitor.visitor_pass_no);
    this.approvedVisitorsCount = this.approvedVisitors.length;
    if (this.approvedVisitorsCount === 0) {
      this.resetApprovedBadge();
    }
  }
  toggleChairmanDropdown() {
    this.displayChairmanNotificationDialog = !this.displayChairmanNotificationDialog;
  }


  getChairmanNotifications() {
    this.visitorService.getVisitors().subscribe(
      data => {
        const readChairmanNotificationIds = JSON.parse(localStorage.getItem('readChairmanNotificationIds') || '[]');
        this.chairmanNotifications = data.filter(visitor =>
          visitor.select_employee === 'Chairman' &&
          !readChairmanNotificationIds.includes(visitor.visitor_pass_no)
        );
        this.chairmanNotificationCount = this.chairmanNotifications.length;
        if (this.chairmanNotificationCount > 0) {
          this.displayChairmanNotificationDialog = true;
        }
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching chairman notifications:', error);
      }
    );
  }

  markChairmanNotificationAsRead(visitor: Visitor) {
    const readChairmanNotificationIds = JSON.parse(localStorage.getItem('readChairmanNotificationIds') || '[]');
    if (!readChairmanNotificationIds.includes(visitor.visitor_pass_no)) {
      readChairmanNotificationIds.push(visitor.visitor_pass_no);
      localStorage.setItem('readChairmanNotificationIds', JSON.stringify(readChairmanNotificationIds));
    }
    this.chairmanNotifications = this.chairmanNotifications.filter(v => v.visitor_pass_no !== visitor.visitor_pass_no);
    this.chairmanNotificationCount = this.chairmanNotifications.length;
    if (this.chairmanNotificationCount === 0) {
      this.resetChairmanBadge();
    }
  }

  resetChairmanBadge() {
    this.chairmanNotificationCount = 0;
    this.visitorService.resetChairmanNotifications();
  }


  // Method to verify a chairman notification
verifyChairmanNotification(visitor: Visitor) {
  visitor.is_verified = true; // Assuming `is_verified` field is used for verification
  this.visitorService.updateVisitor(Number(visitor.visitor_pass_no), this.createFormData(visitor)).subscribe(
    (response) => {
      console.log('Chairman notification verified successfully:', response);
      this.markChairmanNotificationAsRead(visitor); // Mark as read after verification
    },
    (error) => {
      console.error('Error verifying chairman notification:', error);
    }
  );
}

// Helper method to create FormData for the update
createFormData(visitor: Visitor): FormData {
  const formData = new FormData();
  formData.append('verified', visitor.is_verified ? 'true' : 'false');
  formData.append('Approved', visitor.is_approved ? 'true' : 'false');
  Object.entries(visitor).forEach(([key, value]) => {
    if (value !== null && key !== 'visitor_photo' && key !== 'id_proof_photo') {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value as any);
      }
    }
  });
  return formData;
}

toggleFrontOfficeDropdown() {
  this.displayFrontOfficeNotificationDialog = !this.displayFrontOfficeNotificationDialog;
}

getFrontOfficeNotifications() {
  this.visitorService.getVisitors().subscribe(
    data => {
      const readFrontOfficeNotificationIds = JSON.parse(localStorage.getItem('readFrontOfficeNotificationIds') || '[]');
      this.frontOfficeNotifications = data.filter(visitor =>
        visitor.select_employee !== 'Chairman' && // Ensure the notification is for non-chairman
        !readFrontOfficeNotificationIds.includes(visitor.visitor_pass_no)
      );
      this.frontOfficeNotificationCount = this.frontOfficeNotifications.length;
      if (this.frontOfficeNotificationCount > 0) {
        this.displayFrontOfficeNotificationDialog = true;
      }
      this.cdr.detectChanges();
    },
    error => {
      console.error('Error fetching front office notifications:', error);
    }
  );
}

markFrontOfficeNotificationAsRead(visitor: Visitor) {
  const readFrontOfficeNotificationIds = JSON.parse(localStorage.getItem('readFrontOfficeNotificationIds') || '[]');
  if (!readFrontOfficeNotificationIds.includes(visitor.visitor_pass_no)) {
    readFrontOfficeNotificationIds.push(visitor.visitor_pass_no);
    localStorage.setItem('readFrontOfficeNotificationIds', JSON.stringify(readFrontOfficeNotificationIds));
  }
  this.frontOfficeNotifications = this.frontOfficeNotifications.filter(v => v.visitor_pass_no !== visitor.visitor_pass_no);
  this.frontOfficeNotificationCount = this.frontOfficeNotifications.length;
  if (this.frontOfficeNotificationCount === 0) {
    this.resetFrontOfficeBadge();
  }
}

resetFrontOfficeBadge() {
  this.frontOfficeNotificationCount = 0;
  this.visitorService.resetFrontOfficeNotifications();
}

verifyFrontOfficeNotification(visitor: Visitor) {
  visitor.is_verified = true; // Assuming `is_verified` field is used for verification
  this.visitorService.updateVisitor(Number(visitor.visitor_pass_no), this.createFormData(visitor)).subscribe(
    (response) => {
      console.log('Front office notification verified successfully:', response);
      this.markFrontOfficeNotificationAsRead(visitor); // Mark as read after verification
    },
    (error) => {
      console.error('Error verifying front office notification:', error);
    }
  );
}



approveAdminNotificationCount: number = 0;
approveAdminNotifications: Visitor[] = [];
displayApproveAdminNotificationDialog: boolean = false;

// Other existing methods...

toggleApproveAdminDropdown() {
  this.displayApproveAdminNotificationDialog = !this.displayApproveAdminNotificationDialog;
}

getApproveAdminNotifications() {
  this.visitorService.getVisitors().subscribe(
    data => {
      const readApproveAdminNotificationIds = JSON.parse(localStorage.getItem('readApproveAdminNotificationIds') || '[]');
      this.approveAdminNotifications = data.filter(visitor =>
        
        !readApproveAdminNotificationIds.includes(visitor.visitor_pass_no)
      );
      this.approveAdminNotificationCount = this.approveAdminNotifications.length;
      if (this.approveAdminNotificationCount > 0) {
        this.displayApproveAdminNotificationDialog = true;
      }
      this.cdr.detectChanges();
    },
    error => {
      console.error('Error fetching approve admin notifications:', error);
    }
  );
}

markApproveAdminNotificationAsRead(visitor: Visitor) {
  const readApproveAdminNotificationIds = JSON.parse(localStorage.getItem('readApproveAdminNotificationIds') || '[]');
  if (!readApproveAdminNotificationIds.includes(visitor.visitor_pass_no)) {
    readApproveAdminNotificationIds.push(visitor.visitor_pass_no);
    localStorage.setItem('readApproveAdminNotificationIds', JSON.stringify(readApproveAdminNotificationIds));
  }
  this.approveAdminNotifications = this.approveAdminNotifications.filter(v => v.visitor_pass_no !== visitor.visitor_pass_no);
  this.approveAdminNotificationCount = this.approveAdminNotifications.length;
  if (this.approveAdminNotificationCount === 0) {
    this.resetApproveAdminBadge();
  }
}

resetApproveAdminBadge() {
  this.approveAdminNotificationCount = 0;
  this.visitorService.resetApproveAdminNotifications();
}

verifyApproveAdminNotification(visitor: Visitor) {
  visitor.is_approved = true; // Assuming `is_approved` field is used for approval
  this.visitorService.updateVisitor(Number(visitor.visitor_pass_no), this.createFormData(visitor)).subscribe(
    (response) => {
      console.log('Approve Admin notification approved successfully:', response);
      this.markApproveAdminNotificationAsRead(visitor); // Mark as read after approval
    },
    (error) => {
      console.error('Error approving approve admin notification:', error);
    }
  );
}

}
