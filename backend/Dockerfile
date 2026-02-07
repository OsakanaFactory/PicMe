# ビルドステージ
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Mavenラッパーをコピー
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# 依存関係を事前ダウンロード（キャッシュ最適化）
RUN ./mvnw dependency:go-offline -B || true

# ソースコードをコピーしてビルド
COPY src src
RUN ./mvnw package -DskipTests -B

# 実行ステージ
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
