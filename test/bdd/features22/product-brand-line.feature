Feature: Registro rápido de marcas y líneas desde el formulario de producto

  Scenario: Crear una marca inexistente desde el formulario
    Given un usuario se encuentra en el formulario de producto
    When escribe una nueva marca "Acme" que no existe
    Then la marca "Acme" debe crearse y aparecer en la lista de marcas

  Scenario: Crear una línea inexistente desde el formulario
    Given la marca "Acme" está seleccionada en el formulario
    When escribe una nueva línea "Premium" que no existe dentro de "Acme"
    Then la línea "Premium" debe crearse y aparecer en la lista de líneas de "Acme"
