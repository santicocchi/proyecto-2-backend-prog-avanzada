Feature: Auditoría de eventos sensibles

  Scenario: Registrar inicio de sesión
    Given un usuario inicia sesión exitosamente
    When se guarda la actividad en el registro
    Then el registro debe contener un evento de tipo "login"

  Scenario: Filtrar registros por tipo
    Given existen eventos de tipo "login" y "update"
    When el auditor filtra por tipo "update"
    Then debe obtener solo los eventos de tipo "update"
