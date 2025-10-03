import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../../../../common/components/services/currency.service';
import { formatCurrency, parseNumberUS } from '../../../../../common/components/thousands-format/formatters';

type RiskKey = 'edificacion' | 'mobiliario' | 'maquinarias' | 'existencias' | 'propiedades';

export interface LocationCoversResult {
  values: Record<RiskKey, { enabled: boolean; value: number }>;
  solarPanels: { has: boolean; value: number };
  rc: number | null;
}

@Component({
  selector: 'app-add-location-covers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-location-covers.component.html',
  styleUrls: [ './add-location-covers.component.css']
})
export class AddLocationCoversComponent implements OnChanges {
  @Input() open = false;
  @Input() actividad = 'Local Comercial';
  @Input() ciudad = 'Distrito Nacional';
  @Input() defaultRisk: RiskKey | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<LocationCoversResult>();

  state!: Record<RiskKey, { enabled: boolean; value: number }>;
  hasSolar = false;
  solarValue = 0;
  rcValue: number | null = null;

  private resetState() {
    this.state = {
      edificacion: { enabled: false, value: 0 },
      mobiliario:  { enabled: false, value: 0 },
      maquinarias: { enabled: false, value: 0 },
      existencias: { enabled: false, value: 0 },
      propiedades: { enabled: false, value: 0 },
    };
    this.hasSolar = false;
    this.solarValue = 0;
    this.rcValue = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true) {
      this.resetState();
      if (this.defaultRisk) {
        this.state[this.defaultRisk].enabled = true;
      }
    }
    if (this.open && changes['defaultRisk'] && this.defaultRisk) {
      const anyEnabled = Object.values(this.state).some(s => s.enabled);
      if (!anyEnabled) this.state[this.defaultRisk].enabled = true;
    }
  }

  // === Normaliza el estado a número en cada cambio de modelo ===
  updateMoney(key: RiskKey, raw: string | number) {
    this.state[key].value = parseNumberUS(raw);
  }

  updateSolar(raw: string | number) {
    this.solarValue = parseNumberUS(raw);
  }

  onConfirm() {
    // Defensa adicional: emite siempre números “limpios”
    const numericState = Object.fromEntries(
      Object.entries(this.state).map(([k, v]) => [
        k,
        { enabled: v.enabled, value: Number(v.value) || 0 }
      ])
    ) as Record<RiskKey, { enabled: boolean; value: number }>;

    this.confirm.emit({
      values: numericState,
      solarPanels: { has: this.hasSolar, value: Number(this.solarValue) || 0 },
      rc: this.rcValue
    });
  }

  // Mantén el formateo visual
  formatCurrency = formatCurrency;
  // Moneda usada
  constructor(public currency: CurrencyService) {}
}
