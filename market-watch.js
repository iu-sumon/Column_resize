var isButtonClicked = false;
var lastChangedSelect = "";
var isBlockGsecButtonClicked = false;
var dataPage = 1;
var dataLimit = 50;
var sortingOrder = 'ASC';
var sortingColumnName = null
var pid_selected = document.querySelector("#profile li.profile-selected-li");
var pid = pid_selected.getAttribute("data-value");
var screener_table = document.querySelector('.screener_table').getElementsByTagName('tbody')[0];
var block_table = document.querySelector('.block_table').getElementsByTagName('tbody')[0];
var gsec_table = document.querySelector('.gsec_table').getElementsByTagName('tbody')[0];
var headerCellsScreener = document.getElementById("market_watch_screener").getElementsByTagName("th")
var headerCellsBLock = document.getElementById("mw_block_table").getElementsByTagName("th")
var headerCellsGSEC = document.getElementById("mw_gsec_table").getElementsByTagName("th")
var activeButton = document.querySelector('.widget-btn.widget-btn-active');

$(document).ready(function () {
    let storedFontSize = localStorage.getItem('market_watch_font') || 'normal'; 
    changeMarketWatchFontSize(storedFontSize);
    $('#fontSize_mwatch').find(`input[value="${storedFontSize}"]`).prop('checked', true);

    getSymbolData(); 
    symbol_input();
    showHideTable('market_watch_screener');
    showHideTable('mw_block_table');
    showHideTable('mw_gsec_table');

});

function changeMarketWatchFontSize(fontSize) { 
    let screenerTable = $('#market_watch_screener');
    let blockTable = $('#mw_block_table');
    let gsecTable = $('#mw_gsec_table'); 

    let screenerTableHead = screenerTable.find('thead');
    let screenerTableBody = screenerTable.find('tbody');  
    screenerTableHead.removeClass('font-size-extra-large-head font-size-large-head font-size-normal-head font-size-small-head font-size-extra-small-head font-size-xxs-small-head');
    screenerTableBody.removeClass('font-size-extra-large-body font-size-large-body font-size-normal-body font-size-small-body font-size-extra-small-body font-size-xxs-small-body');

    let blockTableHead = blockTable.find('thead');
    let blockTableBody = blockTable.find('tbody');
    blockTableHead.removeClass('font-size-extra-large-head font-size-large-head font-size-normal-head font-size-small-head font-size-extra-small-head font-size-xxs-small-head');
    blockTableBody.removeClass('font-size-extra-large-body font-size-large-body font-size-normal-body font-size-small-body font-size-extra-small-body font-size-xxs-small-body');

    let gsecTableHead = gsecTable.find('thead');
    let gsecTableBody = gsecTable.find('tbody');
    gsecTableHead.removeClass('font-size-extra-large-head font-size-large-head font-size-normal-head font-size-small-head font-size-extra-small-head font-size-xxs-small-head');
    gsecTableBody.removeClass('font-size-extra-large-body font-size-large-body font-size-normal-body font-size-small-body font-size-extra-small-body font-size-xxs-small-body');

    // Add font size classes based on the selected font size
    switch (fontSize) {
        case 'extra-large': 
            screenerTableHead.addClass('font-size-extra-large-head');
            screenerTableBody.addClass('font-size-extra-large-body');
            blockTableHead.addClass('font-size-extra-large-head');
            blockTableBody.addClass('font-size-extra-large-body');
            gsecTableHead.addClass('font-size-extra-large-head');
            gsecTableBody.addClass('font-size-extra-large-body'); 
            break;
        case 'large': 
            screenerTableHead.addClass('font-size-large-head');
            screenerTableBody.addClass('font-size-large-body');
            blockTableHead.addClass('font-size-large-head');
            blockTableBody.addClass('font-size-large-body');
            gsecTableHead.addClass('font-size-large-head');
            gsecTableBody.addClass('font-size-large-body'); 
        case 'normal':
            let customFont = localStorage.getItem("customFont") || '0.80';
            let customWeight = localStorage.getItem("customWeight") || 500;
            $("#web-market-watch-container").css({"font-size": customFont + 'rem', "font-weight": customWeight});
            break;
        case 'small': 
            screenerTableHead.addClass('font-size-small-head');
            screenerTableBody.addClass('font-size-small-body');
            blockTableHead.addClass('font-size-small-head');
            blockTableBody.addClass('font-size-small-body');
            gsecTableHead.addClass('font-size-small-head');
            gsecTableBody.addClass('font-size-small-body'); 
            break;
        case 'extra-small': 
            screenerTableHead.addClass('font-size-extra-small-head');
            screenerTableBody.addClass('font-size-extra-small-body');
            blockTableHead.addClass('font-size-extra-small-head');
            blockTableBody.addClass('font-size-extra-small-body');
            gsecTableHead.addClass('font-size-extra-small-head');
            gsecTableBody.addClass('font-size-extra-small-body'); 
            break;
        case 'xxs-small': 
            screenerTableHead.addClass('font-size-xxs-small-head');
            screenerTableBody.addClass('font-size-xxs-small-body');
            blockTableHead.addClass('font-size-xxs-small-head');
            blockTableBody.addClass('font-size-xxs-small-body');
            gsecTableHead.addClass('font-size-xxs-small-head');
            gsecTableBody.addClass('font-size-xxs-small-body'); 
            break;
        default:
            break;
    }
    
    // Save font size to localStorage
    localStorage.setItem('market_watch_font', fontSize);
}

 // Event listener for radio buttons
 $(document).on('change', '.mwatch-font-group input[type="radio"]', function() {
    let fontSize = $(this).val(); 
    changeMarketWatchFontSize(fontSize);
});

