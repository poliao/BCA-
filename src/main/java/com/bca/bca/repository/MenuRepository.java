package com.bca.bca.repository;

import com.bca.bca.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findAllByOrderBySequenceAsc();

    @Query(value = "WITH RECURSIVE authorized_menus AS (" +
            "    SELECT m.* FROM su_menus m " +
            "    JOIN su_role_permissions rp ON m.menu_id = rp.menu_id " +
            "    JOIN su_roles r ON rp.role_id = r.role_id " +
            "    WHERE r.role_code IN :roleCodes AND rp.is_visible = true " +
            "    UNION " +
            "    SELECT m.* FROM su_menus m " +
            "    INNER JOIN authorized_menus am ON am.parent_id = m.menu_id" +
            ") " +
            "SELECT DISTINCT * FROM authorized_menus ORDER BY sequence ASC", nativeQuery = true)
    List<Menu> findAuthorizedMenus(@Param("roleCodes") Collection<String> roleCodes);
}
