package lifeapp.service;

import lifeapp.model.DTO_LoginRequest;
import lifeapp.model.DTO_RegisterRequest;
import lifeapp.model.User;
import lifeapp.repository.UserRepository;
import lifeapp.security.JwtUtil;
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


    @Autowired
    private JwtUtil jwtUtil;

    public String register(DTO_RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            return "Username já existe.";
        }
        User u = new User();
        u.setUsername(req.getUsername().toLowerCase());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setEmail(req.getEmail().toLowerCase());
        userRepo.save(u);
        return "Registo efetuado com sucesso!";
    }

    public String login(DTO_LoginRequest req) {
        Optional<User> userOpt = userRepo.findByUsername(req.getUsername().toLowerCase());
        if (userOpt.isEmpty()) {
            return "Username não existe.";
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return "Password incorreta.";
        }
        return jwtUtil.generateToken(user.getUsername());
    }
}
