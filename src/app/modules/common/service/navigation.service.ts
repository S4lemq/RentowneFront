import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
private lastTabLabel: string | null = null;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  setLastTabLabel(label: string) {
    this.lastTabLabel = label;
  }
  
  getLastTabLabel(): string | null {
    return this.lastTabLabel;
  }
  
}
