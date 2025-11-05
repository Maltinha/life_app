package lifeapp.controller;

import lifeapp.model.DTO_UserProfile;
import lifeapp.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService imageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token) {
        try {
            String response = imageService.uploadProfileImage(file, token);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/getImage")
    public ResponseEntity<byte[]> getImage(
        @RequestHeader("Authorization") String token) {
        try {
            byte[] image = imageService.getProfileImage(token);
            return ResponseEntity
                    .ok()
                    .header("Content-Type", "image/*")
                    .body(image)
                    ;
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/getInfo")
    public ResponseEntity<DTO_UserProfile> getProfileInfo(
            @RequestHeader("Authorization") String token) {
        try{
            DTO_UserProfile userInfo = imageService.getProfileInfo(token);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(null);
        }
    }



}
