import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type RiskKey =
  | 'edificacion'
  | 'mobiliario'
  | 'maquinarias'
  | 'existencias'
  | 'propiedades';

@Component({
  selector: 'app-risk-selectors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-selectors.component.html',
  styleUrls: ['./risk-selectors.component.css']
})
export class RiskSelectorsComponent {
  @Input() riskCards: { key: RiskKey; label: string; icon: string; selected: boolean }[] = [];
  @Output() toggle = new EventEmitter<RiskKey>();

  onToggle(card: { key: RiskKey; selected: boolean }) {
    this.toggle.emit(card.key);
  }
}
