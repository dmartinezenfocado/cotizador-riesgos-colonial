import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-location-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-location-section.component.html',
  styleUrls: ['./add-location-section.component.css']
})
export class AddLocationSectionComponent {
  @Input() tipoConstruccion: string | null = null;
  @Input() ciudad: string | null = null;
  @Input() sector: string | null = null;
  @Input() barrio: string | null = null;
  @Input() canAddLocation = false;

  @Output() tipoConstruccionChange = new EventEmitter<string | null>();
  @Output() ciudadChange = new EventEmitter<string | null>();
  @Output() sectorChange = new EventEmitter<string | null>();
  @Output() barrioChange = new EventEmitter<string | null>();
  @Output() addLocation = new EventEmitter<void>();

  onAddLocation() {
    this.addLocation.emit();
  }
}
