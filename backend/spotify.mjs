// spotify.mjs

import fetch from 'node-fetch';

const clientId = '69da7700f4a6486a8a3249a9f9790552';
const clientSecret = '00508aeaae2249cc8eb828621b9c4f10';

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
