var ignorewatchlist = ['BOND (Public)' , 'SC', 'ATB', 'BOND (Government)', 'SPOT Mkt', 'BLOCK', 'zcategory' , 'Portfolio', 'Suspend'];
var pid_selected = document.querySelector("#profile li.profile-selected-li");
var pid = pid_selected?.getAttribute("data-value");
var isColumnDragging = false;

function selectOption() {
    $('.watchlist_table').each(function() {
        let exist_table_id = $(this).attr('id');
        let old_headers = document.getElementById(exist_table_id).getElementsByTagName("th");
        let sorted_val = $('input[name="sorting_' + exist_table_id + '"]:checked').val();
        
        if (sorted_val && sorted_val !== 'OFF') {
            let [order, col, exchg] = sorted_val.split(' ');

            if (exchg) {
                col = `${col}.${exchg}`; 
            }

            let th = Array.from(old_headers).find(header => header.innerHTML.trim() == col);
            if (th) {
                let thClass = th.classList[0];
                sortTable(exist_table_id, thClass, order.toLowerCase());
            }
        }
    });
}

function change_watchlist_sorting(sorting_val, elem_id) {
    let watchlist_id = elem_id.replace('selected_val_', '').replace('add_', '').replace(/\s+/g, '');
    let old_headers = document.getElementById(watchlist_id).getElementsByTagName("th");

    if (sorting_val == 'OFF') {
        localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting');
        Array.from(old_headers).forEach(th => th.removeAttribute('data-sorted'));
    } else {
        localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting', sorting_val);
        let [order, col, exchg] = sorting_val.split(' ');

        if (exchg) {
            col = `${col}.${exchg}`; 
        }

        let th = Array.from(old_headers).find(header => header.innerHTML.trim() == col);
        if (th) {
            let thClass = th.classList[0];
            sortTable(watchlist_id, thClass, order.toLowerCase());
        }
    }
}

// Event listener for radio buttons
$(document).on('change', '.sorting-radio-group input[type="radio"]', function() {
    change_watchlist_sorting($(this).val(), $(this).closest('.sorting-radio-group').attr('id'));
});

// Create New Watchlist
function create_watchlist(element_id) {
    var table_id = element_id.replace('create_', '').replace(/\s+/g, '');
    var modal = $("#main-page-modal");
    var pageLoader = $('#page-loading-indicator').html();
    var url = "portfolio/add_watchlist/" + table_id;
    modal.modal({ show: true });
    modal.find('.modal-title').text('');
    modal.find('.modal-body').html(pageLoader).load(url);
}
// Remove Watchlist
function delete_watchlist(element_id) {
    var select_id = element_id.replace('remove_', '').replace(/\s+/g, '');
    var name = $('#select_' + select_id).val();
    
    if (ignorewatchlist.includes(name)) {
        show_flash_messages('Cannot delete default watchlist', 'danger');
        return;
    }

    $.confirm({
        title: 'Delete Confirmation',
        titleClass: 'text-center',
        content: `Are you sure you want to delete the watchlist "${name}"?`,
        typeAnimated: true,
        theme: 'dark',
        escapeKey: 'NO',
        buttons: {
            YES: {
                keys: ['enter'],
                btnClass: 'btn-danger',
                action: function () {
                    var url = '/shared/removewatchlist/';
                    $.get(url, { name: name })
                        .done(function (data) {
                            $('.user_watchlists option[value="' + name + '"]').remove();
                            show_flash_messages(data, 'success'); 
                            
                            var getOptions = $('#select_' + select_id)[0].options;
                            var first_options = getOptions[0]; // Get the first option
                            
                            $('#select_' + select_id).val(first_options?.value);
                            load_watchlist(first_options?.value, select_id);
                        })
                        .fail(function (data) {
                            show_flash_messages(data.responseText, 'danger');
                        });
                }
            },
            NO: {
                btnClass: 'btn-success',
                action: function () {
                    // User canceled the action
                }
            }
        }
    });
}

