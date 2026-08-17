# WatchLog

## Neighborhood Surveillance Simulation

WatchLog is a web-based surveillance simulation platform designed for neighborhood inhabitants to log sightings, track suspicious movements, and analyse community security trends.

## Tech stack

-   **Backend:** Laravel 11 (PHP 8.3)
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

### 2. Clone the repository
```bash
git clone https://github.com/CrispyMiatr/WMD-Course-Project
cd WMD-Course-Project
```

### 3. Environment configuration
Copy the example environment file:
```bash
cp .env.example .env
```
*Note for Linux users: To avoid permission issues, ensure your .env contains WWWUSER=1000 and WWWGROUP=1000 (or your specific UID/GID).*

### 4. Build and start the containers
First, bootstrap the project to install the initial dependencies:
```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
```
Then, build the images and start the services:
```bash
docker compose up -d --build
```
*You will need to wait a few moments for the PostgreSQL database to initialize before proceeding.*

### 5. Initialise application & database
Run these commands to set up the encryption key, folder permissions, and database tables:
```bash
./vendor/bin/sail artisan key:generate
./vendor/bin/sail shell -c "chmod -R 775 storage bootstrap/cache"
./vendor/bin/sail artisan migrate:fresh --seed

```

### 6. Compile frontend assets
In a terminal window, install the Node dependencies and start the Vite dev server:
```bash
./vendor/bin/sail npm install --legacy-peer-deps
./vendor/bin/sail npm run dev
```

The application will be available at **`http://localhost`**.

> [!NOTE]
> ### Troubleshooting
> #### "Permission Denied" errors
> If you see an error stating that laravel.log or a folder in storage cannot be opened, run:
> ```bash
> ./vendor/bin/sail shell -c "chmod -R 775 storage bootstrap/cache"
> ```
> #### Command not found
> If you receive a "command not found" error for npm or php, make sure you are prefixing the commands with ./vendor/bin/sail. The project uses the specific versions provided inside the Docker containers.


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

### Demo Video

[Here is a link](https://youtu.be/tPNvnTtjK4M) to a short demo video about how the app works.

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
- [react-leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps
- [WatchLog eye "logo"](https://lucide.dev/icons/eye) - Eye icon edited & used as the WatchLog logo

### Gemini
Gemeni was used to assist with the development of this project. It was used to help me get started and figure out core logic of functionalities.
- [Google Gemini](https://aistudio.google.com/)

Unfortunately, it won't let me share the conversations. At first I thought the problem was a large conversation, but after starting new conversations for each new feature it would still not let me share it. I do not understand what the problem is, but apparently this has been an issue for longer when searching online. My sincere apologies.

Luckily I found an extension that can save conversations into `.md` files. I added these to a separate folder. I hope this suffices as proof and is good enough as documentation. The first and longest conversation I could only export up until a certain point. The extension apparently has a character cap.
- [Conversation 1](/resources/gemini-chats/WatchLog_1_Neighbourhood-surveillance_first-conversation_partial.md) - Long conversation, various features. Only partially exported.
- [Conversation 2](/resources/gemini-chats/WatchLog_2_User-rankings-&-more-data-cleaning.md) - User rankings & more data cleaning
- [Conversation 3](/resources/gemini-chats/WatchLog_3_Implementing-demographic-sighting-analytics.md) - Implementing demographic sighting analytics
- [Conversation 4](/resources/gemini-chats/WatchLog_4_Creating-database-seeding.md) - Creating database seeding