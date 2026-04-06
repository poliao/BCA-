import { EntityBase } from "@app/shared/service/base.service"

export class SuUser extends EntityBase {
    id: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roles: SuRole[] = [];
}

export class SuRole extends EntityBase {
    id: number;
    roleCode: string;
    roleName: string;
    description: string;
    isActive: boolean;
    permissions: SuRolePermission[] = [];
}

export class SuRolePermission extends EntityBase {
    id: number;
    roleId: number;
    menuId: number;
    menuCode: string;
    menuName: string;
    systemCode: string;
    isVisible: boolean;
    canRead: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canPrint: boolean;
    canApprove: boolean;
    canVerify: boolean;
    
    // For Tree Hierarchy
    parentId: number;
    children: SuRolePermission[] = [];
}

