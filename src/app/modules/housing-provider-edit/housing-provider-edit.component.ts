import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { HousingProviderService } from '../housing-provider-add/housing-provider.service';
import { HousingProviderDto } from '../housing-provider-add/model/housing-provider-dto';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderFieldDto } from '../housing-provider-add/model/provider-field-dto';
import { ProviderType } from '../housing-provider-add/model/provider-type';
import { BillingMethod } from '../housing-provider-add/model/billing-method';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';

@Component({
  selector: 'app-housing-provider-edit',
  templateUrl: './housing-provider-edit.component.html',
  styleUrls: ['./housing-provider-edit.component.scss']
})
export class HousingProviderEditComponent implements OnInit, OnDestroy {
  private killer$ = new Subject<void>();
  housingProviderId!: number;
  housingProviderForm!: FormGroup;
  providerTypes = Object.values(ProviderType);
  billingMethods = Object.values(BillingMethod);

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private housingProviderService: HousingProviderService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.housingProviderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(45)]],
      type: ['', Validators.required],
      tax: ['', [Validators.min(0), Validators.max(99), maxDecimalPlaces(2)]],
      conversionRate: ['', [Validators.min(0), Validators.max(999), maxDecimalPlaces(5)]],
      items: this.fb.array([this.createItem()])
    });

    this.housingProviderId = Number(this.acitvatedRoute.snapshot.params['id']);

    this.getHouseProvider();

    this.typeControl?.valueChanges
    .pipe(takeUntil(this.killer$)).subscribe(() => this.resetItems());
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  createItem(): FormGroup {
    return this.fb.group({
      fieldName: [''],
      price: ['', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]],
      billingMethod: ['']
    });
  }

  getHouseProvider() {
    this.housingProviderService.getHousingProvider(this.housingProviderId)
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
    })
  }

  mapFormValues(dto: HousingProviderDto): void {
    this.housingProviderForm.patchValue({
      name: dto.name,
      type: dto.type,
      tax: dto.tax,
      conversionRate: dto.conversionRate
    });

    const items = this.items;
    items.clear(); // Usuń wszystkie obecne kontrole przed dodaniem nowych
    dto.providerFieldDtos?.forEach(field => this.addProviderField(field));
  }

  // Metoda do dodawania dynamicznych pól do FormArray
  private addProviderField(field?: ProviderFieldDto) {
    const items = this.items;
    items.push(this.fb.group({
      id: field?.id,
      fieldName: field?.name || '',
      price: [field?.price, [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]],
      billingMethod: field?.billingMethod || ''
    }));
  }
  
  submit() {
    if (this.housingProviderForm.valid) {
      const providerFieldDtos = this.getProviderFieldDtos();

      const housingProvider: HousingProviderDto = {
        id: this.housingProviderId,
        name: this.nameControl?.value,
        type: this.typeControl?.value,
        tax: this.taxControl?.value,
        conversionRate: this.conversionRateControl?.value,
        providerFieldDtos: providerFieldDtos
      }

      this.updateBillingMethod(housingProvider);
      this.housingProviderService.updateHousingProvider(housingProvider).pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(["/housing-providers/edit", this.housingProviderId])
        .then(() => {
          const translatedText = this.translateService.instant("snackbar.housingProviderSaved");
          this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
          this.getHouseProvider();
        })
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


  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  resetItems() {
    const itemsControl = this.items;
    while (itemsControl.length !== 0) {
      itemsControl.removeAt(0);
    }
    itemsControl.push(this.createItem());
  }

  getProviderFieldDtos(): ProviderFieldDto[] {
    const items = this.items.value;
  
    const providerFieldDtos: ProviderFieldDto[] = items.map((item: any) => ({
      id: item.id,
      name: item.fieldName,
      price: item.price,
      billingMethod: item.billingMethod,
    }));
  
    return providerFieldDtos;
  }

  get items(): FormArray {
    return this.housingProviderForm.get('items') as FormArray;
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


}
