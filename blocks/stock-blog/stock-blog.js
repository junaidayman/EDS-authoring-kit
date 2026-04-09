/**
 * stock-blog.js
 */
export default function decorate(block) {
  const stocks = {};
  const children = [...block.querySelectorAll(":scope > div")];

  // 1. Parse data from the authored Block (Word/Google Doc table)
  children.forEach((child) => {
    const nameEl = child.querySelector("div:first-child p");
    if (!nameEl) return;

    const name = nameEl.innerText.trim();
    const values = Array.from(child.querySelectorAll("div:last-child p")).map(
      (p) => p.innerText.trim(),
    );
    const symbol = name.toUpperCase();

    let price = NaN;
    for (let v of values) {
      if (!isNaN(parseFloat(v)) && isFinite(v)) {
        price = parseFloat(v);
        break;
      }
    }

    let change = 0;
    let foundPrice = false;
    for (let v of values) {
      if (!foundPrice && !isNaN(parseFloat(v)) && isFinite(v)) {
        foundPrice = true;
        continue;
      }
      if (foundPrice && !isNaN(parseFloat(v)) && isFinite(v)) {
        change = parseFloat(v);
        break;
      }
    }

    let isUp = false;
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] === "true" || values[i] === "false") {
        isUp = values[i] === "true";
        break;
      }
    }

    stocks[symbol] = { price, change, isUp };
  });

  /**
   * 2. Real-Time Update Logic
   * Targets specific DOM nodes to keep the animation smooth.
   */
  function updateStockPrice(symbol, newPrice) {
    const stock = stocks[symbol];
    if (!stock) return;

    const oldPrice = stock.price;
    if (oldPrice === newPrice) return;

    const difference = newPrice - oldPrice;
    stock.price = newPrice;
    stock.change += difference;
    stock.isUp = stock.change >= 0;

    // Target only the nodes within this specific block
    const stockNodes = block.querySelectorAll(`[data-symbol="${symbol}"]`);

    stockNodes.forEach((node) => {
      const priceEl = node.querySelector('.stock-price-value'); // Target specific span
      const changeEl = node.querySelector('.stock-change');

      if (priceEl) priceEl.innerText = `${newPrice.toFixed(2)}`;

      if (changeEl) {
        const sign = stock.isUp ? "+" : "";
        const arrow = stock.isUp ? "▲" : "▼";
        changeEl.innerText = `${arrow} ${sign}${stock.change.toFixed(2)}`;
        changeEl.className = `stock-change ${stock.isUp ? "up" : "down"}`;
      }

      // Flashing effect
      const flashEl = priceEl || node;
      flashEl.classList.remove('flash-green', 'flash-red');
      void flashEl.offsetWidth; // Force reflow
      flashEl.classList.add(difference > 0 ? 'flash-green' : 'flash-red');
    });
  }

  // 3. Initial UI Render
  let html = "";
  Object.keys(stocks).forEach((symbol) => {
    const data = stocks[symbol];
    const sign = data.isUp ? "+" : "";
    const colorClass = data.isUp ? "up" : "down";
    const arrow = data.isUp ? "▲" : "▼";
    
    html += `
      <div class="stock-box" data-symbol="${symbol}">
        <span class="stock-symbol">${symbol}</span>
        <span class="stock-price">₹<span class="stock-price-value">${isNaN(data.price) ? "--" : data.price.toFixed(2)}</span></span>
        <span class="stock-change ${colorClass}">${arrow} ${sign}${data.change.toFixed(2)}</span>
      </div>`;
  });

  // Duplicate for seamless scroll
  block.innerHTML = `<div class="stock-blog-track">${html + html}</div>`;

  // 4. Simulation (WebSocket replacement)
  const intervalId = setInterval(() => {
    const symbols = Object.keys(stocks);
    if (symbols.length === 0) return;
    
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const volatility = (Math.random() * 4) - 2; 
    const newPrice = stocks[randomSymbol].price + volatility;

    updateStockPrice(randomSymbol, newPrice);
  }, 1000);

  // Store interval ID to prevent memory leaks if the block is re-decorated
  block.dataset.intervalId = intervalId;
}