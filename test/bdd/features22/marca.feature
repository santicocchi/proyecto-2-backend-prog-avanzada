Feature: Gestión de Marcas

  Scenario: Crear una nueva marca
    When creo una marca con nombre "Nike"
    Then el servicio debe responder "Nike"