// Load Watchlist
function load_watchlist(wlname, element_id) { 
    if (wlname == null || wlname == undefined || wlname.length == 0 || wlname == '') {
        return;
    } 

    var table_id = element_id.replace('select_', '').replace('add_', '').replace(/\s+/g, '');
    var searchSymbol = $('#search_' + table_id).val();

    
    if (table_id !== null && table_id !== undefined) {
        showHideTableWatchlist(table_id); 
        localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + table_id + '_selected', wlname);

        let sorting_val = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + table_id + '_sorting');
        if (sorting_val) {
            $('#selected_val_' + table_id + ' input[value="' + sorting_val + '"]').prop('checked', true);
        } else {
            $('#selected_val_' + table_id + ' input[value="OFF"]').prop('checked', true);
            $('#'+table_id).find('th').removeAttr('data-sorted');
        }

        var name = wlname;
        var url = '/shared/viewwatchlist/';
        var table_tag = document.getElementById(table_id);
        if (table_tag !== null && table_tag !== undefined) {
            var table = table_tag.getElementsByTagName('tbody')[0];
            // $(table_tag).find('th').removeAttr('data-sorted');
        }

        if ($("#save_"+table_id).is(":visible")) {
            $("#save_"+table_id).hide();
        }

        var start = 1;  
        var pageSize = 31;  
        var isLessThenPageSize = false; 

        $("#" + table_id + " tbody tr").remove();

        function appendRow(wl_data) {
            tableStateLoad();
            tableStateSave(table_id);

            wl_data.symbol.forEach(function(symbol, i){
                let board = wl_data.board[i]; 
                let cse_board = wl_data.board[i];

                if(['DEBT','YIELDDBT','SPUBLIC','ATBPUB'].includes(cse_board)){
                    cse_board = 'PUBLIC'
                    }
                if(['SBLOCK'].includes(cse_board)){
                    cse_board = 'BLOCK'
                }  
   
                let symbol_board = symbol.replace(/[^a-zA-Z0-9\s-_]/g, '') + board;
                let cse_symbol_board = symbol.replace(/[^a-zA-Z0-9\s-_]/g, '') + cse_board;
                let symbol_dot_board = `${symbol}.${board}`;
 
                let change = wl_data?.ltp_change?.[i] && wl_data?.ltp_change?.[i] != 0 ? wl_data.ltp_change[i] : '0.0';
                let changeper = wl_data?.ltp_changeper?.[i] && wl_data?.ltp_changeper?.[i] != 0 ? wl_data.ltp_changeper[i] : '0.0';
               
                let high = wl_data?.high?.[i] && wl_data?.high?.[i] != 0 ? wl_data.high[i] : '-';                
                let low = wl_data?.low?.[i] && wl_data?.low?.[i] != 0 ? wl_data.low[i] : '-'; 
                let vol = wl_data?.total_qty?.[i] && wl_data?.total_qty?.[i] != 0 ? Number(wl_data.total_qty[i]).toLocaleString("en-IN") : '-';
                let trade = wl_data?.total_trades?.[i] && wl_data?.total_trades?.[i] != 0 ? wl_data.total_trades[i] : '-';
                let value = wl_data?.total_value?.[i] && wl_data?.total_value?.[i] != 0 ? Number(wl_data.total_value[i]).toLocaleString("en-IN") : '-';

                let ltp = wl_data?.ltp?.[i] && wl_data?.ltp?.[i] != 0 ? wl_data.ltp[i] : '-';
                let cp = wl_data?.close_price?.[i] && wl_data?.close_price?.[i] != 0 ? wl_data.close_price[i] : '-';
                let ycp = wl_data?.ycp?.[i] && wl_data?.ycp?.[i] != 0 ? wl_data.ycp[i] : '-';
                let yvol = wl_data?.yvol?.[i] && wl_data?.yvol?.[i] != 0 ? Number(wl_data.yvol[i]).toLocaleString("en-IN") : '-';
                let lastqty = wl_data?.last_qty?.[i] && wl_data?.last_qty?.[i] != 0 ? Number(wl_data.last_qty[i]).toLocaleString("en-IN") : '-';
 
                let bidq = wl_data?.bid_qty?.[i] && wl_data?.bid_qty?.[i] != 0 ? wl_data.bid_qty[i] : '-';
                let askq = wl_data?.ask_qty?.[i] && wl_data?.ask_qty?.[i] != 0 ? wl_data.ask_qty[i] : '-';
                let bidp = wl_data?.bid_price?.[i] && wl_data?.bid_price?.[i] != 0 ? wl_data.bid_price[i] : '-';
                let askp = wl_data?.ask_price?.[i] && wl_data?.ask_price?.[i] != 0 ? wl_data.ask_price[i] : '-';

                let buy_percentage = wl_data?.buy_percent?.[i];
                let sell_percentage = wl_data?.sell_percent?.[i];

                let dse_52w_hl = (wl_data?.h_52w?.[i] ?? '-') + ' / ' + (wl_data?.l_52w?.[i] ?? '-');
                let dse_26w_hl = (wl_data?.h_26w?.[i] ?? '-') + ' / ' + (wl_data?.l_26w?.[i] ?? '-');
                let dse_4w_hl = (wl_data?.h_4w?.[i] ?? '-') + ' / ' + (wl_data?.l_4w?.[i] ?? '-');
                let dse_2w_hl = (wl_data?.h_2w?.[i] ?? '-') + ' / ' + (wl_data?.l_2w?.[i] ?? '-');
                let dse_1w_hl = (wl_data?.h_w?.[i] ?? '-') + ' / ' + (wl_data?.l_w?.[i] ?? '-');

                let dse_1y_ch = (wl_data?.ch_52w?.[i] ?? '-');
                let dse_6m_ch = (wl_data?.ch_26w?.[i] ?? '-');
                let dse_1m_ch = (wl_data?.ch_4w?.[i] ?? '-');
                let dse_2w_ch = (wl_data?.ch_2w?.[i] ?? '-');
                let dse_1w_ch_val = (wl_data?.ch_w?.[i] ?? '-');

                let dse_1y_ch_per = (wl_data?.chp_52w?.[i] ?? '-');
                let dse_6m_ch_per = (wl_data?.chp_26w?.[i] ?? '-');
                let dse_1m_ch_per = (wl_data?.chp_4w?.[i] ?? '-');
                let dse_2w_ch_per = (wl_data?.chp_2w?.[i] ?? '-');
                let dse_1w_ch_val_per = (wl_data?.chp_w?.[i] ?? '-');
                
                //For CSE
                let cse_change = wl_data?.cse_ltp_change?.[i] && wl_data?.cse_ltp_change?.[i] != 0 ? wl_data.cse_ltp_change[i] : '0.0';
                let cse_changeper = wl_data?.cse_ltp_changeper?.[i] && wl_data?.cse_ltp_changeper?.[i] != 0 ? wl_data.cse_ltp_changeper[i] : '0.0';
                let vol_cse = wl_data?.cse_total_qty?.[i] && wl_data?.cse_total_qty?.[i] != 0 ? Number(wl_data.cse_total_qty[i]).toLocaleString("en-IN") : '-';
                let ltp_cse = wl_data?.cse_ltp?.[i] && wl_data?.cse_ltp?.[i] != 0 ? wl_data.cse_ltp[i] : '-';
                let bidq_cse = wl_data?.cse_bid_qty?.[i] && wl_data?.cse_bid_qty?.[i] != 0 ? wl_data.cse_bid_qty[i] : '-';
                let askq_cse = wl_data?.cse_ask_qty?.[i] && wl_data?.cse_ask_qty?.[i] != 0 ? wl_data.cse_ask_qty[i] : '-';
                let bidp_cse = wl_data?.cse_bid_price?.[i] && wl_data?.cse_bid_price?.[i] != 0 ? wl_data.cse_bid_price[i] : '-';
                let askp_cse = wl_data?.cse_ask_price?.[i] && wl_data?.cse_ask_price?.[i] != 0 ? wl_data.cse_ask_price[i] : '-';

                let cse_buy_percentage = wl_data?.cse_buy_percent?.[i];
                let cse_sell_percentage = wl_data?.cse_sell_percent?.[i];

                // For DSE
                let color_class_ch_1y = getColorClass(wl_data?.ch_52w?.[i] ?? 0);
                let color_class_ch_6m = getColorClass(wl_data?.ch_26w?.[i] ?? 0);
                let color_class_ch_1m = getColorClass(wl_data?.ch_4w?.[i] ?? 0);
                let color_class_ch_2w = getColorClass(wl_data?.ch_2w?.[i] ?? 0);
                let color_class_ch_w = getColorClass(wl_data?.ch_w?.[i] ?? 0);

                //For DSE
                let pos_neg = '';
                let color_class = '';
                let bg_class = '';

                //For CSE
                let pos_neg_cse = '';
                let color_class_cse = '';
                let bg_class_cse = '';

                //For DSE
                if (wl_data?.ltp_change?.[i] > 0) {
                    color_class = 'up';
                    pos_neg = '+';
                    bg_class = 'positive';
                }
                if (wl_data?.ltp_change?.[i] < 0) {
                    color_class = 'down';
                    pos_neg = '';
                    bg_class = 'negative';
                }
                if (wl_data?.ltp_change?.[i] == 0) {
                    color_class = 'neutral';
                    pos_neg = '';
                    bg_class = 'nochange';
                }

                //For CSE
                if (wl_data?.cse_ltp_change?.[i] > 0) {
                    color_class_cse = 'up';
                    pos_neg_cse = '+';
                    bg_class_cse = 'positive';
                }
                if (wl_data?.cse_ltp_change?.[i] < 0) {
                    color_class_cse = 'down';
                    pos_neg_cse = '';
                    bg_class_cse = 'negative';
                }
                if (wl_data?.cse_ltp_change?.[i] == 0) {
                    color_class_cse = 'neutral';
                    pos_neg_cse = '';
                    bg_class_cse = 'nochange';
                }
                
                let suspend = 'neutral';
                if (wl_data?.suspend?.[i] == true) {
                    suspend = 'down';
                }

                row = table.insertRow();
                row.classList.add("watchlist_ticker");
                row.classList.add(symbol_board);
                row.setAttribute("onclick", "watchlist_link(this)");
                row.setAttribute("data-symbol-context", symbol_dot_board);
                row.setAttribute("data-id", symbol_dot_board);
                row.style.textAlign = 'right';

                let headers = document.getElementById(table_id)?.getElementsByTagName("th");
                let rowHTML = '';
                
                let alert_icon = wl_data?.alert?.[i] == true ? '<i class="fa fa-bell text-warning" style="font-size: x-small;"></i>' : '';
                
                let marketBox = wl_data?.market_type?.[i] == 'S' ? '<span class="spot_box" title="SPOT">S</span>' : '';

                let events_52h = wl_data?.events?.[i]?.['52h'] ? `<span class="events_circle events_52h"></span>` : '';
                let events_52l = wl_data?.events?.[i]?.['52l'] ? `<span class="events_circle events_52l"></span>` : '';
                let events_dividend = wl_data?.events?.[i]?.['div'] ? `<span class="events_circle events_dividend"></span>` : '';
                let events_news = wl_data?.events?.[i]?.['news'] ? `<span class="events_circle events_news"></span>` : '';
                    
                // Tooltip creation logic
                let tooltipContent = `
                    ${wl_data?.events?.[i]?.['52h'] ? `<span class="tooltip-item">${wl_data.events[i]['52h']}</span>` : ''}
                    ${wl_data?.events?.[i]?.['52l'] ? `<span class="tooltip-item">${wl_data.events[i]['52l']}</span>` : ''}
                    ${wl_data?.events?.[i]?.['div'] ? `<span class="tooltip-item">${wl_data.events[i]['div']}</span>` : ''}
                    ${wl_data?.events?.[i]?.['news'] ? `<span class="tooltip-item">${wl_data.events[i]['news']}</span>` : ''}
                `;

                for (let i = 0; i < headers.length; i++) {
                    if (headers[i].className) { 
                        switch (headers[i].className) {
                            case `${table_id}-col-ac text-center`:
                                rowHTML += `
                                    <td class="${table_id}-col-ac text-center">
                                        <div data-symbol="${symbol_dot_board}" class="td-btn">
                                            <button onclick="remove_from_watchlist('${symbol_dot_board}', '${table_id}')" class="wlremove has-tooltip" title="Remove Stock"><i class="fa fa-times"></i></button>
                                        </div>
                                    </td>`;
                                break;
                            case `${table_id}-col-symbol text-left`:
                                rowHTML += `
                                    <td class="${table_id}-col-symbol text-left symbol-container-watchlist">
                                        <div align="left" data-symbol="${symbol_dot_board}" class="ticker_name ${suspend}" title="${symbol_dot_board}">
                                         ${symbol} ${marketBox} ${alert_icon} 
                                        </div>
                                        <div class="watchlist-tooltip"> 
                                            <span class="watchlist-dots">
                                                ${events_52h}  
                                                ${events_52l}  
                                                ${events_dividend} 
                                                ${events_news}
                                            </span>
                                            <div class="symbol-info-tooltip">${tooltipContent}</div>
                                        </div>
                                    </td>`;
                                break;
                            case `${table_id}-col-group text-center ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-group text-center ui-sortable-handle">
                                        <div class="">${wl_data?.symbol_category?.[i] ?? '-'}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ltp ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ltp ui-sortable-handle">
                                        <div class="${symbol_board}_ltp ${color_class} ">${ltp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ltp-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ltp-cse ui-sortable-handle">
                                        <div class="${cse_symbol_board}_ltp_cse ${color_class_cse} ">${ltp_cse}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-cp ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-cp ui-sortable-handle">
                                        <div class="${symbol_board}_close ">${cp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-bq ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-bq ui-sortable-handle left-right-pad-remove" title="${bidq}">
                                        <div class="${symbol_board}_bidq  watch_bid_bg">${bidq}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-bq-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-bq-cse ui-sortable-handle left-right-pad-remove" title="${bidq_cse}">
                                        <div class="${cse_symbol_board}_bidq_cse  watch_bid_bg">${bidq_cse}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-bid ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-bid ui-sortable-handle left-right-pad-remove">
                                        <div class="${symbol_board}_bid  watch_bid_bg">${bidp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-bid-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-bid-cse ui-sortable-handle left-right-pad-remove">
                                        <div class="${cse_symbol_board}_bid_cse  watch_bid_bg">${bidp_cse}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ask ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ask ui-sortable-handle left-right-pad-remove">
                                        <div class="${symbol_board}_ask  watch_ask_bg">${askp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ask-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ask-cse ui-sortable-handle left-right-pad-remove">
                                        <div class="${cse_symbol_board}_ask_cse  watch_ask_bg">${askp_cse}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-aq ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-aq ui-sortable-handle left-right-pad-remove" title="${askq}">
                                        <div class="${symbol_board}_askq  watch_ask_bg">${askq}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-aq-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-aq-cse ui-sortable-handle left-right-pad-remove" title="${askq_cse}">
                                        <div class="${cse_symbol_board}_askq_cse  watch_ask_bg">${askq_cse}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-high ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-high ui-sortable-handle">
                                        <div class="${symbol_board}_high ">${high}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-low ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-low ui-sortable-handle">
                                        <div class="${symbol_board}_low ">${low}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-vol text-center ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-vol ui-sortable-handle left-right-pad-remove" title="${vol}">
                                        <div class="progress watch-volume-progress-bar" style="width:115px; height: 1.6rem">
                                            <span class="total-volume_text ${symbol_board}_vol">${vol}</span>
                                            <div class="progress-bar ${symbol_board}_buy_per_mw" role="progressbar" style="background-color: var(--mwatch-buy-bg-color)!important; width:${sell_percentage}%;" aria-valuenow="${sell_percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                                            <div class="progress-bar ${symbol_board}_sell_per_mw" role="progressbar" style="background-color: var(--mwatch-sell-bg-color)!important;  width:${buy_percentage}%;" aria-valuenow="${buy_percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </td>`;
                                break;
                            case `${table_id}-col-vol-cse text-center ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-vol-cse ui-sortable-handle left-right-pad-remove" title="${vol_cse}"> 
                                        <div class="progress watch-volume-progress-bar" style="width:115px; height: 1.6rem">
                                            <span class="total-volume_text ${cse_symbol_board}_vol_cse">${vol_cse}</span>
                                            <div class="progress-bar ${cse_symbol_board}_buy_per_mw_cse" role="progressbar" style="background-color: var(--mwatch-buy-bg-color)!important; width:${cse_buy_percentage}%;" aria-valuenow="${cse_buy_percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                                            <div class="progress-bar ${cse_symbol_board}_sell_per_mw_cse" role="progressbar" style="background-color: var(--mwatch-sell-bg-color)!important; width:${cse_sell_percentage}%;" aria-valuenow="${cse_sell_percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </td>`;
                                break;
                            case `${table_id}-col-vol-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-vol-cse ui-sortable-handle" title="${vol_cse}">
                                        <div class="${cse_symbol_board}_vol_cse ">${vol_cse}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ycp ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ycp ui-sortable-handle">
                                        <div class="${symbol_board}_ycp ">${ycp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-yvol ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-yvol ui-sortable-handle" title="${yvol}">
                                        <div class="${symbol_board}_yvol ">${yvol}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-chg ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-chg ui-sortable-handle">
                                        <div class="${symbol_board}_chg ${color_class} ">${pos_neg}${change}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-pchg ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-pchg ui-sortable-handle">
                                        <div class="${symbol_board}_chgper ${color_class} ">${pos_neg}${changeper}%</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-chg-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-chg-cse ui-sortable-handle">
                                        <div class="${cse_symbol_board}_chg_cse ${color_class_cse} ">${pos_neg_cse}${cse_change}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-pchg-cse ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-pchg-cse ui-sortable-handle">
                                        <div class="${cse_symbol_board}_chgper_cse ${color_class_cse} ">${pos_neg_cse}${cse_changeper}%</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-lvol ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-lvol ui-sortable-handle">
                                        <div class="${symbol_board}_lastqty">${lastqty}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-52w-hl ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-52w-hl ui-sortable-handle">
                                        <div>${dse_52w_hl}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-26w-hl ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-26w-hl ui-sortable-handle">
                                        <div>${dse_26w_hl}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-4w-hl ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-4w-hl ui-sortable-handle">
                                        <div>${dse_4w_hl}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-2w-hl ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-2w-hl ui-sortable-handle">
                                        <div>${dse_2w_hl}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-1w-hl ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1w-hl ui-sortable-handle">
                                        <div>${dse_1w_hl}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-1y-ch ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1y-ch ui-sortable-handle ${color_class_ch_1y}" title="Till Yesterday">
                                        <div>${dse_1y_ch}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-6m-ch ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-6m-ch ui-sortable-handle ${color_class_ch_6m}" title="Till Yesterday">
                                        <div>${dse_6m_ch}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-1m-ch ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1m-ch ui-sortable-handle ${color_class_ch_1m}" title="Till Yesterday">
                                        <div>${dse_1m_ch}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-2w-ch ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-2w-ch ui-sortable-handle ${color_class_ch_2w}" title="Till Yesterday">
                                        <div>${dse_2w_ch}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-1w-ch ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1w-ch ui-sortable-handle ${color_class_ch_w}" title="Till Yesterday">
                                        <div>${dse_1w_ch_val}</div>
                                    </td>`;
                                break; 

                            case `${table_id}-col-1y-ch-per ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1y-ch-per ui-sortable-handle ${color_class_ch_1y}" title="Till Yesterday">
                                        <div>${dse_1y_ch_per}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-6m-ch-per ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-6m-ch-per ui-sortable-handle ${color_class_ch_6m}" title="Till Yesterday">
                                        <div>${dse_6m_ch_per}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-1m-ch-per ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1m-ch-per ui-sortable-handle ${color_class_ch_1m}" title="Till Yesterday">
                                        <div>${dse_1m_ch_per}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-2w-ch-per ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-2w-ch-per ui-sortable-handle ${color_class_ch_2w}" title="Till Yesterday">
                                        <div>${dse_2w_ch_per}</div>
                                    </td>`;
                                break; 
                            case `${table_id}-col-1w-ch-per ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-1w-ch-per ui-sortable-handle ${color_class_ch_w}" title="Till Yesterday">
                                        <div>${dse_1w_ch_val_per}</div>
                                    </td>`;
                                break; 
                            default:
                                rowHTML += `<td><div class="">-</div></td>`;
                                break;
                        }
                    }
                }
                row.innerHTML = rowHTML;

            })

            let compact_type = localStorage.getItem(`${system_username}_${pid}_${table_id}_compact_mode`) || 'OFF';
            if (compact_type == 'ON') { 
                $('#' + table_id).find('.watch-volume-progress-bar').removeAttr('style');
                $('#' + table_id).find('.watch-volume-progress-bar').css({'width': '115px', 'height': '0.8rem'});      
            }  

            let firstTooltipItem = $('.symbol-info-tooltip').find('.tooltip-item').first();
            if (firstTooltipItem.length) {
                firstTooltipItem.css('margin-top', compact_type == 'ON' ? '13px' : '7px');
            }

            $(".watchlist-symbol-context").on("contextmenu","tr", function() { 
                generateCommonContextArray(this, "watchlist");
            });
             
            if(!ignorewatchlist.includes(wlname)) {
                $("#" + table_id + " tbody").sortable({
                    cursor: "move",
                    delay: 300,
                    placeholder: "sortable-placeholder",
                    helper: function (e, tr) {
                        var $originals = tr.children();
                        var $helper = tr.clone();
                        $helper.children().each(function (index) {
                            // Set helper cell sizes to match the original sizes
                            $(this).width($originals.eq(index).width());
                        });
                        return $helper;
                    },
                    stop: function (event, ui) { 
                        // Save the new order after dragging and dropping
                        saveRowOrder(table_id);
                    }
                });
            }

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
            $("#" + table_id + ">" + "thead" + ">" + "tr").sortable({
                items: "> th:not(:nth-child(1)):not(:nth-child(2))",
                delay: 300,
                start: function(event, ui) {
                    isColumnDragging = true;
                    ui.item.data("source", ui.item.index());
                    ui.placeholder.html(ui.item.html());
                },
                update: function(event, ui) {
                    moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index()); 
                    tableStateSave(table_id);
                }, 
                stop: function(event, ui) {
                    setTimeout(function() {
                        isColumnDragging = false;
                    }, 0); 
                },
                placeholder: "ui-state-highlight"
            });
        }  

        function getColorClass(value) {
            if (value > 0) return 'up';
            if (value < 0) return 'down';
            return 'neutral';
        }
        
        function tableStateSave(table_id) {
            const headersData = Array.from($(`#${table_id} thead th`), th => ({
                headerText: $(th).text().trim()
            }));  
            localStorage.setItem(`${system_username}_${profile_page}_${pid}_${table_id}_watchlist`, JSON.stringify(headersData));
        } 

        function tableStateLoad() {
            let html_headers = document.getElementById(table_id).getElementsByTagName("th");
            let new_headers = localStorage.getItem(`${system_username}_${profile_page}_${pid}_${table_id}_watchlist`);
        
            // Create an array to hold the new headers
            let htmlHeadersArray = Array.from(html_headers); //html
        
            if (new_headers) {
                new_headers = JSON.parse(new_headers);
        
                var table = document.getElementById(table_id);
                var headerRow = table.tHead.getElementsByTagName("tr")[0];
        
                // Remove all existing headers from the DOM
                Array.from(headerRow.children).forEach(child => {
                    headerRow.removeChild(child);
                });
        
                // Add the saved headers in the saved order
                new_headers.forEach(function(item) {
                    const headerText = item.headerText;
        
                    // Find the matching header in the newHeadersArray
                    var th = htmlHeadersArray.find(header => header.innerHTML.trim() === headerText);
                    if (th) {
                        headerRow.appendChild(th);
        
                        // Remove the added header from the array
                        htmlHeadersArray = htmlHeadersArray.filter(header => header !== th);
                    }
                });
        
                // Append any remaining headers (newly added columns) at the end
                htmlHeadersArray.forEach(function(th) {
                    headerRow.appendChild(th);
                });
            }
        }
       
        var fetchController;
        // Function to fetch data
        function fetchData() {
            cancelFetch(); 

            var controller = new AbortController();
            fetchController = controller;
            
            $.ajax({
                url: url,
                data: {
                    name: name,
                    start: start,
                    pageSize: pageSize,
                    symbol: searchSymbol
                },
                dataType: 'json',
                method: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AbortController', controller.signal);
                },
                success: function(data) { 
                    appendRow(data);
                    // if (!ignorewatchlist.includes(wlname)) { 
                    //     saveRowOrder();
                    // } 
                    if(data.symbol.length < pageSize) {
                        isLessThenPageSize = true;
                    }
                   
                    hideShowTableColWatchlistFromLocal(table_id);
                    // auto_sorting_local(table_id)
                    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // Check if the request was cancelled
                    if (textStatus !== 'abort'){
                        // Handle the error
                        console.log('Error:', errorThrown);
                    }
                }
            });
        }
        
         // Event listener for scrolling within the table div
         var debounceScroll = debounce(function() { 
            let tableDiv = $("#" + table_id).closest('.lm_content')[0]; 
            if (tableDiv.scrollTop + tableDiv.clientHeight >= tableDiv.scrollHeight - 1) {   
                if ($("#" + table_id + ' tbody tr').length >= pageSize) { 
                    start += 1;
                    
                    if (!isLessThenPageSize) { 
                        fetchData();
                    }
                }
            }
        }, 100);
        
        $("#" + table_id).closest('.lm_content').scroll(debounceScroll);
        function debounce(func, delay) {
            let inDebounce;
            return function() {
                let context = this;
                let args = arguments;
                clearTimeout(inDebounce);
                inDebounce = setTimeout(function() {
                    func.apply(context, args);
                }, delay);
            }
        }

        // Function to cancel ongoing request if exists
        function cancelFetch() {
            if (fetchController) {
                fetchController.abort();
            }
        }
        
        // Initial data fetch
        if (wlname != undefined && wlname != "") {
            fetchData();
        }
    }    
}

