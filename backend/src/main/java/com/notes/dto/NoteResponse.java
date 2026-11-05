package com.notes.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NoteResponse {
    private Long id;
    private String title;
    private String description;
    private String fileName;
    private boolean isPublic;
    private String uploaderName;
    private Long userId;
    private LocalDateTime createdAt;
}
