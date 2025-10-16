Feature: Gestión de formas de pago

  Scenario: Crear una forma de pago
    Given que tengo una nueva forma de pago con nombre "Tarjeta"
    When la creo mediante create
    Then debería recibir un objeto creado con nombre "Tarjeta"

  Scenario: Listar todas las formas de pago
    Given que existen formas de pago en la base de datos
    When las solicito mediante findAll
    Then debería recibir un listado de formas de pago

  Scenario: Obtener una forma de pago por id
    Given que existe una forma de pago con id 1
    When la solicito mediante findOne con id 1
    Then debería recibir la forma de pago con id 1

  Scenario: Actualizar una forma de pago
    Given que existe una forma de pago con id 1
    When actualizo la forma de pago con nombre "Efectivo" mediante update
    Then debería recibir la forma de pago actualizada con nombre "Efectivo"

  Scenario: Eliminar una forma de pago
    Given que existe una forma de pago con id 1
    When elimino la forma de pago mediante remove
    Then debería recibir confirmación de eliminación
