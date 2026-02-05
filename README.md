# 🏆 Tournament Manager

A full-stack application for managing esports tournaments, organizing matches, and visualizing results with a dynamic bracket system.

<img width="1623" height="967" alt="obraz" src="https://github.com/user-attachments/assets/da5a9684-619a-4e91-954e-cf9b18b5319e" />

## ✨ Features

*   **Match Management**: Create, view, update, and delete matches.
*   **Dynamic Bracket**: Visual symmetric tournament bracket that automatically organizes matches and updates based on scores.
*   **Player & Team System**: Manage player profiles and team rosters.
*   **Score Tracking**: Real-time score updates with automatic winner progression.
*   **Responsive Design**: Optimized for various screen sizes with a dark-themed UI.

## 🛠️ Tech Stack

### Backend
*   **Java 17**
*   **Spring Boot 4.0.2** (Web, JPA)
*   **H2 Database** (File-based local storage)
*   **Lombok**
*   **Maven**

### Frontend
*   **React 19**
*   **Axios** for API communication
*   **SVG** for custom bracket rendering
*   **CSS Variables** for theming

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   Java JDK 17+
*   Maven

### 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/tournament-manager.git
    cd tournament-manager
    ```

2.  **Start the Backend**
    Navigate to the backend directory and run the Spring Boot application.
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
    The server will start at `http://localhost:8080`.
    *Database console available at `http://localhost:8080/h2-console`*

3.  **Start the Frontend**
    Open a new terminal, navigate to the frontend directory, install dependencies, and start.
    ```bash
    cd frontend
    npm install
    npm start
    ```
    The application will run at `http://localhost:3000`.

## 📁 Project Structure

```
tournament-manager/
├── backend/            # Spring Boot Application
│   ├── src/main/java   # API Controllers, Services, Entities
│   └── data/           # H2 Database files
├── frontend/           # React Application
│   ├── src/components  # Bracket & UI components
│   └── public/         # Static assets
└── scripts/            # Helper scripts (startup, setup)
```

## 🎮 Usage

1.  Open the dashboard.
2.  Add players and create matches.
3.  The **Tournament Bracket** will automatically generate.
4.  Click on matches to update scores.
5.  Watch as winners advance automatically through the bracket!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

