var ignorewatchlist = ['BOND (Public)' , 'SC', 'ATB', 'BOND (Government)', 'SPOT Mkt', 'BLOCK', 'zcategory'];
var pid_selected = document.querySelector("#profile li.profile-selected-li");
var pid = pid_selected?.getAttribute("data-value");

// function selectOption() { 
//     $('.watchlist_table').each(function() { 
//         let exist_table_id = $(this).attr('id'); 
//         let old_headers = document.getElementById(exist_table_id).getElementsByTagName("th"); 
//         let sorted_val = $('input[name="sorting_' + exist_table_id + '"]:checked').val();
//         if (sorted_val && sorted_val !== 'OFF') { 
//             let th = Array.from(old_headers).find(header => header.innerHTML == sorted_val); 
//             let thClass = th.classList[0];
//             if (th) { 
//                 sortTable(exist_table_id, thClass);
//                 if (th.getAttribute('data-sorted') !== 'desc') {
//                     sortTable(exist_table_id, thClass);
//                 }
//             } 
//         } 
//     });
// }


// function change_watchlist_sorting(sorting_val, elem_id) {
//     let watchlist_id = elem_id.replace('selected_val_', '').replace('add_', '').replace(/\s+/g, ''); 
//     let old_headers = document.getElementById(watchlist_id).getElementsByTagName("th"); 

//     if (sorting_val == 'OFF') { 
//         localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting');
//     } else {  
//         localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting', sorting_val);
//         let th = Array.from(old_headers).find(header => header.innerText == sorting_val); 
//         let thClass = th.classList[0];
//         if (th) { 
//             sortTable(watchlist_id, thClass);
//             if (th.getAttribute('data-sorted') !== 'desc') {
//                 sortTable(watchlist_id, thClass);
//             }
//         }
//     }
// }


// // Event listener for radio buttons
// $(document).on('change', '.custom-radio-group input[type="radio"]', function() {
//     change_watchlist_sorting($(this).val(), $(this).closest('.custom-radio-group').attr('id'));
// });

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
       if(ignorewatchlist.includes(name))
        {
            show_flash_messages('Cannot delete default watchlist','danger');
            return;
        } 
    var url = '/shared/removewatchlist/';
    $.get(url, { name: name })
        .done(function (data) {
            $('.user_watchlists option[value="' + name + '"]').remove(); 
            show_flash_messages(data, 'success'); 
            var getOptions = $('#select_' + select_id)[0].options;
            var first_options = getOptions[getOptions.length - getOptions.length];

            $('#select_' + select_id).val(first_options?.value);
            load_watchlist(first_options?.value, select_id)
        })
        .fail(function (data) {
            show_flash_messages(data.responseText, 'danger');
        });
}

