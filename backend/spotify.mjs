// spotify.mjs

import fetch from 'node-fetch';

const clientId = 'd16b419d172c450dac60bc9b98502eee';
const clientSecret = '0e3c35c85661401facb743b4b92394ce';

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

async function getRecommendations(accessToken, seedGenres, seedArtists, seedTracks) {
  const url = new URL('https://api.spotify.com/v1/recommendations');
  const params = {
    seed_genres: seedGenres,
    seed_artists: seedArtists,
    seed_tracks: seedTracks,
  };

  Object.keys(params).forEach(key => params[key] && url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.tracks;
}

export { getAccessToken, getRecommendations };
