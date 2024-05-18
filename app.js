var system_username ='sumon';
var profile_page = 'trade_page';
var pid = 2;

$(document).ready(function() {
  tableStateLoad()
  var order_table_id = 'wl_table_1';

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


  $('#wl_table_1 thead').on('click', 'th', function() {
    const th = $(this);
    const className = th.attr('class').split(' ').find(cls => cls.startsWith('wl_table_1-col-'));
    if (className) {
        sortTable(className);
    }
});

    function sortTable(className) {
        const table = $('#wl_table_1');
        let switching = true;
            let shouldSwitch;
            let dir = "asc";
            let switchcount = 0;
            let i;

        while (switching) {
            switching = false;
            const rows = table.find('tbody tr');

            for (i = 0; i < rows.length - 1; i++) {
                shouldSwitch = false;
                const x = $(rows[i]).find(`.${className} div`).text().trim();
                const y = $(rows[i + 1]).find(`.${className} div`).text().trim();
                
            // Convert to numbers if possible, treat '-' as a very small value
            const numX = x === '-' ? -Infinity : parseFloat(x.replace(/,/g, ''));
            const numY = y === '-' ? -Infinity : parseFloat(y.replace(/,/g, ''));

                if (!isNaN(numX) && !isNaN(numY)) { // Both values are numbers
                    if (dir === "asc") {
                        if (numX > numY) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (numX < numY) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else { // Non-numeric comparison as fallback
                    if (dir === "asc") {
                        if (x.toLowerCase() > y.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (dir === "desc") {
                        if (x.toLowerCase() < y.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }

            if (shouldSwitch) {
                $(rows[i]).insertAfter($(rows[i + 1]));
                switching = true;
                switchcount++;
            } else {
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }

        // Update the sorting indicators
        table.find('th').removeClass('sort-asc sort-desc');
        const sortedHeader = table.find(`th.${className}`);
        if (sortedHeader.length) {
            sortedHeader.addClass(dir === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    }

})


 
function selectOption() { 
    $('.watchlist_table').each(function() { 
        let exist_table_id = $(this).attr('id'); 
        let local_sorting_val = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + exist_table_id + '_sorting');
        if (local_sorting_val) {
            $('#selected_val_' + exist_table_id).text(local_sorting_val);
            let old_headers = document.getElementById(exist_table_id).getElementsByTagName("th"); 
            var th = Array.from(old_headers).find(header => header.innerHTML === local_sorting_val); 
            if (th) { 
                th.click(); // First click to ensure header is selected
                // Check if the current sort direction is ascending, if so, click again to make it descending
                if (!th.classList.contains('sort-desc')) {
                    th.click();
                }
            }
        } 
    });
} 

selectOption()
setInterval(selectOption, 10000)
   
function toggleDropdown(id) {
    let dropdown_id = id.replace('dropdown_', '').replace('add_', '').replace(/\s+/g, ''); 
    document.getElementById("sorting_dropdown_" + dropdown_id).classList.toggle("sorting-show");
}
  
function changeSorting(sorting_val, elem_id) { 
    let watchlist_id = elem_id.replace('sorting_', '').replace('add_', '').replace(/\s+/g, ''); 
    if(sorting_val === 'OFF'){ 
        $('#selected_val_' + watchlist_id).text(sorting_val);
        localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting');
    }
    else{
        $('#selected_val_' + watchlist_id).text(sorting_val);
        localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_sorting', sorting_val);
        let old_headers = document.getElementById(watchlist_id).getElementsByTagName("th"); 
        console.log(old_headers)
        var th = Array.from(old_headers).find(header => header.innerHTML === sorting_val); 
        if (th) { 
            th.click(); // First click to ensure header is selected
            // Check if the current sort direction is ascending, if so, click again to make it descending
            if (!th.classList.contains('sort-desc')) {
                th.click();
            } 
        }
    }
    toggleDropdown(watchlist_id);
}
      
 

//deepcode ignore FunctionDeclarationInBlock: <please specify a reason for ignoring this>
function tableStateLoad() { 

    var headerOrder = localStorage.getItem('Market_table_header'); 
    let headers = document.getElementById('wl_table_1').getElementsByTagName("th"); 
    

    if (headerOrder) {
        headerOrder = JSON.parse(headerOrder);
        var table = document.getElementById('wl_table_1');
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
        $("#" + 'wl_table_1' + ">" + "tbody").html(dropTable); 
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
  var table_tag = document.getElementById('wl_table_1');
    if (table_tag !== null && table_tag !== undefined) {
        var table = table_tag.getElementsByTagName('tbody')[0];
    }
    
    // Create a new row
    var newRow = table.insertRow(0);
    newRow.classList.add("watchlist_ticker");
    newRow.setAttribute("onclick", "watchlist_link(this)");
    newRow.style.textAlign = 'center';

    // Get headers information
    var headers = table_tag.getElementsByTagName("th");
    
    // Define cell data for the new row based on header classes
    let cellData = [];
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].className) {
            let className = headers[i].className;
            console.log(className)
            // Handle different classes accordingly
            switch (className) {
                case "wl_table_1-col-1 table-bordered sortme ui-sortable-handle":
                    cellData.push(`<div class="td-btn"><button class="wlremove has-tooltip" title="Remove Stock"><i class="fa fa-times"></i></button></div>`);
                    break;
                case "wl_table_1-col-2 table-bordered sortme ui-sortable-handle":
                    cellData.push(`<div align="left" class="ticker_name">New</div>`);  
                    break;
                case "wl_table_1-col-3 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>A</div>`);
                    break; 
                case "wl_table_1-col-4 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>10</div>`);
                    break; 
                case "wl_table_1-col-5 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-6 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-7 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-8 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-9 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-10 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-11 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-12 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>-</div>`);
                    break; 
                case "wl_table_1-col-13 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>13</div>`);
                    break; 
                case "wl_table_1-col-14 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>130</div>`);
                    break; 
                case "wl_table_1-col-15 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>0.00</div>`);
                    break; 
                case "wl_table_1-col-16 table-bordered sortme ui-sortable-handle":
                    cellData.push( `<div>0.00%</div>`);
                    break; 
                default:
                    cellData.push(`<div>-</div>`); // Default value if no specific class is matched
                    break;
            }
        } 
    }

    // Insert cells into the new row
    cellData.forEach(html => {
        var cell = newRow.insertCell();
        cell.innerHTML = html;
    });

    tableStateSave('wl_table_1');
  }

