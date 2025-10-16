Feature: Protección de sesión del usuario

  Scenario: Inicio de sesión con token seguro
    Given un usuario se autentica exitosamente
    When se genera un token de sesión
    Then el token debe estar firmado y tener expiración segura

  Scenario: Verificación en dos pasos
    Given un usuario habilitó la verificación en dos pasos
    When intenta iniciar sesión
    Then el sistema debe solicitar el segundo factor de autenticación
