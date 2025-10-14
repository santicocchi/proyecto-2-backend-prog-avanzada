import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService,
    {
      provide: 'IPermissionRepository',
      useClass: PermissionRepository,
    },
  ]
})
export class PermissionModule { }
