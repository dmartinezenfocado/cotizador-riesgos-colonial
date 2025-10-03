import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  HostListener
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type PisoOpt  = '4 Pisos o Menos' | 'Mas de 4 Pisos' | 'Desconocido';
export type AnioOpt  = '10 Años o Menos' | 'Mas de 10 Años' | 'Desconocido';

export interface AddLocationPayload {
  esPropietario: 'Propietario' | 'Inquilino';
  calle: string;
  numeroInmueble: string;
  numeroPiso: PisoOpt | '';
  anioConstruccion: AnioOpt | '';
  concretoTotal: boolean;        // techo y paredes de concreto
  concretoVigasAcero: boolean;   // paredes de concreto y vigas de acero
}

@Component({
  selector: 'app-add-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLocationModalComponent implements OnChanges {
  /** Control de apertura */
  @Input() open = false;

  @Input() tipoConstruccion: string | null = null;

  /** Chips superiores (selecciones previas) */
  @Input() chipCiudad = 'Distrito Nacional';
  @Input() chipSector = '—';
  @Input() chipBarrio = '—';

  /** Valores iniciales opcionales al abrir el modal */
  @Input() initial: Partial<AddLocationPayload> = {};

  /** Eventos */
  @Output() cancel  = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<AddLocationPayload>();

  // === Estado interno del formulario del modal ===
  esPropietario: 'Propietario' | 'Inquilino' = 'Propietario';
  calle = '';
  numeroInmueble = '';
  numeroPiso: PisoOpt | '' = '';
  anioConstruccion: AnioOpt | '' = '';
  concretoTotal = false;
  concretoVigasAcero = false;

  // Opciones de selects
  readonly floorOptions: PisoOpt[] = ['4 Pisos o Menos', 'Mas de 4 Pisos', 'Desconocido'];
  readonly yearOptions:  AnioOpt[] = ['10 Años o Menos', 'Mas de 10 Años', 'Desconocido'];

   /** Título dinámico del modal */
  get tipoConstruccionTitle(): string {
    const raw = (this.tipoConstruccion ?? '').trim();
    if (!raw) return 'Local Comercial';
    return raw.replace('/', ' / ');
  }

  /** Cuando cambie `open` o `initial`, resetea/prellena el formulario */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['initial']) {
      if (this.open) {
        const i = this.initial ?? {};
        this.esPropietario       = (i.esPropietario ?? 'Propietario');
        this.calle               = (i.calle ?? '');
        this.numeroInmueble      = (i.numeroInmueble ?? '');
        this.numeroPiso          = (i.numeroPiso as PisoOpt | '') ?? '';
        this.anioConstruccion    = (i.anioConstruccion as AnioOpt | '') ?? '';
        this.concretoTotal       = !!i.concretoTotal;
        this.concretoVigasAcero  = !!i.concretoVigasAcero;
      }
    }
  }

  /** Accesibilidad: cerrar con ESC */
 @HostListener('document:keydown.escape', ['$event'])
onEsc(ev: any) {   // o ev: Event
  if (this.open) this.cancel.emit();
}

  onConfirm() {
    this.confirm.emit({
      esPropietario: this.esPropietario,
      calle: this.calle.trim(),
      numeroInmueble: this.numeroInmueble.trim(),
      numeroPiso: this.numeroPiso,
      anioConstruccion: this.anioConstruccion,
      concretoTotal: this.concretoTotal,
      concretoVigasAcero: this.concretoVigasAcero
    });
  }
}