document.addEventListener('click', function (event) {
    var clickedElement = event.target;
    var tables = document.querySelectorAll('.watchlist_table');

    // Check if the clicked element or its parent is part of the table
    var isPartOfTable = false;
    for (var table of tables) {
        if (table.contains(clickedElement)) {
            isPartOfTable = true;
            break;
        }
    }

    if (!isPartOfTable) {
        var rows = document.querySelectorAll('.watchlist_ticker');
        for (var row of rows) {
            row.classList.remove('clicked');
        }
    }
});

// Add symbol to watchlist
function add_to_watchlist(instrument, element_id) {
    var table_id = element_id.replace('add_', '');
    if (instrument != null) {
        var name = $('#select_' + table_id).val();
        if (name != null && name != '' && !ignorewatchlist.includes(name)) {
            var url = '/shared/addwatchlistitem/';
            $.get(url, { symbol: instrument, name: name })
                .done(function (data) {
                    show_flash_messages(data, 'success');
                    load_watchlist(name, table_id);
                })
                .fail(function (data) {
                    show_flash_messages(data.responseText, 'danger');
                });
        } else {
            show_flash_messages('You cannot add symbols to this watchlist', 'danger');
        }
    }
}

// Search symbol to watchlist
function search_to_watchlist(instrument, element_id) {
    var table_id = element_id.replace('search_', '');
    if (instrument != null) {
        var name = $('#select_' + table_id).val();
        load_watchlist(name, table_id);
    }
}