// Load Watchlist
function load_watchlist(wlname, element_id) { 
    if (wlname == null || wlname == undefined || wlname.length == 0 || wlname == '') {
        return;
    } 

    var table_id = element_id.replace('select_', '').replace('add_', '').replace(/\s+/g, '');
    if (table_id !== null && table_id !== undefined) {
        showHideTableWatchlist(table_id); 
        localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + table_id + '_selected', wlname);

        let sorting_val = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + table_id + '_sorting');
        if (sorting_val) {
            $('#selected_val_' + table_id + ' input[value="' + sorting_val + '"]').prop('checked', true);
        } else {
            $('#selected_val_' + table_id + ' input[value="OFF"]').prop('checked', true);
        }

        var name = wlname;
        var url = '/shared/viewwatchlist/';
        var table_tag = document.getElementById(table_id);
        if (table_tag !== null && table_tag !== undefined) {
            var table = table_tag.getElementsByTagName('tbody')[0];
        }
        var start = 1;  
        var pageSize = 31;  
        var isLessThenPageSize = false; 

        $("#" + table_id + " tbody tr").remove();

        function appendRow(data) {
            tableStateLoad();
            tableStateSave(table_id);

            data.watchlist_results.forEach(function(wl_data){
                symbol = wl_data.symbol;
                board = wl_data.board;
                symbol_board = symbol.replace(/[^a-zA-Z0-9\s-_]/g, '') + board;
                symbol_dot_board = wl_data['symbol']+'.'+wl_data['board'];

                change = wl_data.ltp_change == 0 ? '0.00' : wl_data.ltp_change;
                changeper = wl_data.ltp_changeper == 0 ? '0.00' : wl_data.ltp_changeper;
                high = wl_data.high == 0 ? '-' : wl_data.high;
                low = wl_data.low == 0 ? '-' : wl_data.low;
                vol = wl_data.total_qty == 0 ? '-' : Number(wl_data.total_qty).toLocaleString("en-IN");
                trade = wl_data.total_trades == 0 ? '-' : wl_data.total_trades;
                value = wl_data.total_value == 0 ? '-' : Number(wl_data.total_value).toLocaleString("en-IN");
                ltp = wl_data.ltp == 0 ? '-' : wl_data.ltp;
                cp = wl_data.close_price == 0 ? '-' : wl_data.close_price;
                ycp = wl_data.ycp == 0 ? '-' : wl_data.ycp;
                yvol = wl_data.yvol == 0 ? '-' : Number(wl_data.yvol).toLocaleString("en-IN");

                bidq = wl_data.bid_qty == 0 ? '-' : wl_data.bid_qty;
                askq = wl_data.ask_qty == 0 ? '-' : wl_data.ask_qty;
                bidp = wl_data.bid_price == 0 ? '-' : wl_data.bid_price;
                askp = wl_data.ask_price == 0 ? '-' : wl_data.ask_price;
                // symname = wl_data.result[i].replace(".", "");

                pos_neg = '';
                color_class = '';
                bg_class = '';

                if (wl_data.ltp_change > 0) {
                    color_class = 'up';
                    pos_neg = '+';
                    bg_class = 'positive';
                }
                if (wl_data.ltp_change < 0) {
                    color_class = 'down';
                    pos_neg = '';
                    bg_class = 'negative';
                }
                if (wl_data.ltp_change == 0) {
                    color_class = 'neutral';
                    pos_neg = '';
                    bg_class = 'nochange';
                }
                
                suspend = 'neutral';
                if (wl_data.suspend == true) {
                    suspend = 'down';
                }

                row = table.insertRow();
                row.classList.add("watchlist_ticker");
                row.classList.add(symbol_board);
                row.setAttribute("onclick", "watchlist_link(this)");
                row.setAttribute("data-symbol-context", symbol_dot_board);
                row.setAttribute("data-id", symbol_dot_board);
                row.style.textAlign = 'center';

                let headers = document.getElementById(table_id)?.getElementsByTagName("th");
                let rowHTML = '';
                
                let alert_icon = wl_data.alert == true ? '<i class="fa fa-bell text-warning" style="font-size: x-small;"></i>' : '';

                for (let i = 0; i < headers.length; i++) {
                    if (headers[i].className) { 
                        switch (headers[i].className) {
                            case `${table_id}-col-ac`:
                                rowHTML += `
                                    <td class="${table_id}-col-ac">
                                        <div data-symbol="${symbol_dot_board}" class="td-btn">
                                            <button onclick="remove_from_watchlist('${symbol_dot_board}', '${table_id}')" class="wlremove has-tooltip" title="Remove Stock"><i class="fa fa-times"></i></button>
                                        </div>
                                    </td>`;
                                break;
                            case `${table_id}-col-symbol text-left`:
                                rowHTML += `
                                    <td class="${table_id}-col-symbol text-left" title="${symbol_dot_board}">
                                        <div align="left" data-symbol="${symbol_dot_board}" class="ticker_name ${suspend}">${symbol} ${alert_icon}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-group ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-group">
                                        <div class="">${wl_data.symbol_category}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ltp ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ltp ui-sortable-handle">
                                        <div class="${symbol_board}_ltp ${color_class} ">${ltp}</div>
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
                                    <td class="${table_id}-col-bq ui-sortable-handle" title="${bidq}">
                                        <div class="${symbol_board}_bidq  watch_bid_bg">${bidq}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-bid ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-bid ui-sortable-handle">
                                        <div class="${symbol_board}_bid  watch_bid_bg">${bidp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-ask ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-ask ui-sortable-handle">
                                        <div class="${symbol_board}_ask  watch_ask_bg">${askp}</div>
                                    </td>`;
                                break;
                            case `${table_id}-col-aq ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-aq ui-sortable-handle" title="${askq}">
                                        <div class="${symbol_board}_askq  watch_ask_bg">${askq}</div>
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
                            case `${table_id}-col-vol ui-sortable-handle`:
                                rowHTML += `
                                    <td class="${table_id}-col-vol ui-sortable-handle" title="${vol}">
                                        <div class="${symbol_board}_vol ">${vol}</div>
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
                            default:
                                rowHTML += `<td><div class="">-</div></td>`;
                                break;
                        }
                    }
                }
                row.innerHTML = rowHTML;

                

            })
            $(".watchlist-symbol-context").on("contextmenu","tr", function() {
                    
                // Call the function to generate context menu
                generateCommonContextArray(this, "watchlist");
            });
             // Enable Table Sorting
            //  Sortable.initTable(table_tag);  
            
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
                        saveRowOrder();
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
                    ui.item.data("source", ui.item.index());
                    ui.placeholder.html(ui.item.html());
                },
                update: function(event, ui) {
                    moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index()); 
                    tableStateSave(table_id);
                }, 
                placeholder: "ui-state-highlight"
            });
        }  
        
        function tableStateSave(table_id) {
            const headersData = Array.from($(`#${table_id} thead th`), th => ({
                headerText: $(th).text().trim()
            }));  
            localStorage.setItem(`${system_username}_${profile_page}_${pid}_${table_id}`, JSON.stringify(headersData));
        } 

        function tableStateLoad() {
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

        function saveRowOrder() {
            var dragTr = $("#" + table_id + " tbody").sortable("toArray", { attribute: "data-id" });  
           
            var apiUrl = '/shared/addwatchlistitemprecedence/';
            // Make a POST request to the Flask API
            $.ajax({
                type: 'POST',
                url: apiUrl,
                contentType: 'application/json',
                data: JSON.stringify({ wlname: wlname, dragTr: dragTr }),
                success: function (data) {
                    // show_flash_messages(data, 'success');
                },
                error: function (data) {
                    console.log(data.responseText);
                    // show_flash_messages(data.responseText, 'danger');
                }
            });
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
                    pageSize: pageSize
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
                    if(data.watchlist_results.length < pageSize) {
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
         $("#" + table_id).parents().parents().scroll(function() {
            var tableDiv = $(this)[0];
            // If scrolled to the bottom of the table div
            if (tableDiv.scrollTop + tableDiv.clientHeight >= tableDiv.scrollHeight) {
                if($("#" + table_id+' tbody tr').length >= pageSize)
                { 
                    start += 1;
                    if(!isLessThenPageSize){
                        fetchData();
                    }
                    
                }
            }
        });

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


function watchlist_link(elem) {
    let rows = document.querySelectorAll('.watchlist_ticker');
    for (var otherRow of rows) {
        otherRow.classList.remove('clicked');
    }
    elem.classList.add('clicked');
    
    let watchlist_header = $(elem).parents().parents().parents().parents().parents().parents().parents().children().eq(0);
    let watchlist_header_text = watchlist_header.children().eq(0).find('.lm_active').children().eq(1).text();
    let watchlist_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + watchlist_header_text +'_color');

    
    let Quote_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Quote_color'); 
    let Chart_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Chart_color'); 
    let News_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'News_color'); 
    let stockInfo_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + 'Stock Info_color'); 

    let symbol = $(elem).find('.ticker_name').text().trim();
    let symbol_board = $(elem).find('.ticker_name').data('symbol'); 
    let board = symbol_board.split('.')[1];
    chart_board = board; 
    
    let current_mkt_input = $('.mktdpt_symbol_name')
    current_mkt_input.each(function(index, element) { 
        let watch_mktdpt_input_id =  $(this).attr('id'); 
        let target_title_watch_mkt = $('#' + watch_mktdpt_input_id).parents().parents().parents().parents().parents().parents().children().eq(0).find('.lm_active').children().eq(1).text(); 
        let watch_mktdpt_color = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_' + target_title_watch_mkt + '_color'); 
        
        if (watchlist_color == watch_mktdpt_color) {

            let watch_mkt_channel_array= []; 
            let watch_mkt_channel_object = {
                symbol_id: watch_mktdpt_input_id,
                mkt_symbol: symbol_board
            };
    
            watch_mkt_channel_array.push(watch_mkt_channel_object)
            if ($('.mktdpt_symbol_name').length > 0) { 
                localStorage.setItem(system_username +'_mkt' + target_title_watch_mkt, JSON.stringify(watch_mkt_channel_array));
                let current_mkt_symbol =  $('#' + watch_mktdpt_input_id).val();
                if(symbol_board != current_mkt_symbol)
                {
                    $('#' + watch_mktdpt_input_id).val(symbol_board);
                    getmktdepth(symbol_board, watch_mktdpt_input_id);
                }
               
            }  
        }
    });
 

    if(watchlist_color == Quote_color){
        if ($('#quote_box').length > 0) { 
            let current_quote_symbol = $('#quote_loaded_symbol').text();
            if(symbol_board != current_quote_symbol)
            {
                get_quote_data_widget(symbol_board);
            } 
        }
    }

    if(watchlist_color == Chart_color) {
        if (($('#tv_chart_container').length > 0 || $('#tv_chart_container_advanced').length > 0) && window.symbol_advanced_chart_widget) { 
            let current_chart_symbol =  window.symbol_advanced_chart_widget.activeChart().symbol();
            if(symbol_board != current_chart_symbol)
            {
                reinit_chart(symbol_board); 
            }
        }
   }
 
    if(watchlist_color == News_color){
        if ($('#symbol-news-content').length > 0) {
            if ($('#symbol-news-content').is(":visible")){
                let current_news_symbol = $('#current_news_symbol').text(); 
                if(symbol != current_news_symbol){
                    sym_news(symbol, page=1);
                }  
            };
        }
    }

    if(watchlist_color == stockInfo_color){
        if ($('#stock_analysis').length > 0) {
            getAndSetFinancialData(symbol);
            getAndSetHoldingsData(symbol);
            getAndSetProfileData(symbol);
            getAndSetCorpActionsData(symbol);
            getAndSetNewsData(symbol);
        }
    }

    if ($('.timesale_symbol_name').length > 0){        
        $('.timesale_symbol_name').eq(0).val(symbol_board);
        if(timesalewindow != undefined){            
            $('.web-time-sales-table tbody tr').remove();
            gettimesale(symbol_board, $('.timesale_symbol_name').eq(0).attr("id"));        
        }
    }
    if (board == 'YIELDDBT') {
        getGsecData(symbol);
    }
};

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

