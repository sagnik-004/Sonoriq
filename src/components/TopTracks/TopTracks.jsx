import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopTracks.css';

const MusicCharts = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const clientId = 'd91a526fac8d4ce59f314782764bca69';
      const clientSecret = '8c16b55a114047e98523196eb625fc71';
      const playlistId = '37i9dQZF1DXcBWIGoYBM5M'; // Replace with your playlist ID
      const artistIds = '1Xyo4u8uXC1ZmMpatF05PJ,5K4W6rqBFWDnAN6FQUkS6x,7dGJo4pcD2V6oG8kP0tJRR'; // Replace with your artist IDs

      try {
        // Get Spotify access token
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          }
        });
        const token = tokenResponse.data.access_token;

        // Fetch top tracks
        const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTopTracks(tracksResponse.data.items);

        // Fetch top artists
        const artistsResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${artistIds}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTopArtists(artistsResponse.data.artists);

      } catch (error) {
        console.error('Error fetching Spotify data:', error);
      }
    };

    fetchSpotifyData();
  }, []);

  return (
    <div className="music-charts">
      <h2>Top Tracks</h2>
      <ul className="top-tracks">
        {topTracks.map((track, index) => (
          <li key={index} className="track-item">
            <img src={track.track.album.images[0].url} alt={track.track.name} />
            <div className="track-info">
              <span className="track-title">{track.track.name}</span>
              <span className="track-artist">{track.track.artists[0].name}</span>
              <a href={track.track.external_urls.spotify} className="listen-link" target="_blank" rel="noopener noreferrer">
              Listen on &nbsp;<i className="fa-brands fa-spotify"></i>
              </a>
            </div>
          </li>
        ))}
      </ul>
      <h2>Top Artists</h2>
      <ul className="top-artists">
        {topArtists.map((artist, index) => (
          <li key={index}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MusicCharts;
