import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private citas: Cita[] = [];

  constructor() { }

  agregar(cita: Cita): void {
    this.citas.push(cita);
  }

  obtenerTodas(): Cita[] {
    return this.citas;
  }

  buscarPorId(id: number | string): Cita | undefined {
    return this.citas.find(c => c.id === Number(id));
  }

  siguienteId(): number {
    return this.citas.length > 0 ? Math.max(...this.citas.map(c => c.id)) + 1 : 1;
  }
}