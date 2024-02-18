import { Component } from '@angular/core';
import { LoaderService } from './modules/common/service/loader.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Rentowne';
  
  constructor(public loaderService: LoaderService) {}
  
}
