Feature: Servicio de venta
  Como módulo de gestión de ventas
  Quiero manejar operaciones CRUD 
  Para administrar correctamente la información de las ventas

  Scenario: Crear una venta
    Given una nueva venta válida
    When la creo mediante create
    Then debería recibir la venta creada con los datos correctos

  Scenario: Obtener todas las ventas
    Given que existen ventas en la base de datos
    When solicito todas las ventas mediante findAll
    Then debería recibir una lista de ventas mapeadas correctamente

  Scenario: Buscar una venta por id
    Given que existe una venta con id 1
    When la busco mediante findOne
    Then debería recibir la venta con id 1

  Scenario: Buscar una venta inexistente
    Given que no existe una venta con id 999
    When la busco mediante findOne
    Then debería lanzar un error "venta no encontrada"

  Scenario: Eliminar una venta existente
    Given una venta existente con id 1
    When elimino la venta mediante softDelete
    Then debería confirmar que la venta se eliminó correctamente


  