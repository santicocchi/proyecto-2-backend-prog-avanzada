Feature: Servicio de proveedoresXProductos
  Como módulo de gestión de proveedoresXProductos
  Quiero manejar operaciones CRUD y de stock
  Para administrar correctamente la información de los proveedoresXProductos

  Scenario: Crear un proveedorXProducto
    Given un nuevo proveedorXProducto válido
    When lo creo mediante create
    Then debería recibir el proveedorXProducto creado con los datos correctos

  Scenario: Obtener todos los proveedoresXProductos
    Given que existen proveedoresXProductos en la base de datos
    When solicito todos los proveedoresXProductos mediante findAll
    Then debería recibir una lista de proveedoresXProductos mapeados correctamente

  Scenario: Buscar un proveedorXProducto por id
    Given que existe un proveedorXProducto con id 1
    When lo busco mediante findOne
    Then debería recibir el proveedorXProducto con id 1

  Scenario: Buscar un proveedorXProducto inexistente
    Given que no existe un proveedorXProducto con id 999
    When lo busco mediante findOne
    Then debería lanzar un error "Relación proveedor-producto no encontrada"

  Scenario: Actualizar un proveedorXProducto existente
    Given un proveedorXProducto existente con id 1
    When actualizo el proveedorXProducto con un nuevo precio 1200
    Then debería recibir el proveedorXProducto actualizado con precio 1200

  Scenario: Eliminar un proveedorXProducto existente
    Given un proveedorXProducto existente con id 1
    When elimino el proveedorXProducto mediante softDelete
    Then debería confirmar que el proveedorXProducto se eliminó correctamente  

    Scenario: Error al crear un proveedorXProducto
    Given un error inesperado al intentar crear un proveedorXProducto
    When ejecuto create
    Then debería lanzar un error "Error al crear la relación proveedor-producto"

  Scenario: Error al obtener todos los proveedoresXProductos
    Given un error inesperado al intentar obtener todos los proveedoresXProductos
    When ejecuto findAll
    Then debería lanzar un error "Error al obtener las relaciones proveedor-producto"

  Scenario: Error inesperado al buscar un proveedorXProducto
    Given un error inesperado al intentar obtener un proveedorXProducto
    When ejecuto findOne
    Then debería lanzar un error "Error al obtener la relación proveedor-producto"

  Scenario: Error inesperado al actualizar un proveedorXProducto
    Given un error inesperado al intentar actualizar un proveedorXProducto
    When ejecuto update
    Then debería lanzar un error "Error al actualizar la relación proveedor-producto"

  Scenario: Error inesperado al eliminar un proveedorXProducto
    Given un error inesperado al intentar eliminar un proveedorXProducto
    When ejecuto remove
    Then debería lanzar un error "Error al eliminar la relación proveedor-producto"
