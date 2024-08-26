import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { User } from '../User';
import { Paginator } from 'primeng/paginator';
import { ConfirmationService, MessageService, FilterService, FilterMatchMode, SelectItem } from 'primeng/api';
import { DepartmentService } from '../department.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  providers: [ConfirmationService, MessageService, FilterService]
})
export class ViewUserComponent implements OnInit {
  users: User[] = [];
  departments: any[] = [];
  locations: any[] = [];
  searchQuery: string = '';
  genderOptions: any[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];
  searchId: string = '';
  searchName: string = '';
  searchEmail: string = '';
  searchGender: string = '';
  searchDepartment: string = '';
  searchLocation: string = '';
  searchDateOfJoining: string = '';
  selectedNameFilter: string = 'contains';
  pageIndex: number = 0;
  pageSize: number = 10;
  totalUsers: number = 0;
  maleUsers: number = 0;
  femaleUsers: number = 0;
  @ViewChild('paginator') paginator!: Paginator;
  filterValues: any = {};
  matchModeOptions: SelectItem[] | undefined;

  constructor(
    private userService: UserService,
    private deptService: DepartmentService,
    private locService: LocationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.registerCustomFilters();
    this.loadUsers();
    this.loadDepartments();
    this.loadLocations();
    this.getUsersCount();
    this.matchModeOptions = [
      { label: 'Custom Equals', value: 'custom-equals' },
      { label: 'Starts With', value: FilterMatchMode.STARTS_WITH },
      { label: 'Contains', value: FilterMatchMode.CONTAINS },
      { label: 'Custom Contains Case Insensitive', value: 'custom-contains-ci' }
    ];
  }

  registerCustomFilters() {
    this.filterService.register('custom-equals', (value: any, filter: any): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.toString() === filter.toString();
    });

    this.filterService.register('custom-contains-ci', (value: any, filter: any): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      return value.toString().toLowerCase().includes(filter.toString().toLowerCase());
    });
  }

  loadUsers(page: number = this.pageIndex + 1): void {
    const searchQuery = this.constructSearchQuery();
    const queryParams = { search: searchQuery };

    this.userService.getAllUsers(page, this.pageSize, queryParams, this.filterValues).subscribe(data => {
      console.log('API Response:', data);
      this.users = data.results;
      this.totalUsers = data.count || 0; // Update totalUsers from API response
      if (this.paginator) {
        this.paginator.changePage(this.pageIndex); // Update paginator page
      }
    });
  }

  constructSearchQuery(): string {
    let searchQuery = '';
    if (this.searchId) {
      searchQuery += `id:${this.searchId},`;
    }
    if (this.searchName) {
      const nameOperator = this.selectedNameFilter === 'startswith' ? 'istartswith' :
                           this.selectedNameFilter === 'contains' ? 'icontains' :
                           this.selectedNameFilter === 'endswith' ? 'iendswith' : 'icontains';
      searchQuery += `name__${nameOperator}:${this.searchName},`;
    }
    if (searchQuery.endsWith(',')) {
      searchQuery = searchQuery.slice(0, -1);
    }
    return searchQuery;
  }

  loadDepartments(): void {
    this.deptService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  loadLocations(): void {
    this.locService.getLocations().subscribe(data => {
      this.locations = data;
    });
  }

  applyFilter(): void {
    this.pageIndex = 0; // Reset page index on filter change
    this.loadUsers();
  }

  clearFilters(): void {
    this.filterValues = {};
    this.searchQuery = '';
    this.pageIndex = 0; // Reset page index on filter clear
    this.loadUsers();
  }

  onDepartmentInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const department = this.departments.find(dep => dep.name === input);
    this.filterValues.department = department ? department.id : '';
    this.applyFilter();
  }

  onLocationInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const location = this.locations.find(loc => loc.name === input);
    this.filterValues.location = location ? location.id : '';
    this.applyFilter();
  }

  getDepartmentName(id: number): string {
    const department = this.departments.find(dep => dep.id === id);
    return department ? department.name : 'Unknown';
  }

  getLocationName(id: number): string {
    const location = this.locations.find(loc => loc.id === id);
    return location ? location.name : 'Unknown';
  }

  onSearch(filterKey: string, filterValue: any) {
    this.filterValues[filterKey] = filterValue;
    this.loadUsers();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.page; // Update pageIndex
    this.pageSize = event.rows; // Update pageSize
    this.loadUsers(); // Reload users with new page and pageSize
  }

  getUsersCount(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.totalUsers = users.length;
        this.maleUsers = users.filter(user => user.gender === 'Male').length;
        this.femaleUsers = users.filter(user => user.gender === 'Female').length;
      },
      error => {
        console.error('Failed to fetch users:', error);
      }
    );
  }

  confirm(event: Event, userId: number) {
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
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.deleteUser(userId);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted successfully');
        this.loadUsers();
      },
      (error) => {
        console.error('Failed to delete user:', error);
      }
    );
  }
}
