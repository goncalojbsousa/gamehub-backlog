# GameHub Project

GameHub is a game backlog tracker

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

## Color documentation

### White mode
| Color               | Hexadecimal                                                |
| ----------------- | ---------------------------------------------------------------- |
| Background       | ![#ffffff](https://via.placeholder.com/10/0a192f?text=+) #ffffff |
| Color main       | ![#f4f4f5](https://via.placeholder.com/10/f8f8f8?text=+) #f4f4f5 |
| Color sec       | ![#ffffff](https://via.placeholder.com/10/00b48a?text=+) #ffffff |
| Color reverse       | ![#1c1917](https://via.placeholder.com/10/00b48a?text=+) #1c1917 |
| Color reverse sec       | ![#292524](https://via.placeholder.com/10/00b48a?text=+) #292524 |
| Color text       | ![#27272a](https://via.placeholder.com/10/00b48a?text=+) #27272a |
| Color text sec       | ![#4b5563](https://via.placeholder.com/10/00b48a?text=+) #4b5563 |
| Color icons       | ![#27272a](https://via.placeholder.com/10/00b48a?text=+) #27272a |
| Color alert       | ![#fee2e2](https://via.placeholder.com/10/00b48a?text=+) #fee2e2 |
| Color border detail       | ![#e4e4e7](https://via.placeholder.com/10/00b48a?text=+) #e4e4e7 |
| Color border detail sec       | ![#3b82f6](https://via.placeholder.com/10/00b48a?text=+) #3b82f6 |
| Color gradient start       | ![#ffffffcc](https://via.placeholder.com/10/00b48a?text=+) #ffffffcc |
| Color gradient end       | ![#ffffff](https://via.placeholder.com/10/00b48a?text=+) #ffffff |


### Dark mode
| Color               | Hexadecimal                                                |
| ----------------- | ---------------------------------------------------------------- |
| Background       | #292524 |
| Color main       | ![#1c1917](https://via.placeholder.com/10/f8f8f8?text=+) #1c1917 |
| Color sec       | ![#292524](https://via.placeholder.com/10/00b48a?text=+) #292524 |
| Color reverse       | ![#e4e4e7](https://via.placeholder.com/10/00b48a?text=+) #e4e4e7 |
| Color reverse sec       | ![#ffffff](https://via.placeholder.com/10/00b48a?text=+) #ffffff |
| Color text       | ![#ffffff](https://via.placeholder.com/10/00b48a?text=+) #ffffff |
| Color text sec       | ![#9ca3af](https://via.placeholder.com/10/00b48a?text=+) #9ca3af |
| Color icons       | ![#ffffff](https://via.placeholder.com/10/00b48a?text=+) #ffffff |
| Color alert       | ![#ef4444](https://via.placeholder.com/10/00b48a?text=+) #ef4444 |
| Color border detail       | ![#52525b](https://via.placeholder.com/10/00b48a?text=+) #52525b |
| Color border detail sec       | ![#3b82f6](https://via.placeholder.com/10/00b48a?text=+) #3b82f6 |
| Color gradient start       | ![#292524b3](https://via.placeholder.com/10/00b48a?text=+) #292524b3 |
| Color gradient end       | ![#292524](https://via.placeholder.com/10/00b48a?text=+) #292524 |

## Authors

- [@goncalojbsousa](https://github.com/goncalojbsousa)

## Inspirations

 - [Gamegator](gamegator.ne)
 - [Mathiewz Project](https://frontend-kofb4cduoq-od.a.run.app)
 - [Backloggd](https://backloggd.com)
 - [Infinite Backlog](https://infinitebacklog.net)
