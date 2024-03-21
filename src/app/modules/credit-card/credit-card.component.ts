import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {
  @Input() cardNumber?: string;
  @Input() cardHolderName?: string;
  @Input() cardExpiryYear?: string;
  @Input() cardExpiryMonth?: string;
}
