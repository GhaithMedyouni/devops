# Use an OpenJDK image as the base
FROM openjdk:17-jdk-alpine

# Define build arguments for Nexus configuration
ARG NEXUS_URL
ARG GROUP_ID
ARG ARTIFACT_ID
ARG VERSION

# Construct the Nexus download URL based on these arguments
RUN apk add --no-cache curl && \
    curl -o app.jar "$NEXUS_URL/repository/maven-central-repository/$(echo $GROUP_ID | tr . /)/$ARTIFACT_ID/$VERSION/$ARTIFACT_ID-$VERSION.jar"

# Expose the application port
EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]

#FROM openjdk:17-jdk-alpine
#WORKDIR /app
#COPY target/*.jar app.jar
#EXPOSE 9000
#ENTRYPOINT ["java", "-jar", "app.jar"]
