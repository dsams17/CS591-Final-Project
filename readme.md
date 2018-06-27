The Project is all contained within subdirectories of the Proj directory, with frontend containing all of the angular, and the backend folders all being directly contained within this directory.

The backend can be initialized as per normal and is listening on port 3000. The frontend also works as expected and listening on port 4200.

The application signs a user into Spotify using Oauth2. It uses this to access a user's playlists, which are displayed in a dropdown. From here, the user can check to see if a particular playlist has already been analyzed for mood or run a new analysis. The analysis consists of using a very advanced alogrithm to send the playlist data to Watson for analysis. The data returned from this is then consumed by Giphy to find a matching gif. Both of these are then stored in the database as attached to this particular user for future use and also displayed.
