import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { Visitor } from '../visitor';
import { VisitorService } from '../visitor.service';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { User } from '../User';
import { MessageService, SelectItem } from 'primeng/api';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit {
  
  departments = [
    { label: 'Officer Ward', value: 'Officer Ward' },
    { label:'Others',value:'Others'}
    
  ];

  nationalities = [
    { label: 'Indian',value:'Indian'},
    { label: 'American', value: 'American' },
    { label: 'German', value: 'German' }
  ];
  employees = [
    { label: 'Admin', value: 'Admin' },
  ];
  itemCarings = [
    { label: 'Laptop', value: 'Laptop' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Bag', value: 'Bag' }
  ];
  vehicleTypes = [
    { label: 'Car', value: 'Car' },
    { label: 'Bike', value: 'Bike' },
    { label: 'Truck', value: 'Truck' },
    { label: 'Bus', value: 'Bus' },
    { label: 'Other',value: 'Others'}
  ];
  visitorStatusOptions: any[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Blocklist', value: 'Blocklist' },
  ];
  designationOptions: any[] = [
    { label: 'Manager', value: 'Manager' },
    { label:'Others',value:'Others'}
  ];
  areaToVisitOptions: any[] = [
    { label: 'SCHOOL', value: 'SCHOOL' },
    { label: 'PU COLLEGE', value: 'PU COLLEGE' },
    { label:'DEGREE COLLEGE',value:'DEGREE COLLEGE'},
    { label:'ADMIN',value:'ADMIN'},
    
  ];
  
  visitorTypeOptions: any[] = [
    { label: 'DAY PASS ', value: 'DAY PASS ' },
    { label: 'MULTIPLE DAY PASS', value: 'MULTIPLE DAY PASS' },
    // Add more options as needed
  ];
  
  meetingPurposeOptions: any[] = [
    { label: 'PERSONAL', value: 'PERSONAL' },
    { label: ' OFFICIAL', value: ' OFFICIAL' },
    { label: 'AMC VISIT', value: 'AMC VISIT' },
    { label: ' PARENT', value: ' PARENT' },
    { label: ' VENDOR', value: ' VENDOR' },
    { label: 'P&T MEETING', value: 'P&T MEETING' }, 
  ];
  
  idProofOptions: any[] = [
    { label: 'AADHAR', value: 'AADHAR' },
    { label: 'ANY GOVT ID', value: 'ANY GOVT ID' },
    { label: 'DRIVING LICENSE', value: 'DRIVING LICENSE' },
    { label: 'PAN', value: 'PAN' },
    { label: 'PASSPORT', value: 'PASSPORT' },
    { label: 'VOTER ID', value: 'VOTER ID' },
   
  ];
  
 
 
  visitorInfo: any;

  visitorForm!: FormGroup;
  formSubmitted = false;
  selectedItemCaring: string | null = null;
  selectedDepartment: string = '';
  selectedNationality: string = '';
  
    // Image fields
  visitorPhoto: string | null = null;
  idProofPhoto: string | null = null;

  users: User[] = [];
  selectedEmployeeId: number | null = null;  // Initially, no employee is selected

  visitors: Visitor[] = [];
  triggerVisitorObservable = new Subject<void>();
  triggerIdObservable = new Subject<void>();
  showVisitorWebcam = true;
  showIdWebcam = true;
  allowCameraSwitch = true;
  nextWebcamObservable = new Subject<boolean>();
  videoOptions: MediaTrackConstraints = {};
  visitorId: number | null = null;  // Track visitor ID
  isUpdateMode = false;  // Track whether we are updating an existing visitor

  currentVisitorPassNo: number = 0; // Variable to track the current visitor pass number

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
     private visitorService: VisitorService,private router: Router,private userService: UserService) { }

  ngOnInit(): void {
    this.visitorService.getVisitors().subscribe(visitors => {
     
      this.loadEmployees();
      
    });
    
  
  
    this.getNextVisitorPassNo(); // Fetch initial visitor pass number
    const defaultVisitorType = this.visitorTypeOptions[0].value;
    const defaultVisitorStatus= this.visitorStatusOptions[0].value;
    const currentDate = new Date();
    this.visitorForm = this.fb.group({
      searchValue: [''],
      visitor_pass_no: [{ value: '', disabled: true }],
      badge_id: ['', Validators.required], // Add validators for badge_id
      visitor_name: ['', [Validators.required, Validators.minLength(3)]],
      mobile_no: ['', Validators.required], // Add validators for mobile_no
      email: ['', [ Validators.email]], // Add validators for email
      designation: [''],
      department: [''],
      nationality: [''],
      total_visitor: ['', Validators.required], // Add validators for total_visitor
      company_name: ['', Validators.required], // Add validators for company_name
      company_contact_no: [''], // Add validators for company_contact_no
      company_address: [''],
      area_to_visit: ['', Validators.required], // Add validators for area_to_visit
      type_of_visitor: [defaultVisitorType, Validators.required], // Add validators for type_of_visitor
      meeting_purpose: ['', Validators.required], // Add validators for meeting_purpose
      id_proof: [''],
      id_proof_number: [''],
      valid_pass_from: [currentDate, Validators.required],
      valid_pass_to: [currentDate, Validators.required],
      visitor_status: [defaultVisitorStatus, Validators.required], // Add validators for visitor_status
      expecting_stay_hours: [8],
      select_employee: ['', Validators.required], // Add validators for select_employee
      host_department: [''],
      host_email_id: [''],
      host_contact_details: [''],
      item_caring: [''],
      make_serial_no: [''],
      vehicle_type: [''],
      vehicle_number: ['']
      
      
    });
    
  

  
  }

   
  
    
    
    
  getNextVisitorPassNo() {
    this.visitorService.getNextVisitorPassNo().subscribe(
      (nextPassNo: any) => {
        this.currentVisitorPassNo = nextPassNo.nextPassNo; // Set current pass number
        this.updateVisitorPassNo(); // Update form with current pass number
      },
      (error) => {
        console.error('Failed to fetch next visitor pass number:', error);
      }
    );
  }

  updateVisitorPassNo() {
    const newPassNo = this.currentVisitorPassNo++;
    this.visitorForm.patchValue({
      visitor_pass_no: newPassNo.toString().padStart(4, '0') // Format pass number
    });
  }

  
  


 
 

  
  submitForm() {
    if (this.visitorForm.valid) {
      const visitorData: Visitor = {
        ...this.visitorForm.value,
        valid_pass_from: this.formatDate(this.visitorForm.value.valid_pass_from),
        valid_pass_to: this.formatDate(this.visitorForm.value.valid_pass_to),
        visitor_photo: this.dataURLToFile(this.visitorPhoto, 'visitor_photo.png'),
        id_proof_photo: this.dataURLToFile(this.idProofPhoto, 'id_proof_photo.png'),
      };
  
      const formData = new FormData();
      Object.entries(visitorData).forEach(([key, value]) => {
        if (value !== null) {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value);
          }
        } else {
          formData.append(key, ''); // Append an empty string for null values
        }
      });
  
      if (this.isUpdateMode && this.visitorId) {
        this.visitorService.updateVisitor(this.visitorId, formData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Visitor updated successfully!' });
            console.log('Visitor updated successfully:', response);
  
            // Reset check-in time to null and check-out time to null
            this.visitorForm.patchValue({
              check_in_time: null,
              check_out_time: null
            });
  
            this.newVisitor();  // Reset form for new entry
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/visitor']); // Navigate to /visitor route
            });
          },
          
          (error) => {
            this.handleFormError(error);
          }
        );
      } else {
        this.visitorService.addVisitor(formData).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Visitor added successfully!' });
            alert('Visitor added successfully!');
            console.log('Visitor added successfully:', response);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Visitor added successfully!' });
            this.currentVisitorPassNo++;
            this.updateVisitorPassNo();
            this.visitorService.incrementNewVisitors();
            this.visitorForm.reset({
              type_of_visitor: this.visitorTypeOptions[0].value
            });
            this.newVisitor();  // Reset form for new entry
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/visitor']); // Navigate to /visitor route
            });
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 8000 });
            this.handleFormError(error);
          }
        );
      }
    }
  }
  handleFormError(error: any) {
    let errorMessage = 'Invalid Form Details:<br>';
  
    if (error.error) {
      if (typeof error.error === 'object') {
        if (Array.isArray(error.error)) {
          errorMessage += error.error.join('<br>') + '<br>';
        } else {
          for (const [field, messages] of Object.entries(error.error)) {
            errorMessage += `${field}: ${(messages as string[]).join(' ')}<br>`;
          }
        }
      } else if (typeof error.error === 'string') {
        errorMessage += error.error;
      } else {
        errorMessage += 'An unknown error occurred.';
      }
    } else {
      errorMessage += 'An unknown error occurred.';
    }
  
    this.messageService.add({severity: 'error', summary: 'Validation Error', detail: errorMessage});
  }
  
  formatDate(date: any): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }
  
  getPassValidity(validFrom: Date, validTo: Date): number {
    const fromDate = new Date(validFrom);
    const toDate = new Date(validTo);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  handleVisitorPhoto(image: WebcamImage): void {
    if (image) {
        this.visitorPhoto = image.imageAsDataUrl;
    } else {
        this.visitorPhoto = null;
    }
    this.showVisitorWebcam = false;
}

loadEmployees() {
  this.userService.getUsers().subscribe((data: User[]) => {
    this.users = data;
  });
}

selectEmployee(employeeId: number) {
  this.selectedEmployeeId = employeeId;
  const selectedEmployee = this.users.find(user => user.id === employeeId);
  if (selectedEmployee) {
    this.visitorForm.patchValue({
      select_employee: selectedEmployee.name,
      host_department: selectedEmployee.departmentName, // Ensure this matches the serializer field
      host_email_id: selectedEmployee.email_id,
      host_contact_details: selectedEmployee.contact_number
    });
    console.log(selectedEmployee);
  }
}

handleIdProof(image: WebcamImage): void {
    if (image) {
        this.idProofPhoto = image.imageAsDataUrl;
    } else {
        this.idProofPhoto = null;
    }
    this.showIdWebcam = false;
}


  triggerVisitorSnapshot(): void {
    this.triggerVisitorObservable.next();
  }

  triggerIdSnapshot(): void {
    this.triggerIdObservable.next();
  }

  cameraWasSwitched(deviceId: string): void {
    console.log('Active device: ' + deviceId);
  }

  handleInitError(error: WebcamInitError): void {
    console.error(error);
  }

  addItem(selectedItem: any) {
    this.selectedItemCaring = selectedItem;
  }

  dataURLToFile(dataUrl: string | null, filename: string): File | null {
    if (!dataUrl) return null;
    const arr = dataUrl.split(',');
    if (arr.length < 2) {
      console.error('Invalid data URL:', dataUrl);
      return null;
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      console.error('Invalid MIME type in data URL:', dataUrl);
      return null;
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
 
  searchByMobile() {
    const searchValue = this.visitorForm.get('searchValue')?.value;
    if (searchValue) {
      this.visitorService.searchVisitor(searchValue).subscribe(
        (visitor: any) => {
          if (visitor) {
            this.visitorId = Number(visitor.visitor_pass_no);  // Convert to number if necessary
            this.visitorForm.patchValue(visitor);
            this.visitorPhoto = visitor.visitor_photo; // Display existing photos if available
            this.idProofPhoto = visitor.id_proof_photo; // Display existing photos if available
            this.isUpdateMode = true;  // Set update mode
          } else {
            this.messageService.add({ severity: 'error', detail: 'Visitor Not Found' });
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/visitor']);
              });
            }, 2000); // Delay of 2 seconds before refreshing
          }
        },
        (error: any) => {
          console.error('Error searching visitor: ', error);
          this.messageService.add({ severity: 'error', detail: 'Visitor Not Found' });
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/visitor']);
            });
          }, 2000); // Delay of 2 seconds before refreshing
        }
      );
    } else {
      this.messageService.add({ severity: 'error', detail: 'Please enter a value to search' });
    }
  }
  
  
  newVisitor() {
    this.visitorForm.reset();
    this.visitorPhoto = null;
    this.idProofPhoto = null;
    this.visitorId = null;  // Clear visitor ID
    this.isUpdateMode = false;  // Reset update mode
    this.showVisitorWebcam = true;
    this.showIdWebcam = true;
  }
  resetForm() {
    this.visitorForm.reset();
    this.visitorPhoto = null;
    this.idProofPhoto = null;
    this.visitorId = null;  // Clear visitor ID
    this.isUpdateMode = false;  // Reset update mode
    this.showVisitorWebcam = true; // Show the webcam again
    this.idProofPhoto = null;
    this.showIdWebcam = true;
  }
  resetIdproofPhoto(){
    this.idProofPhoto = null;
    this.showIdWebcam = true;
  }
  resetVisitorPhoto(){
    this.visitorPhoto = null;
    this.showVisitorWebcam = true;
  }


}

  