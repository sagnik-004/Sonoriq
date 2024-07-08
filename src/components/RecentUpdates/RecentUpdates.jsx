import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentUpdates.css';

const RecentUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const apiKey = 'a9e6497b8caa453fae744ea8a5070359'; // Replace with your actual NewsAPI key
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=music&apiKey=${apiKey}`);
        const filteredUpdates = response.data.articles.filter(update => 
          !update.title.includes('[Removed]') && !update.description.includes('[Removed]')
        );
        setUpdates(filteredUpdates);
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div className="container">
      <h2>Recent Updates</h2>
      {updates.map((update, index) => (
        <div className="update-card" key={index}>
          <h3>{update.title}</h3>
          <p>{update.description}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentUpdates;
