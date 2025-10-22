Feature: Servicio de Clientes
  Como módulo de gestión de clientes
  Quiero manejar operaciones CRUD
  Para administrar la información de los clientes

  Scenario: Crear un cliente
    Given un nuevo cliente válido
    When lo creo en el servicio
    Then debería obtener el cliente mapeado correctamente

  Scenario: Obtener todos los clientes
    Given una lista de clientes existentes
    When obtengo todos los clientes
    Then debería recibir una lista mapeada

  Scenario: Buscar un cliente existente
    Given un cliente existente con id 1
    When lo busco por id
    Then debería devolver sus datos correctamente

  Scenario: Buscar un cliente inexistente
    Given que no existe un cliente con id 99
    When lo busco por id
    Then debería lanzar un error de "Cliente no encontrado"

  Scenario: Actualizar un cliente existente
    Given un cliente existente con id 1
    When actualizo sus datos
    Then debería devolver el cliente actualizado

  Scenario: Eliminar un cliente existente
    Given un cliente existente con id 1
    When lo elimino
    Then debería confirmar que se eliminó correctamente
