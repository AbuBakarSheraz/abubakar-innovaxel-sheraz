import React, { useState } from 'react';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [updateUrl, setUpdateUrl] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const handleShorten = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShortUrl(`http://localhost:5000/api/shorten/${data.shortCode}`);
        setShortCode(data.shortCode);
        setMessage('URL Shortened Successfully!');
        setUpdateUrl(''); // Clear update form
        setShowUpdateForm(false);
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stats/${shortCode}`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        setMessage(data.error || 'Error getting stats');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleUpdate = async () => {
    if (!updateUrl.trim()) {
      setMessage('Please enter a valid URL to update');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/shorten/${shortCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: updateUrl }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('URL updated successfully!');
        setShowUpdateForm(false);
        setUpdateUrl('');
        // Refresh stats if they are currently displayed
        if (stats) {
          handleStats();
        }
      } else {
        setMessage(data.error || 'Error updating URL');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleRedirect = async () => {
    if (!redirectUrl.trim()) {
      setMessage('Please enter a short code to redirect');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/shorten/${redirectUrl}`);
      const data = await response.json();
      
      if (response.ok && data.url) {
        // Open the original URL in a new tab
        window.open(data.url, '_blank');
        setMessage(`Redirecting to: ${data.url}`);
      } else {
        setMessage(data.error || 'Error redirecting URL');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shorten/${shortCode}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage('Short URL deleted successfully!');
        setShortUrl('');
        setStats(null);
        setShortCode('');
        setShowUpdateForm(false);
        setUpdateUrl('');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Error deleting URL');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const clearAll = () => {
    setUrl('');
    setShortUrl('');
    setShortCode('');
    setStats(null);
    setMessage('');
    setUpdateUrl('');
    setShowUpdateForm(false);
    setRedirectUrl('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">URL Shortener</h1>

      {/* Create Short URL Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">Create Short URL</h2>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleShorten} 
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full mt-3 transition-colors"
        >
          Shorten URL
        </button>
      </div>

      {/* Redirect Section */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-green-800">Redirect to Original URL</h2>
        <input
          type="text"
          placeholder="Enter short code to redirect"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
        />
        <button 
          onClick={handleRedirect} 
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-full mt-3 transition-colors"
        >
          Redirect
        </button>
      </div>

      {/* Shortened URL Display */}
      {shortUrl && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-green-600 font-medium mb-2">Shortened URL:</p>
          <a 
            href={shortUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline break-all"
          >
            {shortUrl}
          </a>
          <p className="text-sm text-gray-600 mt-2">Short Code: <span className="font-mono">{shortCode}</span></p>
        </div>
      )}

      {/* Action Buttons */}
      {shortCode && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleStats}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Get Stats
          </button>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {showUpdateForm ? 'Cancel Update' : 'Update URL'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete URL
          </button>
        </div>
      )}

      {/* Update Form */}
      {showUpdateForm && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">Update URL</h3>
          <input
            type="text"
            placeholder="Enter new URL"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={updateUrl}
            onChange={(e) => setUpdateUrl(e.target.value)}
          />
          <button 
            onClick={handleUpdate} 
            className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 w-full mt-3 transition-colors"
          >
            Update URL
          </button>
        </div>
      )}

      {/* Stats Display */}
      {stats && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">URL Statistics</h3>
          <div className="space-y-2">
            <p><strong>Original URL:</strong> <span className="break-all">{stats.url}</span></p>
            <p><strong>Short Code:</strong> <span className="font-mono">{stats.shortCode}</span></p>
            <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(stats.updatedAt).toLocaleString()}</p>
            <p><strong>Access Count:</strong> <span className="font-bold text-blue-600">{stats.accessCount}</span></p>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`p-3 rounded-lg text-center ${
          message.includes('successfully') || message.includes('Redirecting') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Clear All Button */}
      <button
        onClick={clearAll}
        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 w-full transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};

export default UrlShortener;