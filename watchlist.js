const ui_refresh_interval_fix = 150;
let user_role_filter = ['administrator', 'brokeradmin', 'brokerexec', 'brokertrader', 'ccexec'];
let checked_status = ['Accepted','Partially Filled','Private Order','Unplaced','Filled','Cancelled',"Expired"];

ws_worker_fix.onmessage = (resp) => {
    var data = resp.data;
    if (data.msg) {
        switch (data.channel) {       
            case 'ws_status':
                let socket_status = data;
                if (socket_status.msg == 'connected') {
                    // as some times it's generate before the page load
                    setTimeout(function() {
                        show_flash_messages("You are connected to the server", 'success');
                    },1000);
                }
                if (socket_status.msg == 'disconnected') {
                    show_flash_messages("You are disconnected from the server please check network", 'danger' , 20000);
                }
                break;  

            case 'broker_fix_status':
                broker_fix_status(data.msg);
                break;
            
            case 'broker_fix_cse_status':
                broker_fix_cse_status(data.msg);
                break;

            case 'dlr_trades_'+system_username:
                let delaer_trade = JSON.parse(data.msg.value);
                broker_dealer_trades(delaer_trade);
                break;

            // for dealer 
            case 'cln_trades_'+system_username:
                broker_client_trades(JSON.parse(data.msg.value));
                break;

            case 'cln_trades':
                broker_client_trades(JSON.parse(data.msg.value));
                break;

            case 'ordr_out_'+system_username: //for dealer, client and accosiate outbound order cahce  
                let outbound_message_custom =  JSON.parse(data.msg.value);
                processOrderMessage(outbound_message_custom, 'outbound');
                break; 

            case 'ordr_in_'+system_username: //for dealer, client and accosiate inbound order cahce 
                broker_inbound_trades(JSON.parse(data.msg.value))
                break;

            case 'ordr_out': //for admin outbound order cahce 
                let outbound_message =  JSON.parse(data.msg.value)
                processOrderMessage(outbound_message, 'outbound'); 
                break; 
                
            case 'ordr_in': //for admin inbound order cahce 
                parserObjectForFix(data.msg, 'ordr_in', broker_inbound_trades);
                break; 

            // for user specific     
            case 'broker_order_reject_'+system_username:
                show_flash_messages(data.msg.value.msg, 'danger');
                break;

            case 'broker_order_success_'+system_username:               
                show_flash_messages(data.msg.value.msg, 'success');
                break;
            case 'rms_update_limit_'+system_username:
                rms_update_limit(data.msg);
                break;

            case 'rms_update':
                rms_update(data.msg);
                break;

            // ws_feed_app    
            case 'send_limit': 
                showAdminLimitRequest(JSON.parse(data.msg.value));
                break;

            case 'update_limit': 
                updateLimitRequest(data.msg.value);
                break;
                
            case 'logout_user_'+system_username:              
                if(data.msg.value.device == user_device || data.msg.value.device == 'ALL')
                {
                    loggedOutUser();
                }
                break;

            case 'logout_all':              
                if(data.msg.value.device == user_device || data.msg.value.device == 'ALL')
                {
                    loggedOutUser();
                }
                break;

            case 'notification_sync':
                notification_data = JSON.parse(data.msg.value);
                updateNotificationData(notification_data);
                break;

            case 'temp_dealer_assign_req':
                showTempDealerAssignRequest(JSON.parse(data.msg.value));
                break;

            case 'temp_dealer_update':
                updateTempDealerAssignRequest(JSON.parse(data.msg.value));
                break;  

            case 'announcement':
                showAnnouncement(JSON.parse(data.msg.value));
                break;
            
    

        }
    }
};

subscribe_custom_user_channel();
function subscribe_custom_user_channel()
{
    // system_dealer_team_id
    var current_user_data = { 
        system_user_role : system_user_role, 
        system_username : system_username,
        trader_group_members : system_dealer_group_members,
        client_bo_id: "",
        device:"Desktop"
    }  
    ws_worker_fix.postMessage(['subscribe_custom_user_channel',current_user_data])
}

function parserObjectForFix(msg, propertyName, parseFunction) {
    const parsedData = JSON.parse(msg.value[propertyName]);
    if (Object.keys(parsedData).length > 0) {
        for (const key in parsedData) {
            if (parsedData.hasOwnProperty(key)) {
                const dictionaryArray = parsedData[key];
                dictionaryArray.forEach(dict => {
                    parseFunction(dict);
                });
            }
        }
    }
}

function broker_fix_status(msg) {
    if (msg.value.status == 0) {
        $("#netstatuslight").prop('title', 'DSE Server Connected');
        $("#netstatuslight").removeClass().addClass('fa fa-wifi text-success');
    } else {
        $("#netstatuslight").prop('title', 'DSE Server Disconnected');
        $("#netstatuslight").removeClass().addClass('fa fa-wifi text-danger');
    }
    msg = null;
}

function broker_fix_cse_status(msg) {
    if (msg.value.status == 0) {
        $("#cse_netstatuslight").prop('title', 'CSE Server Connected');
        $("#cse_netstatuslight").removeClass().addClass('fa fa-wifi text-success');
    } else {
        $("#cse_netstatuslight").prop('title', 'CSE Server Disconnected');
        $("#cse_netstatuslight").removeClass().addClass('fa fa-wifi text-danger');
    }
    msg = null;
}

function broker_dealer_trades(msg) {
    // console.log("Dealer: ", msg)
    var selected_user = $("#order_summery_dealer").val();

    if (system_user_role == 'brokertrader') {
        if (msg.did == system_username || msg.did == selected_user) {
            $("#dealer_turnover_today").text(Number(msg.tvl).toLocaleString('en-IN'));
            flashup($("#dealer_turnover_today"));

            var total_turnover = parseFloat($("#dealer_turnover_total").val()) + parseFloat(msg.tv);
            $("#dealer_turnover_total").val(total_turnover);
            $("#dealer_turnover_total").text(Number(total_turnover).toLocaleString('en-IN'));

            // flashnum($("#dealer_turnover_total"));

            if ($('#client_trades_summary').length > 0) {
                $('.' + msg.did + '_buy_orders').text(Number(msg.bo).toLocaleString('en-IN'));
                $('.' + msg.did + '_sell_orders').text(Number(msg.so).toLocaleString('en-IN'));
                $('.' + msg.did + '_total_orders').text(Number(msg.to).toLocaleString('en-IN'));
                $('.' + msg.did + '_buy_trades').text(Number(msg.bt).toLocaleString('en-IN'));
                $('.' + msg.did + '_sell_trades').text(Number(msg.st).toLocaleString('en-IN'));
                $('.' + msg.did + '_total_trades').text(Number(msg.tt).toLocaleString('en-IN'));
                $('.' + msg.did + '_buy_value').text(Number(msg.bv).toLocaleString('en-IN'));
                $('.' + msg.did + '_sell_value').text(Number(msg.sv).toLocaleString('en-IN'));
                $('.' + msg.did + '_total_value').text(Number(msg.tvl).toLocaleString('en-IN'));
                $('.' + msg.did + '_net_value').text(Number(msg.nv).toLocaleString('en-IN'));
            }

            total_turnover = null;
        }
        
    }
    msg = null;
}