// Remove symbol from watchlist
function remove_from_watchlist(instrument, table_id) {
    if (instrument != null) {
        var name = $('#select_' + table_id).val();
        var url = '/shared/removewatchlistitem/';
        $.get(url, { symbol: instrument, name: name })
            .done(function (data) {
                show_flash_messages(data, 'success');
                load_watchlist(name, table_id);
            })
            .fail(function (data) {
                show_flash_messages(data.responseText, 'danger');
            });

    }
}


//Hide and Show From Local
function hideShowTableColWatchlistFromLocal(table_id) {
    var storedColumnNames = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];
    var wl_class = "." + table_id + "-col-checkbox";
    var colCheckboxes = document.querySelectorAll(wl_class);

    colCheckboxes.forEach((element) => {
        var colName = element.getAttribute("data-col");
        if (storedColumnNames.includes(element.value)) {
            var isChecked = element.checked = false
            hideShowTableColWatchlist(colName, isChecked)
        }
    });
}

//Hide and Show functionality
function hideShowTableColWatchlist(colName, checked) {
    var cells = document.querySelectorAll(`.${colName}`);
    cells.forEach((cell) => {
        cell.style.display = checked ? "table-cell" : "none";
    });
}


function showHideTableWatchlist(table_id) {
    var tableId = document.getElementById(table_id);
    if (tableId !== null && tableId !== undefined) { 
        var wl_class = "." + table_id + "-col-checkbox";
        var colCheckboxes = document.querySelectorAll(wl_class);
        colCheckboxes.forEach((element) => {

            element.addEventListener("change", (event) => {
                var columnNames = JSON.parse(localStorage.getItem(system_username + '_' + table_id)) || [];

                var colName = element.getAttribute("data-col");
                var checked = event.target.checked;

                if (checked) {
                    columnNames = columnNames.filter(
                        (columnName) => columnName !== element.value
                    );

                }

                else {
                    columnNames.push(element.value);
                }
                hideShowTableColWatchlist(colName, checked);
                localStorage.setItem(system_username + '_' + table_id, JSON.stringify(columnNames));
            });

        });

        hideShowTableColWatchlistFromLocal(table_id);
    }
}

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

