Feature: Gestión de formas de pago

  Scenario: Crear una forma de pago
    Given que tengo una nueva forma de pago con nombre "Tarjeta"
    When la creo mediante create
    Then debería recibir un objeto creado con nombre "Tarjeta"

  Scenario: Crear una forma de pago con error
    Given que tengo caida la base de datos
    When la creo mediante create
    Then debería recibir un error "Error al crear la forma de pago"

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

Scenario: Listar formas de pago con error
    Given que el repositorio lanza un error al listar las formas de pago
    When intento listar todas las formas de pago
    Then debería lanzarse un error con mensaje "Error al obtener las formas de pago"

  Scenario: Buscar una forma de pago inexistente
    Given que no existe una forma de pago con id 999
    When intento obtener la forma de pago con id 999
    Then debería lanzarse un error con mensaje "Forma de pago no encontrada"

  Scenario: Actualizar una forma de pago inexistente
    Given que no existe una forma de pago con id 999 para actualizar
    When intento actualizar la forma de pago con id 999 con nombre "Nueva"
    Then debería lanzarse un error con mensaje "Forma de pago no encontrada"

  Scenario: Eliminar una forma de pago inexistente
    Given que no existe una forma de pago con id 999 para eliminar
    When intento eliminar la forma de pago con id 999
    Then debería lanzarse un error con mensaje "Forma de pago no encontrada"