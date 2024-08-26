import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CircularService } from '../circular.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Circular } from '../circular';

@Component({
  selector: 'app-circular',
  templateUrl: './circular.component.html',
  styleUrls: ['./circular.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CircularComponent implements OnInit {
  circularForm!: FormGroup;
  displayDialog: boolean = false;
  circulars: Circular[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private circularService: CircularService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchCirculars();
  }

  initializeForm(): void {
    this.circularForm = this.fb.group({
      title: ['', Validators.required],
      media: [null]
    });
  }

  showDialog(): void {
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.circularForm.reset();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addCircular(): void {
    if (this.circularForm.valid) {
      const formData = new FormData();
      Object.entries(this.circularForm.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      if (this.selectedFile) {
        formData.append('media', this.selectedFile, this.selectedFile.name);
      }

      this.circularService.addCircular(formData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Circular added successfully!' });
          this.fetchCirculars();
          this.hideDialog();
        },
        (error) => {
          console.error('Failed to add circular:', error);
          alert('Failed to add circular. Please try again.');
        }
      );
    }
  }

  fetchCirculars(): void {
    this.circularService.getCirculars().subscribe(
      (data: Circular[]) => {
        this.circulars = data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      },
      (error) => {
        console.error('Failed to fetch circulars:', error);
        alert('Failed to fetch circulars. Please try again.');
      }
    );
  }

  deleteCircular(id: number): void {
    this.circularService.deleteCircular(id).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Circular deleted successfully!' });
        this.fetchCirculars();
      },
      (error) => {
        console.error('Failed to delete circular:', error);
        alert('Failed to delete circular. Please try again.');
      }
    );
  }

  confirm(event: Event, id: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please confirm to delete the record',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined p-button-sm',
      acceptButtonStyleClass: 'p-button-sm',
      accept: () => {
        this.deleteCircular(id);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  }

  isVideo(fileName: string): boolean {
    return /\.(mp4|mov)$/i.test(fileName);
  }
}
