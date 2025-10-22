Feature: Servicio de Proveedor
  Como módulo de gestión de proveedores
  Quiero manejar operaciones CRUD 
  Para administrar correctamente la información de los proveedores

  Scenario: Crear un proveedor
    Given un nuevo proveedor válido
    When lo creo mediante create
    Then debería recibir el proveedor creado con los datos correctos

  Scenario: Obtener todos los proveedores
    Given que existen proveedores en la base de datos
    When solicito todos los proveedores mediante findAll
    Then debería recibir una lista de proveedores mapeados correctamente

  Scenario: Buscar un proveedor por id
    Given que existe un proveedor con id 1
    When lo busco mediante findById
    Then debería recibir el proveedor con id 1

  Scenario: Buscar un proveedor inexistente
    Given que no existe un proveedor con id 999
    When lo busco mediante findById
    Then debería lanzar un error "proveedor no encontrado"

  Scenario: Actualizar un proveedor existente
    Given un proveedor existente con id 1
    When actualizo el proveedor con un nuevo nombre "BGH"
    Then debería recibir el proveedor actualizado con nombre "BGH"

  Scenario: Eliminar un proveedor existente
    Given un proveedor existente con id 1
    When elimino el proveedor mediante softDelete
    Then debería confirmar que el proveedor se eliminó correctamente

Scenario: Error al crear un proveedor
  Given un nuevo proveedor válido
  And el repositorio lanza un error inesperado al crear
  When lo creo mediante create
  Then debería lanzar un error "Error al crear el proveedor"

  Scenario: Error al obtener todos los proveedores
  Given que el repositorio lanza un error inesperado al listar
  When solicito todos los proveedores mediante findAll
  Then debería lanzar un error "Error al obtener los proveedores"

Scenario: Error interno al buscar un proveedor por id
  Given que el repositorio lanza un error inesperado al buscar por id
  When lo busco mediante findById
  Then debería lanzar un error "Error al obtener el proveedor"


Scenario: Error al eliminar un proveedor inexistente
  Given un proveedor existente con id 1
  And el repositorio lanza un error inesperado al eliminar
  When elimino el proveedor mediante softDelete
  Then debería lanzar un error "Proveedor no encontrado"
