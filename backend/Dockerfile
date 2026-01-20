FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Mavenラッパーとpom.xmlをコピー
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# 依存関係を事前ダウンロード（キャッシュ最適化）
RUN ./mvnw dependency:go-offline -B

# ソースコードをコピー
COPY src src

# アプリケーションをビルド
RUN ./mvnw clean package -DskipTests

# 実行ステージ
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# ビルドされたJARをコピー
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
