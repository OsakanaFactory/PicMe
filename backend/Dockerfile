# ビルドステージ
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Mavenラッパーをコピー
COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/pom.xml .

# 実行権限を付与
RUN chmod +x mvnw

# 依存関係を事前ダウンロード（キャッシュ最適化）
RUN ./mvnw dependency:go-offline -B || true

# ソースコードをコピーしてビルド
COPY backend/src src
RUN ./mvnw package -DskipTests -B

# 実行ステージ
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
