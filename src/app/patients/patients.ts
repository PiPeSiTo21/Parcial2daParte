import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class PatientsComponent implements OnInit {
  private pacienteService = inject(PacienteService);

  listaPacientes: Paciente[] = [];

  tipoDocumento = signal<string>('');
  numeroDocumento = signal<string>('');
  nombres = signal<string>('');
  apellidos = signal<string>('');
  telefono = signal<string>('');
  fechaNacimiento = signal<string>('');
  sexo = signal<string>('');

  errores = signal<Record<string, string>>({});
  mensajeExito = signal<string>('');

  get fechaHoy(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.listaPacientes = this.pacienteService.obtenerTodos();
  }

  validarSoloLetras(campo: 'nombres' | 'apellidos', event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorLimpio = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 50);
    input.value = valorLimpio;

    if (campo === 'nombres') this.nombres.set(valorLimpio);
    if (campo === 'apellidos') this.apellidos.set(valorLimpio);
    this.limpiarError(campo);
  }

  validarSoloNumeros(campo: 'numeroDocumento' | 'telefono', event: Event): void {
    const input = event.target as HTMLInputElement;
    const max = campo === 'numeroDocumento' ? 15 : 12;
    const valorLimpio = input.value.replace(/[^0-9]/g, '').slice(0, max);
    input.value = valorLimpio;

    if (campo === 'numeroDocumento') this.numeroDocumento.set(valorLimpio);
    if (campo === 'telefono') this.telefono.set(valorLimpio);
    this.limpiarError(campo);
  }

  limpiarError(campo: string): void {
    const errs = { ...this.errores() };
    delete errs[campo];
    this.errores.set(errs);
  }

  validarFormulario(): boolean {
    const errs: Record<string, string> = {};

    if (!this.tipoDocumento()) errs['tipoDocumento'] = 'Seleccione tipo de documento';

    const numDoc = this.numeroDocumento().trim();
    if (numDoc.length < 5 || numDoc.length > 15) {
      errs['numeroDocumento'] = 'El documento debe tener entre 5 y 15 dígitos';
    }

    const nom = this.nombres().trim();
    if (nom.length < 2 || nom.length > 50) {
      errs['nombres'] = 'Los nombres deben tener entre 2 y 50 caracteres';
    }

    const ape = this.apellidos().trim();
    if (ape.length < 2 || ape.length > 50) {
      errs['apellidos'] = 'Los apellidos deben tener entre 2 y 50 caracteres';
    }

    const tel = this.telefono().trim();
    if (tel.length < 7 || tel.length > 12) {
      errs['telefono'] = 'El teléfono debe tener entre 7 y 12 dígitos';
    }

    if (!this.fechaNacimiento()) {
      errs['fechaNacimiento'] = 'La fecha es obligatoria';
    } else if (this.fechaNacimiento() > this.fechaHoy) {
      errs['fechaNacimiento'] = 'La fecha de nacimiento no puede ser futura';
    }

    if (!this.sexo()) {
      errs['sexo'] = 'Seleccione el sexo del paciente';
    }

    this.errores.set(errs);
    return Object.keys(errs).length === 0;
  }

  guardarPaciente(event: Event): void {
    event.preventDefault();

    if (!this.validarFormulario()) return;

    const nuevoPaciente: Paciente = {
      id: this.pacienteService.siguienteId(),
      tipoDocumento: this.tipoDocumento(),
      numeroDocumento: this.numeroDocumento().trim(),
      nombres: this.nombres().trim(),
      apellidos: this.apellidos().trim(),
      telefono: this.telefono().trim(),
      fechaNacimiento: this.fechaNacimiento(),
      sexo: this.sexo()
    };

    this.pacienteService.agregar(nuevoPaciente);
    this.cargarPacientes();

    this.mensajeExito.set(
      `¡Registro confirmado! Usuario ${nuevoPaciente.nombres} ${nuevoPaciente.apellidos} registrado con éxito.`
    );

    this.resetFormulario();

    setTimeout(() => this.mensajeExito.set(''), 4000);
  }

  resetFormulario(): void {
    this.tipoDocumento.set('');
    this.numeroDocumento.set('');
    this.nombres.set('');
    this.apellidos.set('');
    this.telefono.set('');
    this.fechaNacimiento.set('');
    this.sexo.set('');
    this.errores.set({});
  }
}