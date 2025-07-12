package lifeapp.controller;

import lifeapp.model.DTO_LoginRequest;
import lifeapp.model.DTO_RegisterRequest;
import lifeapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody DTO_RegisterRequest request) {
        String response = authService.register(request);
        if (response.equals("Username já existe.")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody DTO_LoginRequest request) {
        String token = authService.login(request);
        if (token.equals("Username não existe.") || token.equals("Password incorreta.")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(token);
        }
        return ResponseEntity.ok(token);
    }
}
