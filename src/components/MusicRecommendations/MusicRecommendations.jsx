import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar'; // Import Sidebar component
import Preloader from '../../components/Preloader/Preloader'; // Import Preloader component
import '../MusicRecommendations/MusicRecommendations.css'; // Import MusicRecommendations styles
import '../../components/sidebar/Sidebar.css'; // Import Sidebar styles
const baseURL = 'https://sonoriq-backend.onrender.com';

const MusicRecommendations = () => {
  const [tracks, setTracks] = useState([]);
  const [seedGenres, setSeedGenres] = useState('pop');
  const [seedArtists, setSeedArtists] = useState('');
  const [seedTracks, setSeedTracks] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true); // Start loading
      const response = await fetch(`${baseURL}/api/recommendations?seed_genres=${seedGenres}&seed_artists=${seedArtists}&seed_tracks=${seedTracks}`);
      const data = await response.json();
      setTracks(data);
      setLoading(false); // End loading
    };

    fetchTracks();
  }, [seedGenres, seedArtists, seedTracks]);

  const handleGenreChange = (e) => setSeedGenres(e.target.value);
  const handleArtistChange = (e) => setSeedArtists(e.target.value);
  const handleTrackChange = (e) => setSeedTracks(e.target.value);

  // Helper function to truncate strings
  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  return (
    <div className="app-container">
      {loading && <Preloader />} {/* Show preloader when loading */}
      <Sidebar /> {/* Include Sidebar component */}
      <div className="music-recommendations">
        <h1>Music Recommendations</h1>
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
                <h3 title={track.name}>{truncateString(track.name, 20)}</h3>
                <p title={track.artists.map(artist => artist.name).join(', ')}>{truncateString(track.artists.map(artist => artist.name).join(', '), 20)}</p>
              </div>
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="spotify-link">
                Listen on &nbsp;<i className="fa-brands fa-spotify"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicRecommendations;
