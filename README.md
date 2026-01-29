# Tournament Manager - Spring Boot + React

Full-stack tournament management system.

## 🏗️ Architecture

**Backend:** Spring Boot 3.2.1 + PostgreSQL
**Frontend:** React 18 + Axios  
**Database:** PostgreSQL

## 🚀 Quick Start

### Prerequisites:
- Java 17+
- Maven
- Node.js 16+
- PostgreSQL

### Setup Database:
```bash
createdb tournamentdb
```

### Setup Project (One-time):
```bash
./scripts/setup.sh
```

### Run Backend (Terminal 1):
```bash
./scripts/start-backend.sh
```

### Run Frontend (Terminal 2):
```bash
./scripts/start-frontend.sh
```

### Open:
**http://localhost:3000**

## ✨ Features

- Match creation (1v1, 2v2, 3v3, 5v5)
- Series types (BO1, BO3, BO5, Unlimited)
- Inline player addition (type + click "+")
- Real-time score updates
- PostgreSQL persistence
- REST API backend

## 🔗 API Endpoints

- `GET /api/players` - Get all players
- `POST /api/players` - Create player
- `DELETE /api/players/{id}` - Delete player
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create match
- `PATCH /api/matches/{id}/score` - Update score
- `DELETE /api/matches/{id}` - Delete match

## 📁 Project Structure

```
Tournament Manager/
├── src/main/java/
│   └── com/esport/tournamentmanager/
│       ├── controller/    # REST controllers
│       ├── service/       # Business logic
│       ├── repository/    # Database access
│       ├── entity/        # JPA entities
│       └── dto/           # Data transfer objects
├── src/main/resources/
│   └── application.properties
├── frontend/
│   └── src/
│       ├── App.js        # Main component
│       └── App.css       # Styles
└── pom.xml               # Maven dependencies
```

## 🛠️ Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tournamentdb
spring.datasource.username=postgres
spring.datasource.password=postgres
server.port=8080
```

---

**Made with Spring Boot + React + PostgreSQL** 🚀

