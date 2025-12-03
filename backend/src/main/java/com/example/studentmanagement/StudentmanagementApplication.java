package com.example.studentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class StudentmanagementApplication {

	// Main entry point
	public static void main(String[] args) {
		SpringApplication.run(StudentmanagementApplication.class, args);
	}

}
