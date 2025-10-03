import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css']
})
export class SubmitButtonComponent {
  @Input() label = 'Enviar';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() submitClick = new EventEmitter<void>();

  onClick() {
    if (!this.disabled && !this.loading) {
      this.submitClick.emit();
    }
  }
}
