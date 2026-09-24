import { Injectable } from '@angular/core';
import { Medico } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  // Inicializar con los 4 médicos por defecto
  private medicos: Medico[] = [
    { id: 1, nombres: 'Carlos', apellidos: 'Mendoza', especialidad: 'Terapia Neural', horarioAtencion: 'L-V 8:00-12:00', añosExperiencia: 0, bibliografia: '' },
    { id: 2, nombres: 'María', apellidos: 'López', especialidad: 'Quiropraxia', horarioAtencion: 'L-V 14:00-18:00', añosExperiencia: 0, bibliografia: '' },
    { id: 3, nombres: 'Juan', apellidos: 'Pérez', especialidad: 'Fisioterapia', horarioAtencion: 'L-S 7:00-11:00', añosExperiencia: 0, bibliografia: '' },
    { id: 4, nombres: 'Ana', apellidos: 'Gómez', especialidad: 'Nutrición y Dietética', horarioAtencion: 'Mar-Jue 10:00-16:00', añosExperiencia: 0, bibliografia: '' }
  ];

  constructor() { }

  agregar(medico: Medico): void {
    this.medicos.push(medico);
  }

  obtenerTodos(): Medico[] {
    return this.medicos;
  }

  buscarPorId(id: number | string): Medico | undefined {
    return this.medicos.find(m => m.id === Number(id));
  }

  siguienteId(): number {
    return this.medicos.length > 0 ? Math.max(...this.medicos.map(m => m.id)) + 1 : 1;
  }
}