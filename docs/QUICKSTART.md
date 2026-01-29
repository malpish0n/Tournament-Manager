# 🚀 SPRING BOOT 4.0.2 + React + PostgreSQL

## ✅ Zaktualizowano:
- **Spring Boot 4.0.2** ✅
- **Maven** ✅
- **Java 17** ✅
- **PostgreSQL** ✅

---

## 🚀 JAK URUCHOMIĆ:

### 1. PostgreSQL (Terminal 1)
```bash
# Zainstaluj
brew install postgresql@14
brew services start postgresql@14

# Utwórz bazę
createdb tournamentdb
```

### 2. Backend - Spring Boot 4.0.2 (Terminal 2)
```bash
cd "/Users/arekkasztelan/Desktop/Projects/Tournament Manager"
./start-backend.sh
```

**LUB bezpośrednio:**
```bash
mvn spring-boot:run
```

Poczekaj na: `Started TournamentManagerApplication`

### 3. Frontend - React (Terminal 3)
```bash
cd "/Users/arekkasztelan/Desktop/Projects/Tournament Manager"
./start-frontend.sh
```

**LUB bezpośrednio:**
```bash
cd frontend
npm start
```

### 4. Otwórz
**http://localhost:3000**

---

## 📝 Szybki test:

1. Wybierz **2v2** i **BO3**
2. Team A: "Faker", "Caps"
3. Team B: "Perkz", "Jankos"
4. **Create Match!**

Dane zapisują się w PostgreSQL! 🎉

---

## 🛠️ Troubleshooting:

### Backend nie startuje?
```bash
# Sprawdź Java
java -version

# Sprawdź PostgreSQL
pg_isready

# Sprawdź bazę
psql -l | grep tournamentdb
```

### Frontend pokazuje błąd połączenia?
- Upewnij się że backend działa na port 8080
- Sprawdź: `curl http://localhost:8080/api/players`

---

**Spring Boot 4.0.2 + Maven + Java 17 + PostgreSQL = GOTOWE!** 🚀

