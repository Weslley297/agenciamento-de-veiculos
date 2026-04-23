import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatIconModule, CdkMenuModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  constructor(private router: Router) { }

  redirectTo(url: string) {
    console.log('Redirecting to:', url);
    this.router.navigate([url]);
  }
}
