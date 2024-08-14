# GameHub Project

Welcome to GameHub Backlog! We're thrilled to have you here. GameHub Backlog was conceived and developed by Gonçalo Sousa as a portfolio project, showcasing a passion for both gaming and software development. This platform is the culmination of countless hours of dedication and creativity, aimed at providing gamers with a seamless experience in managing their game collections.

At its core, GameHub Backlog is a game backlog tracker designed to help you keep track of your ever-growing library of video games. We understand how easy it is to accumulate a list of games you plan to "play someday," only to find it becoming overwhelming. GameHub simplifies the process, allowing you to organize, prioritize, and manage your games in one convenient location.

But GameHub Backlog is more than just a personal tracker; it's a community-driven platform built by players, for players. Whether you're looking to discover new titles, categorize your existing collection, or share your game lists with friends, GameHub has you covered. Our goal is to bring gamers together, fostering a space where you can share your gaming experiences and discover new ones.

Join us on this journey as we continue to enhance GameHub Backlog, adding new features and improving the platform based on your feedback. Together, let's make the world of gaming more organized and enjoyable. Happy gaming!

## Running locally

Clone the project

```bash
  git clone https://github.com/goncalojbsousa/gamehub-project.git
```

Enter the project directory

```bash
  cd gamehub-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Environment Variables

To run this project, you need to configure the following environment variables in your `.env` file:

### Website URL (Domain)
- `NEXTAUTH_URL`

### Email Provider (Magic Link)
- `EMAIL_FROM`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`

### Google
#### Authentication Google Provider Credentials
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

#### reCAPTCHA
- `NEXT_PUBLIC_reCAPTCHA_SITE_KEY`
- `reCAPTCHA_SECRET_KEY`

### JWT Secret
- `AUTH_SECRET`

### IGDB Service
- `IGDB_PROXY_URL`
- `IGDB_SECRET`

### Database Configuration
- `DATABASE_URL`


## API documentation

### Create/update user game status
#### To access the route you need to be authenticated 

```http
  POST /api/game/updateGameStatus
```

| Parameter   | Type       | Description                                     |
|-------------|------------|-----------------------------------------------|
| `userId`    | `string`    | **Mandatory**. User identifier (UUID). |
| `gameId`    | `number`    | **Mandatory**. Game identifier (positive number). |
| `status`    | `string`    | **Mandatory**. Game status (maximum 20 characters). |
| `progress`  | `string`    | **Mandatory**. Game progress (maximum 20 characters). |


## Color documentation

### White Mode
| Color                        | Hexadecimal                                                |
| ---------------------------- | ------------------------------------------------------------ |
| Background                   | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |
| Main Color                   | ![#f4f4f5](https://via.placeholder.com/10/f4f4f5?text=+) #f4f4f5 |
| Secondary Color              | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |
| Reverse Color                | ![#1c1917](https://via.placeholder.com/10/1c1917?text=+) #1c1917 |
| Reverse Secondary Color      | ![#292524](https://via.placeholder.com/10/292524?text=+) #292524 |
| Text Color                   | ![#27272a](https://via.placeholder.com/10/27272a?text=+) #27272a |
| Secondary Text Color         | ![#4b5563](https://via.placeholder.com/10/4b5563?text=+) #4b5563 |
| Icons Color                  | ![#27272a](https://via.placeholder.com/10/27272a?text=+) #27272a |
| Alert Color                  | ![#fee2e2](https://via.placeholder.com/10/fee2e2?text=+) #fee2e2 |
| Border Detail Color          | ![#e4e4e7](https://via.placeholder.com/10/e4e4e7?text=+) #e4e4e7 |
| Secondary Border Detail Color| ![#3b82f6](https://via.placeholder.com/10/3b82f6?text=+) #3b82f6 |
| Gradient Start Color         | ![#ffffffcc](https://via.placeholder.com/10/ffffffcc?text=+) #ffffffcc |
| Gradient End Color           | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |

### Dark Mode
| Color                        | Hexadecimal                                                |
| ---------------------------- | ------------------------------------------------------------ |
| Background                   | ![#292524](https://via.placeholder.com/10/292524?text=+) #292524 |
| Main Color                   | ![#1c1917](https://via.placeholder.com/10/1c1917?text=+) #1c1917 |
| Secondary Color              | ![#292524](https://via.placeholder.com/10/292524?text=+) #292524 |
| Reverse Color                | ![#e4e4e7](https://via.placeholder.com/10/e4e4e7?text=+) #e4e4e7 |
| Reverse Secondary Color      | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |
| Text Color                   | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |
| Secondary Text Color         | ![#9ca3af](https://via.placeholder.com/10/9ca3af?text=+) #9ca3af |
| Icons Color                  | ![#ffffff](https://via.placeholder.com/10/ffffff?text=+) #ffffff |
| Alert Color                  | ![#ef4444](https://via.placeholder.com/10/ef4444?text=+) #ef4444 |
| Border Detail Color          | ![#52525b](https://via.placeholder.com/10/52525b?text=+) #52525b |
| Secondary Border Detail Color| ![#3b82f6](https://via.placeholder.com/10/3b82f6?text=+) #3b82f6 |
| Gradient Start Color         | ![#292524b3](https://via.placeholder.com/10/292524b3?text=+) #292524b3 |
| Gradient End Color           | ![#292524](https://via.placeholder.com/10/292524?text=+) #292524 |


## IGDB
All game data is provided by IGDB
 - [IGDB](https://www.igdb.com)
 - [Discord](https://discord.com/invite/igdb)
 - [X (Old Twitter)](https://x.com/IGDBcom)


## Authors

- [@goncalojbsousa](https://github.com/goncalojbsousa)


## Inspirations

 - [Gamegator](gamegator.net)
 - [Mathiewz Project](https://frontend-kofb4cduoq-od.a.run.app)
 - [Backloggd](https://backloggd.com)
 - [Infinite Backlog](https://infinitebacklog.net)
