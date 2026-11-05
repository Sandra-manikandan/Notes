package com.notes.controller;

import com.notes.dto.NoteResponse;
import com.notes.entity.Note;
import com.notes.entity.User;
import com.notes.repository.NoteRepository;
import com.notes.repository.UserRepository;
import com.notes.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private NoteResponse toResponse(Note note) {
        NoteResponse r = new NoteResponse();
        r.setId(note.getId());
        r.setTitle(note.getTitle());
        r.setDescription(note.getDescription());
        r.setFileName(note.getFileName());
        r.setPublic(note.isPublic());
        r.setCreatedAt(note.getCreatedAt());
        if (note.getUser() != null) {
            r.setUploaderName(note.getUser().getUsername());
            r.setUserId(note.getUser().getId());
        }
        return r;
    }

    // Get public notes (no auth needed)
    @GetMapping("/public")
    public ResponseEntity<List<NoteResponse>> getPublicNotes() {
        List<NoteResponse> notes = noteRepository.findByIsPublicTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(notes);
    }

    // Get single note by ID (public notes freely, private only if owner)
    @GetMapping("/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable Long id, Authentication auth) {
        Optional<Note> opt = noteRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Note note = opt.get();
        if (!note.isPublic()) {
            if (auth == null) {
                return ResponseEntity.status(403).body(Map.of("error", "Login required to view this note"));
            }
            Long userId = (Long) auth.getCredentials();
            if (note.getUser() == null || !note.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
        }

        return ResponseEntity.ok(toResponse(note));
    }

    // Get my notes (auth required)
    @GetMapping("/my")
    public ResponseEntity<List<NoteResponse>> getMyNotes(Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        List<NoteResponse> notes = noteRepository.findByUserId(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(notes);
    }

    // Upload note (auth required)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadNote(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("isPublic") boolean isPublic,
            @RequestParam("file") MultipartFile file,
            Authentication auth) throws IOException {

        Long userId = (Long) auth.getCredentials();
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "User not found"));

        // Save file
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Note note = new Note();
        note.setTitle(title);
        note.setDescription(description);
        note.setFileName(file.getOriginalFilename());
        note.setFilePath(filePath.toString());
        note.setPublic(isPublic);
        note.setUser(userOpt.get());
        noteRepository.save(note);

        return ResponseEntity.ok(Map.of("message", "Note uploaded successfully", "id", note.getId()));
    }

    // Download file
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadNote(@PathVariable Long id, Authentication auth) throws MalformedURLException {
        Optional<Note> opt = noteRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Note note = opt.get();
        if (!note.isPublic()) {
            if (auth == null) return ResponseEntity.status(403).body(Map.of("error", "Login required"));
            Long userId = (Long) auth.getCredentials();
            if (note.getUser() == null || !note.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
        }

        Path filePath = Paths.get(note.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + note.getFileName() + "\"")
                .body(resource);
    }

    // Delete note (owner only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getCredentials();
        Optional<Note> opt = noteRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Note note = opt.get();
        if (note.getUser() == null || !note.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        // Delete file
        try {
            Files.deleteIfExists(Paths.get(note.getFilePath()));
        } catch (IOException e) {
            // ignore
        }

        noteRepository.delete(note);
        return ResponseEntity.ok(Map.of("message", "Note deleted"));
    }
}
