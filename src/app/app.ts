import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { YakuriApiService } from './core/services/yakuri-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  readonly api = inject(YakuriApiService);

  ngOnInit(): void {
    this.api.checkHealth().subscribe();
  }
}
