Feature: Gestión de roles y permisos

  Scenario: Asignar un rol a un usuario
    Given existe un rol "Editor" con permisos básicos
    When el administrador asigna el rol "Editor" al usuario "juan@example.com"
    Then el usuario debe tener asignado el rol "Editor"

  Scenario: Modificar permisos de un rol
    Given existe un rol "Viewer" con permiso "read"
    When el administrador agrega el permiso "export" al rol "Viewer"
    Then el rol "Viewer" debe incluir el permiso "export"
