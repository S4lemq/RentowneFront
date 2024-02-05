import { Pipe, PipeTransform } from "@angular/core";
import { ProviderType } from "../model/provider-type";

@Pipe({
    name: 'translateProviderType'
  })
export class TranslateProviderTypePipe implements PipeTransform {

  transform(value: ProviderType | undefined): string {
    switch (value) {
      case ProviderType.INTERNET:
        return 'Internet';
      case ProviderType.ELECTRICITY:
        return 'Energia elektryczna';
      case ProviderType.GAS:
        return 'Gaz';
      case ProviderType.WATER:
        return 'Woda';
      case ProviderType.ADMINISTRATIVE_FEE:
        return 'Czynsz administracyjny';
      default:
        return 'nieznany';
    }
  }
}
