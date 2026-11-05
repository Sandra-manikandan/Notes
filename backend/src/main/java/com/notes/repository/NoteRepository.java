package com.notes.repository;

import com.notes.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserId(Long userId);
    List<Note> findByIsPublicTrue();
    List<Note> findByIsPublicTrueOrUserId(boolean isPublic, Long userId);
}
