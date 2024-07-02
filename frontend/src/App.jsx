// src/App.jsx
import React from 'react';
import MusicRecommendations from '../src/components/MusicRecommendations';
import '../src/styles/MusicRecommendations.css';

const App = () => {
  return (
    <div className="App">
      <h1>Music Recommendations</h1>
      <MusicRecommendations />
    </div>
  );
};

export default App;