function broker_client_trades(msg) {
    // console.log("Client: ", msg)
    var selected_user = $("#order_summery_dealer").val();

    if (system_user_role == 'associate') {
        if (msg.uid == system_username || msg.uid == selected_user) {
            var today_turnover = (parseFloat($("#associate_turnover_today").text().replace(/,/g, '')) || 0) + parseFloat(msg.tv);
            flashup($("#associate_turnover_today"));
            $("#associate_turnover_today").val(today_turnover);
            $("#associate_turnover_today").text(Number(today_turnover).toLocaleString('en-IN'));

            var total_turnover = (parseFloat($("#associate_turnover_total").text().replace(/,/g, '')) || 0) + parseFloat(msg.tv);
            $("#associate_turnover_total").val(total_turnover);
            $("#associate_turnover_total").text(Number(total_turnover).toLocaleString('en-IN'));
            
            if ($('#total_summary').length > 0) {
                var total_buy_value = (parseFloat($(`.${msg.uid}_buy_value`).text().replace(/,/g, '')) || 0)
                var total_sell_value = (parseFloat($(`.${msg.uid}_sell_value`).text().replace(/,/g, '')) || 0)
                
                var total_buy_trades = (parseInt($(`.${msg.uid}_buy_trades`).text()) || 0)
                var total_sell_trades = (parseInt($(`.${msg.uid}_sell_trades`).text()) || 0)
        
                if (msg.osd == 'BUY') {
                    total_buy_value = total_buy_value + parseFloat(msg.tv);
                    $(`.${msg.uid}_buy_value`).text(Number(total_buy_value).toLocaleString('en-IN'));
                    total_buy_trades += 1;
                    $(`.${msg.uid}_buy_trades`).text(total_buy_trades);
                } else if (msg.osd == 'SELL') {
                    total_sell_value = total_sell_value + parseFloat(msg.tv);
                    
                    $(`.${msg.uid}_sell_value`).text(Number(total_sell_value).toLocaleString('en-IN'));
                    total_sell_trades += 1;
                    $(`.${msg.uid}_sell_trades`).text(total_sell_trades);
                }
                if (msg.osd == 'BUY' || msg.osd == 'SELL') {
                    var total_trade_value = (parseFloat($(`.${msg.uid}_total_value`).text().replace(/,/g, '')) || 0) + parseFloat(msg.tv);
                    $(`.${msg.uid}_total_value`).text(Number(total_trade_value).toLocaleString('en-IN'));
        
                    var total_net_value = total_buy_value - total_sell_value;
                    $(`.${msg.uid}_net_value`).text(Number(total_net_value).toLocaleString('en-IN'));
        
                    var total_trade_count = total_buy_trades + total_sell_trades;
                    $(`.${msg.uid}_total_trades`).text(total_trade_count);
                }
            }

            today_turnover = null;
            total_turnover = null;
        }
    }
    if ($('#client_trades_summary').length > 0) {
        if (($('.' + msg.cid).length == 0) && (msg.did == selected_user || msg.did == system_username || msg.uid == system_username || msg.uid == selected_user)) {
            var newRow = $('<tr>').addClass('text-right');
            var columns = ['client_code', 'buy_orders', 'sell_orders', 'total_orders', 'buy_trades', 'sell_trades', 'total_trades', 'buy_value', 'sell_value', 'total_value', 'net_value'];
            columns.forEach(function(column, index) {
                if (column == 'client_code') {
                    newRow.append($('<td>').addClass('text-center client_trades_summary-col-' + (index + 1) + ' ' + msg.cid + ' trade_summary_client_id').text(msg.cid));
                } else {
                    if (['buy_value', 'sell_value', 'total_value', 'net_value'].includes(column)) {
                        var tradeSummaryClass = 'trade_summary_' + column.replace('value', 'amount');
                    } else {
                        var tradeSummaryClass = 'trade_summary_' + column;
                    }
                    newRow.append($('<td>').addClass('client_trades_summary-col-' + (index + 1) + ' ' + msg.cid + '_' + column + ' ' + tradeSummaryClass));
                }
            });

            var tableRows = $('#client_trades_summary tbody tr');
            if (tableRows.length >= parseInt($("#pagination_limit").val())) {
                tableRows.last().remove();
            }
            $('#client_trades_summary').prepend(newRow);
            initializeColumnVisibility('trade_summary');
        }

        $('.' + msg.cid + '_buy_orders').text(Number(msg.bo).toLocaleString('en-IN'));
        $('.' + msg.cid + '_sell_orders').text(Number(msg.so).toLocaleString('en-IN'));
        $('.' + msg.cid + '_total_orders').text(Number(msg.to).toLocaleString('en-IN'));
        $('.' + msg.cid + '_buy_trades').text(Number(msg.bt).toLocaleString('en-IN'));
        $('.' + msg.cid + '_sell_trades').text(Number(msg.st).toLocaleString('en-IN'));
        $('.' + msg.cid + '_total_trades').text(Number(msg.tt).toLocaleString('en-IN'));
        $('.' + msg.cid + '_buy_value').text(Number(msg.bv).toLocaleString('en-IN'));
        $('.' + msg.cid + '_sell_value').text(Number(msg.sv).toLocaleString('en-IN'));
        $('.' + msg.cid + '_total_value').text(Number(msg.tvl).toLocaleString('en-IN'));
        $('.' + msg.cid + '_net_value').text(Number(msg.nv).toLocaleString('en-IN')).removeClass(msg.nv < 0 ? 'text-success' : 'text-danger').addClass(msg.nv < 0 ? 'text-danger' : 'text-success');
    }

    
    msg = null;
}

function broker_inbound_trades(msg) {
    processOrderMessage(msg, 'inbound');
    if (msg.uid == system_username) {
        if (msg.em) {
            const error_msg = msg.em.split('):').pop().trim();
            show_flash_messages(`Error: ${error_msg}`, 'danger');
        }  
    }



    // Handle filled and partially filled orders
    if (msg.et == 'F' && ['brokertrader', 'client', 'associate'].includes(system_user_role)){
        createSliderItem(msg, 'execution_order');
    }

    msg = null;
}