// Remove symbol from watchlist
function remove_from_watchlist(instrument, table_id) {
    if (instrument != null) {
        var name = $('#select_' + table_id).val();
        var url = '/shared/removewatchlistitem/';
        
        if (name != null && name != '' && !ignorewatchlist.includes(name)) {
            $.confirm({
                title: 'Remove Confirmation',
                titleClass: 'text-center',
                content: `Are you sure you want to remove "${instrument}" from the watchlist "${name}"?`,
                typeAnimated: true,
                theme: 'dark',
                escapeKey: 'NO',
                buttons: {
                    YES: {
                        keys: ['enter'],
                        btnClass: 'btn-danger',
                        action: function () {
                            $.get(url, { symbol: instrument, name: name })
                                .done(function (data) {
                                    show_flash_messages(data, 'success');
                                    load_watchlist(name, table_id);
                                })
                                .fail(function (data) {
                                    show_flash_messages(data.responseText, 'danger');
                                });
                        }
                    },
                    NO: {
                        btnClass: 'btn-success',
                        action: function () {
                            // User canceled the action
                        }
                    }
                }
            });
        } else {
            show_flash_messages('You cannot remove symbols from this watchlist', 'danger');
        }
    }
}

 
// Function to check the number of checked checkboxes
function checkMaxCheckedBoxes(table_id) {
    var wl_class = "." + table_id + "-col-checkbox";
    var colCheckboxes = document.querySelectorAll(wl_class);
    var checkedCount = 0;

    colCheckboxes.forEach((element) => {
        if (element.checked) {
            checkedCount++;
        }
    });

    if (checkedCount > 25) {
        show_flash_messages("You can only check a maximum of 25 checkboxes.", 'danger'); 
        return false;
    }
    return true;
}

