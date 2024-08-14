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

```http
  POST /api/game/updateGameStatus
```

| Parameter   | Type       | Description                                     |
|-------------|------------|-----------------------------------------------|
| `userId`    | `string`    | **Mandatory**. User identifier (UUID). |
| `gameId`    | `number`    | **Mandatory**. Game identifier (positive number). |
| `status`    | `string`    | **Mandatory**. Game status (maximum 20 characters). |
| `progress`  | `string`    | **Mandatory**. Game progress (maximum 20 characters). |

### Get user game status

```http
GET /api/game/getGameStatus
```

##### Query Parameters:

| Parameter | Type | Description |
|-------------|------------|-----------------------------------------------------|
| `userId` | `string` | **Mandatory**. User identifier (UUID). |
| `gameId` | `string` | **Mandatory**. Game identifier (positive number in string format). |

##### Responses:

- 200 OK: Returns the game status and progress for the specified user and game.

```json
{
    "status": "string", // User's game status
    "progress": "string" // User's game progress
}
```

- 400 Bad Request: Returned when `userId` or `gameId` are missing or improperly formatted.

```json
{
    "error": "gameId parameter is missing" // Example error message
}
```

- 500 Internal Server Error: Returned if there's a server-side issue when fetching the user's game status.

```json
{
    "error": "Internal Server Error"
}
```

### Get user game status by user ID

```http
GET /api/game/getGameStatusByUserId
```

##### Query Parameters:

| Parameter | Type | Description |
|-------------|------------|-----------------------------------------------------|
| `userId` | `string` | **Mandatory**. User identifier (UUID). |
| `status` | `string` | **Mandatory**. Game status (one of: 'Playing', 'Played', 'Dropped', 'Plan to play'). |
| `page` | `number` | Optional. Page number for pagination (defaults to 1). |

##### Responses:

- 200 OK: Returns the game statuses and progress for the specified user, with pagination.

```json
{
    "data": [
        {
            "gameId": 123,
            "status": "Playing",
            "progress": "Unfinished",
            "gameDetails": {
            "id": 123,
            "name": "Game Title",
            "cover": "url_to_image",
            "summary": "Game summary",
            // Other game details from IGDB
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 3,
        "totalItems": 100
    }
}
```

- 400 Bad Request: Returned when `userId`, `status` or other parameters are missing or improperly formatted.

```json
{
    "message": "Invalid parameters"
}
```

- 403 Forbidden: Returned when the client IP is blocked due to rate limiting.

```json
{
    "message": "Access temporarily blocked. Try again later."
}
```

- 429 Too Many Requests: Returned when the rate limit is exceeded.

```json
{
    "message": "Limit rate exceeded. Try again later."
}
```

- 500 Internal Server Error: Returned if there's a server-side issue when fetching the user's game statuses or game details.

```json
{
    "message": "Internal server error"
}
```

### Get user data

```http
GET /api/user/getUserData
```

##### Query Parameters:

| Parameter | Type | Description |
|-------------|------------|----------------------------------------------|
| `username` | `string` | **Mandatory**. Username of the user to fetch. |

##### Responses:

- 200 OK: Returns the user data for the specified username.

```json
{
  "id": "string", // User's unique identifier (UUID)
  "name": "string", // User's full name
  "image": "string", // URL to the user's profile image
  "createdAt": "string",// Date and time the user was created
  "username": "string" // User's username
}
```

- 401 Unauthorized: Returned when the `username` parameter is missing.

```json
{
  "error": "Username is missing"
}
```

- 500 Internal Server Error: Returned if there's a server-side issue when fetching the user's data.

```json
{
  "error": "Internal Server Error"
}
```


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
