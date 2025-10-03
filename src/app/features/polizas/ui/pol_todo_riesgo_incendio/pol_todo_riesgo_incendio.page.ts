import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddLocationModalComponent, AddLocationPayload } from '../modals/add-location-modal/add-location-modal.component';
import { AddLocationCoversComponent, LocationCoversResult } from '../modals/add-location-covers/add-location-covers.component';
import { SubmitButtonComponent } from '../../../../common/components/buttons/submit-button/submit-button.component';
import { RiskKey, RiskSelectorsComponent } from '../../../../common/components/risk-selectors/risk-selectors.component';
import { CurrencyService } from '../../../../common/components/services/currency.service';
import { formatCurrencyInput, parseNumberUS, toUSCurrency } from '../../../../common/components/thousands-format/formatters';
import { CurrencyToggleComponent } from '../../../../common/components/currency-toggle/currency-toggle.component';
import { AddLocationSectionComponent } from "../../../../common/components/add-location-section/add-location-section.component";



/* ============================================================================
 * TIPOS
 * ========================================================================== */
type CoverItem = { name: string; sublimit: string };

type RiskState = Record<RiskKey, { enabled: boolean; value: number }>;

interface LocationRecord {
  contexto: { tipo: string | null; ciudad: string | null; sector: string | null; barrio: string | null; };
  detalle?: AddLocationPayload;
  riesgos: RiskState;
  paneles: { has: boolean; value: number };
  rc: number | null;
}

/* ============================================================================
 * CONSTANTES
 * ========================================================================== */
const RISK_KEYS: Readonly<RiskKey[]> = ['edificacion','mobiliario','maquinarias','existencias','propiedades'] as const;
const MAX_LOCATIONS = 2;

/* ============================================================================
 * COMPONENTE
 * ========================================================================== */
@Component({
  selector: 'app-pol-todo-riesgo-incendio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddLocationModalComponent,
    AddLocationCoversComponent,
    RiskSelectorsComponent,
    SubmitButtonComponent,
    CurrencyToggleComponent,
    AddLocationSectionComponent
],
  templateUrl: './pol_todo_riesgo_incendio.page.html',
  styleUrls: ['./pol_todo_riesgo_incendio.page.css']
})
export class PolTodoRiesgoIncendioPage {

  constructor(public currency: CurrencyService) {}

  /* ------------------------------------------------------------------------
   * CATÁLOGOS DEMO
   * ---------------------------------------------------------------------- */
  readonly coverOptions: string[] = ['Incendio','Explosión','Terremoto','Inundación','Robo con violencia','Daños por agua'];
  readonly clauseOptions: string[] = ['Cláusula A - Ajuste automático','Cláusula B - Valor de reposición','Cláusula C - Avería de maquinaria'];
  readonly deductibleOptions: string[] = ['RD$ 5,000','RD$ 10,000','1% mínimo RD$ 15,000','2% mínimo RD$ 25,000'];

  /* ------------------------------------------------------------------------
   * UI STATE
   * ---------------------------------------------------------------------- */
  selectedCover: string | null = null;
  sublimitInput = '';
  selectedClause: string | null = null;
  selectedDeductible: string | null = null;

  readonly formatCurrencyInput = formatCurrencyInput;

  covers: CoverItem[] = [];
  clauses: string[] = [];
  deductibles: string[] = [];

  tipoConstruccion: string | null = null;
  ciudad: string | null = null;
  sector: string | null = null;
  barrio: string | null = null;

  readonly locationSlots = Array.from({ length: MAX_LOCATIONS }, (_, i) => i);
  locations: LocationRecord[] = [];
  private currentLocationIndex: number | null = null;

  /* ------------------------------------------------------------------------
   * MODALES
   * ---------------------------------------------------------------------- */
  showAddModal = false;
  showCoversModal = false;
  private lastLocationPayload?: AddLocationPayload;

  /* ------------------------------------------------------------------------
   * RISK CARDS
   * ---------------------------------------------------------------------- */
  riskCards: { key: RiskKey; label: string; icon: string; selected: boolean }[] = [
    { key: 'edificacion', label: 'EDIFICACIÓN', icon: '🏢', selected: false },
    { key: 'mobiliario', label: 'MOBILIARIOS Y EQUIPOS', icon: '🛋️', selected: false },
    { key: 'maquinarias', label: 'MAQUINARIAS', icon: '🚜', selected: false },
    { key: 'existencias', label: 'EXISTENCIAS O INVENTARIOS', icon: '📋', selected: false },
    { key: 'propiedades', label: 'PROPIEDADES MUEBLES E INMUEBLES', icon: '🏷️', selected: false },
  ];
  private riskSelectionOrder: RiskKey[] = [];

