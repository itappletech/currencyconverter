import React, { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const [currencyRates, setCurrencyRates] = useState(null);
  const [wallets, setWallets] = useState([
    { 
      currency: "USD",
      symbol: "$",
      balance: 200
    },
    { 
      currency: "EUR",
      symbol: "€",
      balance: 150
    },
    { 
      currency: "GBP",
      symbol: "£",
      balance: 10
    }
  ]);

  const [leftCurrency, setLeftCurrency] = useState('USD');
  const [rightCurrency, setRightCurrency] = useState('USD');
  const [leftVal, setLeftVal] = useState(0);
  const [rightVal, setRightVal] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    axios.get(`https://api.coingecko.com/api/v3/exchange_rates`)
      .then(res => {
        setCurrencyRates(res.data.rates);
      })
  }, []);

  const calculateRate = (from, to) => {
    if (currencyRates) {
      const fromVal = currencyRates[from.toLowerCase()];
      const toVal = currencyRates[to.toLowerCase()];
      if (fromVal && toVal) {
        return toVal.value / fromVal.value;
      }
    }
    return 1;
  };

  const onClickExchange = () => {
    if (wallets.find(x=>x.currency === leftCurrency).balance >= leftVal) {
      const newWallets = wallets;
      const left = newWallets.find(x=>x.currency === leftCurrency);
      left.balance = Math.round((left.balance - leftVal) * 100) / 100;
      const right = newWallets.find(x=>x.currency === rightCurrency);
      right.balance = Math.round((right.balance + rightVal) * 100) / 100;
      setWallets(newWallets);
      setLeftVal(0);
      setRightVal(0);
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="main-wrapper">
          <div className="row">
            <div className="col-4">
              <div>
                <select 
                  value={leftCurrency}
                  onChange={(e) => {
                    setLeftCurrency(e.target.value);
                    const r = calculateRate(e.target.value, rightCurrency);
                    setRate(Number(r.toFixed(4)));
                    setLeftVal(Math.round(rightVal/r*100) / 100);
                  }}
                >
                  {wallets.map(x => (
                    <option 
                      key={x.currency} 
                      value={x.currency}
                    >{x.currency}</option>
                  ))}
                </select>
              </div>
              <p>Balance: {wallets.find(x=>x.currency === leftCurrency).symbol}{wallets.find(x=>x.currency === leftCurrency).balance}</p>
              <div>
                <input 
                  type="number" 
                  placeholder="-"
                  className="changeVal"
                  value={leftVal}
                  onChange={(e) => {
                    setLeftVal(Number(e.target.value));
                    setRightVal(Math.round(e.target.value*rate*100) / 100);
                  }}
                ></input>
                {wallets.find(x=>x.currency === leftCurrency).balance < leftVal && (
                  <div className="text-danger">Exceeds balance</div>
                )}
              </div>
            </div>
            <div className="col-4">
              <div className="row">
                <div className="col-12">
                  <span 
                    style={{
                      border: "1px solid white",
                      borderRadius: "20px",
                      padding: "3px 20px"
                    }}
                  >{wallets.find(x=>x.currency === leftCurrency).symbol}1 = {wallets.find(x=>x.currency === rightCurrency).symbol}{rate}</span>
                </div>
              </div>
              <div className="row mt-5">
                <button 
                  type="button" 
                  className="btn btn-primary waves-effect waves-light"
                  onClick={onClickExchange}
                >Exchange</button>
              </div>
            </div>
            <div className="col-4">
              <div>
                <select 
                  value={rightCurrency}
                  onChange={(e) => {
                    setRightCurrency(e.target.value);
                    const r = calculateRate(leftCurrency, e.target.value);
                    setRate(Number(r.toFixed(4)));
                    setRightVal(Math.round(leftVal*r*100) / 100);
                  }}
                >
                  {wallets.map(x => (
                    <option 
                      key={x.currency} 
                      value={x.currency}
                    >{x.currency}</option>
                  ))}
                </select>
              </div>
              <p>Balance: {wallets.find(x=>x.currency === rightCurrency).symbol}{wallets.find(x=>x.currency === rightCurrency).balance}</p>
              <div>
                <input 
                  type="number" 
                  placeholder="+"
                  className="changeVal"
                  value={rightVal}
                  onChange={(e) => {
                    setRightVal(Number(e.target.value));
                    setLeftVal(Math.round(e.target.value/rate*100) / 100);
                  }}
                ></input>
              </div>
            </div>  
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
