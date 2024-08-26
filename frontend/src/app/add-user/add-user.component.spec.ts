import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

import { AddUserComponent } from './add-user.component';
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
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../app.service';
import { User } from '../User';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let de:DebugElement;
  let el:HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUserComponent],
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
    }).compileComponents();
    
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
 

  it('should call the addUser method', () => {
    fixture.detectChanges();
    spyOn(component,'addUser');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.addUser).toHaveBeenCalledTimes(0);
  });
 

});
