import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  let cancelToken

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email')
      return
    }

    setError('')
    setLoading(true)
    setResults([])

    if (cancelToken) {
      cancelToken.cancel()
    }

    cancelToken = axios.CancelToken.source()

    try {
      const response = await axios.post('http://localhost:3001/search', { email, number }, {
        cancelToken: cancelToken.token,
      })
      
      setResults(response.data)
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.error(err)
      }
    } finally {
      setLoading(false)
    };
  }

  const handleNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, '')
    let maskedInput = input.match(/.{1,2}/g)?.join('-') || ''
    setNumber(maskedInput)
  }

  return (
    <div className="App">
      <form onSubmit={handleSearch}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number:</label>
          <input
            type="text"
            value={number}
            onChange={handleNumberChange}
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {results.map((item, index) => (
          <li key={index}>{`${index+1}. Email: ${item.email}, Number: ${item.number}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
