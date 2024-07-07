import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopTracks.css';

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const clientId = 'd91a526fac8d4ce59f314782764bca69';
    const clientSecret = '8c16b55a114047e98523196eb625fc71';

    const getToken = async () => {
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
          new URLSearchParams({
            'grant_type': 'client_credentials'
          }), {
            headers: {
              'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error obtaining token:', error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      const playlistId = '37i9dQZF1DXcBWIGoYBM5M'; // Replace with your actual playlist ID
      axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => setTracks(response.data.items))
      .catch(error => {
        console.error('Error fetching tracks:', error);
        console.log(error.response.data);
      });
    }
  }, [token]);

  return (
    <div className="container">
      <h2>Top Tracks</h2>
      {tracks.map((track, index) => (
        <div className="track-card" key={index}>
          <img className="album-art" src={track.track.album.images[0].url} alt={track.track.name} />
          <h3 className="track-title">{track.track.name}</h3>
          <p className="artists">{track.track.artists.map(artist => artist.name).join(', ')}</p>
          <a className="listen-button" href={track.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          Listen on &nbsp;<i className="fa-brands fa-spotify"></i>
          </a>
        </div>
      ))}
    </div>
  );
};

export default TopTracks;
