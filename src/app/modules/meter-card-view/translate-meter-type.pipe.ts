import { Pipe, PipeTransform } from '@angular/core';
import { MeterType } from '../meter-edit/model/meter-type';

@Pipe({
  name: 'translateMeterType'
})
export class TranslateMeterTypePipe implements PipeTransform {

  transform(value: MeterType): string {
    switch (value) {
      case MeterType.WATER_COLD:
        return 'Woda zimna';
      case MeterType.WATER_WARM:
        return 'Woda ciepła';
      case MeterType.GAS:
        return 'Gaz';
      case MeterType.ELECTRIC:
        return 'Energia elektryczna';
      case MeterType.HEAT:
        return 'Ciepło';
      default:
        return 'nieznany';
    }
  }
}
