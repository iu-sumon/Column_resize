 // Constants at module level since they don't change
 const obj_status = {
    up: ['m-parking', 'parking', 'pending'],
    back: ['Cancelled', 'Expired', 'Rejected'],
    fill: ['Accepted','Partially Filled'],
    repls: ['Replaced']
  };

  // Helper functions
  function getNumVal(selector) {
    return parseFloat(selector.text().replace(/[^0-9.-]/g, ''));
  }
  
  function updateElementValue(selector, value, format = false) {
    const formattedValue = format ? value.toLocaleString('en-IN') : value;
    selector.text(formattedValue);
  }
  
  function updateCash(clientCd, amt) {
    const cashEls = $(`.${clientCd}_cash`);
    cashEls.each(function () {
      const el = $(this);
      const currCash = getNumVal(el);
      const updatedCash = (currCash + amt).toFixed(1);
      el.text(updatedCash);
    });
  }
  
  function handleBuyOrder(msg) {
    const { order_status, exec_status, order_type, cc, order_price, q, cq, order_symbol, exec_qty } = msg;
    const amt = order_price * parseFloat(q);
    const exec_amt = order_price * parseFloat(exec_qty);
    const cencel_amt = order_price * (parseFloat(q) - parseFloat(cq));
  
    // for 'm-parking', 'parking', 'pending'
    if (obj_status.up.includes(order_status) && obj_status.up.includes(exec_status) && order_type === 'Limit') {
      updateCash(cc, -amt);
      updateDayOrders(cc, amt, 'buy');
    }

    // for 'Cancelled', 'Expired', 'Rejected'
    if (obj_status.back.includes(order_status) && obj_status.back.includes(exec_status) && order_type === 'Limit') {
      updateCash(cc, cencel_amt);
      updateDayOrders(cc, -cencel_amt, 'buy');
    }

    // for 'Trade Executed'
    if (exec_status === 'Trade Executed') {
      if ($('#portfolio_code_input').length > 0 && cc == $('#portfolio_code_input').val()) {
        if ($(`.${order_symbol}_${msg.cc}_total_qty`).length) {
          updateExistingPortfolio(msg);
        } else {
          createNewPortfolioEntry(msg);
        }
      } 
      updateTransactionMetrics(cc, exec_amt, 'buy');
    }

    // for 'Accepted' 'Partially Filled' and 'Replaced'
    if (obj_status.fill.includes(order_status) && obj_status.repls.includes(exec_status)) {
      setTimeout(() => showClientInfo(cc), 3000);
      if ($('#account_limit_code').length > 0 && $('#account_limit_code').val() == cc) {
        setTimeout(() => get_account_limit(), 3000);
      }
      
    }
    if (order_type === 'Market' || order_type === 'Market At Best') {
      updateRelatedData(msg);
    }
  }
  
  function handleSellOrder(msg) {
    const { order_status, exec_status, cc, order_price, q, cq, order_symbol, exec_qty, symbol_category, compulsory_spot } = msg; 
    const amt = order_price * parseFloat(q);
    const exec_amt = order_price * parseFloat(exec_qty);
    const cencel_amt = order_price * (parseFloat(q) - parseFloat(cq));
  
    // for 'm-parking', 'parking', 'pending'
    if (obj_status.up.includes(order_status) && obj_status.up.includes(exec_status)) {
      updateQty(order_symbol, cc, -parseFloat(q));
      updateDayOrders(cc, amt, 'sell');
    }

    // for 'Cancelled', 'Expired', 'Rejected'
    if (obj_status.back.includes(order_status) && obj_status.back.includes(exec_status)) {
      updateQty(order_symbol, cc, parseFloat(q) - parseFloat(cq));
      updateDayOrders(cc, -cencel_amt, 'sell');
    }

    // for 'Trade Executed'
    if (exec_status === 'Trade Executed') {
      if ($('#portfolio_code_input').length > 0 && cc == $('#portfolio_code_input').val()) {
        if ($(`.${order_symbol}_${msg.cc}_total_qty`).length) {
          updateExistingPortfolio(msg);
        }  
      } 
      if (symbol_category !== 'Z' && compulsory_spot !== 'Y') {
        updateCash(cc, exec_amt);
        updateTransactionMetrics(cc, exec_amt, 'sell');
      }
    }

    // for 'Accepted' 'Partially Filled' and 'Replaced'
    if (obj_status.fill.includes(order_status) && obj_status.repls.includes(exec_status)) {
      setTimeout(() => showClientInfo(cc), 3000);

      if ($('#account_limit_code').length > 0 && $('#account_limit_code').val() == cc) {
        setTimeout(() => get_account_limit(), 3000);
      }
    }
  }
  
  function updateDayOrders(clientCd, amt, type) {
    if (!$(`.${clientCd}_total_orders_val`).length) return;
  
    const totalOrderEl = $(`.${clientCd}_total_orders_val`);
    const currentTotal = getNumVal(totalOrderEl);
    updateElementValue(totalOrderEl, currentTotal + amt, true);
  
    const typeOrderEl = $(`.${clientCd}_${type}_orders_val`);
    const currentTypeTotal = getNumVal(typeOrderEl);
    updateElementValue(typeOrderEl, currentTypeTotal + amt, true);

    // Update remaining metrics
    updateRemainingMetrics(clientCd, type);
  
  }
  
  function updateTransactionMetrics(clientCd, amt, type) {
    if (!$(`.${clientCd}_total_trans_val`).length) return;
  
    // Update transaction totals
    const totalTransEl = $(`.${clientCd}_total_trans_val`);
    const currentTrans = getNumVal(totalTransEl);
    updateElementValue(totalTransEl, currentTrans + amt, true);
  
    // Update execution metrics
    const execEl = $(`.${clientCd}_${type}_exec_val`);
    const currentExec = getNumVal(execEl);
    updateElementValue(execEl, currentExec + amt, true);
  
    // Update net transaction
    updateNetTransaction(clientCd, type);

    // Update remaining metrics
    updateRemainingMetrics(clientCd, type);

  }
  
  function updateRemainingMetrics(clientCd, type) {
    const orderEl = $(`.${clientCd}_${type}_orders_val`);
    const execEl = $(`.${clientCd}_${type}_exec_val`);
    const remainEl = $(`.${clientCd}_${type}_remaining_val`);
  
    const currentOrder = getNumVal(orderEl);
    const currentExec = getNumVal(execEl);
    updateElementValue(remainEl, currentOrder - currentExec);
  }
  
  function updateNetTransaction(clientCd, type) {
    const netTransEl = $(`.${clientCd}_net_trans_val`);
    const buyExec = getNumVal($(`.${clientCd}_buy_exec_val`));
    const sellExec = getNumVal($(`.${clientCd}_sell_exec_val`));
  
    const netValue = type === 'buy' ? buyExec : buyExec - sellExec;
    updateElementValue(netTransEl, netValue, true);
  }
  
  function updateQty(sym, cd, qty) {
    const qtyEl = $(`.${sym}_${cd}_saleable_qty`);
    if (!qtyEl.length) return;
    const currQty = getNumVal(qtyEl);
    qtyEl.text((currQty + qty));
  }
  
  function createNewPortfolioEntry(msg) {
    let cleanSym = msg.order_symbol.replace(/[\&\(\)]/g,'');
    let portClass = (msg.order_symbol + msg.board).replace(/[^a-zA-Z0-9\s-_]/g, '');
  
    // Handle special board cases for CSE exchange
    if(msg.exchange == 'CSE') {
        if(['DEBT','YIELDDBT','SPUBLIC','ATBPUB'].includes(msg.board)){
            portClass = portClass.replace(msg.board, 'PUBLIC');
        }
        if(['SBLOCK'].includes(msg.board)){
            portClass = portClass.replace(msg.board, 'BLOCK');
        }
    }
    
    let totQty = parseFloat(msg.exec_qty);
    let saleable = 0;
    let avgCost = msg.lp;
    let totCost = Math.round(totQty * avgCost);
    let mktRate = msg.lp;
    let mktVal = msg.lp * totQty;
    let gain = mktVal - totCost;
    let gainPct = (gain / totCost) * 100;
    let InvestPct = (totCost * 100) / getNumVal($('#total_cost'));
    
    $("#saleable_table").find("tbody").prepend(
        $('<tr>', {
            style: "text-align: right;",
            class: "portsym " + portClass,
            "data-symbol": msg.order_symbol,
            "data-symbol-context": msg.order_symbol + msg.board,
            "data-board": msg.board,
            "data-qty": saleable,
            "data-clientcode": msg.cc,
            onclick: "portfolio_link(this)"
        }).append(
            `<td class="portfolio_symbol text-left pl-2">${msg.order_symbol}</td>
             <td class="${msg.order_symbol}_${msg.cc}_total_qty portfolio_qty" id="totalqty_${cleanSym}">${totQty}</td>
             <td class="${msg.order_symbol}_${msg.cc}_saleable_qty portfolio_saleable" id="qty_${cleanSym}">${saleable}</td>
             <td class="${msg.order_symbol}_${msg.cc}_avg_cost portfolio_avgcost" id="avgcost_${cleanSym}">${avgCost}</td>
             <td class="${msg.order_symbol}_${msg.cc}_total_cost portfolio_totalcost" id="mktcost_${cleanSym}">${Number(totCost).toLocaleString('en-IN')}</td>
             <td class="${msg.order_symbol}_${msg.cc}_mkt_rate portfolio_mktrate" id="mktrate_${cleanSym}">${mktRate}</td>
             <td class="${msg.order_symbol}_${msg.cc}_mkt_value portfolio_mktvalue" id="mkt_val_${cleanSym}">${Number(mktVal).toLocaleString('en-IN')}</td>
             <td class="${msg.order_symbol}_${msg.cc}_gain portfolio_gain" id="unreal_gain_${cleanSym}">${Number(gain).toLocaleString('en-IN')}</td>
             <td class="${msg.order_symbol}_${msg.cc}_gain_per portfolio_pgain" id="gain_per_${cleanSym}">${gainPct.toFixed(2)}%</td>
             <td class="${msg.order_symbol}_${msg.cc}_invest_per portfolio_percentage pr-2" id="invest_per_${cleanSym}">${InvestPct.toFixed(2)}</td>`
        )
    );
  
    // Set color classes based on gain
    if (gain > 0) {
        $(`#mktrate_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_mktrate up portfolio_mktrate`);
        $(`#mkt_val_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_mkt_value up portfolio_mktvalue mkt_val`);
        $(`#unreal_gain_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_gain up portfolio_gain total_gain`);
        $(`#gain_per_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_gain_per up portfolio_pgain gain_per`);
    } else if (gain < 0) {
        $(`#mktrate_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_mktrate down portfolio_mktrate`);
        $(`#mkt_val_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_mkt_value down portfolio_mktvalue mkt_val`);
        $(`#unreal_gain_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_gain down portfolio_gain total_gain`);
        $(`#gain_per_${cleanSym}`).removeClass().addClass(`${msg.order_symbol}_${msg.cc}_gain_per down portfolio_pgain gain_per`);
    }
        
    updatePortfolioTotals(totCost, mktVal);
    initializeColumnVisibility('portfolio');
  };
  
  function updateExistingPortfolio(msg) {
    let oldQty = getNumVal($(`.${msg.order_symbol}_${msg.cc}_total_qty`));
    let oldAvg = getNumVal($(`.${msg.order_symbol}_${msg.cc}_avg_cost`));
    let oldVal = getNumVal($(`.${msg.order_symbol}_${msg.cc}_mkt_value`));
    let oldCost = oldAvg * oldQty;
  
    let execQty = parseFloat(msg.exec_qty);
    let newQty;
    let newCost;
    let newAvg;
    let newVal;
  
    if (msg.order_side == 'BUY') {
        newQty = oldQty + execQty;
    } else {    
        newQty = oldQty - execQty;
    } 
    if (msg.order_side == 'BUY') {
        newCost = oldCost + (execQty * msg.lp);
    }
    else {
        newCost = oldAvg * newQty; 
    }
  
    if (msg.order_side == 'BUY') {
        newVal = msg.lp * newQty;
    }
    else {
        newVal = oldVal - (execQty * msg.lp);
    }
  
    if (msg.order_side == 'BUY') { 
        newAvg = newCost / newQty;
    }

    let newGain = newVal - newCost;
    let newGainPct = (newGain / newCost) * 100;
    let newInvestPct = (newCost * 100) /getNumVal($('#total_cost'));
  
    // Update all elements
    $(`.${msg.order_symbol}_${msg.cc}_total_qty`).text(newQty);
    if (msg.order_side == 'BUY') {
     $(`.${msg.order_symbol}_${msg.cc}_avg_cost`).text(newAvg.toFixed(2));
    }
    $(`.${msg.order_symbol}_${msg.cc}_total_cost`).text(Math.round(newCost));
    $(`.${msg.order_symbol}_${msg.cc}_mkt_rate`).text(msg.lp);
    $(`.${msg.order_symbol}_${msg.cc}_mkt_value`).text(Math.round(newVal));
    $(`.${msg.order_symbol}_${msg.cc}_gain`).text(newGain.toFixed(1));
    $(`.${msg.order_symbol}_${msg.cc}_gain_per`).text(newGainPct.toFixed(1));
    $(`.${msg.order_symbol}_${msg.cc}_invest_per`).text(newInvestPct.toFixed(2));
    
    // Update totals
    updatePortfolioTotals(newCost - oldCost, newVal - oldVal);
  };


function updatePortfolioTotals(costChg, valChg) {
    let oldCost = getNumVal($('#total_cost'));
    let oldVal = getNumVal($('#total_val'));
    
    let newCost = oldCost + costChg;
    let newVal = oldVal + valChg;
    let newGain = newVal - newCost;
    let newGainPct = (newGain / newCost) * 100;

    $('#total_cost').text(Number(newCost).toLocaleString('en-IN'));
    $('#total_val').text(Number(newVal).toLocaleString('en-IN'));
    $('#tot_unreal').text(Number(newGain).toLocaleString('en-IN'));
    $('#tot_per').text(newGainPct.toFixed(2));
};
