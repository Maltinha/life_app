package lifeapp.service;

import lifeapp.model.DTO_LoginRequest;
import lifeapp.model.DTO_RegisterRequest;
import lifeapp.model.User;
import lifeapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(DTO_RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            return "Username já existe.";
        }
        User u = new User();
        u.setUsername(req.getUsername().toLowerCase());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepo.save(u);
        return "Registo efetuado com sucesso!";
    }

    public String login(DTO_LoginRequest req) {
        Optional<User> userOpt = userRepo.findByUsername(req.getUsername());
        if (userOpt.isEmpty()) {
            return "Username não existe.";
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return "Password incorreta.";
        }
        // Aqui vamos gerar o JWT (vamos fazer no passo 7)
        String token = "jwt-token-aqui";
        return token;
    }
}
