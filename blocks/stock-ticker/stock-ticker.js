/**
 * stock-ticker.js
 */
export default async function decorate(block) {
  // 1. Initial State / Fallback Data
  const stocks = {
    "RELIANCE": { price: 2971.30, change: 12.40, isUp: true },
    "TCS": { price: 3945.00, change: -5.20, isUp: false },
    "HDFCBANK": { price: 1528.00, change: 8.50, isUp: true },
    "INFY": { price: 1452.10, change: 10.30, isUp: true },
    "ICICIBANK": { price: 1084.50, change: -2.15, isUp: false },
    "SBI": { price: 765.20, change: 4.10, isUp: true }
  };

  // Create the ticker track (The scrolling container)
  const tickerTrack = document.createElement('div');
  tickerTrack.className = 'stock-ticker-track';

  // 2. Build the Ticker UI
  function initializeTicker() {
    let html = '';
    Object.keys(stocks).forEach((symbol) => {
      const data = stocks[symbol];
      const sign = data.isUp ? '+' : '';
      const colorClass = data.isUp ? 'up' : 'down';
      const arrow = data.isUp ? '▲' : '▼';
      
      html += `
        <div class="stock-box" data-symbol="${symbol}">
          <span class="stock-symbol">${symbol}</span>
          <span class="stock-price">₹${data.price.toFixed(2)}</span>
          <span class="stock-change ${colorClass}">${arrow} ${sign}${data.change.toFixed(2)}</span>
        </div>
      `;
    });
    
    // Duplicate for seamless loop
    tickerTrack.innerHTML = html + html;
    block.textContent = '';
    block.append(tickerTrack);
  }

  // 3. Real-Time Update Logic (Targeted DOM updates)
  function updateStockPrice(symbol, newPrice) {
    if (!stocks[symbol]) return;
    
    const oldPrice = stocks[symbol].price;
    if (oldPrice === newPrice) return;

    const difference = newPrice - oldPrice;
    stocks[symbol].price = newPrice;
    stocks[symbol].change += difference;
    stocks[symbol].isUp = stocks[symbol].change >= 0;

    // We target the block specifically to avoid hitting other tickers on the same page
    const stockNodes = block.querySelectorAll(`[data-symbol="${symbol}"]`);
    
    stockNodes.forEach((node) => {
      const priceEl = node.querySelector('.stock-price');
      const changeEl = node.querySelector('.stock-change');
      
      priceEl.innerText = `₹${newPrice.toFixed(2)}`;
      
      const sign = stocks[symbol].isUp ? '+' : '';
      const arrow = stocks[symbol].isUp ? '▲' : '▼';
      changeEl.innerText = `${arrow} ${sign}${stocks[symbol].change.toFixed(2)}`;
      changeEl.className = `stock-change ${stocks[symbol].isUp ? 'up' : 'down'}`;
      
      // Visual feedback for trades
      priceEl.classList.remove('flash-green', 'flash-red');
      void priceEl.offsetWidth; // Force Reflow
      priceEl.classList.add(difference > 0 ? 'flash-green' : 'flash-red');
    });
  }

  // Render the initial UI
  initializeTicker();

  // 4. Simulation / Connection
  // In a real EDS project, you might check if the window is active before running this
  const intervalId = setInterval(() => {
    const symbols = Object.keys(stocks);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const volatility = (Math.random() * 4) - 2; 
    const newPrice = stocks[randomSymbol].price + volatility;
    
    updateStockPrice(randomSymbol, newPrice);
  }, 1000);

  // Optional: Clean up interval if the block is removed (important for SPA-like transitions)
  block.dataset.intervalId = intervalId;
}