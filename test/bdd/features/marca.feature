Feature: Gestión de marcas

  Scenario: Crear una marca
    Given que quiero crear una marca con nombre "Adidas"
    When la creo mediante create
    Then debería recibir un objeto con nombre "Adidas"

  Scenario: Listar todas las marcas
    Given que existen marcas en la base de datos
    When las solicito mediante findAll
    Then debería recibir un listado de marcas

  Scenario: Obtener una marca por id
    Given que existe una marca con id 1
    When la solicito mediante findOne con id 1
    Then debería recibir la marca con id 1

  Scenario: Actualizar una marca
    Given que existe una marca con id 1
    When actualizo la marca con nombre "Nike" mediante update
    Then debería recibir la marca actualizada con nombre "Nike"

  Scenario: Eliminar una marca
    Given que existe una marca con id 1
    When elimino la marca mediante remove
    Then debería recibir confirmación de eliminación

  Scenario: Asignar línea a una marca
    Given que quiero asignar la línea 1 a la marca 1
    When asigno la línea mediante assignLinea
    Then debería recibir mensaje de éxito

  Scenario: Remover línea de una marca
    Given que quiero remover la línea 1 de la marca 1
    When remuevo la línea mediante removeLinea
    Then debería recibir mensaje de éxito
