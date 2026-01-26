# 🎮 Match Creator - Prosty System do Meczów

Prosta aplikacja do tworzenia meczów z ziomkami. Bez bazy danych, bez komplikacji - po prostu wchodzisz, tworzysz teamy i gracie!

## ✨ Funkcje

- **Formaty meczów**: 1v1, 2v2, 3v3, 5v5
- **Typy serii**: BO1 (Best of 1), BO3 (Best of 3), BO5 (Best of 5), Unlimited
- **Zarządzanie graczami**: Dodawaj graczy jednym kliknięciem
- **Tworzenie teamów**: Wybierasz graczy i tworzysz mecz w 3 krokach
- **Historia meczów**: Zobacz wszystkie mecze i aktualizuj wyniki
- **LocalStorage**: Wszystkie dane zapisywane lokalnie w przeglądarce

## 🚀 Jak Uruchomić

```bash
# Przejdź do folderu
cd frontend

# Zainstaluj zależności (tylko raz)
npm install

# Uruchom aplikację
npm start
```

Aplikacja otworzy się automatycznie w przeglądarce na: `http://localhost:3000`

## 📱 Jak Używać

### 1. Dodaj Graczy
- Wejdź w zakładkę **"👥 Gracze"**
- Wpisz nick gracza (np. Faker, Perkz, Jankos)
- Kliknij **"Dodaj Gracza"**
- Powtórz dla wszystkich ziomków

### 2. Stwórz Mecz
- Wejdź w zakładkę **"🎯 Stwórz Mecz"**
- Wybierz format: **1v1, 2v2, 3v3 lub 5v5**
- Wybieraj graczy z listy
- Klikaj **"Dodaj do Team A"** lub **"Dodaj do Team B"**
- Gdy oba teamy są pełne, kliknij **"🎮 Stwórz Mecz!"**

### 3. Grajcie i Aktualizujcie Wyniki
- Wejdź w zakładkę **"📋 Mecze"**
- Wpisz wyniki w pola (np. 2:1)
- Aplikacja automatycznie pokaże zwycięzcę 🏆

## 💾 Zapis Danych

- Wszystkie dane zapisywane są **lokalnie w przeglądarce** (LocalStorage)
- Nie potrzebujesz internetu ani bazy danych
- Dane zostają nawet po zamknięciu przeglądarki
- Każda przeglądarka ma swoje własne dane

## 🗑️ Czyszczenie Danych

W zakładce **"👥 Gracze"** na dole jest przycisk **"🗑️ Wyczyść Wszystkie Dane"** - usunie wszystkich graczy i mecze.

## 🎯 Stack

- **React 18** - tylko frontend
- **LocalStorage** - przechowywanie danych
- **CSS3** - ładne style

## 🔥 Pro Tips

- Możesz otworzyć aplikację na kilku komputerach/telefonach jednocześnie
- Każde urządzenie będzie miało swoją własną listę graczy
- Super do LAN party lub turniejów w domu!

## 📁 Struktura Projektu

```
Tournament Manager/
├── README.md           # Ten plik
├── QUICKSTART.md       # Szybki start
├── EXAMPLES.md         # Przykłady użycia
├── package.json        # Główne skrypty
└── frontend/           # Aplikacja React
    ├── src/
    │   ├── App.js      # Główny komponent
    │   ├── App.css     # Style
    │   └── index.js    # Entry point
    └── package.json
```

## 🎨 Wygląd

- **Fioletowy gradient** jako tło
- **Czytelne białe panele**
- **Duże przyciski** - łatwe klikanie
- **Responsywne** - działa na telefonie i komputerze

## ⚡ Szybkie Komendy

Z głównego folderu:
```bash
npm run install  # Instalacja zależności
npm start        # Uruchomienie aplikacji
```

Z folderu frontend:
```bash
npm start        # Uruchomienie
npm run build    # Budowanie produkcyjne
```

## 🐛 Rozwiązywanie Problemów

**Aplikacja się nie uruchamia?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**Dane się nie zapisują?**
- Sprawdź czy masz włączone LocalStorage w przeglądarce
- Nie używaj trybu incognito (dane znikną po zamknięciu)

**Chcę wyczyścić dane?**
- Użyj przycisku "🗑️ Wyczyść Wszystkie Dane" w aplikacji
- Lub otwórz konsolę przeglądarki (F12) i wpisz: `localStorage.clear()`

## 📝 Changelog

**v1.0.0** - 2026-01-26
- ✨ Formaty: 1v1, 2v2, 3v3, 5v5
- ✨ Zarządzanie graczami
- ✨ Historia meczów
- ✨ LocalStorage
- ✨ Responsywny design

---

**Made for ziomki by ziomki** 💪🎮

