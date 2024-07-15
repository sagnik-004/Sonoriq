import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentUpdates.css';

const RecentUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      const apiKey = '769bd979-bcdc-49ba-8d82-358f742d5bb2';
      try {
        const response = await axios.get(`https://content.guardianapis.com/search?q=music&show-fields=bodyText&page-size=52&api-key=${apiKey}`);
        const articles = response.data.response.results;
        setUpdates(articles);
      } catch (error) {
        console.error('Error fetching recent updates:', error);
      }
    };

    fetchRecentUpdates();
  }, []);

  const truncateText = (text, maxLines) => {
    const words = text.split(' ');
    const linesArray = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + word + ' ';
      const testLinesArray = (testLine.length / 100) * 100 > 600 ? [...linesArray, currentLine.trim()] : linesArray;
      currentLine = (testLine.length / 100) * 100 > 600 ? word + ' ' : testLine;
      if (testLinesArray.length >= maxLines) {
        linesArray.push(currentLine.trim());
        break;
      } else if (i === words.length - 1) {
        linesArray.push(currentLine.trim());
      }
    }

    return linesArray.slice(0, maxLines).join(' ') + (linesArray.length > maxLines ? '...' : '');
  };

  return (
    <div className="recent-updates">
      <h2>Recent Updates</h2>
      <ul>
        {updates.map((update, index) => (
          <li key={index}>
            <h3>{update.webTitle}</h3>
            <p>{truncateText(update.fields && update.fields.bodyText ? update.fields.bodyText : 'No summary available.', 10)}</p>
            <a href={update.webUrl} target="_blank" rel="noopener noreferrer">Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUpdates;