// function sortTable(table_id, className) {
//     const table = $('#' + table_id);
//     const rows = table.find('tbody tr').get();
//     let dir = "asc";

//     // Detect current sort direction and toggle it
//     const currentSort = table.find(`th.${className}`).attr('data-sorted');
//     if (currentSort === "asc") {
//         dir = "desc";
//     }

//     rows.sort((a, b) => {
//         const x = $(a).find(`.${className} div`).text().trim();
//         const y = $(b).find(`.${className} div`).text().trim();
        
//         // Convert to numbers if possible, treat '-' as a very small value
//         const numX = x === '-' ? -Infinity : parseFloat(x.replace(/,/g, ''));
//         const numY = y === '-' ? -Infinity : parseFloat(y.replace(/,/g, ''));

//         if (!isNaN(numX) && !isNaN(numY)) { // Both values are numbers
//             if (dir === "asc") {
//                 return numX - numY;
//             } else {
//                 return numY - numX;
//             }
//         } else { // Non-numeric comparison as fallback
//             if (dir === "asc") {
//                 return x.toLowerCase().localeCompare(y.toLowerCase());
//             } else {
//                 return y.toLowerCase().localeCompare(x.toLowerCase());
//             }
//         }
//     });

//     // Append sorted rows back to the table
//     $.each(rows, (index, row) => {
//         table.children('tbody').append(row);
//     });

