package com.bca.bca.repository;

import com.bca.bca.entity.Role;
import com.bca.bca.entity.Menu;
import com.bca.bca.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    List<RolePermission> findByRoleId(Long roleId);
    List<RolePermission> findByRole(Role role);
    Optional<RolePermission> findByRoleAndMenu(Role role, Menu menu);
}
