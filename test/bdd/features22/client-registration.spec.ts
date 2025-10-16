import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

type Client = { name: string; email: string; password: string; active: boolean; token?: string };

class ClientService {
  private clients: Map<string, Client> = new Map();
  register(name: string, email: string, pass: string, confirm: string) {
    if (this.clients.has(email)) return { ok: false, msg: 'email duplicado' };
    if (pass !== confirm) return { ok: false, msg: 'no match' };
    const token = 'ABC123';
    this.clients.set(email, { name, email, password: pass, active: false, token });
    return { ok: true, token };
  }
  activate(email: string, token: string) {
    const c = this.clients.get(email);
    if (!c || c.token !== token) return false;
    c.active = true; return true;
  }
  login(email: string, pass: string) {
    const c = this.clients.get(email);
    return !!c && c.active && c.password === pass;
  }
}

const feature = loadFeature('./test/bdd/features/client-registration.feature');

defineFeature(feature, test => {
  let svc: ClientService;
  let res: any;
  beforeEach(() => { svc = new ClientService(); });

  test('Registro exitoso con email único', ({ given, when, then }) => {
    given(/^no existe un cliente con email "([^"]*)"$/, (email) => { logStep('Given email libre'); });
    when(/^se registra con nombre "([^"]*)", email "([^"]*)" y contraseña "([^"]*)" coincidente$/, (name, email, pass) => {
      logStep('When registro'); res = svc.register(name, email, pass, pass);
    });
    then(/^el sistema envía un correo de confirmación a "([^"]*)" y la cuenta queda pendiente de activación$/, (email) => {
      logStep('Then mail enviado'); expect(res.ok).toBe(true); expect(res.token).toBeDefined();
    });
  });

  test('Registro fallido por email duplicado', ({ given, when, then }) => {
    given(/^ya existe un cliente con email "([^"]*)"$/, (email) => { svc.register('x', email, 'a', 'a'); });
    when(/^se intenta registrar nuevamente con email "([^"]*)"$/, (email) => { res = svc.register('y', email, 'a', 'a'); });
    then('el sistema rechaza el registro por email ya existente', () => { expect(res.ok).toBe(false); });
  });

  test('Activación de cuenta y inicio de sesión', ({ given, when, then }) => {
    let ok = false;
    given(/^existe una cuenta pendiente para "([^"]*)" con token "([^"]*)"$/, (email, token) => { svc.register('c', email, 'Secreta123', 'Secreta123'); });
    when(/^el cliente activa su cuenta con token "([^"]*)"$/, (token) => { ok = svc.activate('cliente@example.com', token); });
    then(/^el sistema habilita la cuenta y permite iniciar sesión con email "([^"]*)" y contraseña "([^"]*)"$/, (email, pass) => {
      expect(ok).toBe(true); expect(svc.login(email, pass)).toBe(true);
    });
  });
});
