Feature: Alertas de stock bajo

  Scenario: Generar alerta cuando el stock baja a 10 unidades o menos
    Given existe un producto "Laptop" con stock 12
    When se vende 3 unidades de "Laptop"
    Then el sistema debe generar una alerta de stock para "Laptop" con cantidad 9

  Scenario: Resolver alerta cuando el stock se repone
    Given existe una alerta activa para "Laptop" con cantidad 9
    When se incrementa el stock de "Laptop" a 20 unidades
    Then la alerta de "Laptop" debe marcarse como resuelta

  Scenario: Consultar alertas activas
    Given existen alertas activas para "Laptop" y "Mouse"
    When el usuario revisa la sección de alertas
    Then el sistema muestra 2 alertas activas
