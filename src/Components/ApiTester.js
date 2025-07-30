import React, { useState } from 'react';
import axios from 'axios';

const categorizedApis = {
  SIM: [
    { name: "SIM Info Success", method: "GET", url: "https://jsonplaceholder.typicode.com/posts/1" },
    { name: "SIM Info Fail", method: "GET", url: "https://jsonplaceholder.typicode.com/404" },
  ],
  OTP: [
    { name: "Send OTP", method: "POST", url: "https://jsonplaceholder.typicode.com/posts", body: { phone: "1234567890", message: "Your OTP is 1234" } },
  ],
  Send: [
    { name: "Send Message", method: "POST", url: "https://jsonplaceholder.typicode.com/posts", body: { user: "areej", text: "hello" } },
  ],
  Valid: [
    { name: "Validate Email", method: "GET", url: "https://jsonplaceholder.typicode.com/comments/1" },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState('SIM');
  const [results, setResults] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [allLoading, setAllLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  const [customBody, setCustomBody] = useState('');
  const [customResult, setCustomResult] = useState(null);

  const testApisInCategory = async (category) => {
    setLoadingCategory(category);
    const apis = categorizedApis[category];
    const categoryResults = [];

    for (const api of apis) {
      try {
        const res = await axios({
          method: api.method,
          url: api.url,
          data: api.method === 'POST' ? api.body : null,
        });
        categoryResults.push({ name: api.name, status: res.status, success: true, data: res.data });
      } catch (err) {
        categoryResults.push({
          name: api.name,
          status: err.response?.status || 'Error',
          success: false,
          error: err.message,
        });
      }
    }

    setResults(prev => ({ ...prev, [category]: categoryResults }));
    setLoadingCategory(null);
  };

  const testAllCategories = async () => {
    setAllLoading(true);
    for (const category of Object.keys(categorizedApis)) {
      await testApisInCategory(category);
    }
    setAllLoading(false);
  };

  const testCustomApi = async () => {
    try {
      const res = await axios({
        method: customMethod,
        url: customUrl,
        data: customMethod === 'POST' ? JSON.parse(customBody || '{}') : null,
      });
      setCustomResult({ status: res.status, success: true, data: res.data });
    } catch (err) {
      setCustomResult({
        status: err.response?.status || 'Error',
        success: false,
        error: err.message,
      });
    }
  };

  return (
    <div className="api-container">
      <h1 className="api-title">🧪 API Testing Dashboard</h1>

      <div className="tab-buttons">
        {Object.keys(categorizedApis).map(cat => {
          const categoryPassed = results[cat]?.every(r => r.success);
          const categoryFailed = results[cat]?.some(r => !r.success);
          return (
            <button
              key={cat}
              className={`api-button ${activeTab === cat ? 'active-tab' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
              {categoryPassed && <span className="status success">✅</span>}
              {categoryFailed && !categoryPassed && <span className="status error">❌</span>}
            </button>
          );
        })}
        <button onClick={testAllCategories} className="api-button" disabled={allLoading}>
          {allLoading ? 'Testing All...' : '🚀 Test All'}
        </button>
        <button className={`api-button ${activeTab === 'custom' ? 'active-tab' : ''}`} onClick={() => setActiveTab('custom')}>
          ✏️ Custom API
        </button>
      </div>

      {activeTab !== 'custom' && (
        <div>
          <button
            className="api-button run-button"
            onClick={() => testApisInCategory(activeTab)}
            disabled={loadingCategory === activeTab || allLoading}
          >
            {loadingCategory === activeTab ? 'Testing...' : `▶️ Test ${activeTab}`}
          </button>

          <div className="result-container">
            {results[activeTab]?.map((res, i) => (
              <div key={i} className="result-block">
                <h4>{res.name}</h4>
                <p>Status: <strong>{res.status}</strong></p>
                {res.success ? (
                  <pre className="api-response">{JSON.stringify(res.data, null, 2)}</pre>
                ) : (
                  <p className="api-error">Error: {res.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="custom-api">
          <h2>🔧 Test Custom API</h2>
          <input
            type="text"
            placeholder="Enter API URL"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            className="input"
          />
          <select value={customMethod} onChange={e => setCustomMethod(e.target.value)} className="input">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          {customMethod === 'POST' && (
            <textarea
              placeholder="Enter JSON body"
              value={customBody}
              onChange={e => setCustomBody(e.target.value)}
              className="input"
              rows={5}
            />
          )}
          <button onClick={testCustomApi} className="api-button run-button">Run Custom Test</button>
          {customResult && (
            <div className="result-block">
              <p>Status: {customResult.status}</p>
              {customResult.success ? (
                <pre className="api-response">{JSON.stringify(customResult.data, null, 2)}</pre>
              ) : (
                <p className="api-error">Error: {customResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
