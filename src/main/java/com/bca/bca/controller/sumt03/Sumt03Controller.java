package com.bca.bca.controller.sumt03;

import com.bca.bca.dto.PageResponse;
import com.bca.bca.entity.ProductionProcess;
import com.bca.bca.service.ProductionProcessService;
import com.bca.bca.util.QueryUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/su/sumt03")
@RequiredArgsConstructor
public class Sumt03Controller {

    private final ProductionProcessService processService;

    @GetMapping
    public PageResponse<ProductionProcess> getProcesses(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort) {
        Page<ProductionProcess> processPage = processService.findAll(QueryUtil.createPageable(page, size, sort));
        return new PageResponse<>(processPage.getContent(), processPage.getTotalElements());
    }

    @GetMapping("/detail")
    public ProductionProcess getProcess(@RequestParam Long id) {
        return processService.findById(id);
    }

    @GetMapping("/master")
    public Map<String, Object> getMaster() {
        Map<String, Object> master = new HashMap<>();
        master.put("processGroups", processService.findAllGroups());
        master.put("productionLocations", processService.findAllLocations());
        return master;
    }

    @PostMapping
    public ProductionProcess save(@RequestBody ProductionProcess process) {
        return processService.save(process);
    }

    @DeleteMapping
    public void delete(@RequestParam Long id) {
        processService.deleteById(id);
    }
}
