# BlitzJack - Team 17's Project

## Installation instructions
- Clone the repository onto your machine
- Run `npm install` to install necessary dependencies
- For milestone-03, run `npm run start` or `npm start`
- The server should be started on `localhost:3260`

## Registering / Logging In
- Register an account by providing a username and a password
- Log in to an existing account to have access to leaderboard updates or the statistics page
- Usernames must be unique: duplicate usernames will be rejected

## Limitations
- UI designs aren't fully fleshed out yet, but the general idea of how they'll look is there
- The blackjack game is a bit buggy
- With more time, we would:
 - implement a match history feature
 - implement more interesting user stats
 - store game information

## The Backend
### The Database
- The backend database stores:
  - A leaderboard that holds username, score pairs
  - User statistics tied to user information
  - User login information tied to their username
### Routes
### GET
- `/getUserStats` writes back the currently logged in user statistics object
- `/getLeaderboard` writes back the leaderboard stored in the database
- `/getCurrentUser` writes back the currently logged in user's username
### POST
- Login will log the user in and authenticate the user
- Register will add a new user to the server
- Log out will wipe the session for the current user
### PUT
- updateLeaderboard will update a the leaderboard if the user ends their session with a top 5 score and change their score on the board or put them on there
- updateUser will update the stats of a user at the end of their session
- updateGame
### DELETE
- DeleteGame
