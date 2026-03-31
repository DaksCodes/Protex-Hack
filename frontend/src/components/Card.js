import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import './Card.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const Card = ({ to, setTo, from, setFrom, amount, setAmount, result, setResult }) => {
  const [graphData, setGraphData] = useState(null);
  const [currencies, setCurrencies] = useState({})

  useEffect(() => {
    axios.get('https://api.frankfurter.app/currencies')
      .then(res => setCurrencies(res.data))
      .catch(console.error)
  }, [])

  const handleChange = (e) => {
    e.preventDefault();

    // Convert amount
    axios.get('/convert', { params: { from, to, amount } })
      .then(res => {
        setResult(res.data.result);
      })
      .catch(err => console.error(err));

    // Fetch historical data
    axios.get('/history', { params: { from, to } })
      .then(res => {
        const rates = res.data;
        const dates = Object.keys(rates).sort();
        const values = dates.map(date => rates[date][to]);

        setGraphData({
          labels: dates,
          datasets: [
            {
              label: `Exchange rate (${from} to ${to})`,
              data: values,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        });
      })
      .catch(console.error);
  };

  return (
    <div className="page-container">
      <form onSubmit={handleChange} className="card-form">
        <h2>Currency Converter</h2>

        <div className="form-group">
          <label>From:</label>
          <select onChange={(e) => setFrom(e.target.value)} required>
            <option value="">Select</option>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>{code} - {name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>To:</label>
          <select onChange={(e) => setTo(e.target.value)} required>
            <option value="">Select</option>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>{code} - {name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input type="number" onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <button type="submit">Convert</button>
      </form>

      {result && <div className="converted">Converted Amount: <strong>{result}</strong></div>}

      {graphData && (
        <div className="chart-container">
          <h3>Exchange Rate History (Last 30 Days)</h3>
          <Line data={graphData} />
        </div>
      )}
    </div>
  );
};

export default Card;