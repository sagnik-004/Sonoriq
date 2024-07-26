import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useNavigate } from "react-router-dom";
import "./PlaylistPage.css";

const spotifyApi = new SpotifyWebApi();

function PlaylistPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [params, setParams] = useState({
    language: "",
    genre: "",
    year: "",
    acousticness: 0.5,
    danceability: 0.5,
    energy: 0.5,
    instrumentalness: 0.5,
    speechiness: 0.5,
    valence: 0.5,
    tempo: 125,
  });
  const [playlistName, setPlaylistName] = useState("");
  const [tracks, setTracks] = useState([]);
  const [userId, setUserId] = useState("");
  const [playlistCover, setPlaylistCover] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then((user) => {
        setUserId(user.id);
        setIsLoggedIn(true);
      });
    }
  }, []);

  const handleLogin = () => {
    const clientId = '716c5b12ede9446396806d5c38108034';
    const redirectUrl = 'https://sonoriq.vercel.app/callback';
    const scope = 'playlist-modify-public playlist-modify-private user-read-private';

    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUrl
    )}&scope=${scope}&response_type=token&show_dialog=true`;
    window.location.href = url;
  };

  const handleCreatePlaylist = async () => {
    if (!isLoggedIn) {
      alert("Please log in first");
      return;
    }

    try {
      // Create a new playlist
      const playlist = await spotifyApi.createPlaylist(userId, {
        name: playlistName,
        description: "Custom playlist created from parameters",
        public: true,
      });

      // Add tracks to the playlist
      await spotifyApi.addTracksToPlaylist(
        playlist.id,
        tracks.map((track) => track.uri)
      );

      // Upload the playlist cover image if provided
      if (playlistCover) {
        const base64Cover = await toBase64(playlistCover);
        await spotifyApi.uploadCustomPlaylistCoverImage(
          playlist.id,
          base64Cover
        );
      }

      alert("Playlist created and tracks added successfully");
    } catch (error) {
      console.error("Error creating playlist", error);
    }
  };

  const handleGenerateTracks = async () => {
    try {
      // Example of searching for tracks using Spotify API
      const query = `${params.genre ? "genre:" + params.genre : ""} ${
        params.year ? "year:" + params.year : ""
      }`;
      const response = await spotifyApi.searchTracks(query);
      setTracks(response.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks", error);
    }
  };

  const handleParamChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPlaylistCover(e.target.files[0]);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="pl-playlist-page">
      <h1>Playlist Generator</h1>
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <div className="pl-form-container">
          <div className="pl-param-container">
            <label>
              Language:
              <input
                type="text"
                name="language"
                value={params.language}
                onChange={handleParamChange}
              />
            </label>
            <label>
              Genre:
              <input
                type="text"
                name="genre"
                value={params.genre}
                onChange={handleParamChange}
              />
            </label>
            <label>
              Year:
              <input
                type="text"
                name="year"
                value={params.year}
                onChange={handleParamChange}
              />
            </label>
            <label>
              Acousticness:
              <input
                type="range"
                name="acousticness"
                min="0"
                max="1"
                step="0.01"
                value={params.acousticness}
                onChange={handleSliderChange}
              />
              <span>{params.acousticness}</span>
            </label>
            <label>
              Danceability:
              <input
                type="range"
                name="danceability"
                min="0"
                max="1"
                step="0.01"
                value={params.danceability}
                onChange={handleSliderChange}
              />
              <span>{params.danceability}</span>
            </label>
            <label>
              Energy:
              <input
                type="range"
                name="energy"
                min="0"
                max="1"
                step="0.01"
                value={params.energy}
                onChange={handleSliderChange}
              />
              <span>{params.energy}</span>
            </label>
            <label>
              Instrumentalness:
              <input
                type="range"
                name="instrumentalness"
                min="0"
                max="1"
                step="0.01"
                value={params.instrumentalness}
                onChange={handleSliderChange}
              />
              <span>{params.instrumentalness}</span>
            </label>
            <label>
              Speechiness:
              <input
                type="range"
                name="speechiness"
                min="0"
                max="1"
                step="0.01"
                value={params.speechiness}
                onChange={handleSliderChange}
              />
              <span>{params.speechiness}</span>
            </label>
            <label>
              Valence:
              <input
                type="range"
                name="valence"
                min="0"
                max="1"
                step="0.01"
                value={params.valence}
                onChange={handleSliderChange}
              />
              <span>{params.valence}</span>
            </label>
            <label>
              Tempo:
              <input
                type="range"
                name="tempo"
                min="0"
                max="250"
                step="1"
                value={params.tempo}
                onChange={handleSliderChange}
              />
              <span>{params.tempo} BPM</span>
            </label>
          </div>
          <button className="pl-generate-button" onClick={handleGenerateTracks}>
            Generate
          </button>
          <div className="pl-playlist-container">
            <div className="pl-track-list">
              {tracks.map((track, index) => (
                <div key={index} className="pl-track-card">
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="pl-track-image"
                  />
                  <div className="pl-track-info">
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {track.name}
                    </a>
                    <p>
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* <input type="file" accept="image/*" onChange={handleCoverChange} /> */}
            {/* {playlistCover && (
              <img src={URL.createObjectURL(playlistCover)} alt="Playlist Cover" className="playlist-cover" />
            )} */}
            <input
              type="text"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="pl-playlist-name-input"
            />

            <button
              className="pl-add-to-spotify-button"
              onClick={handleCreatePlaylist}
            >
              Add to Spotify
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;
