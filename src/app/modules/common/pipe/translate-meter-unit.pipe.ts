import { Pipe, PipeTransform } from '@angular/core';
import { MeterType } from '../../meter-edit/model/meter-type';

@Pipe({
    name: 'translateMeterUnit'
  })
  export class TranslateMeterUnitPipe implements PipeTransform {

    transform(value: MeterType | null): string {
        switch (value) {
          case MeterType.WATER_COLD:
          case MeterType.WATER_WARM:
          case MeterType.GAS:
            return 'm³';
          case MeterType.ELECTRIC:
            return 'kWh';
          case MeterType.HEAT:
            return 'GJ';
          default:
            return 'nieznany';
        }
    }

  }