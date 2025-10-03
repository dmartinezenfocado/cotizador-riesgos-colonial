import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-currency-toggle',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './currency-toggle.component.html',
  styleUrls: ['./currency-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyToggleComponent {
  constructor(public currency: CurrencyService) {}
  setUSD() { this.currency.set('USD'); }
  setDOP() { this.currency.set('DOP'); }
}
