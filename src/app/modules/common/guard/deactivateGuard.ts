import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { BaseComponent } from "../base.component";
import { ConfirmDialogService } from "../../confirm-dialog/confirm-dialog.service";
import { Observable, map, take } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
  })
  export class DeactivateGurad implements CanDeactivate<BaseComponent> {
    constructor(private confirmDialogService: ConfirmDialogService) {}
  
    canDeactivate(component: BaseComponent): Observable<boolean> | boolean {
      if (component.isFormValid()) {
        return true;
      } else {
        const dialogRef: MatDialogRef<any> = this.confirmDialogService.openConfirmDialog('Masz nie zapisane zmiany, czy na pewno chcesz wyjść?');
  
        return dialogRef.afterClosed().pipe(
          take(1),
          map(result => {
            return result ? true : false;
          })
        );
      }
    }
  }