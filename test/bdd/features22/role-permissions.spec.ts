import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

type Role = { name: string; permissions: string[] };

class RoleService {
  private roles: Map<string, Role> = new Map();
  assignRole(userEmail: string, roleName: string) {
    return { email: userEmail, role: roleName };
  }
  addPermission(roleName: string, permission: string) {
    const role = this.roles.get(roleName)!;
    role.permissions.push(permission);
  }
  createRole(name: string, permissions: string[]) {
    this.roles.set(name, { name, permissions });
  }
  getRole(name: string) {
    return this.roles.get(name);
  }
}

const feature = loadFeature('./test/bdd/features/role-permissions.feature');

defineFeature(feature, test => {
  let roleService: RoleService;
  let result: any;

  beforeEach(() => {
    roleService = new RoleService();
    result = undefined;
  });

  test('Asignar un rol a un usuario', ({ given, when, then }) => {
    given(/^existe un rol "([^"]*)" con permisos básicos$/, (roleName: string) => {
      logStep(`Given existe un rol ${roleName}`);
      roleService.createRole(roleName, ['read', 'write']);
    });

    when(/^el administrador asigna el rol "([^"]*)" al usuario "([^"]*)"$/, (roleName: string, email: string) => {
      logStep(`When asigno el rol ${roleName} al usuario ${email}`);
      result = roleService.assignRole(email, roleName);
    });

    then(/^el usuario debe tener asignado el rol "([^"]*)"$/, (roleName: string) => {
      logStep(`Then el usuario debe tener el rol ${roleName}`);
      expect(result.role).toBe(roleName);
    });
  });

  test('Modificar permisos de un rol', ({ given, when, then }) => {
    given(/^existe un rol "([^"]*)" con permiso "([^"]*)"$/, (roleName: string, perm: string) => {
      logStep(`Given rol ${roleName} con permiso ${perm}`);
      roleService.createRole(roleName, [perm]);
    });

    when(/^el administrador agrega el permiso "([^"]*)" al rol "([^"]*)"$/, (perm: string, roleName: string) => {
      logStep(`When agrego permiso ${perm} a rol ${roleName}`);
      roleService.addPermission(roleName, perm);
    });

    then(/^el rol "([^"]*)" debe incluir el permiso "([^"]*)"$/, (roleName: string, perm: string) => {
      logStep(`Then rol ${roleName} incluye permiso ${perm}`);
      expect(roleService.getRole(roleName)!.permissions).toContain(perm);
    });
  });
});
