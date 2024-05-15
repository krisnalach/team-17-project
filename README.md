# BlitzJack - Team 17's Project

Note from Krisna: This project seemingly broke by itself.
It works on Mac, but does not work on Windows, when we didn't
touch any code that should have broken it.
It was working on Windows a couple hours prior before breaking.
We will roll back some code, so the current code may have unnecessary
comments.

## Installation instructions
- Install `Node.js`
- Clone the repository onto your machine
- Run `npm install` to install necessary dependencies
- For milestone-03, run `npm run start` or `npm start`
- The server should be started on `localhost:3260`

## Registering / Logging In
- Register an account by providing a username and a password
- Log in to an existing account to have access to leaderboard updates or the statistics page
- Usernames must be unique: duplicate usernames will be rejected
- One user exists by default: username: `admin`, password: `password`

## Limitations
- UI designs aren't fully fleshed out yet, but the general idea of how they'll look is there
- The blackjack game is a bit buggy
- With more time, we would:
 - Implement a match history feature
 - Implement more interesting user stats
 - Store game information

## The Backend
### The Database
- The backend database stores:
  - A leaderboard that holds username, score pairs. The leaderboard is only updated upon game completion (reaching 0 hearts), and if a high score is achieved
  - User statistics tied to user information
  - User login information tied to their username
### Routes
### GET
- `/getUserStats` writes back the currently logged in user statistics object
- `/getLeaderboard` writes back the leaderboard stored in the database
- `/getCurrentUser` writes back the currently logged in user's username
### POST
- `/login` logs in the user if their login attempt is valid and stores them in a session. Implemented using `Passport.js`
- `/register` registers a user into the database with their username and (SHA-256 hashed) password
- `/logout` logs out the currently logged in user and removes them from the session. Implemented using `Passport.js`
### PUT
- `/updateLeaderboard` updates the leaderboard stored in the databse with the provided username and score
- `/updateUser` updates the provided username's statistics with the provided stats object
### DELETE
- `/deleteUser` deletes the currently signed in user from the database completely
