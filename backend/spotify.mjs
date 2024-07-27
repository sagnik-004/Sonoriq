// spotify.mjs

import fetch from 'node-fetch';

const clientId = 'edd1f89601824b81a811987895823f74';
const clientSecret = '7422ab9e3bf1449a80d517bc34c63a2b';

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
