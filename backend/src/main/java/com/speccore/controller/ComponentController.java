package com.speccore.controller;

import com.speccore.entity.Component;
import com.speccore.service.ComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/components")
@CrossOrigin(origins = "*") // For development with React
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentService componentService;

    @GetMapping
    public ResponseEntity<List<Component>> getAllComponents() {
        List<Component> list = componentService.getAllComponents();
        try {
            // #region agent log
            java.nio.file.Files.writeString(java.nio.file.Path.of("C:/Users/ravi/OneDrive/Documents/study pdf/specore ai/debug-6e28f9.log"),
                "{\"sessionId\":\"6e28f9\",\"hypothesisId\":\"C\",\"location\":\"ComponentController.java:getAll\",\"message\":\"list components\",\"data\":{\"count\":" + list.size() + "},\"timestamp\":" + System.currentTimeMillis() + "}\n",
                java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
            // #endregion
        } catch (Exception ignored) {}
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Component> getComponentById(@PathVariable Long id) {
        return ResponseEntity.ok(componentService.getComponentById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Component>> getComponentsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(componentService.getComponentsByCategory(category));
    }
}