$('body').off('click', '.scrsym').on('click', '.scrsym', function (e) {
    e.preventDefault();
    // var elem = $(this).find('.symbtn');
    var symbol = $(this).find('.symbtn').attr('data-symbol');
    marketwatch_link(symbol);
});

$('.market-watch-pagination').on('click', '.previous_page', function () {
    if (dataPage > 1) {
        dataPage = dataPage - 1;
        getSymbolData();
    }

});

$('.market-watch-pagination').on('click', '.next_page', function () {
    dataPage = dataPage + 1;
    getSymbolData();
});

$("#web-market-watch-container").on("click contextmenu", "#market_watch_screener tbody tr", function () {
    $("#web-market-watch-container #market_watch_screener tbody tr").removeClass('orderClicked');
    $(this).addClass("orderClicked");
});

function marketwatch_link(mwatch_sym_board) { 
    let symbol_split = mwatch_sym_board?.split("."); 
    let mwatch_symbol = symbol_split[0];

    let market_watch_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Market Watch_color'); 
    let Quote_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Quote_color'); 
    let Chart_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Chart_color'); 
    let News_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'News_color'); 
    let stockInfo_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Stock Info_color'); 
    
    let current_mkt_input = $('.mktdpt_symbol_name')
    current_mkt_input.each(function(index, element) { 
        let mw_mktdpt_input_id = $(this).attr('id'); 
        let target_title_mw_mkt = $('#' + mw_mktdpt_input_id).parents().parents().parents().parents().parents().parents().children().eq(0).find('.lm_active').children().eq(1).text(); 
        let mw_mktdpt_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + target_title_mw_mkt + '_color'); 
          
        if (market_watch_color == mw_mktdpt_color) {
            let mw_mkt_channel_array= []; 
            let mw_mkt_channel_object = {
                symbol_id: mw_mktdpt_input_id, 
                mkt_symbol: mwatch_sym_board
            };
    
            mw_mkt_channel_array.push(mw_mkt_channel_object)
            if ($('.mktdpt_symbol_name').length > 0) { 
                localStorage.setItem(system_username +'_mkt' + target_title_mw_mkt, JSON.stringify(mw_mkt_channel_array));
                let current_mkt_symbol =  $('#' + mw_mktdpt_input_id).val();
                if(mwatch_sym_board != current_mkt_symbol)
                {
                    $('#' + mw_mktdpt_input_id).val(mwatch_sym_board);
                   getmktdepth(mwatch_sym_board, mw_mktdpt_input_id);
                }
               
            }  
        }
    }); 

    if(market_watch_color == stockInfo_color){
        if ($('#stock_analysis').length > 0) {
            getAndSetFinancialData(mwatch_symbol);
            getAndSetHoldingsData(mwatch_symbol);
            getAndSetProfileData(mwatch_symbol);
            getAndSetCorpActionsData(mwatch_symbol);
            getAndSetNewsData(mwatch_symbol);
        }
    }

    if(market_watch_color == News_color){
        if ($('#symbol-news-content').length > 0) {
            if ($('#symbol-news-content').is(":visible")) { 
                let current_news_symbol = $('#current_news_symbol').text(); 
                if(mwatch_symbol != current_news_symbol){
                    sym_news(mwatch_symbol);
                }  
            };
        }
   }

    if(market_watch_color == Quote_color){
        if ($('#quote_box').length > 0) { 
            let current_quote_symbol = $('#quote_loaded_symbol').text(); 
            if(mwatch_sym_board != current_quote_symbol)
            {
                get_quote_data(mwatch_sym_board);
            } 
        }
    }

    if(market_watch_color == Chart_color) {
        if (($('#tv_chart_container').length > 0 || $('#tv_chart_container_advanced').length > 0) && window.symbol_advanced_chart_widget) { 
            let current_chart_symbol =  window.symbol_advanced_chart_widget.activeChart().symbol();
            if(mwatch_sym_board != current_chart_symbol)
            {
                reinit_chart(mwatch_sym_board); 
            }
        }
    }   
};

$("#select_board, #filter_sector, #filter_category, #select_symbol_board_watch").on('change', function () {
    dataPage = 1;
    getSymbolData();
});

$("#marketwatch_symbol").on('select', function () {
    dataPage = 1;
    getSymbolData();
});

