require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


    app.get('/', (req, res, next) => {
        res.render("index.hbs")
    });

    
  app.get('/artist-search', (req, res, next) => {
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists);
      res.render("artist-search-results", { artistResults: data.body.artists.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })

  app.get('/album/:artistId', (req, res, next) => {
    console.log(req.params)
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log(data.body.items, "THIS IS THE VIEW ALBUMS DATA")
        res.render("albums", {artistResults: data.body.items})
    })
  });
  app.get('/songs/:albumId', (req, res, next) =>{
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
        console.log(data.body.items, "THIS IS THE VIEW ALBUMS DATA")
        res.render("songs", {artistResults: data.body.items})
    })
  })




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
