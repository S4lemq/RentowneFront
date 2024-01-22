import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MeterService } from '../meter-edit/meter.service';
import { MeterDto } from '../meter-edit/model/meter-dto';
import { MeterType } from '../meter-edit/model/meter-type';
import { RentedObjectService } from '../apartment-add/rented-object.service';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meter-add',
  templateUrl: './meter-add.component.html',
  styleUrls: ['./meter-add.component.scss']
})
export class MeterAddComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  rentedObjectId!: number;
  meterForm!: FormGroup;
  meterTypes = Object.values(MeterType);
  rentedObjects: RentedObjectDto[] = [];

  constructor(
    private meterService: MeterService,
    private route: ActivatedRoute,
    private rentedObjectService: RentedObjectService,
    private translateService: TranslateService,
    private router: Router,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.rentedObjectService.getAllRentedObjects()
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.rentedObjects = data);

    this.route.params.pipe(takeUntil(this.killer$)).subscribe(params => {
      this.rentedObjectId = +params['id'];
    });
  
    this.meterForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      meterType: new FormControl('', Validators.required),
      rentedObjectId: new FormControl(this.rentedObjectId, Validators.required)
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  submit() {
    if( this.meterForm.valid ) {
      const rentedObjectDto: RentedObjectDto = {
        id: this.rentedObjectId
      }
      this.meterService.saveMeter(
        {
          name: this.name?.value,
          meterType: this.meterType?.value,
          rentedObject: rentedObjectDto
        } as MeterDto
      ).pipe(takeUntil(this.killer$))
      .subscribe(meter => {
        console.log('dziala')
        const translatedText = this.translateService.instant("snackbar.meterAdded");
        this.router.navigate(["meters/edit/", meter.id])
            .then(() => this.snackBar.open(translatedText, '', {
                duration: 3000,
                panelClass: ['snackbarSuccess']
            }));
      });
    }
  }

  get name() {
    return this.meterForm.get("name");
  }

  get meterType() {
    return this.meterForm.get("meterType");
  }

}