function processOrderMessage(msg, type){
    let new_order = {
        'cid': msg.cid,
        'otm': msg.otm,
        'etm': msg.etm,
        'cc': msg.cc,
        'ap': msg.ap,
        'q': msg.q,
        'dq': msg.dq,
        'lq': msg.lq,
        'cq': msg.cq,
        'uid': msg.uid,
        'lp': msg.lp,
        'ct': msg.ct,  
    };

    if (type == 'inbound'){
        let order_side = (msg.sd == 1) ? 'BUY' : 'SELL';  
        new_order['exchange'] = msg.xc;
        new_order['order_symbol'] = msg.sym; 
        new_order['order_board'] = msg.bt; 
        new_order['order_side'] = order_side;
        new_order['order_type'] = getOrderTypeText(msg.ot);
        new_order['order_price'] = msg.or;
        new_order['order_status'] = getOrderStatus(msg.os); 
        new_order['exec_status'] = getExecStatus(msg.et);
        new_order['dealer_id'] = msg.did;
        new_order['order_id'] = msg.cid;
        new_order['error_msg'] = msg.em;
        new_order['symbol_category'] = msg.ct;
        new_order['compulsory_spot'] = msg.cs;
        new_order['exec_qty'] = msg.eq;
    }

    if (type == 'outbound'){
        let symbol_split = msg.oin.split('.');
        let order_symbol = symbol_split[0];
        let order_board = symbol_split[1]; 

        new_order['exchange'] = msg.ex;
        new_order['order_symbol'] = order_symbol;
        new_order['order_board'] = order_board; 
        new_order['order_side'] = msg.osd;
        new_order['order_type'] = msg.ot;
        new_order['order_price'] = msg.lr;
        new_order['order_status'] = msg.os;
        new_order['exec_status'] = msg.et;
        new_order['dealer_id'] = msg.tid;
        new_order['order_id'] = msg.oid;
        new_order['error_msg'] = '';
        new_order['symbol_category'] = '';
        new_order['compulsory_spot'] = '';
        new_order['exec_qty'] = '';
    }
    addOrUpdateOrderTerminal(new_order);

    // updateRelatedData(new_order);

    updateRealtimeOrderData(new_order);
}

function addOrUpdateOrderTerminal(new_msg){
    let terminals = $('.user_order_terminals').map(function() {
        return this.id; 
    }).get();

    if (terminals.length <= 0){
        return;
    }

    let chain_id = new_msg.cid;
    let existing_orders = $(`.${chain_id}`);

    if(existing_orders.length > 0){
        existing_orders.each(function () {
                let current_terminal_id = $(this).closest('.user_order_terminals').attr('id');
                let index = terminals.indexOf(current_terminal_id);
                if (index !== -1) {
                    terminals.splice(index, 1);
                }
                update_exist_order(new_msg, $(this));
        });
    } 

    terminals.forEach(function(terminal_id){
        handleTerminal(terminal_id, new_msg);
    })
}

function updateRealtimeOrderData(msg) { 
    const UPD_STATS = ['m-parking', 'parking', 'pending'];
    const BACK_STATS = ['Cancelled', 'Expired', 'Rejected'];
    const PART_FILL = ['Partially Filled'];
    const REPL_STAT = ['Replaced'];
    
    // Main logic
    if (msg.order_side === 'BUY') {
        if (UPD_STATS.includes(msg.order_status) && UPD_STATS.includes(msg.exec_status) && msg.order_type === 'Limit') {
            let update_cash = msg.order_price * parseFloat(msg.q);
            updateCash(msg.cc, -update_cash);
            // for account limits
            if ($(`.${msg.cc}_total_orders_val`).length){
                updateDayOrder(msg.cc, update_cash);
                updateBuyDayOrder(msg.cc, update_cash);
            }
            
        }
        
        if (BACK_STATS.includes(msg.order_status) && BACK_STATS.includes(msg.exec_status) && msg.order_type === 'Limit') {
            let update_cash = msg.order_price * (parseFloat(msg.q) - parseFloat(msg.cq));
            updateCash(msg.cc, update_cash);
             // for account limits
             if ($(`.${msg.cc}_total_orders_val`).length){
                updateDayOrder(msg.cc, -update_cash);
                updateBuyDayOrder(msg.cc, -update_cash);
            }
        }
        
        if (msg.exec_status === 'Trade Executed') {
            if ($(`.${msg.order_symbol}_${msg.cc}_total_qty`).length) {
                updateExistingPortfolio(msg);
            } else {
                createNewPortfolioEntry(msg);
            }
             // for account limits
            let update_cash = msg.order_price * parseFloat(msg.exec_qty);

            if ($(`.${msg.cc}_total_trans_val`).length){
                updateTransaction(msg.cc, update_cash);
                updateBuyExecution (msg.cc, update_cash);
                updateBuyRemaining (msg.cc);
                updateNetTransaction(msg.cc, update_cash, msg.order_side);
            }
        }
        
        if ((PART_FILL.includes(msg.order_status) && REPL_STAT.includes(msg.exec_status))) {
            setTimeout(() => showClientInfo(msg.cc), 3000);
        }
        
        if (msg.order_type === 'Market' || msg.order_type === 'Market At Best') {
            update_portfolio(msg);
        }
    }
    
    if (msg.order_side === 'SELL') { 
        
        if (UPD_STATS.includes(msg.order_status) && UPD_STATS.includes(msg.exec_status)) { 
            let currQty = parseFloat(msg.q);
            if($(`.${msg.order_symbol}_${msg.cc}_saleable_qty`).length) {
              updateQty(msg.order_symbol, msg.cc, -currQty);
            }

            // for account limits
            let update_cash = msg.order_price * currQty;
            if ($(`.${msg.cc}_total_orders_val`).length){
              updateDayOrder(msg.cc, update_cash);
              updateSellDayOrder(msg.cc, update_cash);
           }
        }

        if (BACK_STATS.includes(msg.order_status) && BACK_STATS.includes(msg.exec_status)) {
            let currQty = parseFloat(msg.q) - parseFloat(msg.cq);
            if($(`.${msg.order_symbol}_${msg.cc}_saleable_qty`).length) {
                updateQty(msg.order_symbol, msg.cc, currQty);
            }

            // for account limits
            let update_cash = msg.order_price * currQty;
            if ($(`.${msg.cc}_total_orders_val`).length){
              updateDayOrder(msg.cc, -update_cash);
              updateSellDayOrder(msg.cc, -update_cash);
           }
        }
        
        if (msg.exec_status === 'Trade Executed') {
            // updateExistingPortfolio(msg);  
            if ($(`.${msg.order_symbol}_${msg.cc}_total_qty`).length) {
                updateExistingPortfolio(msg);
            }
            if (msg.symbol_category !== 'Z' && msg.compulsory_spot !== 'Y') { 
                let update_cash = msg.order_price * parseFloat(msg.exec_qty);
                updateCash(msg.cc, update_cash);

                // for account limits
                if ($(`.${msg.cc}_total_trans_val`).length){
                    updateTransaction(msg.cc, update_cash);
                    updateSellExecution (msg.cc, update_cash);
                    updateSellRemaining (msg.cc);
                    updateNetTransaction(msg.cc, update_cash, msg.order_side);
                }
            } 
             
        }
        
        if ((PART_FILL.includes(msg.order_status) && REPL_STAT.includes(msg.exec_status))) {
            setTimeout(() => showClientInfo(msg.cc), 3000);
        }
    }
}

// Helper functions
function getNumVal(selector) {
    return parseFloat(selector.text().replace(/[^0-9.-]/g, ''));
};

function updateCash(clientCd, cash) {
    let cashEl = $(`.${clientCd}_cash`);
    let currCash = getNumVal(cashEl);
    cashEl.text((currCash + cash).toFixed(1));
};

// Function to update total day order
function updateDayOrder(clientCd, price) {
    let totalOrderEl = $(`.${clientCd}_total_orders_val`);
    let currTotalOrder = getNumVal(totalOrderEl);
    let updatedTotal = currTotalOrder + price;

    totalOrderEl.text(updatedTotal.toLocaleString('en-IN'));
}

