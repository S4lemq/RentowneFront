import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, max, takeUntil } from 'rxjs';
import { HousingProviderService } from './housing-provider.service';
import { BillingMethod } from './model/billing-method';
import { HousingProviderDto } from './model/housing-provider-dto';
import { ProviderFieldDto } from './model/provider-field-dto';
import { ProviderType } from './model/provider-type';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-housing-provider-add',
  templateUrl: './housing-provider-add.component.html',
  styleUrls: ['./housing-provider-add.component.scss']
})
export class HousingProviderAddComponent implements OnInit, OnDestroy {
  private killer$ = new Subject<void>();
  housingProviderForm!: FormGroup;
  providerTypes = Object.values(ProviderType);
  billingMethods = Object.values(BillingMethod);

  constructor(
    private fb: FormBuilder,
    private housingProviderService: HousingProviderService,
    private translateService: TranslateService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.housingProviderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(45)]],
      type: ['', Validators.required],
      tax: ['', [Validators.min(0), Validators.max(99), maxDecimalPlaces(2)]],
      conversionRate: ['', [Validators.min(0), Validators.max(999), maxDecimalPlaces(5)]],
      items: this.fb.array([this.createItem()])
    });

    this.typeControl?.valueChanges.pipe(
      takeUntil(this.killer$)
    ).subscribe(() => this.resetItems());
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  resetItems() {
    const itemsControl = this.items;
    while (itemsControl.length !== 0) {
      itemsControl.removeAt(0);
    }
    itemsControl.push(this.createItem());
  }

  get items(): FormArray {
    return this.housingProviderForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      fieldName: [''],
      price: ['', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]],
      billingMethod: ['']
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  submit() {
    if (this.housingProviderForm.valid) {
      const providerFieldDtos = this.getProviderFieldDtos();

      const housingProvider: HousingProviderDto = {
        name: this.nameControl?.value,
        type: this.typeControl?.value,
        tax: this.taxControl?.value,
        conversionRate: this.conversionRateControl?.value,
        providerFieldDtos: providerFieldDtos
      }

      this.updateBillingMethod(housingProvider);
      this.housingProviderService.saveHousingProvider(housingProvider)
      .pipe(takeUntil(this.killer$))
      .subscribe(id => {
        const translatedText = this.translateService.instant("snackbar.housingProviderSaved");
        this.router.navigate(["/housing-providers/edit", id])
            .then(() => this.snackBar.open(translatedText, '', {
                duration: 3000,
                panelClass: ['snackbarSuccess']
            }));
      });
    } else {
      this.housingProviderForm.markAllAsTouched();
    }
  }

  updateBillingMethod(dto: HousingProviderDto): void {
    if (dto.type === ProviderType.INTERNET || dto.type === ProviderType.WATER) {
      if (dto.providerFieldDtos && dto.providerFieldDtos.length > 0) {
        dto.providerFieldDtos[0].billingMethod = BillingMethod.MONTHLY;
      }
    }
    if (dto.type === ProviderType.ADMINISTRATIVE_FEE) {
      dto.providerFieldDtos?.forEach(field => {
        field.billingMethod = BillingMethod.MONTHLY;
      });
    }
  }

  getProviderFieldDtos(): ProviderFieldDto[] {
    const items = this.items.value;
  
    const providerFieldDtos: ProviderFieldDto[] = items.map((item: any) => ({
      name: item.fieldName,
      price: item.price,
      billingMethod: item.billingMethod,
    }));
  
    return providerFieldDtos;
  }
  
  getPriceErrorMsg(index: number): string {
    const item = this.items.at(index) as FormGroup;
    const priceControl = item.get('price');
  
    if (priceControl?.hasError('required')) {
      return 'Wartość wymagana';
    } else if (priceControl?.hasError('min')) {
      return 'Minimalnie 0zł';
    } else if (priceControl?.hasError('max')) {
      return 'Maksymalnie 99999zł';
    } else if (priceControl?.hasError('maxDecimalPlaces')) {
      return 'Maksymalnie 5 miejsc po przecinku';
    }
    return '';
  }

  getTaxErrorMsg(): string {
    if (this.taxControl?.hasError('min')) {
      return 'Minimalnie 0%';
    }
    if (this.taxControl?.hasError('max')) {
      return 'Minimalnie 99%';
    }
    if (this.taxControl?.hasError('maxDecimalPlaces')) {
      return "Maksymalnie 2 miejsca po przecinku"
    }
    return '';
  }

  getConversationErrorMsg(): string {
    if (this.conversionRateControl?.hasError('min')) {
      return 'Minimalnie 0';
    }
    if (this.conversionRateControl?.hasError('max')) {
      return 'Minimalnie 999';
    }
    if (this.conversionRateControl?.hasError('maxDecimalPlaces')) {
      return "Maksymalnie 5 miejsc po przecinku"
    }
    return '';
  }

  getTypeErrorMsg(): string {
    if (this.typeControl?.hasError('required')) {
      return 'Wartość wymagana';
    }
    return '';
  }

  getNameErrorMsg(): string {
    if (this.nameControl?.hasError('required')) {
      return 'Wartość wymagana';
    }
    if (this.nameControl?.hasError('minlength')) {
      return 'Minimalnie 1';
    }
    if (this.nameControl?.hasError('maxlength')) {
      return "Maksymalnie 45"
    }
    return '';
  }

  get nameControl() {
    return this.housingProviderForm.get("name");
  }

  get typeControl() {
    return this.housingProviderForm.get("type");
  }

  get taxControl() {
    return this.housingProviderForm.get("tax");
  }

  get conversionRateControl() {
    return this.housingProviderForm.get("conversionRate");
  }
  
}
