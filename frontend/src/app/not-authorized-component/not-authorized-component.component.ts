import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap, timer } from 'rxjs';

@Component({
  selector: 'app-not-authorized-component',
  templateUrl: './not-authorized-component.component.html',
  styleUrl: './not-authorized-component.component.scss'
})
export class NotAuthorizedComponentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Redirect to dashboard after 2 seconds
    timer(4000).pipe(
      tap(() => this.router.navigate(['/dashboard']))
    ).subscribe();
  }
}