function updateBuyDayOrder(clientCd, price) {
    let totalBuyOrderEl = $(`.${clientCd}_buy_orders_val`);
    let currTotalBuyOrder = getNumVal(totalBuyOrderEl);
    let updatedTotalBuy = currTotalBuyOrder + price;

    totalBuyOrderEl.text(updatedTotalBuy.toLocaleString('en-IN'));
}

// Function to update transaction
function updateBuyExecution (clientCd, price) { 
    let buyExecEl = $(`.${clientCd}_buy_exec_val`);
    let currBuyExecVal = getNumVal(buyExecEl);
    let updatedBuyExecVal = currBuyExecVal + price;

    buyExecEl.text(updatedBuyExecVal.toLocaleString('en-IN'));
}

// Function to update transaction
function updateBuyRemaining (clientCd) { 
    let totalBuyOrderEl = $(`.${clientCd}_buy_orders_val`);
    let currTotalBuyOrder = getNumVal(totalBuyOrderEl);

    let buyExecEl = $(`.${clientCd}_buy_exec_val`);
    let currBuyExecVal = getNumVal(buyExecEl);

    let buyRemainEl = $(`.${clientCd}_buy_remaining_val`);
    let updatedBuyRemainingVal = currTotalBuyOrder - currBuyExecVal;

    buyRemainEl.text(updatedBuyRemainingVal);
}

function updateSellDayOrder(clientCd, price) {
    let totalSellOrderEl = $(`.${clientCd}_sell_orders_val`);
    let currTotalSellOrder = getNumVal(totalSellOrderEl);
    let updatedTotalSell = currTotalSellOrder + price;

    totalSellOrderEl.text(updatedTotalSell.toLocaleString('en-IN'));
}

// Function to update transaction
function updateSellExecution (clientCd, price) { 
    let sellExecEl = $(`.${clientCd}_sell_exec_val`);
    let currSellExecVal = getNumVal(sellExecEl);
    let updatedSellExecVal = currSellExecVal + price;

    sellExecEl.text(updatedSellExecVal.toLocaleString('en-IN'));
}

// Function to update transaction
function updateSellRemaining (clientCd) { 
    let totalSellOrderEl = $(`.${clientCd}_sell_orders_val`);
    let currTotalSellOrder = getNumVal(totalSellOrderEl);

    let sellExecEl = $(`.${clientCd}_sell_exec_val`);
    let currSellExecVal = getNumVal(sellExecEl);

    let sellRemainEl = $(`.${clientCd}_sell_remaining_val`);
    let updatedSellRemainingVal = currTotalSellOrder - currSellExecVal;

    sellRemainEl.text(updatedSellRemainingVal);
}

// Function to update transaction
function updateTransaction(clientCd, price) {
    let totalTransEl = $(`.${clientCd}_total_trans_val`);
    let currTransVal = getNumVal(totalTransEl);
    let updatedTransVal = currTransVal + price;

    totalTransEl.text(updatedTransVal.toLocaleString('en-IN'));
}

// Function to update net transaction
function updateNetTransaction(clientCd, price, side) {
    let netTransEl = $(`.${clientCd}_net_trans_val`);

    let buyExecEl = $(`.${clientCd}_buy_exec_val`);
    let currBuyExecVal = getNumVal(buyExecEl);

    let sellExecEl = $(`.${clientCd}_sell_exec_val`);
    let currSellExecVal = getNumVal(sellExecEl);

    if(side == 'BUY'){
        if(currBuyExecVal == 0){
            currBuyExecVal = price; 
        }
        netTransEl.text(currBuyExecVal.toLocaleString('en-IN'));
    }
    else{
         
        if(currSellExecVal == 0){
            currSellExecVal = price;
        }

       console.log(currBuyExecVal, currSellExecVal);

        let nettransVal = currBuyExecVal - currSellExecVal; 
        console.log(nettransVal);
        netTransEl.text(nettransVal.toLocaleString('en-IN'));  
    }
    
}