function clear_order_market_watch_filter() {
    $('#filter_sector').val('ALL');
    $('#filter_category').val('ALL');
    $('#select_symbol_board_watch').val('ALL');
    $('#select_board').val('PUBLIC');
    $('#marketwatch_symbol').val('');
    sortingOrder = "ASC";
    sortingColumnName = null;
    dataPage = 1;
    getSymbolData();
}

function getSymbolData() {
    var instr = null;
    var symbol = null;
    var filter_button = $('button.screener_sort.widget-btn-active');
    var board = filter_button.length > 0 ? filter_button.attr('value') : null;
    var sector = $('#filter_sector').val();
    var market_type = $('#select_symbol_board_watch').val();
    var category = $('#filter_category').val();
    var marketwatch_symbol = $('#marketwatch_symbol').val();
    if (marketwatch_symbol) {
        symbol = marketwatch_symbol.split('.')[0];
    }
    if (board != 'BLOCK' || board != 'YIELDDBT') {
        instr = board
    }
    select_board = $("#select_board").val()
    $('.previous_page').attr('disabled', false);
    $('.next_page').attr('disabled', false);
    if (dataPage == 1) {
        $('.previous_page').attr('disabled', true);
    }

    $.getJSON("shared/get-market-watch-data/",
        {
            'board': board,
            'instr': instr, 'sector': sector,
            'type': market_type, 'category': category,
            'select_board': select_board, 'symbol': symbol,
            'page': dataPage,
            'limit': dataLimit,
            'sort_type': sortingOrder,
            'col_name': sortingColumnName
        }, function (data) {
            if (board == 'BLOCK') {
                isBlockGsecButtonClicked = true;
                $('.screener_table').hide();
                $('.gsec_table').hide();
                $('.block_table').show();
                $(".block_table tbody tr").remove();
                $(".block_table tbody td").remove();
                $('#market_watch_screener_dropdown').hide();
                $('#mw_block_table_dropdown').show();
                $('#mw_gsec_table_dropdown').hide();
                build_block_table(block_table, data);
                if (data.block_ltp_list.length < dataLimit) {
                    $('.next_page').attr('disabled', true);
                }
            }
            else if (board == 'YIELDDBT') {
                isBlockGsecButtonClicked = true;
                $('.screener_table').hide();
                $('.gsec_table').show();
                $('.block_table').hide();
                $(".gsec_table tbody tr").remove();
                $(".gsec_table tbody td").remove();
                // $('.gsec_table tbody tr').show();
                $('#market_watch_screener_dropdown').hide();
                $('#mw_block_table_dropdown').hide();
                $('#mw_gsec_table_dropdown').show();
                build_gsec_table(gsec_table, data);
                if (data.gsec_ltp_list.length < dataLimit) {
                    $('.next_page').attr('disabled', true);
                }
            }
            else {
                isBlockGsecButtonClicked = false;
                $('.screener_table').show();
                $('.gsec_table').hide();
                $('.block_table').hide();
                $(".screener_table tbody tr").remove();
                $(".screener_table tbody td").remove();
                $('#market_watch_screener_dropdown').show();
                $('#mw_block_table_dropdown').hide();
                $('#mw_gsec_table_dropdown').hide();
                isButtonClicked = true;
                lastChangedSelect = "";
                build_screener_table(screener_table, data);
                if (data.ltp_query_data.length < dataLimit) {
                    $('.next_page').attr('disabled', true);
                }
            }

        });

}

$('.screener_sort').click(function (e) {
    e.preventDefault();
    $('#marketwatch_symbol').val('');
    $('.screener_sort').removeClass('widget-btn-active');
    $(this).toggleClass('widget-btn-active');
    var board = $(this).length > 0 ? $(this).attr('value') : null;
    if (board == 'YIELDDBT') {
        $('#select_board').hide();
        $('#filter_sector').hide();
        $('#filter_category').hide();
        $('#select_symbol_board_watch').hide();
    }
    else {
        $('#select_board').show();
        $('#filter_sector').show();
        $('#filter_category').show();
        $('#select_symbol_board_watch').show();
    }
    sortingOrder = "ASC";
    sortingColumnName = null;
    dataPage = 1;
    getSymbolData();
});