// Hide and Show From Local
function hideShowTableColWatchlistFromLocal(table_id) {
    const storedColumnNames = getColumnNames(table_id);
    console.log(storedColumnNames)
    var wl_class = "." + table_id + "-col-checkbox";
    var colCheckboxes = document.querySelectorAll(wl_class);

    colCheckboxes.forEach((element) => {
        var colName = element.getAttribute("data-col");
        if (storedColumnNames.includes(element.value)) {
            let isChecked = element.checked = false
            hideShowTableColWatchlist(colName, isChecked);
        } else {
            console.log(element.value)
            let isChecked = element.checked = true;
            hideShowTableColWatchlist(colName, isChecked);
        }
    });
}

// Hide and Show functionality
function hideShowTableColWatchlist(colName, checked) {
    var cells = document.querySelectorAll(`.${colName}`);
    cells.forEach((cell) => {
        cell.style.display = checked ? "table-cell" : "none";
    });
}

 

// Function to initialize the table watchlist
function showHideTableWatchlist(table_id) {
    var tableId = document.getElementById(table_id);
    if (tableId !== null && tableId !== undefined) {
        var wl_class = "." + table_id + "-col-checkbox";
        var colCheckboxes = document.querySelectorAll(wl_class);

        colCheckboxes.forEach((element) => {
            element.addEventListener("change", (event) => { 

                 if (!checkMaxCheckedBoxes(table_id)) {
                    event.target.checked = false;
                    return;
                }

                var columnNames = getColumnNames(table_id);
                var colName = element.getAttribute("data-col");
                var checked = event.target.checked;

                if (checked) {

                    console.log(columnNames);

                    columnNames = columnNames.filter(
                        (columnName) => columnName !== element.value
                    );

                    console.log(columnNames);
                }
                else {
                    columnNames.push(element.value);
                }
                console.log(columnNames)
                hideShowTableColWatchlist(colName, checked);
                localStorage.setItem(system_username + '_' + table_id, JSON.stringify(columnNames));
            });
        });

        hideShowTableColWatchlistFromLocal(table_id);
    }
}

