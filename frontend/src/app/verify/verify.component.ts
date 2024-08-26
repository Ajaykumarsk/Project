import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisitorService } from '../visitor.service';
import { Visitor } from '../visitor';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  searchTerm: string = '';
  formGroup: FormGroup;
  visitorPhotoFile: string | null = null;
  idProofPhotoFile: string | null = null;
  intervalId: any;


  constructor(private visitorService: VisitorService,private sharedService: SharedService, private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      checked: [false]
    });
  }

  ngOnInit(): void {
    this.loadVisitors();
  
    // Set interval to refresh visitors list every 5 seconds (5000 milliseconds)
    setInterval(() => {
      this.loadVisitors();
    }, 1000);
  }
  
  loadVisitors(): void {
    this.visitorService.getVisitors().subscribe(
      (data: Visitor[]) => {
        // Filter out visitors where selected_employee is "Chairman"
        this.visitors = data.filter(visitor => visitor.select_employee !== 'Chairman' && !visitor.is_verified);
        this.sortVisitorsByApproval(); // Sort visitors after filtering
        this.filteredVisitors = [...this.visitors]; // Initialize filteredVisitors with all filtered visitors
      },
      (error: any) => {
        console.error('Error fetching visitors:', error);
      }
    );
  }
  

  sortVisitorsByApproval(): void {
    this.visitors.sort((a, b) => {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return dateB - dateA; // Sort by most recent first
    });
  }
  searchVisitors(): void {
    const searchTerm = this.searchTerm.toLowerCase().trim();
    if (!searchTerm) {
      this.filteredVisitors = [...this.visitors]; // Show all visitors if search term is empty
    } else {
      this.filteredVisitors = this.visitors.filter((visitor) =>
        visitor.visitor_name.toLowerCase().includes(searchTerm)
      );
    }
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear the search term
    this.filteredVisitors = [...this.visitors]; // Reset filteredVisitors to display all visitors
  }

  onVerifyToggle(visitor: Visitor): void {
    visitor.is_verified = !visitor.is_verified; // Toggle the verified status
    this.sharedService.triggerRefresh();
    this.updateVisitor(visitor); // Update the visitor in the backend
  }

 
  updateVisitor(visitor: Visitor): void {
    const formData = new FormData();
    
    // Convert visitor_photo to File object if it's a base64 string
    if (this.visitorPhotoFile) {
      formData.append('visitor_photo', this.visitorPhotoFile);
    }
    if (this.idProofPhotoFile) {
      formData.append('id_proof_photo', this.idProofPhotoFile);
    }
    
    // Append other fields from visitor object to FormData
    Object.entries(visitor).forEach(([key, value]) => {
      if (value !== null && key !== 'visitor_photo' && key !== 'id_proof_photo') {
        // Convert date objects to ISO string format before appending
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as any);
        }
      }
    });
    
    formData.append('verified', visitor.is_verified ? 'true' : 'false');
    console.log(`ApprovalComponent: Approving visitor with ID ${visitor.visitor_pass_no}`);
    this.visitorService.updateVisitor(Number(visitor.visitor_pass_no), formData).subscribe(
      (response) => {
        console.log('Visitor updated successfully:', response);
        this.sharedService.triggerRefresh();
        this.loadVisitors();
      },
      (error) => {
        console.error('Error updating visitor:', error);
      }
    );
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
  
  
}
