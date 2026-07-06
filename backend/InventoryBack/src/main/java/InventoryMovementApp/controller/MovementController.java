package InventoryMovementApp.controller;



import InventoryMovementApp.model.Movement;
import InventoryMovementApp.service.MovementService;
import InventoryMovementApp.util.HahsUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MovementController {
    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping("/movements")
    public ResponseEntity<List<Movement>> getMovements(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String warehouse) throws IOException {
        List<Movement> movements = movementService.getMovements(from, to, type, warehouse);
        return ResponseEntity.ok(movements);
    }

    @PostMapping("/verify-file")
    public ResponseEntity<?> verifyFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("hash") String hash) throws IOException, NoSuchAlgorithmException {
        String fileContent = new String(file.getBytes());
        String calculatedHash = HahsUtil.calculateSHA256(fileContent);

        if (!calculatedHash.equals(hash)) {
            return ResponseEntity.badRequest().body("Invalid SHA-256 hash");
        }

        List<Movement> movements = movementService.getMovementsFromJson(fileContent);
        movementService.saveMovements(movements);
        return ResponseEntity.ok(movements);
    }
}
