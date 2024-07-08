import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentUpdates.css';

const RecentUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      const apiKey = 'a9e6497b8caa453fae744ea8a5070359';
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=music&apiKey=${apiKey}`);
        // Filter out updates with the title '[Removed]'
        const filteredUpdates = response.data.articles.filter(update => update.title !== '[Removed]');
        setUpdates(filteredUpdates);
      } catch (error) {
        console.error('Error fetching recent updates:', error);
      }
    };

    fetchRecentUpdates();
  }, []);

  return (
    <div className="recent-updates">
      <h2>Recent Updates</h2>
      <ul>
        {updates.map((update, index) => (
          <li key={index}>
            <h3>{update.title}</h3>
            <p>{update.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUpdates;
