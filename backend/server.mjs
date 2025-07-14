// server.mjs

import express from 'express';
import cors from 'cors';
import { getAccessToken, getRecommendations } from './spotify.mjs';
import('dotenv').then(dotenv => dotenv.config());
import process from 'process';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/api/recommendations', async (req, res) => {
  const { seed_genres, seed_artists, seed_tracks } = req.query;

  try {
    const accessToken = await getAccessToken();
    const tracks = await getRecommendations(accessToken, seed_genres, seed_artists, seed_tracks);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
