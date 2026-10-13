FROM ubuntu:latest
LABEL authors="soumayatou"

ENTRYPOINT ["top", "-b"]

# ---- Étape 1 : construire le jar ----
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline
COPY src src
RUN ./mvnw -q clean package -DskipTests

# ---- Étape 2 : image d'exécution, plus légère ----
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd --system --no-create-home appuser
COPY --from=build /app/target/*.jar app.jar
USER appuser
EXPOSE 8087
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]