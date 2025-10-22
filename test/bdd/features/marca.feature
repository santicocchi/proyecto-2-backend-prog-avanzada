Feature: Gestión de marcas

  Scenario: Crear una marca
    Given que quiero crear una marca con nombre "Adidas"
    When la creo mediante create
    Then debería recibir un objeto con nombre "Adidas"

  Scenario: Error al crear una marca
    Given que el repositorio lanza un error al crear una marca
    When intento crear la marca
    Then debería lanzar una excepción con mensaje "Error al crear la marca"

  Scenario: Listar todas las marcas
    Given que existen marcas en la base de datos
    When las solicito mediante findAll
    Then debería recibir un listado de marcas

  Scenario: Error al listar todas las marcas
    Given que el repositorio lanza un error al listar las marcas
    When intento listar las marcas
    Then debería lanzar una excepción con mensaje "Error al obtener las marcas"

  Scenario: Obtener una marca por id
    Given que existe una marca con id 1
    When la solicito mediante findOne con id 1
    Then debería recibir la marca con id 1

  Scenario: Error al obtener una marca inexistente
    Given que no existe una marca con id 999
    When la solicito mediante findOne con id 999
    Then debería lanzar una excepción con mensaje "Marca no encontrada"

  Scenario: Actualizar una marca
    Given que existe una marca con id 1
    When actualizo la marca con nombre "Nike" mediante update
    Then debería recibir la marca actualizada con nombre "Nike"

  Scenario: Error al actualizar una marca inexistente
    Given que no existe una marca con id 999
    When intento actualizar la marca con nombre "Reebok"
    Then debería lanzar una excepción con mensaje "Marca no encontrada"

  Scenario: Eliminar una marca
    Given que existe una marca con id 1
    When elimino la marca mediante remove
    Then debería recibir confirmación de eliminación

  Scenario: Error al eliminar una marca inexistente
    Given que no existe una marca con id 999
    When intento eliminar la marca
    Then debería lanzar una excepción con mensaje "Marca no encontrada"

  Scenario: Asignar línea a una marca
    Given que quiero asignar la línea 1 a la marca 1
    When asigno la línea mediante assignLinea
    Then debería recibir mensaje de éxito

  Scenario: Error al asignar línea a una marca inexistente
    Given que no existe una marca con id 999
    When intento asignar la línea 1
    Then debería lanzar una excepción con mensaje "Marca no encontrada"

  Scenario: Error al asignar línea inexistente
    Given que existe una marca con id 1 pero la línea 999 no existe
    When intento asignar la línea 999
    Then debería lanzar una excepción con mensaje "Linea no encontrada"

  Scenario: Línea ya asignada a una marca
    Given que la línea 1 ya está asignada a la marca 1
    When intento asignar la línea 1 nuevamente
    Then debería lanzar una excepción con mensaje "La linea 1 ya está asignada a la marca 1"

  Scenario: Remover línea de una marca
    Given que quiero remover la línea 1 de la marca 1
    When remuevo la línea mediante removeLinea
    Then debería recibir mensaje de éxito

  Scenario: Error al remover línea de una marca inexistente
    Given que no existe una marca con id 999
    When intento remover la línea 1
    Then debería lanzar una excepción con mensaje "Marca no encontrada"

  Scenario: Error al remover línea inexistente
    Given que existe una marca con id 1 pero la línea 999 no existe
    When intento remover la línea 999
    Then debería lanzar una excepción con mensaje "Linea no encontrada"

  Scenario: Línea no asignada a la marca
    Given que la línea 1 no está asignada a la marca 1
    When intento remover la línea 1
    Then debería lanzar una excepción con mensaje "La linea 1 no está asignada a la marca 1"
