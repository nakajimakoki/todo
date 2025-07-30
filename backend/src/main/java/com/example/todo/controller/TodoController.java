package com.example.todo.controller;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/todos") // 全てのエンドポイントの共通URL
public class TodoController {

    private final TodoRepository todoRepository;

    // コンストラクタでRepositoryを注入（DI）
    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // GET /todos → Todoの一覧を返す
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // POST /todos → 新しいTodoを登録する
    @PostMapping
    public Todo createTodo(@RequestBody Todo newTodo) {
        newTodo.setCreatedAt(LocalDateTime.now());
        newTodo.setUpdatedAt(LocalDateTime.now());
        return todoRepository.save(newTodo);
    }

    // 特定のTodo（例：/todos/1）を取得するエンドポイント
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 既存のTodoを編集
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return todoRepository.findById(id).map(t -> {
            t.setTitle(todo.getTitle());
            t.setCompleted(todo.isCompleted());
            t.setUpdatedAt(LocalDateTime.now());
            return todoRepository.save(t);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    // 既存のTodoを削除
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

}