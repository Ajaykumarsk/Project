import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisitorService } from '../visitor.service';
import { Visitor } from '../visitor';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-check-in-out',
  templateUrl: './check-in-out.component.html',
  styleUrls: ['./check-in-out.component.scss']
})
export class CheckInOutComponent implements OnInit {
  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  searchTerm: string = '';
  formGroup: FormGroup;
  visitorPhotoFile: string | null = null;
  idProofPhotoFile: string | null = null;
  private refreshSubscription!: Subscription;
  intervalId: any;

  constructor(
    private visitorService: VisitorService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      checked: [false]
    });
  }

  ngOnInit(): void {
    
    this.loadVisitors();
    
    this.intervalId = setInterval(() => {
      this.loadVisitors();
    }, 1000);
  }

 

  loadVisitors(): void {
    
    this.visitorService.getVisitors().subscribe(
      (data: Visitor[]) => {
        this.visitors = data.filter(visitor => visitor.is_verified && visitor.is_approved &&
          !visitor.check_out_time);
        this.sortVisitorsByApproval();
        this.filteredVisitors = [...this.visitors]; 
        
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

  onCheckInToggle(visitor: Visitor): void {
    if (visitor.is_verified && visitor.is_approved) {
      visitor.check_in_time = new Date(); // Set check-in time as Date object
      console.log('Check-in time:', visitor.check_in_time);
      this.updateVisitor(visitor);
    } else {
      console.error('Visitor is not verified or approved.');
    }
  }

  onCheckOutToggle(visitor: Visitor): void {
    if (visitor.is_verified && visitor.is_approved) {
      if (visitor.check_in_time) {
        visitor.check_out_time = new Date(); // Set check-out time as Date object
        console.log('Check-out time:', visitor.check_out_time);
        this.updateVisitor(visitor);
      } else {
        console.error('Visitor needs to check in first.');
        alert('Visitor needs to check in first.');
      }
    } else {
      console.error('Visitor is not verified or approved.');
    }
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

    formData.append('checkin', visitor.check_in_time ? 'true' : 'false');
    formData.append('checkout', visitor.check_out_time ? 'true' : 'false');

    this.visitorService.updateVisitor(Number(visitor.visitor_pass_no), formData).subscribe(
      (response) => {
        console.log('Visitor updated successfully:', response);
        this.loadVisitors();
      },
      (error) => {
        console.error('Error updating visitor:', error);
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
  printVisitorCard(visitor: any) {
    let printContents = `
    <div class="card">
       <div class="header">
  <img src="assets/layout/images/school.png" alt="Logo" class="logo left-logo">
  <div class="address">
    <p>Hennur - Bagalur Main Road,</p>
    <p>Kannur Post, Bangalore - 562149</p>
  </div>
</div>
        <div class="content-wrapper">
            <div class="visitor-info">
                <p>Visitor Pass ${visitor.visitor_pass_no}</p>
                <p>Name: ${visitor.visitor_name}</p>
                <p>Visitor Type: ${visitor.type_of_visitor}</p>
                <p>Company Name: ${visitor.company_name}</p>
                <p>Whom to meet: ${visitor.select_employee}</p>
                <p>Visiting purpose: ${visitor.meeting_purpose}</p>
                 <p>Valid From & To: ${visitor.valid_pass_from ? new Date(visitor.valid_pass_from).toLocaleDateString() : 'No Data'} | ${visitor.valid_pass_to ? new Date(visitor.valid_pass_to).toLocaleDateString() : 'No Data'}</p>
                <p>Check In: ${visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleString() : 'No Data'}</p>
                <p>Check Out: ${visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleString() : 'No Data'}</p>

                <p>Approved: ${visitor.is_approved ? 'Yes' : 'No'}</p>
                <p>Verified: ${visitor.is_verified ? 'Yes' : 'No'}</p>
              
                <p class="warning">${!visitor.is_verified ? 'Visitor is not verified.' : ''}</p>
                <p class="warning">${!visitor.is_approved ? 'Visitor is not approved.' : ''}</p>
            </div>
  
            <div class="field">
                <div class="webcam-section">
                    <div class="webcam-section-wrapper">
                        <div class="webcam-container">
                            <label for="visitorPhoto">Visitor</label>
                            <div class="webcam-frame">
                                <img src="${visitor.visitor_photo}" alt="Visitor Photo" class="captured-image"/>
                                <p ${visitor.visitor_photo ? 'hidden' : ''}>No visitor photo available</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="webcam-section">
                    <div class="webcam-section-wrapper">
                        <div class="webcam-container">
                            <label for="idProofPhoto">ID Proof </label>
                            <div class="webcam-frame">
                                <img src="${visitor.id_proof_photo}" alt="ID Proof Photo" class="captured-image"/>
                                <p ${visitor.id_proof_photo ? 'hidden' : ''}>No ID proof photo available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
  
    let styles = `
    <style>
     @page {
            size: 90mm 90mm; /* Set the size of the printed page */
            margin: 0; /* Ensure no default margins */
        }
        .card {
            width: 80mm;
            height: 80mm;
            border: 1px solid #007BFF;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 20px;
            font-size: 10px;
        }

         .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
      }

      .header .logo {
          width: 70px;
          height: 50px;
      }
    
      .header h5 {
          margin: 0;
          font-size: 1.2rem;
          text-align: center;
          flex-grow: 1;
      }
.address {
  margin-center: 20px; /* Adjust spacing between logo and address */
}

.address p {
 text-align: center;
  font-size: 12px; /* Increase font size of address */
  margin: 5px 0; /* Add space between address lines */
}
        .card h5 {
            margin: 0;
            font-size: 1.2rem;
            text-align: center;
        }

        .content-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .visitor-info {
            flex: 1;
            text-align: left;
        }

        .visitor-info p {
            margin-bottom: 5px;
        }

        .field {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 10px;
        }

        .webcam-section-wrapper {
            border: 1px solid #007BFF;
            border-radius: 10px;
            padding:5px;
            margin-bottom: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .webcam-section {
            display: flex;
            justify-content: space-evenly;
        }

        .webcam-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .webcam-container label {
            margin-bottom: 10px;
            font-weight: bold;
            text-align: center;
        }

        .webcam-frame {
            position: relative;
            width: 60px; /* Smaller size for the photo */
            height: 50px; /* Smaller size for the photo */
            overflow: hidden;
            border: 1px solid #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
        }

        .webcam-frame img.captured-image {
            width: 100%;
            height: 100%;
            object-fit: cover;    
        }

        .warning {
            color: red;
            font-weight: bold;
            text-align: left;
        }
    </style>`;
  
    let popupWindow: Window | null = window.open('', '_blank', 'width=800,height=600');
    if (popupWindow) {
        popupWindow.document.open();
        popupWindow.document.write(`<html><head><title>Print Visitor Card</title>${styles}</head><body onload="window.print();window.close()">${printContents}</body></html>`);
        popupWindow.document.close();
    } else {
        console.error('Failed to open popup window.');
    }
  }
  
  
  

  
}  
