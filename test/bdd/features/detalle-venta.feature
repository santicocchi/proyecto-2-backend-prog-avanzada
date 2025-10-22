Feature: Servicio de Detalles de Venta
  Como módulo de gestión de ventas
  Quiero manejar operaciones sobre detalles de venta
  Para administrar la información de los productos vendidos y su stock

  Scenario: Crear detalles de venta
    Given que tengo una lista de detalles de venta válidos
    When los creo mediante crearDetalles
    Then debería recibir los detalles creados con el total calculado correctamente

  Scenario: Crear detalle con stock insuficiente
    Given que un producto tiene stock insuficiente
    When intento crear un detalle con más cantidad de la disponible
    Then debería lanzar un error de "Stock insuficiente"

  Scenario: Obtener un detalle de venta existente
    Given que existe un detalle de venta con id 1
    When lo busco por id
    Then debería recibir el detalle mapeado correctamente

  Scenario: Actualizar un detalle de venta existente
    Given que existe un detalle de venta con id 1
    When actualizo sus datos
    Then debería devolver el detalle actualizado

  Scenario: Eliminar un detalle de venta existente
    Given que existe un detalle de venta con id 1
    When lo elimino
    Then debería recibir confirmación de eliminación
