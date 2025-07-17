import React, { useState } from 'react';
import axios from 'axios';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');

  const handleShorten = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/shorten', { url });
      setShortUrl(`http://localhost:5000/api/shorten/${res.data.shortCode}`);
      setShortCode(res.data.shortCode);
      setMessage('URL Shortened Successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stats/${shortCode}`);
      setStats(res.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error getting stats');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/shorten/${shortCode}`);
      setMessage('Short URL deleted successfully!');
      setShortUrl('');
      setStats(null);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error deleting URL');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-center">URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter URL"
        className="w-full border p-2 rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleShorten} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
        Shorten URL
      </button>

      {shortUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {shortUrl}
          </a>
        </div>
      )}

      {shortCode && (
        <div className="space-x-2 mt-4">
          <button
            onClick={handleStats}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Get Stats
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Delete URL
          </button>
        </div>
      )}

      {stats && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p><strong>Original URL:</strong> {stats.url}</p>
          <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(stats.updatedAt).toLocaleString()}</p>
          <p><strong>Access Count:</strong> {stats.accessCount}</p>
        </div>
      )}

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
};

export default UrlShortener;
