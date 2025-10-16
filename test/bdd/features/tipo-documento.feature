Feature: Gestión de tipos de documento

  Scenario: Crear un tipo de documento
    Given que tengo un nuevo tipo de documento con nombre "DNI"
    When lo creo mediante el servicio
    Then debería recibir un objeto creado con nombre "DNI"

  Scenario: Listar todos los tipos de documento
    Given que existen tipos de documento en la base de datos
    When los obtengo mediante el servicio
    Then debería recibir un listado de tipos de documento

  Scenario: Obtener un tipo de documento por id
    Given que existe un tipo de documento con id 1
    When lo obtengo mediante el servicio
    Then debería recibir el tipo de documento con id 1

  Scenario: Actualizar un tipo de documento
    Given que existe un tipo de documento con id 1
    When actualizo su nombre a "CUIL" mediante el servicio
    Then debería recibir el tipo de documento actualizado con nombre "CUIL"
