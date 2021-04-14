#build container
FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim as build
WORKDIR /source

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore -r linux-musl-x64

# Copy everything else and build
COPY . ./
RUN dotnet publish -c release -o /app -r linux-musl-x64 --self-contained false --no-restore

#runtime container
FROM mcr.microsoft.com/dotnet/aspnet:5.0.2-alpine3.12
COPY --from=build /app /.

ENTRYPOINT ["dotnet", "shipping-service.dll"]