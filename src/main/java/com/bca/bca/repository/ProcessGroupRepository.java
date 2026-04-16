package com.bca.bca.repository;

import com.bca.bca.entity.ProcessGroup;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessGroupRepository extends JpaRepository<ProcessGroup, Long> {
    List<ProcessGroup> findAllByOrderByDisplayOrderAscGroupNameAsc();
}
