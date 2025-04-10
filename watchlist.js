function updateRealtimeOrderData(msg) {
    // Constants
    const UPDATE_STATUSES = ['m-parking', 'parking', 'pending'];
    const BACK_STATUSES = ['Cancelled', 'Expired', 'Rejected'];
    const PARTIAL_FILL_STATUS = ['Partially Filled'];
    const REPLACED_STATUS = ['Replaced'];
    
    // Helper functions
    function getNumericValue(selector) {
        return parseFloat($(selector).text().replace(/[^0-9.-]/g, ''));
    };
    
    function updateCash(clientCode, amount) {
        var cashElement = $(`.cash_${clientCode}`);
        var currentCash = getNumericValue(cashElement);
        cashElement.text((currentCash + amount).toFixed(1));
    };
    
    function updatePortfolioTotals(costChange, valueChange) {
        var oldTotalCost = getNumericValue('#total_cost');
        var oldTotalValue = getNumericValue('#total_val');
        
        var newTotalCost = oldTotalCost + costChange;
        var newTotalValue = oldTotalValue + valueChange;
        var newTotalGain = newTotalValue - newTotalCost;
        var newTotalGainPer = (newTotalGain / newTotalCost) * 100;
        
        $('#total_cost').text(Number(newTotalCost).toLocaleString('en-IN'));
        $('#total_val').text(Number(newTotalValue).toLocaleString('en-IN'));
        $('#tot_unreal').text(Number(newTotalGain).toLocaleString('en-IN'));
        $('#tot_per').text(newTotalGainPer.toFixed(2));
    };
    
    function createNewPortfolioEntry(msg) {
        var cleanedSymbol = msg.order_symbol.replace(/[\&\(\)]/g, '');
        var portfolioClass = (msg.order_symbol + msg.board).replace(/[^a-zA-Z0-9\s-_]/g, '');
        
        // Handle special board cases for CSE exchange
        if (msg.exchange === 'CSE') {
            if (['DEBT', 'YIELDDBT', 'SPUBLIC', 'ATBPUB'].includes(msg.board)) {
                portfolioClass = portfolioClass.replace(msg.board, 'PUBLIC');
            }
            if (['SBLOCK'].includes(msg.board)) {
                portfolioClass = portfolioClass.replace(msg.board, 'BLOCK');
            }
        }
        
        var totalQty = parseFloat(msg.exec_qty);
        var avgCost = msg.lp;
        var totalCost = Math.round(totalQty * avgCost);
        var mktValue = msg.lp * totalQty;
        var gain = mktValue - totalCost;
        var gainPer = (gain / totalCost) * 100;
        var gainClass = gain > 0 ? 'up' : gain < 0 ? 'down' : '';
        
        var rowHtml = [
            '<tr style="text-align: right;" ',
            'class="portsym ' + portfolioClass + '" ',
            'data-symbol="' + msg.order_symbol + '" ',
            'data-symbol-context="' + msg.order_symbol + msg.board + '" ',
            'data-board="' + msg.board + '" ',
            'data-qty="0" ',
            'data-clientcode="' + msg.cc + '" ',
            'onclick="portfolio_link(this)">',
            '<td class="portfolio_symbol text-left pl-2">' + msg.order_symbol + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_total_qty portfolio_qty" id="totalqty_' + cleanedSymbol + '">' + totalQty + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_saleable_qty portfolio_saleable" id="qty_' + cleanedSymbol + '">0</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_avg_cost portfolio_avgcost" id="avgcost_' + cleanedSymbol + '">' + avgCost + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_total_cost portfolio_totalcost" id="mktcost_' + cleanedSymbol + '">' + Number(totalCost).toLocaleString('en-IN') + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_mkt_rate portfolio_mktrate ' + gainClass + '" id="mktrate_' + cleanedSymbol + '">' + msg.lp + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_mkt_value portfolio_mktvalue ' + gainClass + '" id="mkt_val_' + cleanedSymbol + '">' + Number(mktValue).toLocaleString('en-IN') + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_gain portfolio_gain ' + gainClass + '" id="unreal_gain_' + cleanedSymbol + '">' + Number(gain).toLocaleString('en-IN') + '</td>',
            '<td class="' + msg.order_symbol + '_' + msg.cc + '_gain_per portfolio_pgain ' + gainClass + '" id="gain_per_' + cleanedSymbol + '">' + gainPer.toFixed(2) + '%</td>',
            '<td class="portfolio_percentage pr-2" id="invest_per_' + cleanedSymbol + '">100</td>',
            '</tr>'
        ].join('');
        
        $("#saleable_table tbody").prepend(rowHtml);
        updatePortfolioTotals(totalCost, mktValue);
        initializeColumnVisibility('portfolio');
    };
    
    function updateExistingPortfolio(msg) {
        var totalQtyElement = $(`.${msg.order_symbol}_${msg.cc}_total_qty`);
        var avgCostElement = $(`.${msg.order_symbol}_${msg.cc}_avg_cost`);
        var mktValueElement = $(`.${msg.order_symbol}_${msg.cc}_mkt_value`);
        
        var oldTotalQty = getNumericValue(totalQtyElement);
        var oldAvgCost = getNumericValue(avgCostElement);
        var oldMktValue = getNumericValue(mktValueElement);
        var oldTotalCost = oldAvgCost * oldTotalQty;
        
        var execQty = parseFloat(msg.exec_qty);
        var newTotalQty = oldTotalQty + execQty;
        var newTotalCost = oldTotalCost + (execQty * msg.lp);
        var newAvgCost = newTotalCost / newTotalQty;
        var newMktValue = msg.lp * newTotalQty;
        var newGain = newMktValue - newTotalCost;
        var newGainPer = (newGain / newTotalCost) * 100;
        var gainClass = newGain > 0 ? 'up' : newGain < 0 ? 'down' : '';
        
        // Update all elements
        totalQtyElement.text(newTotalQty);
        avgCostElement.text(newAvgCost.toFixed(2));
        $(`.${msg.order_symbol}_${msg.cc}_total_cost`).text(Math.round(newTotalCost));
        $(`.${msg.order_symbol}_${msg.cc}_mkt_rate`).text(msg.lp).removeClass('up down').addClass(gainClass);
        mktValueElement.text(Math.round(newMktValue)).removeClass('up down').addClass(gainClass);
        $(`.${msg.order_symbol}_${msg.cc}_gain`).text(newGain.toFixed(1)).removeClass('up down').addClass(gainClass);
        $(`.${msg.order_symbol}_${msg.cc}_gain_per`).text(newGainPer.toFixed(1)).removeClass('up down').addClass(gainClass);
        
        // Update totals
        updatePortfolioTotals(newTotalCost - oldTotalCost, newMktValue - oldMktValue);
    };
    
    // Main logic
    if (msg.order_side === 'BUY') {
        if (UPDATE_STATUSES.includes(msg.order_status) && UPDATE_STATUSES.includes(msg.exec_status) && msg.order_type === 'Limit') {
            updateCash(msg.cc, -msg.order_price * msg.q);
        }
        
        if (BACK_STATUSES.includes(msg.order_status) && BACK_STATUSES.includes(msg.exec_status) && msg.order_type === 'Limit') {
            updateCash(msg.cc, (msg.q - msg.cq) * msg.order_price);
        }
        
        if (msg.exec_status === 'Trade Executed') {
            if ($(`.${msg.order_symbol}_${msg.cc}_total_qty`).length) {
                updateExistingPortfolio(msg);
            } else {
                createNewPortfolioEntry(msg);
            }
        }
        
        if ((PARTIAL_FILL_STATUS.includes(msg.order_status) && REPLACED_STATUS.includes(msg.exec_status))) {
            setTimeout(function() { showClientInfo(msg.cc); }, 3000);
        }
        
        if (msg.order_type === 'Market' || msg.order_type === 'Market At Best') {
            update_portfolio(msg);
        }
    }
    
    if (msg.order_side === 'SELL') {
        var saleableQtyElement = $(`.${msg.order_symbol}_${msg.cc}_saleable_qty`);
        
        if (UPDATE_STATUSES.includes(msg.order_status) && UPDATE_STATUSES.includes(msg.exec_status)) {
            saleableQtyElement.text(getNumericValue(saleableQtyElement) - msg.q);
        }
        
        if (msg.exec_status === 'Trade Executed') {
            var execQty = parseFloat(msg.exec_qty);
            saleableQtyElement.text(getNumericValue(saleableQtyElement) - execQty);
            
            if (msg.symbol_category !== 'Z' && msg.compulsory_spot !== 'Y') {
                updateCash(msg.cc, execQty * msg.order_price);
            }
        }
        
        if (BACK_STATUSES.includes(msg.order_status) && BACK_STATUSES.includes(msg.exec_status)) {
            saleableQtyElement.text(getNumericValue(saleableQtyElement) + (msg.q - msg.cq));
        }
        
        if ((PARTIAL_FILL_STATUS.includes(msg.order_status) && REPLACED_STATUS.includes(msg.exec_status))) {
            setTimeout(function() { showClientInfo(msg.cc); }, 3000);
        }
    }
}