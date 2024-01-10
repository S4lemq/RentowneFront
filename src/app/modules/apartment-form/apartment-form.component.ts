import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: 'app-apartment-form',
    templateUrl: './apartment-form.component.html',
    styleUrls: ['./apartment-form.component.scss']

  })
export class ApartmentFormComponent implements OnInit {

    @Input() parentForm!: FormGroup;

    ngOnInit(): void {

    }

    getApartmentNameErrorMsg() {
      if(this.apartmentName?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.apartmentName?.errors?.['minlength']) {
        return 'Minimum 4 znaki';
      }
      if (this.apartmentName?.errors?.['maxlength']) {
        return "Maksymalnie 60 znaków";
      }
      return null;
    }


    getleasesNumberErrorMsg() {
      if(this.leasesNumber?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.leasesNumber?.errors?.['min']) {
        return 'Minimalnie 1';
      }
      if (this.leasesNumber?.errors?.['max']) {
        return "Maksymalnie 90";
      }
      return null;
    }

    getAreaNumberErrorMsg() {
      if(this.area?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.area?.errors?.['min']) {
        return 'Minimalnie 1';
      }
      if (this.area?.errors?.['max']) {
        return "Maksymalnie 999.99";
      }
      return null;
    }

    getStreetNameErrorMsg() {
      if(this.streetName?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.streetName?.errors?.['minlength']) {
        return 'Minimalnie 4';
      }
      if (this.streetName?.errors?.['maxlength']) {
        return "Maksymalnie 100";
      }
      return null;
    }

    getBuildingNumberErrorMsg() {
      if(this.buildingNumber?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.buildingNumber?.errors?.['minlength']) {
        return 'Minimalnie 1';
      }
      if (this.buildingNumber?.errors?.['maxlength']) {
        return "Maksymalnie 10";
      }
      return null;
    }

    getApartmentNumberErrorMsg() {
      if(this.buildingNumber?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.buildingNumber?.errors?.['minlength']) {
        return 'Minimalnie 1';
      }
      if (this.buildingNumber?.errors?.['maxlength']) {
        return "Maksymalnie 10";
      }
      return null;
    }

    getZipCodeErrorMsg() {
      if(this.zipCode?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.zipCode?.errors?.['minlength']) {
        return 'Minimalnie 1';
      }
      if (this.zipCode?.errors?.['maxlength']) {
        return "Maksymalnie 10";
      }
      return null;
    }

    getCityNameErrorMsg() {
      if(this.cityName?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.cityName?.errors?.['minlength']) {
        return 'Minimalnie 4';
      }
      if (this.cityName?.errors?.['maxlength']) {
        return "Maksymalnie 60";
      }
      return null;
    }

    getVoivodeshipErrorMsg() {
      if(this.voivodeship?.errors?.['required']) {
        return 'Wartość wymagana';
      }
      if (this.voivodeship?.errors?.['minlength']) {
        return 'Minimalnie 4';
      }
      if (this.voivodeship?.errors?.['maxlength']) {
        return "Maksymalnie 60";
      }
      return null;
    }

    get apartmentName() {
      return this.parentForm.get("apartmentName");
    }

    get leasesNumber() {
      return this.parentForm.get("leasesNumber");
    }

    get area() {
      return this.parentForm.get("area");
    }

    get streetName() {
      return this.parentForm.get("streetName");
    }

    get buildingNumber() {
      return this.parentForm.get("buildingNumber");
    }

    get apartmentNumber() {
      return this.parentForm.get("apartmentNumber");
    }

    get zipCode() {
      return this.parentForm.get("zipCode");
    }

    get cityName() {
      return this.parentForm.get("cityName");
    }

    get voivodeship() {
      return this.parentForm.get("voivodeship");
    }
}