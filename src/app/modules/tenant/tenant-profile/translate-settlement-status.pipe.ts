import { Pipe, PipeTransform } from '@angular/core';
import { SettlementStatus } from './model/settlement-status';

@Pipe({
  name: 'translateSettlementStatus'
})
export class TranslateSettlementStatusPipe implements PipeTransform {

  transform(value: SettlementStatus | undefined): string {
    switch (value) {
      case SettlementStatus.TO_PAY:
        return 'Do zapłaty';
      case SettlementStatus.PROCESSING:
        return 'Przetwarzanie';
      case SettlementStatus.PAID:
        return 'Opłacone';
      default:
        return 'nieznany';
    }
  }
}
