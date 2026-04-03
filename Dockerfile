# --- STAGE 1: Build Frontend ---
FROM node:20 AS node-builder
WORKDIR /src
# Copy project configuration for frontend
COPY RoueDeLaChance.Front/package*.json ./RoueDeLaChance.Front/
COPY RoueDeLaChance.Front/tsconfig.json ./RoueDeLaChance.Front/
COPY RoueDeLaChance.Front/copy-static.js ./RoueDeLaChance.Front/

# Install dependencies and build frontend
WORKDIR /src/RoueDeLaChance.Front
RUN npm install

# Copy source and build
COPY RoueDeLaChance.Front/src ./src
COPY RoueDeLaChance.Front/css ./css
COPY RoueDeLaChance.Front/index.html ./index.html
RUN mkdir -p ../RoueDeLaChance.Web/wwwroot
RUN npm run build
RUN npm run copy-static

# --- STAGE 2: Build Backend ---
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-builder
WORKDIR /src

# Copy solution and project files for restore
COPY RoueDeLaChance.sln .
COPY RoueDeLaChance.Core/RoueDeLaChance.Core.csproj RoueDeLaChance.Core/
COPY RoueDeLaChance.Web/RoueDeLaChance.Web.csproj RoueDeLaChance.Web/
COPY RoueDeLaChance.Tests/RoueDeLaChance.Tests.csproj RoueDeLaChance.Tests/
COPY RoueDeLaChance.Front/RoueDeLaChance.Front.csproj RoueDeLaChance.Front/

RUN dotnet restore

# Copy everything else
COPY . .

# Copy built frontend from node-builder
COPY --from=node-builder /src/RoueDeLaChance.Web/wwwroot ./RoueDeLaChance.Web/wwwroot

# Build and publish for production
RUN dotnet test RoueDeLaChance.Tests/RoueDeLaChance.Tests.csproj -c Release --no-restore
RUN dotnet publish RoueDeLaChance.Web/RoueDeLaChance.Web.csproj -c Release -o /app/publish

# --- STAGE 3: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=dotnet-builder /app/publish .

# Configure ASP.NET to listen on the port provided by Railway
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "RoueDeLaChance.Web.dll"]
