package com.example.todo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private boolean completed;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Tokyo")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // デフォルトコンストラクタ（必須）
    public Todo() {
    }

    // テスト用
    public Todo(String title, boolean completed, LocalDateTime createdAt) {
        this.title = title;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    // フルコンストラクタ（全フィールド指定）
    public Todo(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    // Getter/Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}