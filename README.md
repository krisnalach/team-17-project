# BlitzJack - Team 17's Project

## Installation instructions
- Clone the repository onto your machine
- Run `npm install` to install necessary dependencies
- For milestone-02, run `npm run milestone-02`
- The server should start on localhost:3000

## Logging In
- Only three usernames have log in capabilities, password input is not set up and therefore doesn't do anything
- These three usernames are "john", "phil", and "stu", case sensitive
- Logging in allows for the stats page to function

## Limitations
- UI designs aren't fully fleshed out yet, but the general idea of how they'll look is there
- There are errors thrown in the console purposefully during certain events (i.e. user not being logged in)
- Game logic is not set up yet
- The login feature is not robust and hasn't been tested yet with users that don't exist
- Password feature is not implemented yet

## API Routes
### Get
- GetUserStats will extract the stats for current logged in user
- GetLeaderboard will get the current leaderboard
- GetCurrentUser will get the user that was logged in
### Post
- Login will log the user in and authenticate the user
- Register will add a new user to the server
- Log out will wipe the session for the current user
### Put
- updateLeaderboard will update a the leaderboard if the user ends their session with a top 5 score and change their score on the board or put them on there
- updateUser will update the stats of a user at the end of their session
- updateGame
### Delete
- DeleteGame