function updateQty(sym, cd, qty) {
    let qtyEl = $(`.${sym}_${cd}_saleable_qty`);
    let currQty = getNumVal(qtyEl);
    qtyEl.text((currQty + qty));
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

function updateRelatedData(msg){
    
    let order_status_to_ignore = ['cancel request','unpark request' , 'pending', 'modify request' , 'release request' , 'private request'];
    let exec_status_to_ignore = ['Rejected' , 'Order Status'];
 
    if(order_status_to_ignore.includes(msg.order_status) || exec_status_to_ignore.includes(msg.exec_status)){
      return;
    }

    const portfolio_code = msg.cc;
    if ($('#portfolio_code_input').length > 0 && portfolio_code == $('#portfolio_code_input').val()) {
        // update_portfolio(msg);
    }
                
    if ($('#account_limit_code').length > 0 && $('#account_limit_code').val() == portfolio_code) {
        setTimeout(function(){
            get_account_limit();
        }, 3000);
    }

    if ($('#order_summary_code').length > 0 && $('#order_summary_code').val() == portfolio_code) {
        setTimeout(function(){
            get_code_summary(portfolio_code);
        }, 3000);
    }

}

function handleTerminal(terminal_id, new_msg){
    if ($(`#${terminal_id}`).length > 0) {
        let profile_selected = document.querySelector("#profile li.profile-selected-li");
        let profile_pid = profile_selected?.getAttribute("data-value") || '1';

        let local_os = localStorage.getItem(system_username + '_' + profile_page + '_' + profile_pid + '_selected_status_' + terminal_id);
        let current_os = local_os ? JSON.parse(local_os) : [];

        let filters = getFilters(terminal_id);
        let isAddable = isOrderAddable(new_msg, filters, user_role_filter);
        
        if (current_os.includes(new_msg.order_status) || (current_os.length == 0 && ['pending', 'parking', 'm-parking', 'offline'].includes(new_msg.order_status))) {
            if (isAddable){ 
                if($('#' + terminal_id).find('.' + new_msg.cid).length > 0){ 
                    return ;
                } 
                add_new_order(new_msg, terminal_id); 
            }
        }
    }
}

function add_new_order(msg, exist_terminals_id) { 
        let table = $('#' + exist_terminals_id).find('#market_table_' + exist_terminals_id); 
        let tbody = table.find('tbody');
        let row = tbody[0].insertRow(0);
        
        let orderData = getOrderStatusData(msg.order_status);
        let execData = getExecStatusData(msg.exec_status);

        row.id = msg.order_id; 
        $(row).addClass(`${orderData.rowClass}`);
        $(row).addClass('terminal-tr');
        $(row).addClass(msg.order_id);

        row.setAttribute("data-code", msg.cc);
        row.setAttribute("data-symbol", msg.order_symbol + '.' + msg.order_board);
        row.setAttribute("data-orderstatus", msg.order_status);
        row.setAttribute("data-execstatus", msg.exec_status);
        row.setAttribute("data-xcg", msg.exchange); 
        row.style.textAlign = 'center';

        row.innerHTML = generateRowHTML(msg, exist_terminals_id, orderData, execData);

        flashnum($(row).find($('td.td-btn')));
            
        let progressValue;
        let add_cq = Number(msg.cq);
        let add_q = Number(msg.q);

        if (!isNaN(add_cq) && !isNaN(add_q) && add_q !== 0) {
            progressValue = (add_cq / add_q) * 100;
        } else {
            progressValue = 0;
        }

        if ((checked_status.includes(msg.order_status) && msg.exec_status !== 'Rejected') || (msg.order_status == 'Rejected' && msg.exec_status == 'Rejected')) { 
            updateProgressBar(progressValue, $('#' + exist_terminals_id).find('.' + msg.cid), msg.order_status, orderData.bgColor, orderData.barColor);
        }
        
        if($('.remainingquantity-'+ msg.cid).is(":visible")){
            updateModifyProgressBar(progressValue, msg.lq);
        }

        if(msg.order_status == 'pending' || msg.order_status == 'parking' || msg.order_status == 'm-parking' || msg.order_status == 'offline'){
            updateTotalRecords(exist_terminals_id, tbody);
        } 
        hideShow_orderTerminal_fromLocal('market_table_' + exist_terminals_id);
        table = null;
        row = null; 
        msg = null;
}

function update_exist_order(msg, element){
        let parent_id = element.parent().parent().attr('id');
        let terminal_id = parent_id.replace('market_table_', '').replace('add_', '').replace(/\s+/g, ''); 

        let orderData = getOrderStatusData(msg.order_status);
        let execData = getExecStatusData(msg.exec_status);

        let statusClass = `${terminal_id}_os ui-sortable-handle ${orderData.statusClass}`;
        let execClass = `${terminal_id}_et ui-sortable-handle ${execData.statusClass}`;

        let order_chain_id = msg.cid;
        let orderid_div = "";
        let order_icon = "";
        let exec_qty;
      
        // Special case for private orders
        if (msg.order_status == "Private Order" && msg.exec_status == "Replaced") { 
            statusClass = `${terminal_id}_os ui-sortable-handle text-primary`;
            execClass = `${terminal_id}_et ui-sortable-handle text-primary`;
        }

        let row = element.find("td");
        element.removeClass();

        element.addClass(orderData.rowClass);
        element.addClass('terminal-tr');
        element.addClass(msg.cid);

        element.attr("data-orderstatus", msg.order_status);
        element.attr("data-execstatus", msg.exec_status);

        let classString = statusClass;  
        let classes = classString.split(' '); 
        let firstClass = classes[0];
        let secondClass = classes[1];
        let thirdClass = classes[2]; 
        let joinedClasses = [firstClass, secondClass, thirdClass].join('.');
    
        let classStringExec = execClass;
        let classesExec = classStringExec.split(' ');
        let firstClassExec = classesExec[0];
        let secondClassExec = classesExec[1];
        let thirdClassExec = classesExec[2];
        let joinedClassesExec = [firstClassExec, secondClassExec, thirdClassExec].join('.');

        let avgPrice;
        if(msg.ap == 0 || msg.ap == ""){
            avgPrice = msg.lp;
        }
        else{
            avgPrice = msg.ap;
        }

        if(avgPrice == 0 || !avgPrice){
            avgPrice = "";
        } 

        if (msg.error_msg && msg.error_msg != '') {
            orderid_div = '<div style="display: none;" data-orderid="' + order_chain_id + '" value="" class="client-order-id"></div>' +
                '<div style="display: none;" data-orderchainid="' + order_chain_id + '" value="" class="order-chain-id"></div>';
            order_icon = '<i class="fa fa-lock text-muted"></i>';
            
            if (msg.order_status == 'Rejected' && msg.exec_status == 'Rejected') {
                row.filter(`.${terminal_id}_ap.ui-sortable-handle`).text(avgPrice);
                row.filter(`.${terminal_id}_eq.ui-sortable-handle`).text(msg.cq || 0);
                row.filter(`.${terminal_id}_drib.ui-sortable-handle`).text(msg.dq || 0);
                row.filter(`.${terminal_id}_dq.ui-sortable-handle`).text(msg.lq || 0);
            }
            row.filter(`.${terminal_id}_uid.ui-sortable-handle`).text(msg.uid);

            row.filter(`.${terminal_id}_os.ui-sortable-handle`).removeClass().addClass(statusClass); 
            row.filter(`.${joinedClasses}`).text(msg.order_status);
            row.filter(`.${joinedClasses}`).attr('title', 'Reason: ' + msg.error_msg);

            row.filter(`.${terminal_id}_et.ui-sortable-handle`).removeClass().addClass(execClass); 
            row.filter(`.${joinedClassesExec}`).text(msg.exec_status);
            row.filter(`.${joinedClassesExec}`).attr('title', 'Reason: ' + msg.error_msg);

            if (msg.order_status == "Rejected" || msg.exec_status == "Expired") {
                row.filter('.td-btn').html(order_icon + orderid_div);
            } else {
                row.filter('.td-btn').html(orderid_div);
            } 

        } else { 
            if (msg.order_type != "") {
                row.filter(`.${terminal_id}_ot.ui-sortable-handle`).text(msg.order_type);
            }

            row.filter(`.${terminal_id}_oid.ui-sortable-handle`).text(msg.cid);
            row.filter(`.${terminal_id}_price.ui-sortable-handle`).text(msg.order_price ? msg.order_price : avgPrice);
            row.filter(`.${terminal_id}_ap.ui-sortable-handle`).text(avgPrice);
            row.filter(`.${terminal_id}_qty.ui-sortable-handle`).text(msg.q || 0);
            row.filter(`.${terminal_id}_drib.ui-sortable-handle`).text(msg.dq || 0);
            row.filter(`.${terminal_id}_dq.ui-sortable-handle`).text(msg.lq);
            row.filter(`.${terminal_id}_uid.ui-sortable-handle`).text(msg.uid);
            row.filter(`.${terminal_id}_etm.ui-sortable-handle`).text(msg.etm);
        
            if (msg.cq == 0) exec_qty = '';
            exec_qty = msg.cq;

            var status_div = exec_qty + '<div style="display: none;" data-orderstat="' + msg.order_status + '" value="" class="client-order-status"></div>';
            row.filter(`.${terminal_id}_eq.ui-sortable-handle`).html(status_div);
        
            row.filter(`.${terminal_id}_os.ui-sortable-handle`).removeClass().addClass(statusClass); 
            row.filter(`.${joinedClasses}`).text(msg.order_status);
            row.filter(`.${joinedClasses}`).attr('title', '');

            row.filter(`.${terminal_id}_et.ui-sortable-handle`).removeClass().addClass(execClass); 
            row.filter(`.${joinedClassesExec}`).text(msg.exec_status);
            row.filter(`.${joinedClassesExec}`).attr('title', '');

            orderid_div = '<div style="display: none;" data-orderid="' + order_chain_id + '" value="" class="client-order-id"></div>' +
                '<div style="display: none;" data-orderchainid="' + order_chain_id + '" value="" class="order-chain-id"></div>';
            order_icon = '<i class="fa fa-lock text-muted"></i>';

            if (msg.order_status == "Filled" || msg.order_status == "Cancelled" || msg.order_status == "Rejected" || msg.order_status == "Expired") {
                row.filter('.td-btn').html(order_icon + orderid_div);
            } else {
                row.filter('.td-btn').html(orderid_div);
            }
         
            status_div = null;
        } 

        flashnum(element.find($('td.td-btn')));

        let progressValue;
        let update_cq = Number(exec_qty);
        let update_q = Number(msg.q);

        if (!isNaN(update_cq) && !isNaN(update_q) && update_q !== 0) {
            progressValue = (update_cq / update_q) * 100; 
        } else {
            progressValue = 0; 
        }

        if ((checked_status.includes(msg.order_status) && msg.exec_status !== 'Rejected') || (msg.order_status == 'Rejected' && msg.exec_status == 'Rejected')) {  
            updateProgressBar(progressValue, element, msg.order_status, orderData.bgColor, orderData.barColor);
        } 

        if($('.remainingquantity-'+ msg.order_id).is(":visible")){
            updateModifyProgressBar(progressValue, msg.lq);
        }

        hideShow_orderTerminal_fromLocal(parent_id);
        row = null;
        order_chain_id = null;
        orderid_div = null;
        order_icon = null;
}

function generateRowHTML(msg, id, ordrData, excData) {
    let headers = document.getElementById('market_table_' + id)?.getElementsByTagName("th");
    let rowHTML = '';

    let avgPrice;
    if(msg.ap == 0 || msg.ap == ""){
        avgPrice = msg.lp;
    }
    else{
        avgPrice = msg.ap;
    }

    if(avgPrice == 0 || !avgPrice){
        avgPrice = "";
    }

    for (let i = 0; i < headers.length; i++) { 
        if (headers[i].className) {  
            switch (headers[i].className) { 
                case `${id}_xcg ui-sortable-handle`:  
                    rowHTML += `<td class="${id}_xcg">${msg.exchange}</td>`; 
                    break;
                case `${id}_oid ui-sortable-handle`:
                    rowHTML += `<td class="${id}_oid ui-sortable-handle text-left">${msg.cid}</td>`;
                    break;
                case `${id}_ordertime ui-sortable-handle`:
                    rowHTML += `<td class="${id}_ordertime ui-sortable-handle text-center">${msg.otm}</td>`;
                    break;    
                case `${id}_etm ui-sortable-handle`:
                    rowHTML += `<td class="${id}_etm ui-sortable-handle text-center">${msg.etm ? msg.etm : msg.otm}</td>`;
                    break;
                case `${id}_cc ui-sortable-handle`:
                    rowHTML += `<td class="${id}_cc ui-sortable-handle text-center">${msg.cc}</td>`;
                    break;
                case `${id}_symbol ui-sortable-handle`:
                    rowHTML += `<td class="${id}_symbol ui-sortable-handle text-left">${msg.order_symbol}${msg.ct ? `<span class="ord-ter-category">[${msg.ct}]</span>` : ''}</td>`;
                    break;
                case `${id}_board ui-sortable-handle`:
                    rowHTML += `<td class="${id}_board ui-sortable-handle text-center">${msg.order_board}</td>`; 
                    break;
                case `${id}_side ui-sortable-handle`: 
                    if (msg.order_side == "BUY") {
                        rowHTML += `<td class="${id}_side ui-sortable-handle text-success">BUY</td>`;
                    } else {
                        rowHTML += `<td class="${id}_side ui-sortable-handle text-danger">SELL</td>`;
                    } 
                    break;
                case `${id}_ot ui-sortable-handle`:  
                    rowHTML += `<td class="${id}_ot ui-sortable-handle order-limit-type">${msg.order_type}</td>`;  
                    break;
                case `${id}_price ui-sortable-handle`:
                    if(msg.order_price){
                        rowHTML += `<td class="${id}_price ui-sortable-handle text-right">${msg.order_price}</td>`; 
                    }  
                    else{
                        rowHTML += `<td class="${id}_price ui-sortable-handle text-right">${avgPrice}</td>`;  
                    }
                    break;
                case `${id}_ap ui-sortable-handle`: 
                    if(msg.order_status == 'Cancelled'){
                        rowHTML += `<td class="${id}_ap ui-sortable-handle text-right"></td>`; 
                    }
                    else{
                        rowHTML += `<td class="${id}_ap ui-sortable-handle text-right">${avgPrice}</td>`; 
                    }  
                    break;
                case `${id}_qty ui-sortable-handle`:
                    rowHTML += `<td class="${id}_qty ui-sortable-handle text-right">${msg.q ? msg.q : 0}</td>`;
                    break;
                case `${id}_drib ui-sortable-handle`:
                    rowHTML += `<td class="${id}_drib ui-sortable-handle text-right">${msg.dq ? msg.dq : 0}</td>`;
                    break;
                case `${id}_dq ui-sortable-handle`:
                    if(msg.lq){
                        rowHTML += `<td class="${id}_dq ui-sortable-handle text-right">${msg.lq}</td>`; 
                    }
                    else{
                        rowHTML += `<td class="${id}_dq ui-sortable-handle text-right"></td>`; 
                    }
                    break;
                case `${id}_eq ui-sortable-handle`:
                    rowHTML += `<td class="${id}_eq ui-sortable-handle text-right">${msg.cq ? msg.cq : 0}</td>`;
                    break;
                case `${id}_os ui-sortable-handle`: 
                    if (msg.error_msg && msg.error_msg != '') { 
                        rowHTML += `<td class="${id}_os ui-sortable-handle ${ordrData.statusClass}" title="Reason:${msg.error_msg}">${msg.order_status}</td>`; 
                    }
                    else{
                        if(msg.order_status == 'm-parking'){ 
                            rowHTML += `<td class="${id}_os ui-sortable-handle ${ordrData.statusClass}"><span><input class="m-check" type="checkbox" />&nbsp;${msg.order_status}</span></td>`;
                        }
                        else{
                            rowHTML += `<td class="${id}_os ui-sortable-handle ${ordrData.statusClass}">${msg.order_status}</td>`;
                        }
                    } 
                    break;
                case `${id}_et ui-sortable-handle`:
                    if (msg.error_msg && msg.error_msg != '') { 
                        rowHTML += `<td class="${id}_et ui-sortable-handle ${excData.statusClass}" title="Reason:${msg.error_msg}">${msg.exec_status}</td>`; 
                    }
                    else{
                        rowHTML += `<td class="${id}_et ui-sortable-handle ${excData.statusClass}">${msg.exec_status}</td>`; 
                    } 
                    break;
                case `${id}_op ui-sortable-handle`:
                    if(msg.order_status == 'm-parking'){ 
                        rowHTML += `
                        <td class="${id}_op ui-sortable-handle">
                        <div class="progress" style="border-radius: 10px; height: 0.8rem; background-color: #6c9ce6; position: relative;">
                        <span class="progress-bar-text" style="text-align: center; color: #000; position: absolute; top: -38%; left: 49%; transform: translate(-50%); font-size: 11px; font-weight: bold;">0.00%</span>
                            <div class="progress-bar" role="progressbar" style="background-color: #6c9ce6; width: 0%; color: #000; font-size: 10px; font-weight: bold;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        </td>`;
                    }
                    else
                    {   
                        rowHTML += `
                        <td class="${id}_op ui-sortable-handle">
                        <div class="progress" style="border-radius: 10px; height: 0.8rem; position: relative;">
                        <span class="progress-bar-text" style="text-align: center; color: #000; position: absolute; top: -38%; left: 49%; transform: translate(-50%); font-size: 11px; font-weight: bold;">0.00%</span>
                            <div class="progress-bar" role="progressbar" style="width: 0%; color: #000; font-size: 10px; font-weight: bold;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        </td>`;
                    }  
                    break;
                case `${id}_did ui-sortable-handle`:
                    rowHTML += `<td class="${id}_did ui-sortable-handle">${msg.dealer_id}</td>`;
                    break;
                case `${id}_uid ui-sortable-handle`:
                    rowHTML += `<td class="${id}_uid ui-sortable-handle">${msg.uid}</td>`;
                    break;
                case `td-btn`: 
                    let checkedArr = ["Filled","Rejected","Expired","Cancelled"];
                    if (checkedArr.includes(msg.order_status)){
                        rowHTML += `
                            <td class="td-btn">
                                <div style="display: none;" data-orderid="${msg.order_id}" value="" class="client-order-id"></div>
                                <div style="display: none;" data-orderchainid="${msg.cid}" value="" class="order-chain-id"></div>
                                <i class="fa fa-lock text-muted"></i>
                            </td>`;
                    }
                    else{
                        rowHTML += `
                        <td class="td-btn">
                            <div style="display: none;" data-orderid="${msg.order_id}" value="" class="client-order-id"></div>
                            <div style="display: none;" data-orderchainid="${msg.cid}" value="" class="order-chain-id"></div> 
                        </td>`;
                    }  
                    break;
                default:
                    rowHTML += `<td><div class="">-</div></td>`;
                    break;
            }
        }
    }

    return rowHTML;
}

function updateTotalRecords(exist_terminals_id, tbody) {
    const totalRecordElement = $('#total_record_' + exist_terminals_id);
    const currentTotalRecords = parseInt(totalRecordElement.text());
    totalRecordElement.text(currentTotalRecords + 1);

    const orderSelectedLimit = localStorage.getItem("selected_order_value") ?? 30;
    tbody.find('tr:gt(' + orderSelectedLimit + ')').remove();

    hideShow_orderTerminal_fromLocal('market_table_' + exist_terminals_id);
}

// Get the progress bar element
function updateProgressBar(percentage, elem, order_status_text, bgColor, barColor) {
    if (percentage !== undefined && !isNaN(percentage)) {
        let progressParent = elem.find("td").find(".progress");
        let progressBar = elem.find("td").find(".progress-bar");
        let progressText = elem.find("td").find(".progress-bar-text");
        let parentColor = bgColor;
        let barBgColor = barColor;

        if (percentage > 0 && (order_status_text == "Cancelled" || order_status_text == "Replaced" || order_status_text == "Expired")) {
            parentColor = '#8e9291';
            barBgColor = '#e1954c';
        } 
        else if (percentage == 0 && order_status_text == "Cancelled") {
            parentColor = '#8e9291';
            barBgColor = '#8e9291';
        } 
        else if (percentage == 0 && order_status_text == "Replaced") {
            parentColor = '#6c9ce6';
            barBgColor = '#6c9ce6';
        }

        progressParent.css('background-color', parentColor);
        progressText.text(`${percentage.toFixed(2)}%`);
        progressBar.css('background-color', barBgColor);
        progressBar.width(`${percentage}%`);
        progressBar.attr('aria-valuenow', percentage);
    }
}

// Utility function to get filters
function getFilters(exist_terminals_id) {
    return {
        order_side: $('#order_side_filter_' + exist_terminals_id).val(),
        exchange: $('#order_exchange_filter_' + exist_terminals_id).val(),
        code: $('#order_terminal_code_' + exist_terminals_id).val(),
        symbol: $('#order_terminal_symbol_' + exist_terminals_id).val(),
        dealer_id: $('#order_terminal_dealer_id_' + exist_terminals_id).val(),
        user_id: $('#order_user_filter_' + exist_terminals_id).val(),
        category: $('#order_category_filter_' + exist_terminals_id).val()
    };
}

function isOrderAddable(msg, filters, userRoleFilter) {
    let isAddable = true;
    const orderSide = msg.order_side;
    const symbol_board = msg.order_symbol + '.' + msg.order_board; 
    const exchange = msg.exchange;
    const dealer =  msg.dealer_id;

    if (filters.order_side == 'BUY' && 'BUY' != orderSide) {
        isAddable = false;
    }
    
    if (filters.order_side == 'SELL' && 'SELL' != orderSide) {
        isAddable = false;
    }

    if (filters.exchange == 'DSE' && 'DSE' != exchange) {
        isAddable = false;
    }

    if (filters.exchange == 'CSE' && 'CSE' != exchange) {
        isAddable = false;
    }

    if (filters.code && filters.code != msg.cc) {
        isAddable = false;
    }

    if (filters.symbol && filters.symbol != symbol_board) {
        isAddable = false;
    }

    if (userRoleFilter.includes(system_user_role)) {
        if (filters.dealer_id && filters.dealer_id != dealer) {
            isAddable = false;
        }
        if (filters.user_id && filters.user_id != msg.uid) {
            isAddable = false;
        }
    }

    return isAddable;
}

function getOrderTypeText(orderType) {
    const orderTypeMap = {
        "1": "Market",
        "2": "Limit",
        "Z": "MarketBest",
        "K": "MarketBest",
    };
    return orderTypeMap[orderType];
}

function getOrderStatusData(orderStatus){
    const statusMap = {
        "Accepted": { statusClass: "text-info", rowClass: "convert-order-element", bgColor: "#6c9ce6", barColor: "#6c9ce6" },
        "Partially Filled": { statusClass: "text-warning", rowClass: "par-filled-order-element", bgColor: "#8e9291", barColor: "#e1954c" },
        "Filled": { statusClass: "text-success", rowClass: "filled-order-element", bgColor: "#00db86", barColor: "#00db86" },
        "Cancelled": { statusClass: "text-muted", rowClass: "locked-order-element", bgColor: "", barColor: "" },
        "Replaced": { statusClass: "text-info", rowClass: "convert-order-element", bgColor: "", barColor: "" },
        "Rejected": { statusClass: "text-danger", rowClass: "rejected-order-element", bgColor: "#e13737", barColor: "#e13737" },
        "Expired": { statusClass: "text-danger", rowClass: "locked-order-element", bgColor: "#e13737", barColor: "#e13737" },
        "Private Order": { statusClass: "text-primary", rowClass: "private-order-element", bgColor: "#007bff", barColor: "#007bff" },
        "m-parking": { statusClass: "text-info", rowClass: "m-order-element", bgColor: "#6c9ce6", barColor: "#6c9ce6" },
        "parking": { statusClass: "text-white", rowClass: "order-element", bgColor: "#e9ecef", barColor: "#e9ecef" },
        "pending": { statusClass: "text-white", rowClass: "order-element", bgColor: "#e9ecef", barColor: "#e9ecef" },
        "modify request": { statusClass: "text-info", rowClass: "order-element", bgColor: "", barColor: "" },
        "unpark request": { statusClass: "text-info", rowClass: "order-element", bgColor: "", barColor: "" },
        "cancel request": { statusClass: "text-muted", rowClass: "order-element", bgColor: "", barColor: "" },
        "private request": { statusClass: "text-primary", rowClass: "order-element", bgColor: "", barColor: "" },
        "release request": { statusClass: "text-info", rowClass: "order-element", bgColor: "", barColor: "" },
        "offline": { statusClass: "text-white", rowClass: "order-element", bgColor: "#e9ecef", barColor: "#e9ecef" },
    };
    return statusMap[orderStatus] || { statusClass: "text-muted", rowClass: "order-element", bgColor: "", barColor: "" };
}

function getOrderStatus(orderStatus) {
    const statusMap = {
        "0": "Accepted",
        "1": "Partially Filled",
        "2": "Filled",
        "4": "Cancelled",
        "5": "Replaced",
        "8": "Rejected",
        "C": "Expired",
        "Z": "Private Order",
        "U": "Unplaced",
    };
    return statusMap[orderStatus];
}

function getExecStatusData(execStatus) {
    const execMap = {
        "Accepted": {statusClass: "text-info"},
        "Cancelled": {statusClass: "text-muted"},
        "Expired": {statusClass: "text-danger"},
        "Trade Executed": {statusClass: "text-success"},
        "": {statusClass: "text-danger"},
        "Replaced": {statusClass: "text-info"},
        "Rejected": {statusClass: "text-danger"},
        "m-parking": {statusClass: "text-info"},
        "parking": {statusClass: "text-white"},
        "pending": {statusClass: "text-white"},
        "modify request": {statusClass: "text-info"},
        "unpark request": {statusClass: "text-info"},
        "cancel request": {statusClass: "text-muted"},
        "private request": {statusClass: "text-primary"},
        "release request": {statusClass: "text-info"},
        "offline": {statusClass: "text-white"},
    };
    return execMap[execStatus] || {statusClass: "text-muted"};
}

function getExecStatus(execStatus) {
    const execMap = {
        "0": "Accepted",
        "4": "Cancelled",
        "C": "Expired",
        "F": "Trade Executed",
        "": "Rejected",
        "5": "Replaced",
        "D": "Replaced",
        "8": "Rejected",
        "I": "Order Status",
    };
    return execMap[execStatus];
}

function update_portfolio(msg) {

    setTimeout(function(){ 
        selectSaleable(msg.cc);
    }, 3000);

}



function rms_update(msg) {
    // For Client Limit or Cash Updates
    if (msg.value.update_type == 'limit') {
        var client_code = msg.value.msg;
        if (client_code in code_list) {
            if ($("#order_client_code").val() == client_code) getClientInfo();
            // if ($("#accsnap_table").length > 0) refresh_snapshot();
            if ($('#account_cash_summary').length > 0 && $('#account_limit_code').val() == client_code) {
                get_account_limit();
            }
            if ($('#portfolio_code_input').length > 0 && $('#portfolio_code_input').val() == client_code) {
                showClientInfo();
            }
            show_flash_messages("Limit Updated for Client Code: " + client_code, 'success');
        }
    }
    // For Broker Team Updates
    if (system_user_role == 'brokertrader') {
        if (msg.value.update_type == 'add_team') {
            var data = JSON.parse(msg.value.msg);
            var dealer_id = data.dealer_id;
            var url = "shared/get_team_dealers/";
            $.getJSON(url, { branchid: data.branch_id, team_name: data.team_name }, function (data) {
                if (data.length > 0) {
                    for (i = 0; i < data.length; i++) {
                        if (data[i].dealer_id == system_username) {
                            code_input();
                            system_dealer_team_id = data.team_name;
                            if ($('.user_order_terminals').length > 0) get_order_history();
                            show_flash_messages("Admin added you to new team", 'success');
                            // if($("#accsnap_table").length > 0)refresh_snapshot();
                        }
                    }
                }
            });
        }
        if (msg.value.update_type == 'remove_team') {
            // var data = JSON.parse(msg.value.msg);
            code_input();
            if ($('.user_order_terminals').length > 0) get_order_history();
            // if($("#accsnap_table").length > 0)refresh_snapshot();
        }
    }
    msg = null;
}

function rms_update_limit(msg)
{
    const client_code = msg.value.msg
    if (client_code) {
        if ($("#order_client_code").val() == client_code) getClientInfo();
        // if ($("#accsnap_table").length > 0) refresh_snapshot();
        if ($('#account_cash_summary').length > 0 && $('#account_limit_code').val() == client_code) {
            get_account_limit();
        }
        if ($('#portfolio_code_input').length > 0 && $('#portfolio_code_input').val() == client_code) {
            showClientInfo();
        }
        show_flash_messages("Limit Updated for Client Code: " + client_code, 'success');
    }
}




function updateModifyProgressBar(progressValue, lq) {
    $("#remaining-quantity").text("Remaining: "+lq);
    document.getElementById("progress-bar-fill").style.width = progressValue + "%";
    
}


function showAnnouncement(msg) {  
    showToast(msg);
    createSliderItem(msg, 'announcement'); 
    if ($('#announcement-content').length > 0 && $('#announcement-content').is(":visible")) {
        let newsDiv = document.querySelector("#accordionExampleAnnounce");
        let accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
    
        let accordionHeader = document.createElement("div");
        accordionHeader.classList.add("accordion-header", "text-overflow-ellipsis");
        accordionHeader.id = `announce_heading${realTimeAnnounceIndex}`;
    
        let buttonClass = realTimeAnnounceIndex === 0 ? "" : "collapsed";
    
        accordionHeader.innerHTML = `
            <h2 class="mb-0 accordion-header-h2" onclick="toggleAccordionToday(this)">
                <span class="accordion-header-icon"><i class="fa fa-chevron-right toggle-chevron-today"></i></span>
                <button class="btn btn-link today-news-btn custom-btn pl-0 ${buttonClass}" type="button" aria-expanded="${realTimeAnnounceIndex === 1 ? 'true' : 'false'}" aria-controls="collapse${realTimeAnnounceIndex}">
                    ${msg.tt}
                    <br>
                    <span style="font-size: 14px;">${msg.ca}</span>
                </button>
            </h2>
        `;
    
        accordionHeader.setAttribute("data-toggle", "collapse");
        accordionHeader.setAttribute("data-target", `#announce_collapse${realTimeAnnounceIndex}`);
    
        let accordionCollapse = document.createElement("div");
        accordionCollapse.id = `announce_collapse${realTimeAnnounceIndex}`;

        let collapseClasses = realTimeAnnounceIndex === 0 ? "collapse" : "collapse"; // Initial accordion item is expanded
        accordionCollapse.classList.add(collapseClasses, "accordion-body", "accordion-text-body-today");

        accordionCollapse.setAttribute("aria-labelledby", `announce_heading${realTimeAnnounceIndex}`);
        accordionCollapse.setAttribute("data-parent", "#accordionExampleAnnounce");

        accordionCollapse.innerHTML = `${msg.tx}`;
    
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        newsDiv.prepend(accordionItem);  // Prepend to show the latest announcement first
    }

    realTimeAnnounceIndex++;
}