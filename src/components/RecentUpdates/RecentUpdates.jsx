import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentUpdates.css';

const RecentUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      const apiKey = '769bd979-bcdc-49ba-8d82-358f742d5bb2';
      try {
        const response = await axios.get(`https://content.guardianapis.com/search?q=music&show-fields=bodyText&page-size=50&api-key=${apiKey}`);
        const articles = response.data.response.results;
        setUpdates(articles);
      } catch (error) {
        console.error('Error fetching recent updates:', error);
      }
    };

    // Fetch updates immediately
    fetchRecentUpdates();

    // Set up interval to fetch updates periodically
    const intervalId = setInterval(fetchRecentUpdates, 43200000); // Fetch updates every 12 hours

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  return (
    <div className="recent-updates">
      <h2>Recent Updates</h2>
      <ul>
        {updates.map((update, index) => (
          <li key={index}>
            <h3>{update.webTitle}</h3>
            <p>{truncateText(update.fields && update.fields.bodyText ? update.fields.bodyText : 'No summary available.', 50)}</p>
            <a href={update.webUrl} target="_blank" rel="noopener noreferrer">Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUpdates;