  get canAddLocation(): boolean {
    return !!(this.tipoConstruccion && this.ciudad && this.sector && this.barrio);
  }
  get firstSelectedRisk(): RiskKey | null {
    if (this.riskSelectionOrder.length) return this.riskSelectionOrder[0];
    const anyChecked = this.riskCards.find((rc) => rc.selected)?.key ?? null;
    return anyChecked ?? null;
  }

  /* ------------------------------------------------------------------------
   * EVENTOS DE UI
   * ---------------------------------------------------------------------- */
  toggleRiskByKey(key: RiskKey) {
    const card = this.riskCards.find(c => c.key === key);
    if (!card) return;
    card.selected = !card.selected;

    if (card.selected) {
      if (!this.riskSelectionOrder.includes(card.key)) {
        this.riskSelectionOrder.push(card.key);
      }
    } else {
      this.riskSelectionOrder = this.riskSelectionOrder.filter(k => k !== card.key);
    }
  }

  openAddLocation(): void {
    if (!this.canAddLocation || this.locations.length >= MAX_LOCATIONS) return;
    this.currentLocationIndex = this.locations.length;
    this.showAddModal = true;
  }
  closeAddLocation(): void { this.showAddModal = false; }
  onConfirmLocation(payload: AddLocationPayload): void {
    this.showAddModal = false;
    this.lastLocationPayload = payload;
    this.showCoversModal = true;
  }
  onConfirmCovers(res: LocationCoversResult): void {
    this.showCoversModal = false;
    if (this.currentLocationIndex === null) return;

    const contexto = this.currentContext();
    const record: LocationRecord = {
      contexto,
      detalle: this.lastLocationPayload,
      riesgos: res.values,
      paneles: res.solarPanels,
      rc: res.rc,
    };

    this.locations[this.currentLocationIndex] = record;
    this.currentLocationIndex = null;
    this.lastLocationPayload = undefined;
  }

  /* ----------------------------- Covers --------------------------- */
  addCover(): void {
    if (!this.selectedCover) return;
    const sublimit = this.sublimitInput?.trim() || '—';
    const existing = this.covers.find((c) => c.name === this.selectedCover);
    if (existing) { existing.sublimit = sublimit; }
    else { this.covers.push({ name: this.selectedCover, sublimit }); }
    this.selectedCover = null;
    this.sublimitInput = '';
  }
  removeCover(index: number): void { this.covers.splice(index, 1); }

  /* ----------------------------- Clausulas ------------------------- */
  addClause(): void {
    if (this.selectedClause && !this.clauses.includes(this.selectedClause)) {
      this.clauses.push(this.selectedClause);
    }
    this.selectedClause = null;
  }
  removeClause(index: number): void { this.clauses.splice(index, 1); }

  /* ----------------------------- Deducibles ------------------------ */
  addDeductible(): void {
    if (this.selectedDeductible && !this.deductibles.includes(this.selectedDeductible)) {
      this.deductibles.push(this.selectedDeductible);
    }
    this.selectedDeductible = null;
  }
  removeDeductible(index: number): void { this.deductibles.splice(index, 1); }

  /* ----------------------------- Helpers --------------------------- */
  private currentContext() {
    return { tipo: this.tipoConstruccion, ciudad: this.ciudad, sector: this.sector, barrio: this.barrio };
  }
  getRiskValue(idx: number, key: RiskKey): number { return this.locations[idx]?.riesgos?.[key]?.value ?? 0; }
  setRiskValue(idx: number, key: RiskKey, raw: string | number): void {
    const cleaned = parseNumberUS(raw);
    const loc = this.locations[idx]; if (!loc) return;
    if (!loc.riesgos[key]) { loc.riesgos[key] = { enabled: true, value: 0 }; }
    loc.riesgos[key].value = cleaned;
  }
  getBlockTotal(idx: number): number {
    const loc = this.locations[idx]; if (!loc) return 0;
    return RISK_KEYS.reduce((acc, k) => acc + (loc.riesgos[k]?.enabled ? (loc.riesgos[k].value || 0) : 0), 0);
  }
  numberToCurrency(n: number): string { return toUSCurrency(n); }

  /* ----------------------------- Submit ---------------------------- */
  get payload() {
    return { ubicacionSeleccion: this.currentContext(), coberturas: this.covers, clausulas: this.clauses, deducibles: this.deductibles };
  }
  onSubmitPolicy(): void { console.log('Póliza enviada', this.payload); }
}
