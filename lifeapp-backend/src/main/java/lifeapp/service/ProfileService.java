package lifeapp.service;

import lifeapp.model.DTO_UserProfile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import lifeapp.repository.UserRepository;
import lifeapp.model.User;
import lifeapp.security.JwtUtil;
import lifeapp.security.JwtUtil;

import java.io.IOException;
import java.nio.file.*;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final Path uploadPath = Paths.get("profileUploads");

    public String saveProfileImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty.");
        }
        // Create folder if not exists
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Create unique filename (timestamp + original name)
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Copy file to upload folder
        Path destination = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return filename; // return name to save in DB
    }

    public String uploadProfileImage(MultipartFile file, String token) throws IOException {
        // Remove "Bearer " prefix if present
        String cleanToken = token.replace("Bearer ", "");

        // Get username from token
        String username = jwtUtil.extractUsername(cleanToken);

        // Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save image using your existing method
        String fileName = saveProfileImage(file);

        // Store the file path (or file name) in the user record
        user.setImageName(fileName);
        userRepository.save(user);

        return "Profile image uploaded successfully.";
    }

    public byte[] getProfileImage(String token) throws IOException {

        // Remove "Bearer " prefix if present
        String cleanToken = token.replace("Bearer ", "");

        // Get username from token
        String username = jwtUtil.extractUsername(cleanToken);

        // Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String filename = user.getImageName();
        Path imagePath;

        if (filename == null || filename.isEmpty()) {
            imagePath = uploadPath.resolve("msn_sporting_avatar.jpg");
        } else {
            imagePath = uploadPath.resolve(filename);
            if (!Files.exists(imagePath)) {
                imagePath = uploadPath.resolve("msn_sporting_avatar.jpg");
            }
        }
        return  Files.readAllBytes(imagePath);
    }

    public DTO_UserProfile getProfileInfo(String token) {
        String cleanToken = token.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(cleanToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DTO_UserProfile dto = new DTO_UserProfile();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFilename(user.getImageName());

        return dto;
    }
}
