Feature: API de Usuarios

  Scenario: Registrar un usuario
    Given un payload de usuario
    When hago POST a /users/register
    Then debo recibir el estado "created"

  Scenario: Listar usuarios
    When hago GET a /users
    Then debo recibir una lista de usuarios

  Scenario: Obtener mi perfil
    When hago GET a /users/me
    Then debo recibir mi id y mis roles

  Scenario: Cerrar sesión
    When hago GET a /users/logout
    Then debo recibir un mensaje de cierre de sesión exitoso

  Scenario: Iniciar sesión
    Given credenciales de login
    When hago POST a /users/login
    Then debo recibir un mensaje de login exitoso y los tokens

  Scenario: Refrescar token
    Given una cookie refresh_token
    When hago GET a /users/refresh-token
    Then debo recibir un nuevo token de acceso

  Scenario: Asignar rol a usuario
    Given un id de usuario y un rol
    When hago POST a /users/:id/role
    Then debo recibir HTTP 200

  Scenario: Quitar rol a usuario
    When hago DELETE a /users/:userId/role/:roleId
    Then debo recibir HTTP 200

  Scenario: Listar roles de un usuario
    When hago GET a /users/:id/roles
    Then debo recibir una lista de roles
