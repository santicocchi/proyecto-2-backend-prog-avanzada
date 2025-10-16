import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

type Event = { type: string; timestamp: number };

class AuditLogService {
  private logs: Event[] = [];
  addEvent(type: string) {
    this.logs.push({ type, timestamp: Date.now() });
  }
  filterByType(type: string) {
    return this.logs.filter(l => l.type === type);
  }
  getAll() {
    return this.logs;
  }
}

const feature = loadFeature('./test/bdd/features/audit-logging.feature');

defineFeature(feature, test => {
  let auditService: AuditLogService;
  let filtered: Event[] = [];

  beforeEach(() => {
    auditService = new AuditLogService();
    filtered = [];
  });

  test('Registrar inicio de sesión', ({ given, when, then }) => {
    given('un usuario inicia sesión exitosamente', () => {
      logStep('Given usuario inicia sesión');
    });

    when('se guarda la actividad en el registro', () => {
      logStep('When guardo evento login');
      auditService.addEvent('login');
    });

    then('el registro debe contener un evento de tipo "login"', () => {
      logStep('Then registro contiene evento login');
      expect(auditService.getAll().some(e => e.type === 'login')).toBe(true);
    });
  });

  test('Filtrar registros por tipo', ({ given, when, then }) => {
    given('existen eventos de tipo "login" y "update"', () => {
      logStep('Given existen eventos login y update');
      auditService.addEvent('login');
      auditService.addEvent('update');
    });

    when('el auditor filtra por tipo "update"', () => {
      logStep('When filtro por update');
      filtered = auditService.filterByType('update');
    });

    then('debe obtener solo los eventos de tipo "update"', () => {
      logStep('Then obtengo solo eventos update');
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('update');
    });
  });
});