// Save button event listener
function column_save_watchlist(table_id){ 
    var wl_class = "." + table_id + "-col-checkbox";
    var colCheckboxes = document.querySelectorAll(wl_class);
    var columnNames = [];

    colCheckboxes.forEach((element) => {
        if (element.checked) {
            columnNames.push(element.value);
        }
    });

    if (columnNames.length > 25) {
        show_flash_messages("You can only check a maximum of 25 checkboxes.", 'danger');
        return;
    }

    localStorage.setItem(system_username + '_' + table_id, JSON.stringify(columnNames));
    show_flash_messages("Settings saved successfully!", 'success');
}
 

// const DEFAULT_HIDDEN_COLUMNS = [
//     "52WH/L", "26WH/L", "4WH/L", "2WH/L", "1WH/L", 
//     "1YCH", "6MCH", "1MCH", "2WCH", "1WCH", 
//     "1YCH%", "6MCH%", "1MCH%", "2WCH%", "1WCH%"
// ];

// // Fetch stored columns from localStorage and merge with defaults if needed
// function getColumnNames(table_id) {
//     let storedColumns = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];

//     console.log(storedColumns);
    
//     // Only process storedColumns if it has elements
//     if (storedColumns.length > 0) {

//         let filteredStoredColumns = storedColumns.filter(column => !DEFAULT_HIDDEN_COLUMNS.includes(column));

