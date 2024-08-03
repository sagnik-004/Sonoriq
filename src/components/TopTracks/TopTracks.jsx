import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopTracks.css";

const MusicCharts = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(true);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const clientId =import.meta.env.VITE_TOPTRACKS_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_TOPTRACKS_CLIENT_SECRET;
      const playlistId =import.meta.env.VITE_TOPTRACKS_PLAYLIST_ID;

      try {
        const tokenResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
          }
        );
        const token = tokenResponse.data.access_token;

        const tracksResponse = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopTracks(tracksResponse.data.items);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      }
    };

    const fetchLastFmAndSpotifyData = async () => {
      const lastFmApiKey =import.meta.env.VITE_TOPTRACKS_LASTFMAPIKEY;
      const spotifyClientId =import.meta.env.VITE_TOPTRACKS_CLIENT_ID
      const spotifyClientSecret =import.meta.env.VITE_TOPTRACKS_CLIENT_SECRET;

      try {
        const lastFmResponse = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${lastFmApiKey}&format=json`
        );
        const artists = lastFmResponse.data.artists.artist;

        const spotifyTokenResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${btoa(`${spotifyClientId}:${spotifyClientSecret}`)}`,
            },
          }
        );
        const spotifyToken = spotifyTokenResponse.data.access_token;

        const artistsWithDetails = await Promise.all(
          artists.map(async (artist) => {
            const spotifyArtistResponse = await axios.get(
              `https://api.spotify.com/v1/search`,
              {
                headers: {
                  Authorization: `Bearer ${spotifyToken}`,
                },
                params: {
                  q: artist.name,
                  type: "artist",
                  limit: 1,
                },
              }
            );
            const spotifyArtist = spotifyArtistResponse.data.artists.items[0];

            if (spotifyArtist) {
              return {
                name: artist.name,
                url: spotifyArtist.external_urls.spotify,
                imageUrl: spotifyArtist.images[0]?.url || "default-image-url",
                listeners: spotifyArtist.followers.total.toLocaleString(),
                // playcount: spotifyArtist.popularity.toLocaleString(),
                tags: spotifyArtist.genres.join(", "),
              };
            } else {
              return null;
            }
          })
        );

        setTopArtists(artistsWithDetails.filter((artist) => artist !== null));
      } catch (error) {
        console.error("Error fetching Last.fm and Spotify data:", error);
      }
    };

    fetchSpotifyData();
    fetchLastFmAndSpotifyData();
  }, []);

  return (
    <div className="music-charts">
      <div className="switch-button">
        <button
          className={showTopTracks ? "active" : ""}
          onClick={() => setShowTopTracks(true)}
        >
          Top Tracks
        </button>
        <button
          className={!showTopTracks ? "active" : ""}
          onClick={() => setShowTopTracks(false)}
        >
          Top Artists
        </button>
      </div>
      {showTopTracks ? (
        <div>
          <ul className="top-tracks">
            {topTracks.map((track, index) => (
              <li key={index} className="track-item">
                <img
                  src={track.track.album.images[0].url}
                  alt={track.track.name}
                />
                <div className="track-info">
                  <span className="track-title">{track.track.name}</span>
                  <span className="track-artist">
                    {track.track.artists[0].name}
                  </span>
                </div>
                <a
                  href={track.track.external_urls.spotify}
                  className="listen-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen on &nbsp;<i className="fa-brands fa-spotify"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <ul className="top-artists">
            {topArtists.map((artist, index) => (
              <li key={index} className="artist-item">
                <a
                  href={artist.url}
                  className="artist-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="artist-img"
                  />
                  <div className="artist-info">
                    <span className="artist-name">{artist.name}</span>
                    <span className="artist-followers">
                      Listeners: {artist.listeners}
                    </span>
                    {/* <span className="artist-playcount">
                      Playcount: {artist.playcount}
                    </span> */}
                    <span className="artist-tags">Tags: {artist.tags}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MusicCharts;
