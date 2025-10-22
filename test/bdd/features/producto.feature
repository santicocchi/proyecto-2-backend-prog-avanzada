Feature: Servicio de Productos
  Como módulo de gestión de productos
  Quiero manejar operaciones CRUD y de stock
  Para administrar correctamente la información de los productos

  Scenario: Crear un producto
    Given un nuevo producto válido
    When lo creo mediante create
    Then debería recibir el producto creado con los datos correctos

  Scenario: Obtener todos los productos
    Given que existen productos en la base de datos
    When solicito todos los productos mediante findAll
    Then debería recibir una lista de productos mapeados correctamente

  Scenario: Buscar un producto por id
    Given que existe un producto con id 1
    When lo busco mediante findById
    Then debería recibir el producto con id 1

  Scenario: Buscar un producto inexistente
    Given que no existe un producto con id 999
    When lo busco mediante findById
    Then debería lanzar un error "Producto no encontrado"

  Scenario: Actualizar un producto existente
    Given un producto existente con id 1
    When actualizo el producto con un nuevo nombre "Monitor Gamer"
    Then debería recibir el producto actualizado con nombre "Monitor Gamer"

  Scenario: Eliminar un producto existente
    Given un producto existente con id 1
    When elimino el producto mediante softDelete
    Then debería confirmar que el producto se eliminó correctamente

  Scenario: Disminuir el stock de un producto
    Given un producto existente con id 1 y stock 10
    When disminuyo el stock en 3 unidades
    Then el stock final debería ser 7

  Scenario: Intentar disminuir stock con cantidad mayor al disponible
    Given un producto existente con id 1 y stock 7
    When intento disminuir el stock en 10 unidades
    Then debería quedar un stock negativo

  