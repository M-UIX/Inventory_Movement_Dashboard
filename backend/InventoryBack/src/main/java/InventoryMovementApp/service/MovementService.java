package InventoryMovementApp.service;

import InventoryMovementApp.model.Movement;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovementService {
    private static final String DATA_FILE = "src/main/resources/movements.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Movement> getMovements(LocalDate from, LocalDate to, String type, String warehouse) throws IOException {
        List<Movement> movements = objectMapper.readValue(new File(DATA_FILE), new TypeReference<List<Movement>>() {});
        return movements.stream()
                .filter(m -> !m.getTimestamp().toLocalDate().isBefore(from) && !m.getTimestamp().toLocalDate().isAfter(to))
                .filter(m -> type == null || m.getMovementType().equalsIgnoreCase(type))
                .filter(m -> warehouse == null || m.getWarehouse().equalsIgnoreCase(warehouse))
                .collect(Collectors.toList());
    }

    public void saveMovements(List<Movement> movements) throws IOException {
        objectMapper.writeValue(new File(DATA_FILE), movements);
    }

    public String readFileContent(String filePath) throws IOException {
        return Files.readString(Paths.get(filePath));
    }

    public List<Movement> getMovementsFromJson(String fileContent) {
        try {
            return objectMapper.readValue(fileContent, new TypeReference<List<Movement>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse JSON content", e);
        }
    }
}