function build_screener_table(screener_table, data) {
    var color_class = '';
    var open_color = '';
    var pos_neg = '';

    load_items();

    var sentinel = document.createElement('td');
    sentinel.classList.add('sentinel');
    screener_table.appendChild(sentinel);

    function load_items() { 
        marketwatch_StateLoad('market_watch_screener');
        marketwatch_StateSave('market_watch_screener');

        data.ltp_query_data.forEach(item => {
            symbol = item?.symbol;
            board = item?.board;
            symname = symbol + board;
            sym_board = symbol + "." + board;

            company_name = item?.company_name.toUpperCase();
            category = item?.symbol_category;
            symbol_type = item?.symbol_instr;
            market_type = item?.market_type;
            sector = item?.sector;

            ltp = item?.ltp == null ? '-' : parseFloat(item?.ltp);
            ycp = item?.ycp == null ? '-' : parseFloat(item?.ycp);
            change = item?.ltp_change == null ? '-' : parseFloat(item?.ltp_change);
            changeper = item?.ltp_changeper == null ? '-' : parseFloat(item?.ltp_changeper);
            lastqty = item?.last_qty == null ? '-' : item?.last_qty;
            lastyield = item?.last_yield == null ? '-' : item?.last_yield;

            high = item.high ?? '-';
            low = item.low ?? '-';
            open_price = item.open ?? '-';
            close_price = item.close_price ?? '-';

            vol = item?.total_qty == null ? '-' : Number(item?.total_qty).toLocaleString("en-IN");
            trade = item?.total_trades == null ? '-' : Number(item?.total_trades).toLocaleString("en-IN");
            value = item?.total_value == null ? '-' : parseFloat(item?.total_value);

            var value_tag = '';
            if (item?.total_value != null) {
                if (value > 10000000) {
                    value = value / 10000000;
                    value_tag = 'cr';
                }
                value = Number(value).toLocaleString("en-IN");
            }

            bidq = item?.bid_qty == null || item?.bid_qty == 0 ? '-' : Number(item?.bid_qty).toLocaleString("en-IN");
            askq = item?.ask_qty == null || item?.ask_qty == 0 ? '-' : Number(item?.ask_qty).toLocaleString("en-IN");
            bidp = item?.bid_price == null || item?.bid_price == 0 ? '-' : parseFloat(item?.bid_price);
            askp = item?.ask_price == null || item?.ask_price == 0 ? '-' : parseFloat(item?.ask_price);

            if (change > 0) {
                color_class = 'up';
                pos_neg = '+';
            } else if (change < 0) {
                color_class = 'down';
                pos_neg = '';
            } else {
                color_class = 'neutral';
                pos_neg = '';
            }

            row = screener_table.insertRow();
            row.setAttribute("class", "scrsym protected ");
            row.style.textAlign = 'right';
            row.setAttribute("data-id", sym_board);  
            
            let headers = document.getElementById('market_watch_screener')?.getElementsByTagName("th");
            let rowHTML = '';
            
            let alert_icon = item.alert == true ? '<i class="fa fa-bell text-warning" style="font-size: x-small;"></i>' : '';

            for (let i = 0; i < headers.length; i++) {
                if (headers[i].className) {
                    switch (headers[i].className) {
                        case 'mw_screener_symbol mwatch_table_th':
                            rowHTML += `
                                <td class="mw_screener_symbol">
                                   <div align="left" data-symbol="${sym_board}" class="symbtn">${symbol} ${alert_icon}</div>
                                </td>`;
                            break;
                        case 'mw_screener_cn mwatch_table_th':
                            rowHTML += `
                                <td class="mw_screener_cn">
                                    <div align="left">${company_name}</div>
                                </td>`;
                            break;
                        case 'mw_screener_sector mwatch_table_th':
                            rowHTML += `
                                <td class="mw_screener_sector">
                                    <div align="left">${sector}</div>
                                </td>`;
                            break;
                        case 'mw_screener_category mwatch_table_th':
                            rowHTML += `
                                <td class="mw_screener_category">
                                    <div align="center">${category}</div>
                                </td>`;
                            break;
                        case 'mw_screener_ltp ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_ltp">
                                    <div class="${symname}_ltp ${color_class}">${ltp}</div>
                                </td>`;
                            break;
                        case 'mw_screener_cp ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_cp">
                                    <div class="${symname}_cp">${close_price}</div>
                                </td>`;
                            break;
                        case 'mw_screener_ycp ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_ycp">
                                    <div class="${symname}_ycp">${ycp}</div>
                                </td>`;
                            break;
                        case 'mw_screener_vol ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_vol">
                                    <div class="${symname}_vol">${vol}</div>
                                </td>`;
                            break;
                        case 'mw_screener_chg ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_chg">
                                    <div class="${symname}_chg ${color_class}">${pos_neg}${change}</div>
                                </td>`;
                            break;
                        case 'mw_screener_pchg ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_pchg">
                                    <div class="${symname}_chgper ${color_class}">${pos_neg}${changeper}%</div>
                                </td>`;
                            break;
                        case 'mw_screener_bqty ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_bqty">
                                    <div class="${symname}_bidq mwatch_bid_bg">${bidq}</div>
                                </td>`;
                            break;
                        case 'mw_screener_bid ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_bid">
                                    <div class="${symname}_bid mwatch_bid_bg">${bidp}</div>
                                </td>`;
                            break;
                        case 'mw_screener_ask ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_ask">
                                    <div class="${symname}_ask mwatch_ask_bg">${askp}</div>
                                </td>`;
                            break;
                        case 'mw_screener_aqty ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_aqty">
                                    <div class="${symname}_askq mwatch_ask_bg">${askq}</div>
                                </td>`;
                            break;
                        case 'mw_screener_trades ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_trades">
                                    <div class="${symname}_trade">${trade}</div>
                                </td>`;
                            break;
                        case 'mw_screener_turnover ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_turnover">
                                    <div class="${symname}_turnover">${value}${value_tag}</div>
                                </td>`;
                            break;
                        case 'mw_screener_open ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_open ${open_color}">
                                    <div class="${symname}_open">${open_price}</div>
                                </td>`;
                            break;
                        case 'mw_screener_high ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_high">
                                    <div class="${symname}_high">${high}</div>
                                </td>`;
                            break;
                        case 'mw_screener_low ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_screener_low">
                                    <div class="${symname}_low">${low}</div>
                                </td>`;
                            break;
                        default:
                            rowHTML += `<td><div class="">-</div></td>`;
                            break;
                    }
                }
            }
            
            row.innerHTML = rowHTML; 
            screener_table.insertBefore(row, sentinel);
        });
        
        function moveColumn(table, sourceIndex, targetIndex) {
            var body = $("tbody", table);
            $("tr", body).each(function (i, row) {
                if (sourceIndex < targetIndex) { 
                    $("td", row).eq(sourceIndex).insertAfter($("td", row).eq(targetIndex));   // Dragging from left to right
                } else { 
                    $("td", row).eq(sourceIndex).insertBefore($("td", row).eq(targetIndex));  // Dragging from right to left
                }
            });
        }

       // For drag and drop action for column
        $("#market_watch_screener"+ ">" + "thead" + ">" + "tr").sortable({
            items: "> th:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4))",
            delay: 300,
            start: function(event, ui) {
                ui.item.data("source", ui.item.index());
                ui.placeholder.html(ui.item.html());
            },
            update: function(event, ui) {
                moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index()); 
                marketwatch_StateSave('market_watch_screener');
            }, 
            placeholder: "ui-state-highlight"
        });

        hideShowTableColFromLocal("market_watch_screener");
    }

} 

function build_block_table(block_table, data) {
    var color_class = '';
    var open_color = '';
    var pos_neg = '';
    var items_per_load = 18;

    load_items(0, items_per_load);

    var sentinel = document.createElement('td');
    sentinel.classList.add('sentinel');
    block_table.appendChild(sentinel);
    function load_items() { 
        marketwatch_StateLoad('mw_block_table');
        marketwatch_StateSave('mw_block_table');

        data.block_ltp_list.forEach(item => {
            symbol = item?.symbol;
            board = item?.board;
            symname = symbol + board;
            sym_board = symbol + "." + board;

            company_name = item?.company_name.toUpperCase();
            category = item?.symbol_category;
            symbol_type = item?.symbol_instr;
            market_type = item?.market_type;
            sector = item?.sector;

            ltp = item?.ltp == null ? '-' : parseFloat(item?.ltp);
            ycp = item?.ycp == null ? '-' : parseFloat(item?.ycp);
            change = item?.ltp_change == null ? '-' : parseFloat(item?.ltp_change);
            changeper = item?.ltp_changeper == null ? '-' : parseFloat(item?.ltp_changeper);
            lastqty = item?.last_qty == null ? '-' : item?.last_qty;
            lastyield = item?.last_yield == null ? '-' : item?.last_yield;

            high = item.high ?? '-';
            low = item.low ?? '-';
            open_price = item.open ?? '-';
            close_price = item.close_price ?? '-';

            vol = item?.total_qty == null ? '-' : Number(item?.total_qty).toLocaleString("en-IN");
            trade = item?.total_trades == null ? '-' : Number(item?.total_trades).toLocaleString("en-IN");
            value = item?.total_value == null ? '-' : parseFloat(item?.total_value);

            var value_tag = '';
            if (item?.total_value != null) {
                if (value > 10000000) {
                    value = value / 10000000;
                    value_tag = 'cr';
                }
                value = Number(value).toLocaleString("en-IN");
            }

            if (change > 0) {
                color_class = 'up';
                pos_neg = '+';
            } else if (change < 0) {
                color_class = 'down';
                pos_neg = '';
            } else {
                color_class = 'neutral';
                pos_neg = '';
            }

            row = block_table.insertRow();
            row.setAttribute("class", "scrsym protected ");
            row.style.textAlign = 'right';
            row.setAttribute("data-id", sym_board); 

            let headers = document.getElementById('mw_block_table')?.getElementsByTagName("th");
            let rowHTML = '';
            let alert_icon = item.alert == true ? '<i class="fa fa-bell text-warning" style="font-size: x-small;"></i>' : '';
          
            for (let i = 0; i < headers.length; i++) {
                if (headers[i].className) {
                    switch (headers[i].className) {
                        case 'mw_block_symbol mwatch_table_th':
                            rowHTML += `
                                <td class="mw_block_symbol">
                                    <div align="left" data-symbol="${sym_board}" class="symbtn">${symbol} ${alert_icon}</div>
                                </td>`;
                            break;
                        case 'mw_block_cn mwatch_table_th':
                            rowHTML += `
                                <td class="mw_block_cn">
                                    <div align="left">${company_name}</div>
                                </td>`;
                            break;
                        case 'mw_block_sector mwatch_table_th':
                            rowHTML += `
                                <td class="mw_block_sector">
                                    <div align="left">${sector}</div>
                                </td>`;
                            break;
                        case 'mw_block_category mwatch_table_th':
                            rowHTML += `
                                <td class="mw_block_category">
                                    <div align="center">${category}</div>
                                </td>`;
                            break;
                        case 'mw_block_ltp ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_ltp">
                                    <div class="${symname}_ltp ${color_class}">${ltp}</div>
                                </td>`;
                            break;
                        case 'mw_block_cp ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_cp">
                                    <div class="${symname}_cp">${close_price}</div>
                                </td>`;
                            break;
                        case 'mw_block_min_price ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_min_price">
                                    <div class="${symname}_low">${low}</div>
                                </td>`;
                            break;
                        case 'mw_block_max_price ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_max_price">
                                    <div class="${symname}_high">${high}</div>
                                </td>`;
                            break;
                        case 'mw_block_max_trades ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_max_trades">
                                    <div class="${symname}_trade">${trade}</div>
                                </td>`;
                            break;
                        case 'mw_block_qty ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_qty">
                                    <div class="${symname}_vol">${vol}</div>
                                </td>`;
                            break;
                        case 'mw_block_value ui-sortable-handle':
                            rowHTML += `
                                <td class="mw_block_value">
                                    <div class="${symname}_turnover">${value} ${value_tag}</div>
                                </td>`;
                            break;
                        default:
                            rowHTML += `<td><div class="">-</div></td>`;
                            break;
                    }
                }
            }
            
            row.innerHTML = rowHTML;
         
            block_table.insertBefore(row, sentinel);
        });

        function moveColumn(table, sourceIndex, targetIndex) {
            var body = $("tbody", table);
            $("tr", body).each(function (i, row) {
                if (sourceIndex < targetIndex) { 
                    $("td", row).eq(sourceIndex).insertAfter($("td", row).eq(targetIndex));   // Dragging from left to right
                } else { 
                    $("td", row).eq(sourceIndex).insertBefore($("td", row).eq(targetIndex));  // Dragging from right to left
                }
            });
        }

       // For drag and drop action for column
        $("#mw_block_table"+ ">" + "thead" + ">" + "tr").sortable({
            items: "> th:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4))",
            delay: 300,
            start: function(event, ui) {
                ui.item.data("source", ui.item.index());
                ui.placeholder.html(ui.item.html());
            },
            update: function(event, ui) {
                moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index()); 
                marketwatch_StateSave('mw_block_table');
            }, 
            placeholder: "ui-state-highlight"
        });

        hideShowTableColFromLocal("mw_block_table");
    }
}

function build_gsec_table(gsec_table, data) {
    var color_class = '';
    var open_color = '';
    var pos_neg = '';
    var items_per_load = 18;

    load_items();

    var sentinel = document.createElement('td');
    sentinel.classList.add('sentinel');
    gsec_table.appendChild(sentinel);

    function load_items() { 
        marketwatch_StateLoad('mw_gsec_table');
        marketwatch_StateSave('mw_gsec_table');

        data.gsec_ltp_list.forEach(item => {
            symbol = item?.symbol;
            board = item?.board;
            symname = symbol + board;
            sym_board = symbol + "." + board;

            company_name = item?.company_name.toUpperCase();
            category = item?.symbol_category;
            symbol_type = item?.symbol_instr;
            market_type = item?.market_type;
            sector = item?.sector;

            ltp = item?.ltp == null ? '-' : parseFloat(item?.ltp);
            ycp = item?.ycp == null ? '-' : parseFloat(item?.ycp);
            change = item?.ltp_change == null ? '-' : parseFloat(item?.ltp_change);
            changeper = item?.ltp_changeper == null ? '-' : parseFloat(item?.ltp_changeper);
            lastqty = item?.last_qty == null ? '-' : item?.last_qty;
            lastyield = item?.last_yield == null ? '-' : item?.last_yield;
            coupon_rate = item?.coupon_rate;
            gsec_yield = item?.gsec_yield;
            high = item.high ?? '-';
            low = item.low ?? '-';
            open_price = item.open ?? '-';
            close_price = item.close_price ?? '-';

            vol = item?.total_qty == null ? '-' : Number(item?.total_qty).toLocaleString("en-IN");
            trade = item?.total_trades == null ? '-' : Number(item?.total_trades).toLocaleString("en-IN");
            value = item?.total_value == null ? '-' : parseFloat(item?.total_value);

            var value_tag = '';
            if (item?.total_value != null) {
                if (value > 10000000) {
                    value = value / 10000000;
                    value_tag = 'cr';
                }
                value = Number(value).toLocaleString("en-IN");
            }

            bidq = item?.bid_qty == null || item?.bid_qty == 0 ? '-' : Number(item?.bid_qty).toLocaleString("en-IN");
            askq = item?.ask_qty == null || item?.ask_qty == 0 ? '-' : Number(item?.ask_qty).toLocaleString("en-IN");
            bidp = item?.bid_price == null || item?.bid_price == 0 ? '-' : parseFloat(item?.bid_price);
            askp = item?.ask_price == null || item?.ask_price == 0 ? '-' : parseFloat(item?.ask_price);

            if (change > 0) {
                color_class = 'up';
                pos_neg = '+';
            } else if (change < 0) {
                color_class = 'down';
                pos_neg = '';
            } else {
                color_class = 'neutral';
                pos_neg = '';
            }

            row = gsec_table.insertRow();
            row.setAttribute("class", "scrsym protected ");
            row.style.textAlign = 'right';
            row.setAttribute("data-id", sym_board); 

            let alert_icon = item.alert == true ? '<i class="fa fa-bell text-warning" style="font-size: x-small;"></i>' : '';

            row.innerHTML = `
                    <td class="mw_gsec_table-col-1">
                        <div align="left" data-symbol="${sym_board}" class="symbtn">${symbol} ${alert_icon}</div>
                    </td>
                    <td class="mw_gsec_table-col-2">
                        <div align="left">${company_name}</div>
                    </td>
                    <td class="mw_gsec_table-col-3">
                        <div  align="left">${sector}</div>
                    </td>
                    <td class="mw_gsec_table-col-4">
                        <div align="left">${category}</div>
                    </td>
                    <td class="mw_gsec_table-col-5">
                        <div >${coupon_rate}%</div>
                    </td>
                    <td class="mw_gsec_table-col-6">
                        <div >${gsec_yield}%</div>
                    </td>
                    <td class="mw_gsec_table-col-7">
                        <div class="${symname}_ltp  ${color_class}">${ltp}</div>
                    </td>
                    <td class="mw_gsec_table-col-8">
                        <div class="${symname}_cp ">${close_price}</div>
                    </td>
                    <td class="mw_gsec_table-col-9">
                        <div class="${symname}_ycp ">${ycp}</div>
                    </td>
                    <td class="mw_gsec_table-col-10">
                        <div class="${symname}_vol ">${vol}</div>
                    </td>
                    <td class="mw_gsec_table-col-11">
                        <div class="${symname}_chg  ${color_class}">${pos_neg} ${change}</div>
                    </td>
                    <td class="mw_gsec_table-col-12">
                        <div class="${symname}_chgper  ${color_class}">${pos_neg} ${changeper}%</div>
                    </td>
                    <td class="mw_gsec_table-col-13">
                        <div class="${symname}_bidq mwatch_bid_bg">${bidq}</div>
                    </td>
                    <td class="mw_gsec_table-col-14">
                        <div class="${symname}_bid mwatch_bid_bg">${bidp}</div>
                    </td>
                    <td class="mw_gsec_table-col-15">
                        <div class="${symname}_ask mwatch_ask_bg">${askp}</div>
                    </td> 
                    <td class="mw_gsec_table-col-16">
                        <div class="${symname}_askq mwatch_ask_bg">${askq}</div>
                    </td>
                    <td class="mw_gsec_table-col-17">
                        <div class="${symname}_trade ">${trade}</div>
                    </td>
                    <td class="mw_gsec_table-col-18">
                        <div class="${symname}_turnover ">${value} ${value_tag}</div>
                    </td>
                    <td class="mw_gsec_table-col-19">
                        <div class="${symname}_open  ${open_color}">${open_price}</div>
                    </td>
                    <td class="mw_gsec_table-col-20">
                        <div class="${symname}_high ">${high}</div>
                    </td>
                    <td class="mw_gsec_table-col-21">
                        <div class="${symname}_low ">${low}</div>
                    </td>
            `
            gsec_table.insertBefore(row, sentinel);
        }); 

        function moveColumn(table, sourceIndex, targetIndex) {
            var body = $("tbody", table);
            $("tr", body).each(function (i, row) {
                if (sourceIndex < targetIndex) { 
                    $("td", row).eq(sourceIndex).insertAfter($("td", row).eq(targetIndex));   // Dragging from left to right
                } else { 
                    $("td", row).eq(sourceIndex).insertBefore($("td", row).eq(targetIndex));  // Dragging from right to left
                }
            });
        }

       // For drag and drop action for column
        $("#mw_gsec_table"+ ">" + "thead" + ">" + "tr").sortable({
            items: "> th:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4))",
            delay: 300,
            start: function(event, ui) {
                ui.item.data("source", ui.item.index());
                ui.placeholder.html(ui.item.html());
            },
            update: function(event, ui) {
                moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index()); 
                marketwatch_StateSave('mw_gsec_table');
            }, 
            placeholder: "ui-state-highlight"
        });

        hideShowTableColFromLocal("mw_gsec_table");
    }
}

function marketwatch_StateSave(table_id) {
    const headersData = Array.from($(`#${table_id} thead th`), th => ({
        headerText: $(th).text().trim()
    }));  
    localStorage.setItem(`${system_username}_${profile_page}_${pid}_${table_id}`, JSON.stringify(headersData));
} 

function marketwatch_StateLoad(table_id) {
    let old_headers = document.getElementById(table_id).getElementsByTagName("th"); 
    var new_headers = localStorage.getItem(`${system_username}_${profile_page}_${pid}_${table_id}`);

    if (new_headers) {
        new_headers = JSON.parse(new_headers);
        var table = document.getElementById(table_id);
        var headerRow = table.tHead.getElementsByTagName("tr")[0]; 
        
        new_headers.forEach(function (item, index) {
            const headerText = item.headerText;
            var th = Array.from(old_headers).find(header => header.innerHTML === headerText);
            if (th) {
                headerRow.appendChild(th);
            }
        });
    }
}  

//Hide and Show From Local
function hideShowTableColFromLocal(table_id) {
    var storedColumnNames = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];

    if (table_id == 'market_watch_screener') {
        var colCheckboxes = document.querySelectorAll(".col-checkbox");
    }
    else if (table_id == 'mw_block_table') {
        var colCheckboxes = document.querySelectorAll(".mw_block_col-checkbox");
    }
    else {
        var colCheckboxes = document.querySelectorAll(".mw_gsec_col-checkbox");
    }

    colCheckboxes.forEach((element) => {
        var colName = element.getAttribute("data-col");
        if (storedColumnNames.includes(element.value)) {
            var isChecked = element.checked = false
            hideShowTableCol(colName, isChecked)
        }
    });
}

//Hide and Show functionality
function hideShowTableCol(colName, checked) {
    var cells = document.querySelectorAll(`.${colName}`);

    cells.forEach((cell) => {
        cell.style.display = checked ? "table-cell" : "none";
    });
}

function showHideTable(table_id) { 
    var columnNames = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];
    if (table_id == 'market_watch_screener') {
        var colCheckboxes = document.querySelectorAll(".col-checkbox");
    }
    else if (table_id == 'mw_block_table') {
        var colCheckboxes = document.querySelectorAll(".mw_block_col-checkbox");
    }
    else {
        var colCheckboxes = document.querySelectorAll(".mw_gsec_col-checkbox");
    }

    colCheckboxes.forEach((element) => {

        element.addEventListener("change", (event) => {

            var colName = element.getAttribute("data-col");
            var checked = event.target.checked;

            if (checked) {
                columnNames = columnNames.filter(
                    (columnName) => columnName !== element.value);
            }

            else {
                columnNames.push(element.value);
            }
            hideShowTableCol(colName, checked);
            localStorage.setItem(system_username + '_' + table_id, JSON.stringify(columnNames));
        });

    });

    hideShowTableColFromLocal(table_id);

} 

var toggleSortingOrder = () => {
    sortingOrder = sortingOrder === 'ASC' ? 'DESC' : 'ASC';
};

headerCellsScreener.forEach((cell) => {

    cell.addEventListener('click', () => {
        toggleSortingOrder();
        sortingColumnName = cell.getAttribute('data-sort');
        dataPage = 1;
        getSymbolData();

    });
});



headerCellsBLock.forEach((cell) => {
    cell.addEventListener('click', () => {
        toggleSortingOrder();
        sortingColumnName = cell.getAttribute('data-sort');
        dataPage = 1;
        getSymbolData();
    });
});

headerCellsGSEC.forEach((cell) => {

    cell.addEventListener('click', () => {
        toggleSortingOrder();
        sortingColumnName = cell.getAttribute('data-sort');
        dataPage = 1;
        getSymbolData();
    });
}); 
 
//Context Menu for Market Watch
$.contextMenu({
    selector: '.scrsym', 
    autoHide: true,
    zIndex: 10000,
    callback: function(key, op) {
        // Call your existing context menu logic
        var order_symbol = op.$trigger.data('id');
        var last_selected_client_code = window.localStorage.getItem('last_selected_client_code');
        switch(key){
            case "buy": 
                if(last_selected_client_code) {

                    $('#order_client_code').val(last_selected_client_code);
                }
                else {
            
                    $('#order_client_code').focus();
                }
                $("#order_instrument").val(order_symbol).trigger('change'); 
                buy_window(); 
                break;
            case "sell": 
                if(last_selected_client_code) {

                    $('#order_client_code').val(last_selected_client_code);
                }
                else {
            
                    $('#order_client_code').focus();
                }
                $("#order_instrument").val(order_symbol).trigger('change'); 
                sell_window(); 
                break;
            case "timesale": time_sale_window(order_symbol); break;
            case "pricetable": showPriceTableWidget(order_symbol); break;
            case "setalert": 
                show_alert_window(order_symbol);
                break;
            case "chart": 
                showChart(order_symbol);
                break;
            case "info": showQuote(order_symbol); break;
            case "news":
                showNews(order_symbol);
                break;
            default: 
                None
        }

        
        
    },
    items: {
        "buy": { name: "BUY", icon: "fa-arrow-up" },
        "sell": { name: "SELL", icon: "fa-arrow-down" },
        "timesale": { name: "Time & Sale", icon: "fa-clock-o" },
        "pricetable": { name: "Historical Volume", icon: "fa-database", className: "contextmenu-padding" },
        "chart":{name: "Chart", icon: "fa-line-chart", className: "contextmenu-padding"},
        "info": { name: "Info", icon: "fa-info" },
        "news": { name: " News", icon: "fa-newspaper-o", className: "contextmenu-padding" },
        "setalert": {name: "Set Alert", icon: "fa-bell", className: "contextmenu-padding"},
    }
});
