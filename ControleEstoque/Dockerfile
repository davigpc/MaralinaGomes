# Estágio 1: Build da Aplicação com Maven
# Usamos uma imagem que já tem o Maven e o JDK 17
FROM maven:3.8-eclipse-temurin-17 AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia primeiro o pom.xml para aproveitar o cache do Docker
COPY pom.xml .

# Copia o wrapper do Maven
COPY .mvn/ .mvn
COPY mvnw .
COPY mvnw.cmd .

# Baixa as dependências do projeto
RUN mvn dependency:go-offline

# Copia o resto do código-fonte
COPY src ./src

# Compila a aplicação e gera o ficheiro .jar
RUN mvn package -DskipTests


# Estágio 2: Execução da Aplicação
# Usamos uma imagem mínima, apenas com o Java para rodar (mais leve e segura)
FROM eclipse-temurin:17-jre-jammy

# Define o diretório de trabalho
WORKDIR /app

# Copia o ficheiro .jar gerado no estágio de build para a imagem final
COPY --from=build /app/target/ControleEstoque-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta 8080 para que a Render possa aceder à aplicação
EXPOSE 8080

# Comando para iniciar a aplicação quando o contêiner arrancar
ENTRYPOINT ["java", "-jar", "app.jar"]
