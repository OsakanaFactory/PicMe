FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Mavenラッパーをコピー
COPY .mvn .mvn
COPY mvnw .

# pom.xmlをコピー
COPY pom.xml .

# 依存関係を事前ダウンロード（キャッシュ最適化）
RUN ./mvnw dependency:go-offline -B || true

# ソースコードをコピー
COPY src src

EXPOSE 8080

# 開発モードで起動
CMD ["./mvnw", "spring-boot:run"]
