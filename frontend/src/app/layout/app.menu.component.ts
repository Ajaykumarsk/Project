import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    userName: string | null = '';

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.userName = localStorage.getItem('role');
        const userRole = localStorage.getItem('role');
        console.log(userRole);
        if (userRole === 'security') {
            this.model = [
                {
                    label: 'Visitors',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] },
                        { label: 'Add Visitor', icon: 'pi pi-fw pi-user-plus', routerLink: ['visitor'] },
                        { label: 'Visitor Status', icon: 'pi pi-fw pi-objects-column', routerLink: ['visitorstatus'] },
                        { label: 'Check In & Out', icon: 'pi pi-fw pi-sign-in', routerLink: ['checkInOut'] },
                    ]
                },
            ];
        } 
        else if (userRole === 'front_office') {
            this.model = [
                {
                    label: 'Visitors',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] },
                        { label: 'Visitor Status', icon: 'pi pi-fw pi-objects-column', routerLink: ['visitorstatus'] },
                        { label: 'Host Verify', icon: 'pi pi-fw pi-check-circle', routerLink: ['verify'] },
                    ]
                },
            ];
        }   else if (userRole === 'approveadmin') {
            this.model = [
                {
                    label: 'Visitors',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] },
                        { label: 'Visitor Status', icon: 'pi pi-fw pi-objects-column', routerLink: ['visitorstatus'] },
                        { label: 'Admin Approval', icon: 'pi pi-fw pi-thumbs-up', routerLink: ['approval'] },
                    ]
                },
            ];
        }else if (userRole === 'chairman') {
            this.model = [
                {
                    label: 'Visitors',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] },
                        { label: 'Visitor Status', icon: 'pi pi-fw pi-objects-column', routerLink: ['visitorstatus'] },
                        { label: 'Host Verify', icon: 'pi pi-fw pi-check-circle', routerLink: ['chairmanverify'] },
                    ]
                },
            ];
        } else {
            this.model = [
                {
                    label: 'Resource Management',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['employeedashboard'] },
                        {
                            label: 'Attendance Management',
                            icon: 'pi pi-fw pi-id-card',
                            items: [
                                { label: 'Onboarding', icon: 'pi pi-fw pi-list', routerLink: ['user'] },
                            ]
                        }
                    ]
                },
                {
                    label: 'Visitors Management',
                    icon: 'pi pi-fw pi-id-card',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] },
                        {
                            label: 'Visitors Management',
                            icon: 'pi pi-fw pi-id-card',
                            items: [
                                { label: 'Visitor Status', icon: 'pi pi-fw pi-objects-column', routerLink: ['visitorstatus'] },
                                { label: 'Add Visitor', icon: 'pi pi-fw pi-user-plus', routerLink: ['visitor'] },
                                { label: 'Host Verify', icon: 'pi pi-fw pi-check-circle', routerLink: ['verify'] },
                                { label: 'Admin Approval', icon: 'pi pi-fw pi-thumbs-up', routerLink: ['approval'] },
                                { label: 'Check In & Out', icon: 'pi pi-fw pi-sign-in', routerLink: ['checkInOut'] },
                                { label: 'Reports', icon: 'pi pi-fw pi-chart-bar', routerLink: ['records'] },
                            ]
                        }
                    ]
                },
                {
                    label: 'Canteen Management',
                    icon: 'pi pi-fw pi-shop',
                    items: [
                        { label: 'Canteen Food Menu', icon: 'pi pi-fw pi-home', routerLink: ['foodmenu'] },  
                        { label: 'Daily Food Menu', icon: 'pi pi-fw pi-book', routerLink: ['caterermenu'] },
                               
                          
                        
                    ]
                },
                {
                    label: 'Configurations',
                    icon: 'pi pi-fw pi-wrench',
                    items: [
                        { label: 'Company', icon: 'pi pi-fw pi-thumbs-up', routerLink: ['company'] },
                        { label: 'Department', icon: 'pi pi-fw pi-sitemap', routerLink: ['department'] },
                        { label: 'Location', icon: 'pi pi-fw pi-map-marker', routerLink: ['location'] },
                        { label: 'Employee Type', icon: 'pi pi-fw pi-sign-in', routerLink: ['employeetypes'] },
                        { label: 'Canteen Food Consummation Timings', icon: 'pi pi-fw pi-clock', routerLink: ['canteenfoodconsummationtiming'] },
                        { label: 'Canteen Food Order Timings', icon: 'pi pi-fw pi-calendar', routerLink: ['canteenfoodordertiming'] },
                        { label: 'Caterer', icon: 'pi pi-fw pi-user', routerLink: ['caterer'] },
                        { label: 'Canteen Food Rate', icon: 'pi pi-fw pi-dollar', routerLink: ['canteenfoodrate'] },
                        { label: 'Canteen Food Items', icon: 'pi pi-fw pi-list', routerLink: ['canteenfoodmenu'] },
                    ]
                },
            ];
        }
    }
}
