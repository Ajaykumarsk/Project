import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { ChartModule } from 'primeng/chart';
import { VisitorComponent } from './visitor/visitor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputIconModule } from 'primeng/inputicon';

import { InputTextModule } from 'primeng/inputtext';
import { VerifyComponent } from './verify/verify.component';
import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PasswordModule } from 'primeng/password';
import { ApprovalComponent } from './approval/approval.component';
import { CheckInOutComponent } from './check-in-out/check-in-out.component';
import { RecordsComponent } from './records/records.component';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AddUserComponent } from './add-user/add-user.component';
import { DepartmentComponent } from './department/department.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UpdateDepartmentComponent } from './update-department/update-department.component';
import { UpdateLocationComponent } from './update-location/update-location.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { EmpolyeeDashboardComponent } from './empolyee-dashboard/empolyee-dashboard.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EmployeeTypeComponent } from './employee-type/employee-type.component';
import { CompanyComponent } from './company/company.component';
import { UpdateCompanyComponent } from './update-company/update-company.component';
import { UpdateEmployeetypeComponent } from './update-employeetype/update-employeetype.component';
import { CanteenfoodconsummtionComponent } from './canteenfoodconsummtion/canteenfoodconsummtion.component';
import { UpdatecanteenfoodconsummtionComponent } from './updatecanteenfoodconsummtion/updatecanteenfoodconsummtion.component';
import { CanteenfoodorderComponent } from './canteenfoodorder/canteenfoodorder.component';
import { UpdatecanteenfoodorderComponent } from './updatecanteenfoodorder/updatecanteenfoodorder.component';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { WebcamModule } from 'ngx-webcam';
import { SharedService } from './shared.service';
import { CatererComponent } from './caterer/caterer.component';
import { UpdateCatererComponent } from './update-caterer/update-caterer.component';
import { CanteenfoodrateComponent } from './canteenfoodrate/canteenfoodrate.component';
import { UpdateCanteenfoodrateComponent } from './update-canteenfoodrate/update-canteenfoodrate.component';
import { CanteenfoodmenuComponent } from './canteenfoodmenu/canteenfoodmenu.component';
import { UpdatecanteenfoodmenuComponent } from './updatecanteenfoodmenu/updatecanteenfoodmenu.component';
import { FileUploadModule } from 'primeng/fileupload';
import { FoodmenuComponent } from './foodmenu/foodmenu.component';
import { GlideSliderComponent } from './glide-slider/glide-slider.component';
import { CarouselModule } from 'primeng/carousel';
import { CaterermenuComponent } from './caterermenu/caterermenu.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { VisitorstatusComponent } from './visitorstatus/visitorstatus.component';
import { ChairmanverifyComponent } from './chairmanverify/chairmanverify.component';
import { CircularComponent } from './circular/circular.component';
import { CircularupdateComponent } from './circularupdate/circularupdate.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    VisitorComponent,
    VerifyComponent,
    ApprovalComponent,
    CheckInOutComponent,
    RecordsComponent,
    ViewUserComponent,
    AddUserComponent,
    DepartmentComponent,
    LocationComponent,
    RegisterComponent,
    UpdateUserComponent,
    UpdateDepartmentComponent,
    UpdateLocationComponent,
    LoginComponent,
    EmpolyeeDashboardComponent,
    EmployeeTypeComponent,
    CompanyComponent,
    UpdateCompanyComponent,
    UpdateEmployeetypeComponent,
    CanteenfoodconsummtionComponent,
    UpdatecanteenfoodconsummtionComponent,
    CanteenfoodorderComponent,
    UpdatecanteenfoodorderComponent,
    CatererComponent,
    UpdateCatererComponent,
    CanteenfoodrateComponent,
    UpdateCanteenfoodrateComponent,
    CanteenfoodmenuComponent,
    UpdatecanteenfoodmenuComponent,
    FoodmenuComponent,
    GlideSliderComponent,
    CaterermenuComponent,
    VisitorstatusComponent,
    ChairmanverifyComponent,
    CircularComponent,
    CircularupdateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, 
    AppLayoutModule,
    ChartModule,
    ReactiveFormsModule,
    FormsModule,
    IconFieldModule,
    DropdownModule,
    FloatLabelModule,
    FieldsetModule,
    ButtonModule,
    CalendarModule,
    InputIconModule,
    WebcamModule,
    AvatarModule,
    AvatarGroupModule,
    InputTextModule,
    StepperModule,
    ToggleButtonModule,
    PasswordModule,
    TableModule,
    PaginatorModule,
    CarouselModule,
    PanelMenuModule,
    ToastModule,
    BadgeModule,
    ConfirmPopupModule,
    MessagesModule,
    DialogModule,
    RadioButtonModule,
    MultiSelectModule,
    FileUploadModule


  ],
  providers: [
    provideClientHydration(),
    MessageService,
    DatePipe ,
    SharedService
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
