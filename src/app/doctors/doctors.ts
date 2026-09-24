import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';

interface Especialidad {
  id: string;
  nombre: string;
  descripcion: string;
}

interface MedicoCard {
  id: number;
  nombre: string;
  especialidad: string;
  horario: string;
  imagen: string;
}

export interface ErroresFormulario {
  paciente?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class DoctorsComponent {
  
  private pacienteService = inject(PacienteService);

  listaPacientes = this.pacienteService.pacientes;

  especialidades: Especialidad[] = [
    { id: '1', nombre: 'Terapia Neural', descripcion: 'Terapia Neural: Tratamiento sobre el sistema nervioso vegetativo para neutralizar irritaciones y aliviar dolores crónicos.' },
    { id: '2', nombre: 'Quiropraxia', descripcion: 'Quiropraxia: Diagnóstico y tratamiento manual de afecciones del sistema musculoesquelético y la columna vertebral.' },
    { id: '3', nombre: 'Fisioterapia', descripcion: 'Fisioterapia: Rehabilitación física integral mediante ejercicios y técnicas para recuperar la movilidad y función corporal.' },
    { id: '4', nombre: 'Nutrición y Dietética', descripcion: 'Nutrición y Dietética: Evaluación y planes alimenticios personalizados para optimizar la salud y prevenir enfermedades.' }
  ];

  especialidadSeleccionada = signal<Especialidad | null>(null);

  medicos: MedicoCard[] = [
    { 
      id: 1, 
      nombre: 'Dr. Carlos Mendoza', 
      especialidad: 'Terapia Neural', 
      horario: 'L-V 8:00-12:00', 
      imagen: 'resourceImages/medico1.jpg' 
    },
    { 
      id: 2, 
      nombre: 'Dra. María López', 
      especialidad: 'Quiropraxia', 
      horario: 'L-V 14:00-18:00', 
      imagen: 'resourceImages/medico2.jpg' 
    },
    { 
      id: 3, 
      nombre: 'Dr. Juan Pérez', 
      especialidad: 'Fisioterapia', 
      horario: 'L-S 7:00-11:00', 
      imagen: 'resourceImages/medico3.jpg' 
    },
    { 
      id: 4, 
      nombre: 'Dra. Ana Gómez', 
      especialidad: 'Nutrición y Dietética', 
      horario: 'Mar-Jue 10:00-16:00', 
      imagen: 'resourceImages/medico4.jpg' 
    },
    { 
      id: 5, 
      nombre: 'Dr. Roberto Silva', 
      especialidad: 'Fisioterapia', 
      horario: 'L-V 11:00-16:00', 
      imagen: 'resourceImages/medico5.jpg' 
    },
    { 
      id: 6, 
      nombre: 'Dra. Sofía Ramírez', 
      especialidad: 'Terapia Neural', 
      horario: 'Mar-Sáb 8:00-13:00', 
      imagen: 'resourceImages/medico6.jpg' 
    }
  ];

  seleccionarEspecialidad(esp: Especialidad) {
    if (this.especialidadSeleccionada()?.id === esp.id) {
      this.especialidadSeleccionada.set(null);
    } else {
      this.especialidadSeleccionada.set(esp);
    }
  }

  medicosFiltrados = computed(() => {
    const seleccionada = this.especialidadSeleccionada();
    if (!seleccionada) {
      return this.medicos;
    }
    return this.medicos.filter(m => m.especialidad === seleccionada.nombre);
  });

  medicoSeleccionado = signal<MedicoCard | null>(null);
  isModalOpen = signal<boolean>(false);

  pacienteSeleccionado = signal<string>('');
  fechaCita = signal<string>('');
  horaInicio = signal<string>('');
  horaFin = signal<string>('');

  erroresFormulario = signal<ErroresFormulario>({});
  citaConfirmada = signal<boolean>(false);

  get fechaHoy(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  agendarCita(medico: MedicoCard) {
    this.medicoSeleccionado.set(medico);
    this.resetForm();
    this.isModalOpen.set(true);
  }

  cerrarModal() {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  resetForm() {
    this.pacienteSeleccionado.set('');
    this.fechaCita.set('');
    this.horaInicio.set('');
    this.horaFin.set('');
    this.erroresFormulario.set({});
    this.citaConfirmada.set(false);
  }

  limpiarError(campo: keyof ErroresFormulario) {
    this.erroresFormulario.update(err => ({ ...err, [campo]: undefined }));
  }

  confirmarCita(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const nuevosErrores: ErroresFormulario = {};
    const paciente = this.pacienteSeleccionado();
    const fecha = this.fechaCita();
    const inicio = this.horaInicio();
    const fin = this.horaFin();

    if (!paciente) {
      nuevosErrores.paciente = 'Seleccione un paciente.';
    }

    if (!fecha) {
      nuevosErrores.fecha = 'Ingrese la fecha de la cita.';
    } else if (fecha < this.fechaHoy) {
      nuevosErrores.fecha = 'La fecha no puede ser anterior a la de hoy.';
    }

    if (!inicio) {
      nuevosErrores.horaInicio = 'Seleccione la hora inicial.';
    }

    if (!fin) {
      nuevosErrores.horaFin = 'Seleccione la hora final.';
    } else if (inicio && fin <= inicio) {
      nuevosErrores.horaFin = 'Debe ser posterior a la hora de inicio.';
    }

    this.erroresFormulario.set(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      this.citaConfirmada.set(true);
    }
  }

  obtenerNombrePaciente(): string {
    const id = Number(this.pacienteSeleccionado());
    const paciente = this.listaPacientes().find(p => p.id === id);
    if (paciente) {
      return `${paciente.nombres} ${paciente.apellidos} — ${paciente.tipoDocumento} ${paciente.numeroDocumento}`;
    }
    return 'Paciente';
  }
}