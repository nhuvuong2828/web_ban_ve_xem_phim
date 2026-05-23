# Stage 1: Build application
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
# Chỉ copy pom.xml trước để cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Copy source code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run application
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
# Khởi động ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
