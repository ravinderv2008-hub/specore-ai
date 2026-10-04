package com.speccore.service;

import com.speccore.entity.Component;
import com.speccore.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComponentService {

    private final ComponentRepository componentRepository;

    public List<Component> getAllComponents() {
        return componentRepository.findAll();
    }

    public Component getComponentById(Long id) {
        return componentRepository.findById(id).orElseThrow(() -> new RuntimeException("Component not found"));
    }

    public List<Component> getComponentsByCategory(String category) {
        return componentRepository.findByCategory(category);
    }
}
