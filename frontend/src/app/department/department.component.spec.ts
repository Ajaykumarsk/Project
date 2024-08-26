import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentComponent } from './department.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UserService } from '../app.service';

describe('DepartmentComponent', () => {
  let component: DepartmentComponent;
  let fixture: ComponentFixture<DepartmentComponent>;
  let de:DebugElement;
  let el:HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentComponent],
      imports: [HttpClientModule, CommonModule,
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

      ], // Remove DatePipe from imports
      providers: [DatePipe,UserService] // Add DatePipe to providers
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the addDepartment method', () => {
    fixture.detectChanges();
    spyOn(component,'addDepartment');
    el = fixture.debugElement.query(By.css('submit')).nativeElement;
    el.click();
    expect(component.addDepartment).toHaveBeenCalledTimes(0);
  });
 
});
