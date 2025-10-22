Feature: Gestión de líneas

  Scenario: Crear una línea
    Given que tengo una nueva línea con nombre "Electrónica"
    When la creo mediante create
    Then debería recibir un objeto creado con nombre "Electrónica"

  Scenario: Listar todas las líneas
    Given que existen líneas en la base de datos
    When las solicito mediante findAll
    Then debería recibir un listado de líneas

  Scenario: Obtener una línea por id
    Given que existe una línea con id 1
    When la solicito mediante findOne con id 1
    Then debería recibir la línea con id 1

  Scenario: Actualizar una línea
    Given que existe una línea con id 1
    When actualizo la línea con nombre "Hogar" mediante update
    Then debería recibir la línea actualizada con nombre "Hogar"

  Scenario: Eliminar una línea
    Given que existe una línea con id 1
    When elimino la línea mediante remove
    Then debería recibir confirmación de eliminación

  Scenario: Crear una línea con error
    Given que el repositorio lanza un error al crear una línea
    When intento crear una nueva línea con nombre "Automotriz"
    Then debería lanzarse un error con mensaje "Error al crear la linea"

  Scenario: Listar líneas con error
    Given que el repositorio lanza un error al listar las líneas
    When intento listar todas las líneas
    Then debería lanzarse un error con mensaje "Error al obtener las lineas"

  Scenario: Buscar una línea inexistente
    Given que no existe una línea con id 999
    When intento obtener la línea con id 999
    Then debería lanzarse un error con mensaje "Error al obtener la linea"

  Scenario: Actualizar una línea inexistente
    Given que no existe una línea con id 999 para actualizar
    When intento actualizar la línea con id 999 con nombre "Industrial"
    Then debería lanzarse un error con mensaje "Error al actualizar la linea"

  Scenario: Eliminar una línea inexistente
    Given que no existe una línea con id 999 para eliminar
    When intento eliminar la línea con id 999
    Then debería lanzarse un error con mensaje "Error al eliminar la linea"
