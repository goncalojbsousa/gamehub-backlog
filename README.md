<p align="center">
  <a href="https://gamehubbacklog.vercel.app">
    <img src="https://github.com/goncalojbsousa/gamehub-backlog/blob/main/public/cover.webp" height="96" style="margin-right: 10px;">
    <h1 align="center">GameHub Backlog</h1>
    <p align="center">Track, rate, and manage your gaming journey</p>
  </a>
</p>

---
## Table of Contents

- [About](#about)
  - [Features](#features)
- [Running Locally](#running-locally)
  - [Database](#database)
- [Environment Variables](#environment-variables)
- [Contribution](#contribution)
- [API Documentation](#api-documentation)
- [IGDB](#igdb)
- [Inspirations](#inspirations)
- [License](#license)


---
## About

GameHub Backlog is a comprehensive game tracking platform designed to help you manage your video game collection, track your progress, and share your gaming experiences. Built with modern web technologies, it offers a seamless experience across all devices.

### Features

- **Multiple Authentication Methods:** Sign in using Google, Discord, or Steam accounts.
- **Complete Game Database:** Access detailed information about games worldwide using the IGDB API.
- **Advanced Search & Filtering:** Find games using advanced filters including Genres, Platforms, and more.
- **Streamlined Backlog System:** Track games with a simplified status system:
  - **Playing**: Currently playing
  - **Played**: Games you've finished
  - **Dropped**: Games you've stopped playing
  - **Plan to Play**: Games you want to play
- **Review System:** Rate games from 1-5 stars and write detailed reviews to share your thoughts.
- **User Profiles:** Customize your public profile with a biography and privacy settings. Choose what information to share with others.
- **Administration Dashboard:** Comprehensive tools for moderators to manage the platform.
- **Modern UI/UX:** Enjoy a clean, responsive design with light and dark mode support.
- **Report System:** Report inappropriate content to help maintain a positive community.
- **Terms of Service & Privacy Policy:** Clear guidelines and policies for all users.

---
## Running locally

Clone the project

```bash
  git clone https://github.com/goncalojbsousa/gamehub-backlog.git
```

Enter the project directory

```bash
  cd gamehub-backlog
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

### Database

Enter the database directory

```bash
  cd database
```

Run Docker Compose

```bash
  docker compose up -d
```

Edit the .env file in the root directory

- `DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"`

Run Prisma migrations

```bash
  npx prisma migrate dev
```

Generate Prisma client

```bash
  npx prisma generate
```

Your database is now ready to use.

---
## Environment Variables

Enter the project directory

```bash
  cd gamehub-backlog
```

Copy .env.example to .env

```bash
  cp .env.example .env
```

Update the .env file with the necessary configuration values.

---
## Contribution

Contributions are welcome and much appreciated! If you want to help improve the GameHub Backlog please read `CONTRIBUTING.md`

Please follow the `code of conduct` of this project.

---
## API Documentation

For comprehensive API documentation, please visit our interactive Swagger documentation:

 [View API Documentation](https://gamehubbacklog.vercel.app/api-docs.html)

Or run the project locally and visit:
`http://localhost:3000/api-docs.html`

The API documentation includes detailed information about all available endpoints, request/response formats, and authentication requirements.

---
## IGDB
All game data is provided by IGDB
- [IGDB](https://www.igdb.com)
- [Discord](https://discord.com/invite/igdb)
- [X (Old Twitter)](https://x.com/IGDBcom)

---
## Inspirations

- [GameGator](https://gamegator.net)
- [Backloggd](https://backloggd.com)
- [Infinite Backlog](https://infinitebacklog.net)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.