import { Component, OnInit } from '@angular/core';
import { LoaderService } from './modules/common/service/loader.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Rentowne';
  
  constructor(
    public loaderService: LoaderService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'pl';
    this.translateService.use(preferredLanguage);
  }
  
}
