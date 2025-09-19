package lifeapp.model;

import lombok.Data;

@Data
public class DTO_RegisterRequest {
    private String username;
    private String password;
    private String email;
}