//         console.log(filteredStoredColumns);

//         return [...new Set([...DEFAULT_HIDDEN_COLUMNS, ...filteredStoredColumns])]; 
//     }

//     console.log(DEFAULT_HIDDEN_COLUMNS)
    
//     return DEFAULT_HIDDEN_COLUMNS;
// }

const DEFAULT_HIDDEN_COLUMNS = [
    "52WH/L", "26WH/L", "4WH/L", "2WH/L", "1WH/L", 
    "1YCH", "6MCH", "1MCH", "2WCH", "1WCH", 
    "1YCH%", "6MCH%", "1MCH%", "2WCH%", "1WCH%"
];

// Fetch stored columns from localStorage and merge with defaults if needed
function getColumnNames(table_id) {
    let storedColumns = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];

    console.log(storedColumns);

    if (storedColumns.length > 0) {
        // Filter storedColumns to exclude any default hidden columns
        let filteredStoredColumns = storedColumns.filter(column => !DEFAULT_HIDDEN_COLUMNS.includes(column));

        console.log(filteredStoredColumns);

        // Ensure that only present elements from DEFAULT_HIDDEN_COLUMNS are included
        let validHiddenColumns = DEFAULT_HIDDEN_COLUMNS.filter(column => storedColumns.includes(column));

        return [...new Set([...validHiddenColumns, ...filteredStoredColumns])];
    }

    console.log(DEFAULT_HIDDEN_COLUMNS);
    
    return DEFAULT_HIDDEN_COLUMNS;
}


// Hide and Show From Local
// function hideShowTableColWatchlistFromLocal(table_id) {
//     var storedColumnNames = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];
//     var wl_class = "." + table_id + "-col-checkbox";
//     var colCheckboxes = document.querySelectorAll(wl_class);

//     colCheckboxes.forEach((element) => {
//         var colName = element.getAttribute("data-col");
//         if (storedColumnNames.includes(element.value)) {
//             var isChecked = element.checked = false
//             hideShowTableColWatchlist(colName, isChecked)
//         }
//     });
// }

// //Hide and Show functionality
// function hideShowTableColWatchlist(colName, checked) {
//     var cells = document.querySelectorAll(`.${colName}`);
//     cells.forEach((cell) => {
//         cell.style.display = checked ? "table-cell" : "none";
//     });
// }


// function showHideTableWatchlist(table_id) {
//     var tableId = document.getElementById(table_id);
//     if (tableId !== null && tableId !== undefined) { 
//         var wl_class = "." + table_id + "-col-checkbox";
//         var colCheckboxes = document.querySelectorAll(wl_class);
//         colCheckboxes.forEach((element) => {

