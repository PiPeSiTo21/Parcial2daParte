import { Medico } from './medico.model';
import { Paciente } from './paciente.model';

export interface Cita {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  medico: Medico;
  paciente: Paciente;
}