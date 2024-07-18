import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopTracks.css';

const MusicCharts = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(true);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const clientId = 'd91a526fac8d4ce59f314782764bca69';
      const clientSecret = '8c16b55a114047e98523196eb625fc71';
      const playlistId = '37i9dQZF1DXcBWIGoYBM5M';

      try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          }
        });
        const token = tokenResponse.data.access_token;

        const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTopTracks(tracksResponse.data.items);

      } catch (error) {
        console.error('Error fetching Spotify data:', error);
      }
    };

    const fetchLastFmData = async () => {
      const apiKey = '869c9de70ac2788fe3c99e9c8e3c42d8';

      try {
        const artistsResponse = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`);
        const artists = artistsResponse.data.artists.artist;
        
        const spotifyTokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`d91a526fac8d4ce59f314782764bca69:8c16b55a114047e98523196eb625fc71`)}`
          }
        });
        const spotifyToken = spotifyTokenResponse.data.access_token;

        const artistsWithDetails = await Promise.all(artists.map(async (artist) => {
          const artistInfoResponse = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist.name}&api_key=${apiKey}&format=json`);
          const artistInfo = artistInfoResponse.data.artist;

          const artistSearchResponse = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
              'Authorization': `Bearer ${spotifyToken}`
            },
            params: {
              q: artist.name,
              type: 'artist',
              limit: 1
            }
          });

          const spotifyArtist = artistSearchResponse.data.artists.items[0];
          return {
            name: artistInfo.name,
            url: artistInfo.url,
            imageUrl: spotifyArtist ? spotifyArtist.images[0].url : 'default-image-url',
            listeners: artist.listeners,
            playcount: artistInfo.stats.playcount,
            tags: artistInfo.tags.tag.map(tag => tag.name).join(', '),
            // bio: artistInfo.bio.summary
          };
        }));

        setTopArtists(artistsWithDetails);
      } catch (error) {
        console.error('Error fetching Last.fm data:', error);
      }
    };

    fetchSpotifyData();
    fetchLastFmData();
  }, []);

  return (
    <div className="music-charts">
      <div className="switch-button">
        <button className={showTopTracks ? 'active' : ''} onClick={() => setShowTopTracks(true)}>Top Tracks</button>
        <button className={!showTopTracks ? 'active' : ''} onClick={() => setShowTopTracks(false)}>Top Artists</button>
      </div>
      {showTopTracks ? (
        <div>
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
        </div>
      ) : (
        <div>
          <h2>Top Artists</h2>
          <ul className="top-artists">
            {topArtists.map((artist, index) => (
              <li key={index} className="artist-item">
                <img src={artist.imageUrl} alt={artist.name} className="artist-img" />
                <div className="artist-info">
                  <a href={artist.url} className="artist-name" target="_blank" rel="noopener noreferrer">
                    {artist.name}
                  </a>
                  <span className="artist-followers">Listeners: {parseInt(artist.listeners).toLocaleString()}</span>
                  <span className="artist-playcount">Playcount: {parseInt(artist.playcount).toLocaleString()}</span>
                  <span className="artist-tags">Tags: {artist.tags}</span>
                  <span className="artist-bio" dangerouslySetInnerHTML={{ __html: artist.bio }}></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MusicCharts;
