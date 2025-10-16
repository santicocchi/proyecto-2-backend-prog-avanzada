Feature: Recuperación de Contraseña

  Scenario: Solicitar enlace de restablecimiento
    Given tengo el correo "usuario@example.com"
    When solicito el restablecimiento de contraseña
    Then debo recibir un enlace de restablecimiento por correo electrónico

  Scenario: Restablecer la contraseña con requisitos de seguridad
    Given he recibido un enlace de restablecimiento válido
    When ingreso una nueva contraseña "NuevaSegura123!"
    Then la contraseña debe actualizarse correctamente
