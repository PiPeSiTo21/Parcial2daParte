import { Injectable, signal } from '@angular/core';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private pacientesSignal = signal<Paciente[]>([]);

  public pacientes = this.pacientesSignal.asReadonly();

  constructor() { }

  agregar(paciente: Paciente): void {
    this.pacientesSignal.update(lista => [...lista, paciente]);
  }

  obtenerTodos(): Paciente[] {
    return this.pacientesSignal();
  }

  buscarPorId(id: number | string): Paciente | undefined {
    return this.pacientesSignal().find(p => p.id === Number(id));
  }

  siguienteId(): number {
    const listaActual = this.pacientesSignal();
    return listaActual.length > 0 ? Math.max(...listaActual.map(p => p.id)) + 1 : 1;
  }
}