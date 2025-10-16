Feature: Registro de ventas y actualización de stock

  Scenario: Registrar una venta exitosa
    Given existe un cliente "Ana" y productos "Libro" (precio 20, stock 15) y "Lapicera" (precio 5, stock 30)
    When se crea una venta con 2 "Libro" y 3 "Lapicera" para "Ana"
    Then el total de la venta debe ser 55 y los stocks deben actualizarse a 13 y 27

  Scenario: Venta rechazada por stock insuficiente
    Given existe un cliente "Ana" y producto "Cuaderno" (precio 10, stock 1)
    When se intenta vender 5 "Cuaderno" a "Ana"
    Then el sistema debe rechazar la venta por stock insuficiente
