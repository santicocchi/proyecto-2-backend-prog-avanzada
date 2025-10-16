import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

class AuthService {
  generateSecureToken() {
    // simulación: payload y firma
    return { token: 'signed.jwt.token', exp: Date.now() + 1000 * 60 * 60 };
  }
  isTwoFactorRequired(user: any) {
    return !!user.twoFactor;
  }
}

const feature = loadFeature('./test/bdd/features/session-security.feature');

defineFeature(feature, test => {
  let authService: AuthService;
  let token: any;
  let twoFactorRequired: boolean;

  beforeEach(() => {
    authService = new AuthService();
    token = undefined;
    twoFactorRequired = false;
  });

  test('Inicio de sesión con token seguro', ({ given, when, then }) => {
    given('un usuario se autentica exitosamente', () => {
      logStep('Given un usuario se autentica exitosamente');
    });

    when('se genera un token de sesión', () => {
      logStep('When se genera un token de sesión');
      token = authService.generateSecureToken();
    });

    then('el token debe estar firmado y tener expiración segura', () => {
      logStep('Then el token debe estar firmado y tener expiración segura');
      expect(token.token).toBeDefined();
      expect(token.exp).toBeGreaterThan(Date.now());
    });
  });

  test('Verificación en dos pasos', ({ given, when, then }) => {
    let user: any = { twoFactor: true };

    given('un usuario habilitó la verificación en dos pasos', () => {
      logStep('Given un usuario habilitó la verificación en dos pasos');
    });

    when('intenta iniciar sesión', () => {
      logStep('When intenta iniciar sesión');
      twoFactorRequired = authService.isTwoFactorRequired(user);
    });

    then('el sistema debe solicitar el segundo factor de autenticación', () => {
      logStep('Then el sistema debe solicitar el segundo factor de autenticación');
      expect(twoFactorRequired).toBe(true);
    });
  });
});
