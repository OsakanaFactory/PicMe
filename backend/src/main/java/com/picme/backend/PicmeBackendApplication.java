package com.picme.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PicmeBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PicmeBackendApplication.class, args);
    }

}
