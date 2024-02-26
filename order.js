$(document).ready(function() {
    tableStateLoad()
    Sortable.initTable(document.querySelector('#market_table'));
    var order_table_id = 'market_table';
  
    function moveColumn(table, sourceIndex, targetIndex) {
        var body = $("tbody", table);
        $("tr", body).each(function (i, row) {
            if (sourceIndex < targetIndex) {
                // Dragging from left to right
                $("td", row).eq(sourceIndex).insertAfter($("td", row).eq(targetIndex));
            } else {
                // Dragging from right to left
                $("td", row).eq(sourceIndex).insertBefore($("td", row).eq(targetIndex));
            }
        });
    }
  
     //  Drag and drop action for column
     $("#" + order_table_id + ">" + "thead" + ">" + "tr").sortable({
        // items: "> th.sortme:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3))",
        start: function(event, ui) {
          ui.item.data("source", ui.item.index());
          ui.placeholder.html(ui.item.html());
        },
        update: function(event, ui) {
          moveColumn($(this).closest("table"), ui.item.data("source"), ui.item.index());
          $("#" +order_table_id + ">" + "tbody").sortable("refresh"); 
          // Save the table state after the update
          tableStateSave(order_table_id);
        }, 
        placeholder: "ui-state-highlight"
     });
  
     //  Drag and drop action for row
     $("#" + order_table_id + " tbody").sortable({
        cursor: "move",
        placeholder: "sortable-placeholder",
        helper: function (e, tr) {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function (index) { 
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        },
        start: function (event, ui) {
            // Add shadow effect to the dragged table row
            ui.helper.addClass("dragging-shadow");
        },
        stop: function (event, ui) {  
            // Save the table state after the update
            tableStateSave(order_table_id);
        }
    })
  
    $("#" + order_table_id).resizableColumns({
      store: window.store,
      minWidth: 3
      // resize: onResize
  });
  
  // Bind to the mouseup event on resizable columns
  $("#" + order_table_id + ' th').on('mouseup', function () {
      tableStateSave(order_table_id);
  });
  
  })
  
  //deepcode ignore FunctionDeclarationInBlock: <please specify a reason for ignoring this>
  function tableStateLoad() { 
  
      var headerOrder = localStorage.getItem('Market_table_header'); 
      let headers = document.getElementById('market_table').getElementsByTagName("th"); 
      
  
      if (headerOrder) {
          headerOrder = JSON.parse(headerOrder);
          var table = document.getElementById('market_table');
          var headerRow = table.tHead.getElementsByTagName("tr")[0];
          headerOrder.forEach(function (text,index) {
              // var th = Array.from(headers).find(header => console.log(header.innerText));
              var th = Array.from(headers).find(header => header.innerText === text);
              if (th) {
                  headerRow.appendChild(th);
                   // Set the loaded column width
                   localStorage.removeItem('undefined-undefined')
                   $(th).width(JSON.parse(localStorage.getItem('Market_table_widths'))[index]);
              }
          });
          // console.log(headerRow)
      } 
  
      var dropTable = localStorage.getItem('Market_table_layout'); 
      if (dropTable) {
          dropTable = JSON.parse(dropTable);
          $("#" + 'market_table' + ">" + "tbody").html(dropTable); 
      }  
  
  } 
  
  // deepcode ignore FunctionDeclarationInBlock: <please specify a reason of ignoring this>
  function tableStateSave(table_id) {
    var headerOrder = [];
    var columnWidths = [];
    $("#" + table_id + ">" + "thead" + ">" + "tr > th.sortme").each(function () { 
        headerOrder.push($(this).text().trim());
        columnWidths.push($(this).width());
    });  
    localStorage.setItem('Market_table_header', JSON.stringify(headerOrder));
    localStorage.setItem('Market_table_widths', JSON.stringify(columnWidths));
  
    var dragTable =  $("#" + table_id + ">" + "tbody").html();  
    localStorage.setItem('Market_table_layout' , JSON.stringify(dragTable)); 
  }
  
  
  function add_new_row()
  {
    var table_tag = document.getElementById('market_table');
    if (table_tag !== null && table_tag !== undefined) {
     var table = table_tag.getElementsByTagName('tbody')[0];

    // Create a new row
    var newRow = table.insertRow(0);
    // newRow.id = msg.value.client_order_id;
    // newRow.setAttribute("data-code", msg.value.order_client_code);
    // newRow.setAttribute("data-symbol", msg.value.order_instrument);
    newRow.style.textAlign = 'center';

    // Get headers information
    var headers = table_tag.getElementsByTagName("th");

    let cellData = [];
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].className) {
            let className = headers[i].className;
            console.log(className);
            // Handle different classes accordingly
            switch (className) {
                case "market_table-col-1 ui-sortable-handle":
                    cellData.push('-');
                    break;
                case "market_table-col-2 ui-sortable-handle":
                    cellData.push(msg.value.exchange);
                    break;
                case "market_table-col-3 ui-sortable-handle":
                    cellData.push(msg.value.client_order_id);
                    break;
                case "market_table-col-4 ui-sortable-handle":
                    cellData.push(msg.value.order_time);
                    break;
                case "market_table-col-5 ui-sortable-handle":
                    cellData.push(msg.value.order_client_code);
                    break;
                case "market_table-col-6 ui-sortable-handle":
                    cellData.push(order_symbol);
                    break;
                case "market_table-col-7 ui-sortable-handle":
                    cellData.push(order_board);
                    break;
                case "market_table-col-8 ui-sortable-handle":
                    if (msg.value.order_side == "BUY") {
                        cellData.push('<span class="text-success">' + msg.value.order_side + '</span>');
                    } else {
                        cellData.push('<span class="text-danger">' + msg.value.order_side + '</span>');
                    }
                    break;
                case "market_table-col-9 ui-sortable-handle":
                    cellData.push(msg.value.order_type);
                    break;
                case "market_table-col-10 ui-sortable-handle":
                    let limit_order_rate_cust = parseFloat(msg.value.limit_order_rate).toFixed(1);
                    if (isNaN(limit_order_rate_cust)) {
                        limit_order_rate_cust = '0.0';
                    }
                    cellData.push(limit_order_rate_cust);
                    break;
                case "market_table-col-11 ui-sortable-handle":
                    cellData.push('');
                    break;
                case "market_table-col-12 ui-sortable-handle":
                    cellData.push(msg.value.order_qty);
                    break;
                case "market_table-col-13 ui-sortable-handle":
                    cellData.push(msg.value.drip_qty);
                    break;
                case "market_table-col-14 ui-sortable-handle":
                    cellData.push('');
                    break;
                case "market_table-col-15 ui-sortable-handle":
                    if (msg.value.order_status == 'm-parking') {
                        cellData.push('<span><input class="m-check" type="checkbox" />&nbsp;' + msg.value.order_status + '</span>');
                    } else {
                        cellData.push(msg.value.order_status);
                    }
                    break;
                case "market_table-col-16 ui-sortable-handle":
                    cellData.push('<div class="progress" style="border-radius: 10px; height: 0.8rem; background-color: #8e9291"><div class="progress-bar" role="progressbar" style="width: 0%; background-color: #00db86; color: #000; font-size: 10px; font-weight: bold;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0.00%</div></div>');
                    break;
                case "market_table-col-17 ui-sortable-handle":
                    cellData.push(msg.value.trader_id);
                    break;
                case "market_table-col-18 ui-sortable-handle":
                    cellData.push(msg.value.user_id);
                    break;
                case "market_table-col-19 ui-sortable-handle":
                    cellData.push('<div style="display: none;" data-orderid="' + msg.value.client_order_id + '" value="" class="client-order-id"></div>' +
                        '<div style="display: none;" data-orderchainid="' + msg.value.chain_id + '" value="" class="order-chain-id"></div>');
                    break;
                default:
                    cellData.push('-');
                    break;
            }
        }

        // Insert cells into the new row
        // cellData.forEach(html => {
        //     var cell = newRow.insertCell();
        //     cell.innerHTML = html;
        // });

        // flashnum($('#' + msg.value.client_order_id).find('td:eq(19)'));
    }

// Update Portfolio after Order Update
if ($('#portfolio_code_input').length > 0) {
    var portfolio_code = msg.value.order_client_code;
    if (portfolio_code == $('#portfolio_code_input').val()) {
        update_portfolio();
    }
}
if ($('#account_limit_code').length > 0 && $('#account_limit_code').val() == msg.value.order_client_code) {
    _.throttle(get_account_limit(), 3000);
}

var market_order_rows = Array.from(table.getElementsByTagName('tr'));
var order_selected_limit = localStorage.getItem("selected_order_value");

if (order_selected_limit !== null && order_selected_limit !== undefined) {
    var excessRows = market_order_rows.slice(order_selected_limit);
    excessRows.forEach(function (row) {
        row.remove();
    });
}

// hideShow_orderTerminal_fromLocal('market_table');
tableStateSave('market_table');
  }
} 
  