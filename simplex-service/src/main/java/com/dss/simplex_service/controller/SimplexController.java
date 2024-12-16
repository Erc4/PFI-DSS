package com.dss.simplex_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dss.simplex_service.model.*;
import com.dss.simplex_service.service.SimplexService;

@RestController
@RequestMapping("/api/simplex")
@CrossOrigin(origins = "http://localhost:4200")
public class SimplexController {

    @Autowired
    private SimplexService simplexService;

    @PostMapping("/solve")
    public ResponseEntity<SimplexResult> solveProblem(@RequestBody SimplexInput input) {
        try {
            System.out.println("isMaximization recibido en controller: " + input.isMaximization());
            SimplexResult result = simplexService.solve(input);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}