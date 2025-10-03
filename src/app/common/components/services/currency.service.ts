import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export type CurrencyCode = 'DOP' | 'USD';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly LS_KEY = 'app.currency';
  private readonly _code$ = new BehaviorSubject<CurrencyCode>(this.load());

  // Observables públicos
  code$ = this._code$.asObservable();
  symbol$ = this._code$.asObservable().pipe(
    // símbolo a partir del código
    map(c => c === 'USD' ? '$' : 'RD$')
  );

  // Lecturas sincrónicas útiles en TS
  get code(): CurrencyCode { return this._code$.value; }
  get symbol(): string { return this.code === 'USD' ? '$' : 'RD$'; }

  set(code: CurrencyCode) {
    this._code$.next(code);
    localStorage.setItem(this.LS_KEY, code);
  }

  toggle() {
    this.set(this.code === 'USD' ? 'DOP' : 'USD');
  }

  private load(): CurrencyCode {
    const saved = localStorage.getItem(this.LS_KEY);
    return (saved === 'USD' || saved === 'DOP') ? saved : 'DOP';
  }
}
