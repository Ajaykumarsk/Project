import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { UpdateDepartmentComponent } from './update-department.component';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

describe('UpdateDepartmentComponent', () => {
  let component: UpdateDepartmentComponent;
  let fixture: ComponentFixture<UpdateDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateDepartmentComponent],
      imports: [
        HttpClientModule,
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        FloatLabelModule,
        PasswordModule,
        MessagesModule,
        TableModule,
        PaginatorModule,
        ConfirmDialogModule,
        ToastModule,
        ConfirmPopupModule,
        RadioButtonModule,
        DropdownModule,
        DialogModule,
        FieldsetModule,
        CalendarModule
      ],
      providers: [
        DatePipe,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'example-id'}) } } }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
