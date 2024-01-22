import { Pipe, PipeTransform } from '@angular/core';
import { MeterType } from '../meter-edit/model/meter-type';

@Pipe({
  name: 'translateMeterType'
})
export class TranslateMeterTypePipe implements PipeTransform {

  transform(value: MeterType): string {
    switch (value) {
      case MeterType.ELECTRIC:
        return 'elektryczny';
      case MeterType.WATER:
        return 'wodny';
      case MeterType.GAS:
        return 'gazowy';
      case MeterType.HEAT:
        return 'cieplny';
      default:
        return 'nieznany';
    }
  }
}
