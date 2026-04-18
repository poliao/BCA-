package com.bca.bca.service;

import com.bca.bca.dto.RolePermissionTreeDto;
import com.bca.bca.entity.Menu;
import com.bca.bca.entity.RolePermission;
import com.bca.bca.repository.MenuRepository;
import com.bca.bca.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<RolePermissionTreeDto> getPermissionTree(Long roleId) {
        List<Menu> allMenus = menuRepository.findAll();
        List<RolePermission> currentPermissions = roleId != null 
            ? rolePermissionRepository.findByRoleId(roleId) 
            : new ArrayList<>();

        Map<Long, RolePermission> permMap = currentPermissions.stream()
            .collect(Collectors.toMap(p -> p.getMenu().getId(), p -> p));

        List<RolePermissionTreeDto> allDtos = allMenus.stream().map(m -> {
            RolePermission p = permMap.get(m.getId());
            return RolePermissionTreeDto.builder()
                .id(p != null ? p.getId() : null)
                .roleId(roleId)
                .menuId(m.getId())
                .menuCode(m.getMenuCode())
                .menuName(m.getMenuNameTh() != null ? m.getMenuNameTh() : m.getMenuNameEn())
                .parentMenuCode(m.getParentMenuCode())
                .isVisible(p != null ? p.getIsVisible() : false)
                .canRead(p != null ? p.getCanRead() : false)
                .canCreate(p != null ? p.getCanCreate() : false)
                .canEdit(p != null ? p.getCanEdit() : false)
                .canDelete(p != null ? p.getCanDelete() : false)
                .canApprove(p != null ? p.getCanApprove() : false)
                .canVerify(p != null ? p.getCanVerify() : false)
                .rowState(p != null ? 0 : 1) // 0 = Normal, 1 = Add
                .rowVersion(p != null ? p.getRowVersion() : null)
                .build();
        }).collect(Collectors.toList());

        return buildTree(allDtos);
    }

    private List<RolePermissionTreeDto> buildTree(List<RolePermissionTreeDto> flatList) {
        Map<String, RolePermissionTreeDto> dtoMap = flatList.stream()
            .collect(Collectors.toMap(RolePermissionTreeDto::getMenuCode, d -> d));

        List<RolePermissionTreeDto> rootNodes = new ArrayList<>();
        for (RolePermissionTreeDto dto : flatList) {
            if (dto.getParentMenuCode() == null || dto.getParentMenuCode().isEmpty()) {
                rootNodes.add(dto);
            } else {
                RolePermissionTreeDto parent = dtoMap.get(dto.getParentMenuCode());
                if (parent != null) {
                    parent.getChildren().add(dto);
                }
            }
        }
        return rootNodes;
    }

    @Transactional(readOnly = true)
    public List<RolePermission> findAll() {
        return rolePermissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<RolePermission> findAll(Pageable pageable) {
        return rolePermissionRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public RolePermission findById(Long id) {
        return rolePermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RolePermission not found"));
    }

    @Transactional
    public RolePermission save(RolePermission rolePermission) {
        return rolePermissionRepository.save(rolePermission);
    }

    @Transactional
    public void deleteById(Long id) {
        rolePermissionRepository.deleteById(id);
    }
}
