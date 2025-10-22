import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div style="padding:24px;font-family:Arial,Helvetica,sans-serif;color:#222;">
      <h2>Angular is running</h2>
      <p>If you can see this, routing and bootstrapping work.</p>
      <p><a href="/login">Go to Login</a></p>
    </div>
  `
})
export class HomeComponent {}


