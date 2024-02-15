import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../common/service/navigation.service';

@Component({
  selector: 'app-apartment-meter-edit-container',
  templateUrl: './apartment-meter-edit-container.component.html',
  styleUrls: ['./apartment-meter-edit-container.component.scss']
})
export class ApartmentMeterEditContainerComponent implements OnInit {

  apartmentId!: number;
  selectedIndex!: number;

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.apartmentId = Number(this.acitvatedRoute.snapshot.params['id']);
    const lastTabLabel = this.navigationService.getLastTabLabel();
    if (lastTabLabel) {
      this.selectedIndex = this.convertLabelToIndex(lastTabLabel);
      this.navigationService.setLastTabLabel('');
    }
  }
  
  convertLabelToIndex(label: string): number {
    switch(label) {
      case 'apartments': return 0;
      case 'housing-provider': return 1;
      case 'meters': return 2;
      default: return 0;
    }
  }

}
