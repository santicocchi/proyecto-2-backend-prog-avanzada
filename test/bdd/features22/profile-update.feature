Feature: Actualización de Perfil

  Scenario: El usuario actualiza su información de contacto correctamente
    Given existe un cliente con id 1, nombre "Juan" y teléfono "111"
    When actualizo el nombre a "Carlos" y el teléfono a "123" para el cliente 1
    Then el servicio debe devolver el nombre "Carlos" y el teléfono "123"
