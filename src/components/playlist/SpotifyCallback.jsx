// src/pages/SpotifyCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = null;

    if (hash) {
      const parsedHash = new URLSearchParams(hash.replace('#', ''));
      token = parsedHash.get('access_token');
      spotifyApi.setAccessToken(token);
      localStorage.setItem('spotify_token', token);
    }

    if (token) {
      navigate('/playlist');
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default SpotifyCallback;
