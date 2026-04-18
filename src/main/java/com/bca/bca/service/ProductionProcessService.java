package com.bca.bca.service;

import com.bca.bca.entity.*;
import com.bca.bca.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionProcessService {

    private final ProductionProcessRepository processRepository;
    private final ProcessGroupRepository groupRepository;
    private final ProductionLocationRepository locationRepository;

    @Transactional(readOnly = true)
    public Page<ProductionProcess> findAll(Pageable pageable) {
        return processRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public ProductionProcess findById(Long id) {
        return processRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Process not found"));
    }

    @Transactional(readOnly = true)
    public List<ProcessGroup> findAllGroups() {
        return groupRepository.findAllByOrderByDisplayOrderAscGroupNameAsc();
    }

    @Transactional(readOnly = true)
    public List<ProductionLocation> findAllLocations() {
        return locationRepository.findAll();
    }

    @Transactional
    public ProductionProcess save(ProductionProcess process) {
        ProductionProcess persistentProcess;
        if (process.getId() != null) {
            persistentProcess = processRepository.findById(process.getId())
                    .orElseThrow(() -> new RuntimeException("Process not found"));
            persistentProcess.setProcessName(process.getProcessName());
            persistentProcess.setBaseUom(process.getBaseUom());
            persistentProcess.setGroupId(process.getGroupId());
            persistentProcess.setStatus(process.getStatus());
            persistentProcess.setRowVersion(process.getRowVersion());
            if (process.getPricingTiers() != null) {
                Map<Long, ProcessPricingTier> existingTierMap = persistentProcess.getPricingTiers().stream()
                        .filter(t -> t.getId() != null)
                        .collect(Collectors.toMap(ProcessPricingTier::getId, t -> t));

                List<ProcessPricingTier> incomingTiers = process.getPricingTiers();
                List<Long> incomingIds = incomingTiers.stream()
                        .map(ProcessPricingTier::getId)
                        .filter(id -> id != null)
                        .collect(Collectors.toList());

                // 1. Remove missing tiers
                persistentProcess.getPricingTiers().removeIf(t -> t.getId() != null && !incomingIds.contains(t.getId()));

                // 2. Update existing or Add new
                for (ProcessPricingTier incoming : incomingTiers) {
                    if (incoming.getId() == null) {
                        incoming.setProcess(persistentProcess);
                        persistentProcess.getPricingTiers().add(incoming);
                    } else if (existingTierMap.containsKey(incoming.getId())) {
                        ProcessPricingTier existing = existingTierMap.get(incoming.getId());
                        existing.setMinQty(incoming.getMinQty());
                        existing.setMaxQty(incoming.getMaxQty());
                        existing.setFixedCost(incoming.getFixedCost());
                        existing.setVariableRate(incoming.getVariableRate());
                        existing.setVariableUnitLabel(incoming.getVariableUnitLabel());
                        existing.setColorCount(incoming.getColorCount());
                        existing.setCutSize(incoming.getCutSize());
                        existing.setStampType(incoming.getStampType());
                        existing.setStampSize(incoming.getStampSize());
                        existing.setTotalAdditionalCost(incoming.getTotalAdditionalCost());
                        existing.setLocationId(incoming.getLocationId());
                        existing.setRowVersion(incoming.getRowVersion());
                    }
                }
            }
        } else {
            persistentProcess = process;
            if (persistentProcess.getPricingTiers() != null) {
                for (ProcessPricingTier tier : persistentProcess.getPricingTiers()) {
                    tier.setProcess(persistentProcess);
                }
            }
        }
        return processRepository.save(persistentProcess);
    }

    @Transactional
    public void deleteById(Long id) {
        processRepository.deleteById(id);
    }

    // --- Process Group CRUD ---

    @Transactional
    public ProcessGroup saveGroup(ProcessGroup group) {
        if (group.getId() != null) {
            ProcessGroup persistent = groupRepository.findById(group.getId())
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            persistent.setGroupName(group.getGroupName());
            persistent.setDisplayOrder(group.getDisplayOrder());
            persistent.setRowVersion(group.getRowVersion());
            return groupRepository.save(persistent);
        }
        return groupRepository.save(group);
    }

    @Transactional
    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }

    // --- Production Location CRUD ---

    @Transactional
    public ProductionLocation saveLocation(ProductionLocation location) {
        if (location.getId() != null) {
            ProductionLocation persistent = locationRepository.findById(location.getId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            persistent.setLocationName(location.getLocationName());
            persistent.setLocationType(location.getLocationType());
            persistent.setRowVersion(location.getRowVersion());
            return locationRepository.save(persistent);
        }
        return locationRepository.save(location);
    }

    @Transactional
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
}
