import React, { useState } from 'react';
import axios from 'axios';

export default function ApiTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined API list
const apiList = [
  {
    name: "Create Post",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    headers: {},
    body: {
      title: "Hello",
      body: "Testing POST",
      userId: 123,
    },
  },
  {
    name: "Get Todo",
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    headers: {},
  },
  {
    name: "Random Joke",
    method: "GET",
    url: "https://official-joke-api.appspot.com/random_joke",
    headers: {},
  },
  {
    name: "Random Advice",
    method: "GET",
    url: "https://api.adviceslip.com/advice",
    headers: {},
  },
  {
    name: "Cat Facts",
    method: "GET",
    url: "https://catfact.ninja/fact",
    headers: {},
  },
  {
    name: "Post a Comment",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/comments",
    headers: {},
    body: {
      postId: 1,
      name: "Areej",
      email: "areej@example.com",
      body: "Testing comment POST",
    },
  },
];


  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios({
        method,
        url,
        data: method === 'POST' ? (body ? JSON.parse(body) : null) : null,
      });

      setResponse([{ name: 'Custom API Test', status: res.status, data: res.data }]);
    } catch (err) {
      setError(err.response ? `${err.response.status}: ${err.response.statusText}` : err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAllApis = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const results = [];

    for (const api of apiList) {
      try {
        const res = await axios({
          method: api.method,
          url: api.url,
          headers: api.headers,
          data: api.method !== "GET" ? api.body : null,
        });

        results.push({
          name: api.name,
          status: res.status,
          data: res.data,
        });
      } catch (err) {
        results.push({
          name: api.name,
          status: err.response?.status || "Error",
          data: err.message,
        });
      }
    }

    setResponse(results);
    setLoading(false);
  };

  return (
    <div className="api-container">
      <h1 className="api-title">API Testing Dashboard</h1>

      <label className="api-label">API URL</label>
      <input
        className="api-input"
        type="text"
        placeholder="https://api.example.com/endpoint"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <label className="api-label">
        Method
        <select className="api-select" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </label>

      {method === 'POST' && (
        <div>
          <label className="api-label">Request Body (JSON)</label>
          <textarea
            rows="6"
            className="api-textarea"
            placeholder='{"key": "value"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      )}

      <button className="api-button" onClick={testApi} disabled={loading || !url.trim()}>
        {loading ? 'Testing...' : 'Test API'}
      </button>
      

      <button className="api-button" onClick={testAllApis} disabled={loading}>
        {loading ? 'Testing All...' : 'Test All APIs'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {Array.isArray(response) && response.map((res, i) => (
          <div key={i} style={{ marginBottom: '2rem' }}>
            <h4>{res.name}</h4>
            <p>Status: {res.status}</p>
            <pre className="api-response">{JSON.stringify(res.data, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
