// MusicRecommendations.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component
import '../styles/MusicRecommendations.css';
import '../styles/Sidebar.css'; // Import Sidebar styles

const MusicRecommendations = () => {
  const [tracks, setTracks] = useState([]);
  const [seedGenres, setSeedGenres] = useState('pop');
  const [seedArtists, setSeedArtists] = useState('');
  const [seedTracks, setSeedTracks] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      const response = await fetch(`http://localhost:5000/api/recommendations?seed_genres=${seedGenres}&seed_artists=${seedArtists}&seed_tracks=${seedTracks}`);
      const data = await response.json();
      setTracks(data);
    };

    fetchTracks();
  }, [seedGenres, seedArtists, seedTracks]);

  const handleGenreChange = (e) => setSeedGenres(e.target.value);
  const handleArtistChange = (e) => setSeedArtists(e.target.value);
  const handleTrackChange = (e) => setSeedTracks(e.target.value);

  return (
    <div className="app-container">
      <Sidebar /> {/* Include Sidebar component */}
      <div className="music-recommendations">
        <div className="inputs">
          <input type="text" placeholder="Search by Genre" value={seedGenres} onChange={handleGenreChange} />
          {/* <input type="text" placeholder="Seed Artists" value={seedArtists} onChange={handleArtistChange} />
          <input type="text" placeholder="Seed Tracks" value={seedTracks} onChange={handleTrackChange} /> */}
        </div>
        <div className="track-list">
          {tracks.map((track) => (
            <div key={track.id} className="track-card">
              <div className="track-image">
                <img src={track.album.images[0].url} alt={track.name} />
              </div>
              <div className="track-info">
                <h3>{track.name}</h3>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="spotify-link">
                  Listen on &nbsp;<i className="fa-brands fa-spotify"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicRecommendations;
