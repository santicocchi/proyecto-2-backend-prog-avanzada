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