//     // Update the sorting indicators
//     table.find('th').removeAttr('data-sorted');
//     const sortedHeader = table.find(`th.${className}`);
//     if (sortedHeader.length) {
//         sortedHeader.attr('data-sorted', dir);
//     }
// }


// function selectOption() {
//     $('.watchlist_table').each(function() {
//         let exist_table_id = $(this).attr('id');
//         let old_headers = document.getElementById(exist_table_id).getElementsByTagName("th");
//         let sorted_val = $('input[name="sorting_' + exist_table_id + '"]:checked').val();
        
//         if (sorted_val && sorted_val !== 'OFF') {
//             let [order, col] = sorted_val.split(' ');
//             let th = Array.from(old_headers).find(header => header.innerHTML.trim() == col);
//             if (th) {
//                 let thClass = th.classList[0];
//                 sortTable(exist_table_id, thClass, order.toLowerCase());
//             }
//         }
//     });
// }

// function change_watchlist_sorting(sorting_val, elem_id) {
//     let watchlist_id = elem_id.replace('selected_val_', '').replace('add_', '').replace(/\s+/g, '');
//     let old_headers = document.getElementById(watchlist_id).getElementsByTagName("th");

//     if (sorting_val == 'OFF') {
//         localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting');
//     } else {
//         localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting', sorting_val);
//         let [order, col] = sorting_val.split(' ');
//         let th = Array.from(old_headers).find(header => header.innerHTML.trim() == col);
//         if (th) {
//             let thClass = th.classList[0];
//             sortTable(watchlist_id, thClass, order.toLowerCase());
//         }
//     }
// }

