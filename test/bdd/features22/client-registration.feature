Feature: Registro y activación de cuenta de cliente

  Scenario: Registro exitoso con email único
    Given no existe un cliente con email "cliente@example.com"
    When se registra con nombre "Carlos", email "cliente@example.com" y contraseña "Secreta123" coincidente
    Then el sistema envía un correo de confirmación a "cliente@example.com" y la cuenta queda pendiente de activación

  Scenario: Registro fallido por email duplicado
    Given ya existe un cliente con email "cliente@example.com"
    When se intenta registrar nuevamente con email "cliente@example.com"
    Then el sistema rechaza el registro por email ya existente

  Scenario: Activación de cuenta y inicio de sesión
    Given existe una cuenta pendiente para "cliente@example.com" con token "ABC123"
    When el cliente activa su cuenta con token "ABC123"
    Then el sistema habilita la cuenta y permite iniciar sesión con email "cliente@example.com" y contraseña "Secreta123"
