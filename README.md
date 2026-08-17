# WatchLog

## Neighborhood Surveillance Simulation

WatchLog is a web-based surveillance simulation platform designed for neighborhood inhabitants to log sightings, track suspicious movements, and analyse community security trends.

## Tech Stack

-   **Backend:** Laravel 11 (PHP 8.2+)
-   **Database:** PostgreSQL (with JSONB and UUID support)
-   **Frontend:** React (TypeScript) via Inertia.js
-   **Styling:** SCSS (CSS Modules)
-   **Mapping:** Leaflet.js (Markers, Trajectories, and Heatmaps)
-   **Dev Environment:** Docker (via Laravel Sail)

---

## Installation & Setup

This project is built to run entirely within a Docker environment.

### 1. Prerequisites
Make sure you have the following installed:
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   Git

### 2. Clone the Repository
```bash
git clone https://github.com/CrispyMiatr/WMD-Course-Project
cd WMD-Course-Project
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
*Note: The default `.env.example` is pre-configured for the Docker PostgreSQL container.*

### 4. Build and Start the Containers
Run the following command to build the images and start the services:
```bash
docker compose up --build -d
```

### 5. Install Dependencies & Migrate
Enter the PHP container to install dependencies and set up the database:
```bash
docker compose exec laravel.test composer install
docker compose exec laravel.test php artisan key:generate
docker compose exec laravel.test php artisan migrate --seed
```

### 6. Compile Frontend Assets
In a new terminal window:
```bash
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

The application will be available at **`http://localhost`**.

> [!NOTE]
> ### Troubleshooting
> If you receive a "command not found" error for `npm` or `php`, ensure you are prefixing the commands with `./vendor/bin/sail`. This ensures the project uses the versions provided by the Docker environment.


### 7. Testing
After running the seeder you can log into the Demo User account or create your own account my registering one at the login screen.
Demo credentials are:
- email = demo@user.com
- pwd = password

#### Explore the pages:
1.  Login as Demo User or egister an account and visit the **Profile** page to set your "Home Location."
2.  Navigate to the **Map** and log several sightings close to your home.
3.  Check the **Overview** page; the "Threat Level" banner will react to your recent logs.
4.  Log a sighting and check "Continue existing movement" to see trajectories in action.

---

## Attribution & Documentation

### Core Frameworks, Libraries, etc.
- [Laravel](https://laravel.com/docs/13.x/readme) - Backend logic & API
- [Inertia.js](https://inertiajs.com/docs/v3/getting-started/index) - The bridge between Larevel & React
- [React](https://reactjs.org/) - Frontend UI Library
- [Vite 6.4.3](https://v6.vite.dev/) - Local development server backed. I used an older version due to initial setup complications and works just fine.
- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety
- [Sass/SCSS](https://sass-lang.com/documentation/) - Modular styling

### External sources
- [Leaflet](https://leafletjs.com/reference.html) - Open-source JavaScript library for interactive maps
- [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) - Leaflet heatmap plugin
- [react-leaflet](https://github.com/PaulLeCam/react-leaflet) - React components for Leaflet maps

### Gemini
Gemeni was used to assist with the development of this project. It was used to help me get started and figure out core logic of functionalities.
- [Google Gemini](https://aistudio.google.com/)

Unfortunately, it won't let me share the conversations. At first I thought the problem was a large conversation, but after starting new conversations for each new feature it would still not let me share it. I do not understand what the problem is, but apparently this has been an issue for longer when searching online. My sincere apologies.

Luckily I found an extension that can save conversations into `.md` files. I added these to a separate folder. I hope this suffices as proof and is good enough as documentation. The first and longest conversation I could only export up until a certain point. The extension apparently has a character cap.
- [Conversation 1](/resources/gemini-chats/WatchLog_1_Neighbourhood-surveillance_first-conversation_partial.md) - Long conversation, various features. Only partially exported.
- [Conversation 2](/resources/gemini-chats/WatchLog_2_User-rankings-&-more-data-cleaning.md) - User rankings & more data cleaning
- [Conversation 3](/resources/gemini-chats/WatchLog_3_Implementing-demographic-sighting-analytics.md) - Implementing demographic sighting analytics
- [Conversation 4](/resources/gemini-chats/WatchLog_4_Creating-database-seeding.md) - Creating database seeding