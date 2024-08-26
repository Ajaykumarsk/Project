import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VisitorComponent } from './visitor/visitor.component';
import { VerifyComponent } from './verify/verify.component';
import { ApprovalComponent } from './approval/approval.component';
import { CheckInOutComponent } from './check-in-out/check-in-out.component';
import { RecordsComponent } from './records/records.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DepartmentComponent } from './department/department.component';
import { UpdateDepartmentComponent } from './update-department/update-department.component';
import { UpdateLocationComponent } from './update-location/update-location.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmpolyeeDashboardComponent } from './empolyee-dashboard/empolyee-dashboard.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { NotAuthorizedComponentComponent } from './not-authorized-component/not-authorized-component.component';
import { EmployeeTypeComponent } from './employee-type/employee-type.component';
import { CompanyComponent } from './company/company.component';
import { UpdateCompanyComponent } from './update-company/update-company.component';
import { UpdateEmployeetypeComponent } from './update-employeetype/update-employeetype.component';
import { CanteenfoodconsummtionComponent } from './canteenfoodconsummtion/canteenfoodconsummtion.component';
import { UpdatecanteenfoodconsummtionComponent } from './updatecanteenfoodconsummtion/updatecanteenfoodconsummtion.component';
import { CanteenfoodorderComponent } from './canteenfoodorder/canteenfoodorder.component';
import { UpdatecanteenfoodorderComponent } from './updatecanteenfoodorder/updatecanteenfoodorder.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CatererComponent } from './caterer/caterer.component';
import { UpdateCatererComponent } from './update-caterer/update-caterer.component';
import { CanteenfoodrateComponent } from './canteenfoodrate/canteenfoodrate.component';
import { UpdateCanteenfoodrateComponent } from './update-canteenfoodrate/update-canteenfoodrate.component';
import { CanteenfoodmenuComponent } from './canteenfoodmenu/canteenfoodmenu.component';
import { UpdatecanteenfoodmenuComponent } from './updatecanteenfoodmenu/updatecanteenfoodmenu.component';
import { FoodmenuComponent } from './foodmenu/foodmenu.component';
import { GlideSliderComponent } from './glide-slider/glide-slider.component';
import { CaterermenuComponent } from './caterermenu/caterermenu.component';
import { VisitorstatusComponent } from './visitorstatus/visitorstatus.component';
import { ChairmanverifyComponent } from './chairmanverify/chairmanverify.component';
import { CircularComponent } from './circular/circular.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profile', component: UserProfileComponent },
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin','front_office','security','chairman','approveadmin'] }},
      { path: 'visitor', component: VisitorComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin','security'] } },
      { path: 'verify', component: VerifyComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin','front_office'] }},
      { path: 'approval', component: ApprovalComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin','approveadmin'] } },
      { path: 'checkInOut', component: CheckInOutComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin','security'] } },
      { path: 'records', component: RecordsComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] } },
      { path: 'employeedashboard', component: EmpolyeeDashboardComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'user', component: ViewUserComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] } },
      { path: 'adduser', component: AddUserComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'department', component: DepartmentComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'location', component: LocationComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatedepartment/:id', component: UpdateDepartmentComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] } },
      { path: 'updatelocation/:id', component: UpdateLocationComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updateuser/:id', component: UpdateUserComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'employeetypes',component:EmployeeTypeComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecemployeetypes/:id', component: UpdateEmployeetypeComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'company',component:CompanyComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecompany/:id', component: UpdateCompanyComponent , canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'canteenfoodconsummationtiming',component:CanteenfoodconsummtionComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecanteenfoodconsummationtiming/:id',component:UpdatecanteenfoodconsummtionComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'canteenfoodordertiming',component:CanteenfoodorderComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecanteenfoodordertiming/:id',component:UpdatecanteenfoodorderComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'caterer',component:CatererComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecaterer/:id',component:UpdateCatererComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'canteenfoodrate',component:CanteenfoodrateComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecanteenfoodrate/:id',component:UpdateCanteenfoodrateComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'canteenfoodmenu',component:CanteenfoodmenuComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'updatecanteenfoodmenu/:id',component:UpdatecanteenfoodmenuComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'foodmenu',component:FoodmenuComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'slide',component:GlideSliderComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'caterermenu',component:CaterermenuComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['admin'] }},
      { path: 'visitorstatus',component:VisitorstatusComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['chairman','admin','security','front_office','approveadmin'] }},
      { path: 'chairmanverify',component:ChairmanverifyComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['chairman','admin'] }},   
      { path: 'circular',component:CircularComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['chairman','admin'] }},
      { path: 'updatecircular/:id',component:CircularComponent, canActivate: [AuthGuard,RoleGuard], data: { roles: ['chairman','admin'] }},
    ]
  },
  { path:'unauth',component:NotAuthorizedComponentComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
