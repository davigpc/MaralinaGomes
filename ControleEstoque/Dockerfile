# Estágio 1: Build da Aplicação com Maven
FROM maven:3.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY .mvn/ .mvn
COPY mvnw .
COPY mvnw.cmd .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Estágio 2: Execução da Aplicação
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/ControleEstoque-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

# Ajusta DATABASE_URL para JDBC removendo usuário e senha e inicia a aplicação
ENTRYPOINT ["/bin/sh", "-c", "export SPRING_DATASOURCE_URL=$(echo $DATABASE_URL | sed -E 's#postgresql://([^:]+):([^@]+)@#jdbc:postgresql://#') && java -jar /app/app.jar"]
