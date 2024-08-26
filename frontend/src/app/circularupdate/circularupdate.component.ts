import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CircularService } from '../circular.service';
import { MessageService } from 'primeng/api';
import { Circular } from '../circular';

@Component({
  selector: 'app-circularupdate',
  templateUrl: './circularupdate.component.html',
  styleUrls: ['./circularupdate.component.scss'],
  providers: [MessageService]
})
export class CircularupdateComponent implements OnInit {
  updateCircularForm!: FormGroup;
  circularId!: number;
  selectedFile: File | null = null;
  currentCircular: Circular | null = null;
  mediaType: 'image' | 'video' | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private circularService: CircularService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.circularId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.fetchCircularDetails();
  }

  initializeForm(): void {
    this.updateCircularForm = this.fb.group({
      title: ['', Validators.required],
      media: [null]
    });
  }

  fetchCircularDetails(): void {
    this.circularService.getCircular(this.circularId).subscribe(
      (data: Circular) => {
        this.currentCircular = data;
        this.updateCircularForm.patchValue({
          title: data.title,
          media: null
        });
        this.detectMediaType(data.media || '');
      },
      (error) => {
        console.error('Failed to fetch circular details:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch circular details.' });
      }
    );
  }

  detectMediaType(mediaUrl: string): void {
    if (mediaUrl.endsWith('.jpg') || mediaUrl.endsWith('.png')) {
      this.mediaType = 'image';
    } else if (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.avi')) {
      this.mediaType = 'video';
    } else {
      this.mediaType = null;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.detectMediaType(file.name);
    }
  }

  updateCircular(): void {
    if (this.updateCircularForm.valid) {
      const formData = new FormData();
      const title = this.updateCircularForm.get('title')?.value || '';
      formData.append('title', title);

      if (this.selectedFile) {
        formData.append('media', this.selectedFile, this.selectedFile.name);
      }

      this.circularService.updateCircular(this.circularId, formData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Circular updated successfully!' });
          this.router.navigate(['/circular']);
        },
        (error) => {
          console.error('Failed to update circular:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update circular.' });
        }
      );
    }
  }
}
