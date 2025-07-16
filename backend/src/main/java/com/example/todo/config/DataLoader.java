package com.example.todo.config;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// アプリの起動時に初期データを投入するための 設定クラス
//Springコンテナに管理されるBeanの定義を持つ設定クラス であることを明記
@Configuration
public class DataLoader {

    // メソッドの戻り値をBeanとして登録
    // TodoRepository は自動で注入される(DI)
    @Bean
    public CommandLineRunner loadData(TodoRepository repository) {
        return args -> {
            repository.save(new Todo("初期データ1", false));
            repository.save(new Todo("初期データ2", false));
            repository.save(new Todo("初期データ3", false));
            repository.save(new Todo("初期データ4", false));
            repository.save(new Todo("初期データ5", false));
            repository.save(new Todo("初期データ6", false));
            repository.save(new Todo("初期データ7", false));
            repository.save(new Todo("初期データ8", false));
            repository.save(new Todo("初期データ9", false));
            repository.save(new Todo("初期データ10", false));
        };
    }
}