*Projekt open-source. Możesz go modyfikować jak chcesz!*
# 🎮 Match Creator - Prosty System do Meczów

Prosta aplikacja do tworzenia meczów z ziomkami. Bez bazy danych, bez komplikacji - po prostu wchodzisz, tworzysz teamy i gracie!

## ✨ Funkcje

- **Formaty meczów**: 1v1, 2v2, 3v3, 5v5
- **Zarządzanie graczami**: Dodawaj graczy jednym kliknięciem
- **Tworzenie teamów**: Wybierasz graczy i tworzysz mecz
- **Historia meczów**: Zobacz wszystkie mecze i aktualizuj wyniki
- **LocalStorage**: Wszystkie dane zapisywane lokalnie w przeglądarce

## 🚀 Jak Uruchomić

```bash
# Przejdź do folderu
cd frontend

# Zainstaluj zależności (tylko raz)
npm install

# Uruchom aplikację
npm start
```

Aplikacja otworzy się automatycznie w przeglądarce na: `http://localhost:3000`

## 📱 Jak Używać

### 1. Dodaj Graczy
- Wejdź w zakładkę **"👥 Gracze"**
- Wpisz nick gracza (np. Faker, Perkz, Jankos)
- Kliknij **"Dodaj Gracza"**
- Powtórz dla wszystkich ziomków

### 2. Stwórz Mecz (3 proste kroki)
- Wejdź w zakładkę **"🎯 Stwórz Mecz"**
- **Krok 1**: Wybierz format: **1v1, 2v2, 3v3 lub 5v5**
- **Krok 2**: Wybierz typ serii: **BO1, BO3, BO5 lub Unlimited**
- **Krok 3**: Wybieraj graczy z listy i dodawaj do Team A lub Team B
- Gdy oba teamy są pełne, kliknij **"🎮 Stwórz Mecz!"**

### 3. Grajcie i Aktualizujcie Wyniki
- Wejdź w zakładkę **"📋 Mecze"**
- Wpisz wyniki w pola (np. 2:1)
- Aplikacja automatycznie pokaże zwycięzcę 🏆

## 💾 Zapis Danych

- Wszystkie dane zapisywane są **lokalnie w przeglądarce** (LocalStorage)
- Nie potrzebujesz internetu ani bazy danych
- Dane zostają nawet po zamknięciu przeglądarki
- Każda przeglądarka ma swoje własne dane

## 🗑️ Czyszczenie Danych

W zakładce **"👥 Gracze"** na dole jest przycisk **"🗑️ Wyczyść Wszystkie Dane"** - usunie wszystkich graczy i mecze.

## 🎯 Stack

- **React 18** - tylko frontend
- **LocalStorage** - przechowywanie danych
- **CSS3** - ładne style

## 🔥 Pro Tips

- Możesz otworzyć aplikację na kilku komputerach/telefonach jednocześnie
- Każde urządzenie będzie miało swoją własną listę graczy
- Super do LAN party lub turniejów w domu!

## 📁 Struktura Projektu

```
Tournament Manager/
├── README.md           # Ten plik
├── QUICKSTART.md       # Szybki start
├── EXAMPLES.md         # Przykłady użycia
├── package.json        # Główne skrypty
└── frontend/           # Aplikacja React
    ├── src/
    │   ├── App.js      # Główny komponent
    │   ├── App.css     # Style
    │   └── index.js    # Entry point
    └── package.json
```

## 🎨 Wygląd

- **Fioletowy gradient** jako tło
- **Czytelne białe panele**
- **Duże przyciski** - łatwe klikanie
- **Responsywne** - działa na telefonie i komputerze

## ⚡ Szybkie Komendy

Z głównego folderu:
```bash
npm run install  # Instalacja zależności
npm start        # Uruchomienie aplikacji
```

Z folderu frontend:
```bash
npm start        # Uruchomienie
npm run build    # Budowanie produkcyjne
```

## 🐛 Rozwiązywanie Problemów

**Aplikacja się nie uruchamia?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**Dane się nie zapisują?**
- Sprawdź czy masz włączone LocalStorage w przeglądarce
- Nie używaj trybu incognito (dane znikną po zamknięciu)

**Chcę wyczyścić dane?**
- Użyj przycisku "🗑️ Wyczyść Wszystkie Dane" w aplikacji
- Lub otwórz konsolę przeglądarki (F12) i wpisz: `localStorage.clear()`

## 📝 Changelog

**v1.0.0** - 2026-01-26
- ✨ Formaty: 1v1, 2v2, 3v3, 5v5
- ✨ Zarządzanie graczami
- ✨ Historia meczów
- ✨ LocalStorage
- ✨ Responsywny design

---

**Made for ziomki by ziomki** 💪🎮

*Projekt open-source. Możesz go modyfikować jak chcesz!*

