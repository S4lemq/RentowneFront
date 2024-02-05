import { Pipe, PipeTransform } from "@angular/core";
import { BillingMethod } from "../model/billing-method";

@Pipe({
    name: 'translateBillingMethod'
  })
export class TranslateBillingMethodPipe implements PipeTransform {

  transform(value: BillingMethod | undefined): string {
    switch (value) {
      case BillingMethod.MONTHLY:
        return 'Miesięczny';
      case BillingMethod.ACCORDING_TO_CONSUMPTION:
        return 'Według zużycia';
      default:
        return 'nieznany';
    }
  }
}

