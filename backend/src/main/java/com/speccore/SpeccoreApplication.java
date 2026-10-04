package com.speccore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@SpringBootApplication
public class SpeccoreApplication {
    public static void main(String[] args) {
        try {
            // #region agent log
            Files.writeString(Path.of("C:/Users/ravi/OneDrive/Documents/study pdf/specore ai/debug-6e28f9.log"),
                "{\"sessionId\":\"6e28f9\",\"hypothesisId\":\"C\",\"location\":\"SpeccoreApplication.java:main\",\"message\":\"backend starting\",\"data\":{},\"timestamp\":" + System.currentTimeMillis() + "}\n",
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            // #endregion
        } catch (Exception ignored) {}
        try {
            SpringApplication.run(SpeccoreApplication.class, args);
            // #region agent log
            Files.writeString(Path.of("C:/Users/ravi/OneDrive/Documents/study pdf/specore ai/debug-6e28f9.log"),
                "{\"sessionId\":\"6e28f9\",\"hypothesisId\":\"C\",\"location\":\"SpeccoreApplication.java:started\",\"message\":\"backend started\",\"data\":{\"ok\":true},\"timestamp\":" + System.currentTimeMillis() + "}\n",
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            // #endregion
        } catch (Exception e) {
            try {
                // #region agent log
                Files.writeString(Path.of("C:/Users/ravi/OneDrive/Documents/study pdf/specore ai/debug-6e28f9.log"),
                    "{\"sessionId\":\"6e28f9\",\"hypothesisId\":\"C\",\"location\":\"SpeccoreApplication.java:fail\",\"message\":\"backend failed\",\"data\":{\"error\":\"" + e.getClass().getSimpleName() + "\",\"msg\":\"" + String.valueOf(e.getMessage()).replace("\"","'") + "\"},\"timestamp\":" + System.currentTimeMillis() + "}\n",
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
                // #endregion
            } catch (Exception ignored) {}
            throw e;
        }
    }
}