// // Event listener for radio buttons
// $(document).on('change', '.custom-radio-group input[type="radio"]', function() {
//     change_watchlist_sorting($(this).val(), $(this).closest('.custom-radio-group').attr('id'));
// });

// function sortTable(table_id, className, order = 'asc') {
//     const table = $('#' + table_id);
//     const rows = table.find('tbody tr').get();

//     rows.sort((a, b) => {
//         const x = $(a).find(`.${className} div`).text().trim();
//         const y = $(b).find(`.${className} div`).text().trim();
        
//         const numX = x === '-' ? -Infinity : parseFloat(x.replace(/,/g, ''));
//         const numY = y === '-' ? -Infinity : parseFloat(y.replace(/,/g, ''));

//         if (!isNaN(numX) && !isNaN(numY)) {
//             if (order === "asc") {
//                 return numX - numY;
//             } else {
//                 return numY - numX;
//             }
//         } else {
//             if (order === "asc") {
//                 return x.toLowerCase().localeCompare(y.toLowerCase());
//             } else {
//                 return y.toLowerCase().localeCompare(x.toLowerCase());
//             }
//         }
//     });

//     $.each(rows, (index, row) => {
//         table.children('tbody').append(row);
//     });

//     table.find('th').removeAttr('data-sorted');
//     const sortedHeader = table.find(`th.${className}`);
//     if (sortedHeader.length) {
//         sortedHeader.attr('data-sorted', order);
//     }
// }



function selectOption() {
    $('.watchlist_table').each(function() {
        let exist_table_id = $(this).attr('id');
        let old_headers = document.getElementById(exist_table_id).getElementsByTagName("th");
        let sorted_val = $('input[name="sorting_' + exist_table_id + '"]:checked').val();
        
        if (sorted_val && sorted_val !== 'OFF') {
            let [order, col] = sorted_val.split(' ');
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
    } else {
        localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting', sorting_val);
        let [order, col] = sorting_val.split(' ');
        let th = Array.from(old_headers).find(header => header.innerHTML.trim() == col);
        if (th) {
            let thClass = th.classList[0];
            sortTable(watchlist_id, thClass, order.toLowerCase());
        }
    }
}

// Event listener for radio buttons
$(document).on('change', '.custom-radio-group input[type="radio"]', function() {
    change_watchlist_sorting($(this).val(), $(this).closest('.custom-radio-group').attr('id'));
});

function sortTable(table_id, className, order = null) {
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
        
        const numX = x === '-' ? -Infinity : parseFloat(x.replace(/,/g, ''));
        const numY = y === '-' ? -Infinity : parseFloat(y.replace(/,/g, ''));

        if (!isNaN(numX) && !isNaN(numY)) {
            if (currentOrder === "asc") {
                return numX - numY;
            } else {
                return numY - numX;
            }
        } else {
            if (currentOrder === "asc") {
                return x.toLowerCase().localeCompare(y.toLowerCase());
            } else {
                return y.toLowerCase().localeCompare(x.toLowerCase());
            }
        }
    });

    $.each(rows, (index, row) => {
        table.children('tbody').append(row);
    });

    table.find('th').removeAttr('data-sorted');
    const sortedHeader = table.find(`th.${className}`);
    if (sortedHeader.length) {
        sortedHeader.attr('data-sorted', currentOrder);
    }
}
