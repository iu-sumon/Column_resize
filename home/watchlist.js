data[0].forEach(function(item,idx, array) {
    let cleanedSymbol = item.symbol.replace(/[\&\(\)]/g,'');
   
            if (idx == array.length-1)bottom_border = "";
            let bellIcon = item.alert ? '<i class="fa fa-bell text-warning" style="font-size: x-small;"></i>' : '';
            let stopCircleIcon = item.sltp ? '<i class="fa fa-stop-circle text-danger" style="font-size: x-small;"></i>' : '';
            let sltpText = item.sltp ? 'SL: ' + item.sl + ', TP: ' + item.tp : '';
            let portfolioClass = (item.symbol + item.board).replace(/[^a-zA-Z0-9\s-_]/g, '');
            if(exchange == 'CSE')
            {
                if(['DEBT','YIELDDBT','SPUBLIC','ATBPUB'].includes(item.board)){
                    portfolioClass = portfolioClass.replace(item.board, 'PUBLIC');
                }
                if(['SBLOCK'].includes(item.board)){
                    portfolioClass = portfolioClass.replace(item.board, 'BLOCK');
                }
            }
            $("#saleable_table").find("tbody").append($('<tr style="text-align: right;" class="portsym ' + portfolioClass + '" data-symbol="'+item.symbol+'" data-symbol-context="'+item.symbol+item.board+'" data-board="'+item.board+'" data-qty="'+item.qty+'" data-clientcode="'+clientcode+'" onclick="portfolio_link(this)"><td  class="portfolio_symbol text-left pl-2" title="'+sltpText+'">' + item.symbol + ' ' + bellIcon + ' ' + stopCircleIcon + "</td>"
            + '<td class="portfolio_qty" id="totalqty_'+cleanedSymbol+'">' + item.totalqty + "</td>" // can be initialqty
            + '<td class="portfolio_saleable" id="qty_'+cleanedSymbol+'">' + item.qty + "</td>" 
            + '<td class="portfolio_avgcost" id="avgcost_'+cleanedSymbol+'">' + item.avgcost+"</td>"
            + '<td class="portfolio_totalcost" id="mktcost_'+cleanedSymbol+'">'+ Number(item.totalcost).toLocaleString('en-IN') +"</td>" 
            + '<td class="portfolio_mktrate" id="mktrate_'+cleanedSymbol+'">' + item.ltp + "</td>"
            + '<td class="portfolio_mktvalue" id="mkt_val_'+cleanedSymbol+'">' + Number(item.value).toLocaleString('en-IN') + "</td>" 
            + '<td class="portfolio_gain" id="unreal_gain_'+cleanedSymbol+'">' + Number(item.gain).toLocaleString('en-IN') + "</td>" 
            + '<td class="portfolio_pgain" id="gain_per_'+cleanedSymbol+'">' + item.gain_per + "</td>" 
            + '<td class="portfolio_percentage pr-2" id="invest_per_'+cleanedSymbol+'">' + item.invest_per + "</td>" 
            + "</tr>"));
            
            
            if(item.gain > 0){
                $('#mktrate_'+cleanedSymbol).removeClass().addClass('up portfolio_mktrate');
                $('#mkt_val_'+cleanedSymbol).removeClass().addClass('up portfolio_mktvalue mkt_val');
                $('#unreal_gain_'+cleanedSymbol).removeClass().addClass('up portfolio_gain total_gain');
                $('#gain_per_'+cleanedSymbol).removeClass().addClass('up portfolio_pgain gain_per');
            }
            if(item.gain < 0){
                $('#mktrate_'+cleanedSymbol).removeClass().addClass('down portfolio_mktrate');
                $('#mkt_val_'+cleanedSymbol).removeClass().addClass('down portfolio_mktvalue mkt_val');
                $('#unreal_gain_'+cleanedSymbol).removeClass().addClass('down portfolio_gain total_gain');
                $('#gain_per_'+cleanedSymbol).removeClass().addClass('down portfolio_pgain gain_per');
            }
    
});

if(Object.keys(data[1]).length > 0){
    $("#saleable_table").find("tbody").append($("<tr style='text-align: right;border-top:1px solid;'><td class='portfolio_symbol'></td><td class='portfolio_qty'></td><td class='portfolio_saleable'></td><td class='portfolio_avgcost'></td><td class='bold portfolio_totalcost' id='total_cost'>" 
    + Number(data[1].sum_totalcost).toLocaleString('en-IN') 
    + "</td><td class='portfolio_mktrate'></td>"+'<td id="total_val"'+" class='bold portfolio_mktvalue'>" + Number(data[1].sum_totalvalue).toLocaleString('en-IN')
    + '</td><td class="portfolio_gain" id="tot_unreal">' + Number(data[1].sum_totalgain).toLocaleString('en-IN')
    + '</td><td class="portfolio_pgain " id="tot_per">'+ data[1].sum_gain_per
    + '</td><td class="pr-2 portfolio_percentage " id="tot_invest">'+ 100
    + "</td></tr>"));

    if(data[1].sum_totalgain < 0){
        $('#total_val').removeClass().addClass('down portfolio_mktvalue');
        $('#tot_unreal').removeClass().addClass('down portfolio_gain');
        $('#tot_per').removeClass().addClass('down portfolio_pgain');
        
    }
    if(data[1].sum_totalgain > 0){
        $('#total_val').removeClass().addClass('up portfolio_mktvalue');
        $('#tot_unreal').removeClass().addClass('up portfolio_gain');
        $('#tot_per').removeClass().addClass('up portfolio_pgain');
    }

    if (system_user_role == 'client') {
        let color_class = data[1].sum_totalgain > 0 ? 'up' : data[1].sum_totalgain < 0 ? 'down' : 'neutral';
        let prefix = data[1].sum_gain_per > 0 ? '+' : '';
        let bgclass = data[1].sum_gain_per > 0 ? 'bgup' : data[1].sum_gain_per < 0 ? 'bgdown' : '';

        $("#global_gainloss").text(Number(data[1].sum_totalgain).toLocaleString('en-IN'));
        $("#global_gainlossper").text(prefix + data[1].sum_gain_per + '%');

        $("#global_gainloss").removeClass().addClass(color_class);
        $("#global_gainlossper").removeClass().addClass(bgclass);

    }
}