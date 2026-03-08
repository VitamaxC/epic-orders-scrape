const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeOrders() {
  let res = [];
  // loop to parse each page
  while (!document.getElementById('next-btn').disabled) {
    res.push(... await getPageInfo(document)); // append orders in current page
    document.getElementById('next-btn').click(); // next page
    await delay(2000);
  }
  res.push(... await getPageInfo(document)); // append orders in the last page
  return res;
}

async function getPageInfo(document) {
  let pageRes = [];
  // fetch 10 orders in each page
  for (const order of document.querySelectorAll('td>div')) {
    order.querySelector('span>span>span>span').dispatchEvent(
      new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
    await delay(500);
    pageRes.push({
      content: document.querySelector('.MuiTooltip-tooltip>span').textContent,
      price: order.querySelectorAll('div')[1].lastChild.textContent,
      time: order.firstChild.textContent
    });
    console.log(document.querySelector('.MuiTooltip-tooltip>span').textContent);
    // console.log(order.querySelectorAll('div')[1].lastChild.textContent);
    // console.log(order.firstChild.textContent);
    order.querySelector('span>span>span>span').dispatchEvent(
      new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
  }
  return pageRes;
}

function list2json(orders) {
  const orderListJson = JSON.stringify(orders, null, 2);
  const blob = new Blob([orderListJson], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const now = new Date().toISOString().slice(0, 10);
  a.download = `EpicOrderList_${now}.json`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

list2json(scrapeOrders())