//             element.addEventListener("change", (event) => {
//                 var columnNames = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];

//                 var colName = element.getAttribute("data-col");
//                 var checked = event.target.checked;

//                 if (checked) {
//                     columnNames = columnNames.filter(
//                         (columnName) => columnName !== element.value
//                     );

//                 }

//                 else {
//                     columnNames.push(element.value);
//                 }
//                 hideShowTableColWatchlist(colName, checked);
//                 localStorage.setItem(system_username + '_' + table_id, JSON.stringify(columnNames));
//             });

//         });

//         hideShowTableColWatchlistFromLocal(table_id);
//     }
// }

function shortenBoardName(board) {
    const mapping = {
        "SPUBLIC": "SPUB",
        "SBLOCK": "SBL",
        "BLOCK": "BL",
        "PUBLIC": "PB",
        "BUYDBT": "BDBT",
        "BUYIN": "BIN",
        "SBUYIN": "SBIN",
        "ATBPUB": "ATBPB",
        "ATBDEBT": "ATBDBT",
        "INDEX": "IDX",
        "YIELDDBT": "YDBT",
        "ATBBUYIN": "ATBBIN",
        "DEBT": "DBT",
        "SCPX": "SCPX"

    };

    // Use ternary operator to return the shortened board or the original board
    return mapping[board] || board;
}

function sortTable(table_id, className, order = null) {

    if(className.includes('symbol')) {
        $("#save_"+table_id).show();
        localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + table_id + '_sorting');
        $('#' + table_id).find('th').not('.' + table_id + '-col-symbol').removeAttr('data-sorted');
        $('#selected_val_' + table_id + ' input[value="OFF"]').prop('checked', true);
    }
    else {
        $("#save_"+table_id).hide();
    }

    if (!isColumnDragging) {
        const table = $('#' + table_id);
        const rows = table.find('tbody tr').get();
        let currentOrder = order;

        if (!currentOrder) {
            const currentSort = table.find(`th.${className}`).attr('data-sorted');
            currentOrder = currentSort === "asc" ? "desc" : "asc";
        }

        rows.sort((a, b) => {
            const x = $(a).find(`.${className} div`).text().trim();
            const y = $(b).find(`.${className} div`).text().trim();

            // Convert to numbers if possible, treat '-' as a very small value
            const numX = x === '-' ? -Infinity : parseFloat(x.replace(/,/g, ''));
            const numY = y === '-' ? -Infinity : parseFloat(y.replace(/,/g, ''));

            if (!isNaN(numX) && !isNaN(numY)) { // Both values are numbers
                if (currentOrder === "asc") {
                    return numX - numY;
                } else {
                    return numY - numX;
                }
            } else { // Non-numeric comparison as fallback
                if (currentOrder === "asc") {
                    return x.toLowerCase().localeCompare(y.toLowerCase());
                } else {
                    return y.toLowerCase().localeCompare(x.toLowerCase());
                }
            }
        });

        // Append sorted rows back to the table
        $.each(rows, (index, row) => {
            table.children('tbody').append(row);
        });

        // Update the sorting indicators
        table.find('th').removeAttr('data-sorted');
        const sortedHeader = table.find(`th.${className}`);
        if (sortedHeader.length) {
            sortedHeader.attr('data-sorted', currentOrder);
        }
  }
}


// Main function to handle watchlist link
function watchlist_link(elem) {
    document.querySelectorAll('.watchlist_ticker').forEach(row => row.classList.remove('clicked'));
    elem.classList.add('clicked');

    const symbol = $(elem).find('.ticker_name').text().trim();
    const symbol_board = $(elem).find('.ticker_name').data('symbol');
    const board = symbol_board.split('.')[1];
    chart_board = board;

    const watchlist_header_text = $(elem).closest('.lm_item.lm_stack').find('.lm_active').children().eq(1).text();
    const watchlist_color = getLocalStorageValue(`${watchlist_header_text}_color`);
    const updates = [
        { color: getLocalStorageValue('Quote_color'), func: updateQuoteWidget },
        { color: getLocalStorageValue('Chart_color'), func: updateChart },
        { color: getLocalStorageValue('News_color'), func: updateNews },
        { color: getLocalStorageValue('Stock Info_color'), func: getAndSetAllData },
        { color: getLocalStorageValue('Time & Sale_color'), func: updateTimeSale },
        { color: getLocalStorageValue('Position_color'), func: updateSymbolClientPortfolio }
    ];

    updateMarketInput(watchlist_color, symbol_board);
    handleColorUpdates(watchlist_color, symbol_board, updates);

    

    if (board === 'YIELDDBT') {
        getGsecData(symbol);
    }
}

function clear_watchlist(table_id) {

    $(`#search_${table_id}`).val('');

    let $selectElement = $(`#select_${table_id}`);
    let value = $selectElement.val();
    let id = $selectElement.attr('id');

    load_watchlist(value, id);


}

function saveRowOrder(table_id) 
{    
    var dragTr = $("#" + table_id + " tbody").sortable("toArray", { attribute: "data-id" });
    let wlname = $(`#select_${table_id}`).val();
    var apiUrl = '/shared/addwatchlistitemprecedence/';

    $.ajax({
            
        type: 'POST',
        url: apiUrl,
        contentType: 'application/json',
        data: JSON.stringify({ wlname: wlname, dragTr: dragTr }),
        success: function (data) {
            // show_flash_messages(data, 'success');  
            let saveButton = $(`#save_${table_id}`);
            if (saveButton.is(":visible")) {
                
                saveButton.hide();
                show_flash_messages("Watchlist saved successfully", 'success');
                
            }
        },
        error: function (data) {
            console.log(data.responseText);
            // show_flash_messages(data.responseText, 'danger');  
        }
	    
    });
}