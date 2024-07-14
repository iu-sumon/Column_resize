var config = {
    settings: {
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: true,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: false,
        showMaximiseIcon: true,
        showCloseIcon: true,
        minItemHeight: true,
        minItemWidth: true
    },
    dimensions: {
        borderWidth: 5,
        minItemHeight: 50,
        minItemWidth: 50,
        headerHeight: 20,
        dragProxyWidth: 300,
        dragProxyHeight: 200
    },
    content: [{
        type: 'row',
        content: [{
            type: 'component',
            componentName: 'widget',
            componentState: { content: '' }
        }
        ]
    }]
};
  
var watchlistwindow;
var scroll_position; 

function call_multiwindow(json, loadFromApi = false) {
    if (watchlistwindow != null) {
        watchlistwindow.destroy();
    }
    watchlistwindow = new GoldenLayout(json, $('#watchlistContainer'));
    watchlistwindow.registerComponent('widget', function (container, state) {
        var widgetId = 'widget-' + new Date().getTime();
        container.getElement().attr('id', widgetId);
        container.getElement().html(state.content);
        container.on('tab', function (tab) {
            // FOR MAXIMIZE BUTTON STACK ITEMS
            tab
                .header
                .controlsContainer
                .find('.lm_maximise') //get the maximise icon
                // .off( 'click' ) //unbind the current click handler
                .on('click', (function (e) {
                    var button_type = e.currentTarget.attributes.title.value;
                    var widgetElement = $('#' + widgetId);

                    if (button_type == 'maximise' || button_type == 'minimise') {
                        var elementId = widgetElement[0].firstChild.id;
                        if (elementId === 'tv_chart_container_advanced') {
                            setTimeout(function () {
                                var symbol = localStorage.getItem(system_username + '_last_selected_ticker') || "ABBANK.PUBLIC";
                                load_tv_chart(symbol);
                            }, 1000);
                        } else if (elementId === 'index_tv_chart') {
                            setTimeout(function () {
                                reinit_index_chart("DSEX.INDEX");
                                $('.indextab').removeClass('active_index');
                                $('#DSEX_tab').addClass('indextab active_index');
                            }, 1000);
                        }
                    }
                    
                    if (button_type == 'maximise') {
                        $("html, body").animate({ scrollTop: scroll_position + 'px' });
                    }
                    if (button_type == 'minimise') {
                        scroll_position = document.documentElement.scrollTop || document.body.scrollTop;
                        $("html, body").animate({ scrollTop: "0" });
                    }
                    
                }));
                
            // FOR CLOSE BUTTON STACK ITEMS
            tab
                .header
                .controlsContainer
                .find('.lm_close') //get the close icon
                .off('click') //unbind the current click handler
                .on('click', (function (e) {

                    $(this).parents('.lm_header:eq(0)').siblings('.lm_items').find('.lm_item_container').each(function (i, obj) {
                        if ($(this).find('.watchlist_table').length > 0) {
                            var watchlist_table_id = $(this).find('.watchlist_table').attr('id');
                            stack_update(watchlist_table_id, 'watchlist_widget');
                        }
                        if ($(this).find('.user_order_terminals').length > 0) {
                            var order_table_id = $(this).find('.user_order_terminals').attr('id');
                            stack_update(order_table_id, 'orderterminal_widget');
                        }
                        if ($(this).find('.mktdpt_symbol_name').length > 0) {
                            var element_id = $(this).find('.mktdpt_symbol_name').attr('id');
                            var marketdepth_table_id = element_id.replace('symbol_', '').replace(/\s+/g, '');
                            stack_update(marketdepth_table_id, 'marketdepth_widget');
                        }
                        if ($(this).find('#traded_table').length > 0) {
                            subUnsubChannel('top_trade',false);
                            subUnsubChannel('top_value',false);
                            subUnsubChannel('top_volume',false);
                        }
                        if ($(this).find('#traded_table_top_gainer').length > 0) {
                            subUnsubChannel('top_gainer',false);
                        }
                        if ($(this).find('#traded_table_top_loser').length > 0) {
                            subUnsubChannel('top_looser',false);
                        }
                        // if ($(this).find('.timesale_symbol_name').length > 0) {
                        //     var element_id = $(this).find('.timesale_symbol_name').attr('id');
                        //     var timesale_table_id = element_id.replace('symbol_', '').replace(/\s+/g, '');
                        //     stack_update(timesale_table_id, 'timesale_widget');
                        // }
                    });
                    tab.contentItem.parent.remove(); //removes entire stack

                }));

            // FOR CLOSE BUTTON TAB ITEMS
            tab
                .closeElement
                .off('click') //unbind the current click handler
                .on('click', (function (e) {
                    tab_update(tab.contentItem);
                    tab.contentItem.remove(); //removes only current tab
                }));
        });
    });
    
    watchlistwindow.on( 'stackCreated', function( stack ){
        //HTML for the colorDropdown is stored in a template tag
        var colorDropdown = $( $( 'template' ).html() ),
            colorDropdownBtn = colorDropdown.find( '.selectedColor' );
         
           var  setColor = function( color ){
           var container = stack.getActiveContentItem().container;
    
            // Set the color on both the dropDown and the background
            colorDropdownBtn.css( 'background-color', color );
    
            // Update the state
            container.extendState({ color: color });

            setTimeout(function() {
                if (container._config.title == 'Chart' && $('#tv_chart_container_advanced').length > 0) {
                    var symbol = localStorage.getItem(system_username + '_last_selected_ticker') || "ABBANK.PUBLIC";
                    load_tv_chart(symbol);
                }
            }, 1000);

            

            setTimeout(function() {
                if (container._config.title == 'Index Chart' && $('#index_tv_chart').length > 0) {
                    reinit_index_chart("DSEX.INDEX");
                    $('.indextab').removeClass('active_index');
                    $('#DSEX_tab').addClass('indextab active_index');
                }
            }, 1000);

            
        };
      
      
        // Add the colorDropdown to the header
        stack.header.controlsContainer.prepend( colorDropdown );
    
        // Update the color initially and whenever the tab changes
        stack.on( 'activeContentItemChanged', function( contentItem ){
            let current_tab = contentItem.config.title;  
            if(current_tab == "Order Terminal"){
                current_tab = "Order Terminal 1";
            } 
            
            let exist_text = $('.lm_title');  
            let pid_selected = document.querySelector("#profile li.profile-selected-li");
            let pid = pid_selected?.getAttribute("data-value");

            for (var i = 0; i < exist_text.length; i++) {
                let current_tab_text = $(exist_text[i]).text(); 

                if(current_tab_text == "Order Terminal"){
                    current_tab_text = "Order Terminal 1";
                } 

                if (current_tab_text.includes(current_tab)) {  

                     var current_tab_color = getLocalStorageValue(`${current_tab_text}_color`);
                     if(current_tab_color){
                        setColor(current_tab_color);
                     }
                     else
                     {
                        setColor('#fff');
                     }

                }
            } 
        });
           
        // Update the color when the user selects a different color
        // from the dropdown
        colorDropdown.find( 'li' ).click(function(){
            let colorDropdownBg = $(this).children().eq(0).css( 'background-color'); 
            setColor(colorDropdownBg); 
            let target_widget_title = $(this).closest('.lm_item.lm_stack').find('.lm_active').children().eq(1).text(); 
               
            let exist_text = $('.lm_title'); 
            let pid_selected = document.querySelector("#profile li.profile-selected-li");
            let pid = pid_selected?.getAttribute("data-value");

            for (var i = 0; i < exist_text.length; i++) {
                let Title_Text = $(exist_text[i]).text();  
                if (Title_Text.includes(target_widget_title)) {
                    if (colorDropdownBg == 'rgb(255, 255, 255)') {
                        localStorage.removeItem(system_username + '_' + profile_page + '_' + pid + '_' + target_widget_title + '_color');
                    } else {
                        localStorage.setItem(system_username + '_' + profile_page + '_' + pid + '_' + target_widget_title + '_color', colorDropdownBg);
                    }
                }
            }
            
        });

      
    });

    watchlistwindow.init();

    if (loadFromApi) { 
        updatesWidgetContensFromApi(watchlistwindow); 
    }

   // Initalize Watchlist loading
   if ($('.watchlist_table').length > 0) {
    symbol_input();
    setInterval(selectOption, 10000);
   }

   function stack_update(table_id, widget) { 
        let pid_selected = document.querySelector("#profile li.profile-selected-li");
        let pid = pid_selected?.getAttribute("data-value"); 

        // Watchlist Widget
        if (widget == 'watchlist_widget') {
            let watchlist_id = table_id; 

            let existing_watchlist_selection = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_selected');
            if (existing_watchlist_selection != null) {
                localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_selected');
            }

            let existing_watchlist_widget_list = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'watchlists');
            if (existing_watchlist_widget_list != null) {
                existing_watchlist_widget_list = existing_watchlist_widget_list.replace(watchlist_id + ',', '').replace(watchlist_id, '');

                if (existing_watchlist_widget_list == '') {
                    localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'watchlists');
                } else {
                    localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'watchlists', existing_watchlist_widget_list);
                }
            } 
        }


        // MarketDepth Widget
        if (widget == 'marketdepth_widget') {
            let marketdepth_id = table_id;  

            let existing_marketdepth_widget_list = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'marketdepths');
            if (existing_marketdepth_widget_list != null) {
                existing_marketdepth_widget_list = existing_marketdepth_widget_list.replace(marketdepth_id + ',', '').replace(marketdepth_id, '');
                if (existing_marketdepth_widget_list == '') {
                    localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'marketdepths');
                } else {
                    localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'marketdepths', existing_marketdepth_widget_list);
                }
            }

        }

        // Order terminal Widget
        if (widget == 'orderterminal_widget') {
            let orderterminal_id = table_id; 

            let existing_orderterminal_widget_list = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'orderterminals');
            if (existing_orderterminal_widget_list != null) {
                existing_orderterminal_widget_list = existing_orderterminal_widget_list.replace(orderterminal_id + ',', '').replace(orderterminal_id, '');
                if (existing_orderterminal_widget_list == '') {
                    localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'orderterminals');
                } else {
                    localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'orderterminals', existing_orderterminal_widget_list);
                }
            }

        }
   
}
    function tab_update(item) {
        let pid_selected = document.querySelector("#profile li.profile-selected-li");
        let pid = pid_selected?.getAttribute("data-value"); 
          // Watchlist Widget 
        if (item.config.type == "component" && item.config.title.includes('Watchlist')) {
            let watchlist_id = item.container._contentElement[0].childNodes[4].childNodes[1].id; 
            
            let existing_watchlist_selection = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_selected');
            if (existing_watchlist_selection != null) {
                localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + watchlist_id + '_selected');
            }

            let existing_watchlist_widget_list = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'watchlists');
            if (existing_watchlist_widget_list != null) {
                existing_watchlist_widget_list = existing_watchlist_widget_list.replace(watchlist_id + ',', '').replace(watchlist_id, '');
                if (existing_watchlist_widget_list == '') {
                    localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'watchlists');
                } else {
                    localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'watchlists', existing_watchlist_widget_list);
                }
            }
        }
        // MarketDepth Widget
        if (item.config.type == "component" && item.config.title.includes('Market Depth')) {
            let element_id = item.container._contentElement[0].childNodes[4].querySelector(':first-child').id;
            let marketdepth_id = element_id.replace('symdata_', '').replace(/\s+/g, '');  

            let existing_marketdepth_widget_list = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'marketdepths');
            if (existing_marketdepth_widget_list != null) {
                existing_marketdepth_widget_list = existing_marketdepth_widget_list.replace(marketdepth_id + ',', '').replace(marketdepth_id, '');
                if (existing_marketdepth_widget_list == '') {
                    localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'marketdepths');
                } else {
                    localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'marketdepths', existing_marketdepth_widget_list);
                }
            }

        }

        // Order Terminal
        if (item.config.type == "component" && item.config.title.includes('Order Terminal')) {
            let orderterminal_id = item.container._contentElement[0].childNodes[4].id;  

            let existing_orderterminal_widget_list = localStorage.getItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'orderterminals');
            if (existing_orderterminal_widget_list != null) {
                existing_orderterminal_widget_list = existing_orderterminal_widget_list.replace(orderterminal_id + ',', '').replace(orderterminal_id, '');
                if (existing_orderterminal_widget_list == '') {
                    localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'orderterminals');
                } else {
                    localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid + '_' + 'orderterminals', existing_orderterminal_widget_list);
                }
            }

        }
        // if ($(this).find('#traded_table').length > 0) {
            if (item.config.type == "component" && item.config.title.includes('Top Stocks')){
                subUnsubChannel('top_trade',false);
                subUnsubChannel('top_value',false);
                subUnsubChannel('top_volume',false);
            }
            // if ($(this).find('#traded_table_top_gainer').length > 0) {
            if (item.config.type == "component" && item.config.title.includes('Top Gainer')) {
                subUnsubChannel('top_gainer',false);
            }
            // if ($(this).find('#traded_table_top_loser').length > 0) {
            if (item.config.type == "component" && item.config.title.includes('Top Loser')) {
                subUnsubChannel('top_looser',false);
            }
    }

    watchlistwindow.on('stateChanged', function (item) { 
        // Settings icon hide for some widget
        let settings_disabled = ['Index Chart','Chart', 'Stock Info', 'Market Sentiment', 'Advance Decline', 'Top Sectors', 'Sector Gain'];
        $('.wd_settings').each(function() {
            let icon_text = $(this).parent().siblings().find('.lm_active').children().eq(1).text();
            if(settings_disabled.includes(icon_text)){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });

        let color_profile_disabled = ['Market Sentiment','Advance Decline', 'Top Sectors', 'Sector Gain', 'Corp. Events', 'Index Impact', 'Index Chart', 'Time & Sales Ticker'];
        $('.chooseColor').each(function() {
            let color_disabled_text = $(this).parent().siblings().find('.lm_active').children().eq(1).text();
            if(color_profile_disabled.includes(color_disabled_text)){
                $(this).hide();
            }
            else{
                $(this).show();
            }
        });

         // Adjust width 
         $('.lm_item_container').each(function() {
            const style = $(this).attr('style');
            const lm_content = $(this).find('.lm_content');
            const widthMatch = style.match(/width:\s*(\d+)px/);
            const width = widthMatch ? widthMatch[1] : null;
        
            if (width !== null) {
                lm_content.width(width); 
            } 
        });
    
        if(item?.origin.config.type == 'row') {
            if(item.origin.config.content[0].content[0].title == 'Chart' && $('#tv_chart_container_advanced').length > 0) {
                setTimeout(function() {
                    var symbol = localStorage.getItem(system_username + '_last_selected_ticker') || "ABBANK.PUBLIC";
                    load_tv_chart(symbol);
                }, 1000);
            }
        }

        if(item?.origin.config.type == 'row') {
            if(item.origin.config.content[0].content[0].title == 'Index Chart' && $('#index_tv_chart').length > 0) {
                setTimeout(function() {
                    reinit_index_chart("DSEX.INDEX");
                }, 1000);
            }
        }

        if(item?.origin.config.type == 'stack') {
            if(item.origin.config.content[0].title == 'Index Chart' && $('#index_tv_chart').length > 0) {
                setTimeout(function() {
                    reinit_index_chart("DSEX.INDEX");
                }, 1000);
            }
        }

        if(item?.origin.config.type == 'stack') {
            if(item.origin.config.content[0].title == 'Chart' && $('#tv_chart_container_advanced').length > 0) {
                setTimeout(function() {
                    var symbol = localStorage.getItem(system_username + '_last_selected_ticker') || "ABBANK.PUBLIC";
                    load_tv_chart(symbol);
                }, 1000);
            }
        }
        // Stop Refresh Timer if Advance Decline Widget is closed

        if ($('#marketstat').length == 0) {
            if (adv_dec_chart_interval != null) clearInterval(adv_dec_chart_interval);
        }
        // Stop Refresh Timer if Top Sectors Widget is closed
        if ($('#traded_sectors').length == 0) {
            if (investedsector_interval != null) clearInterval(investedsector_interval);
        }
        // Stop Refresh Timer if Sectors Gain Chart Widget is closed
        if ($('#traded_sectors_by_gainer').length == 0) {
            if (sectorgainchart_interval != null) clearInterval(sectorgainchart_interval);
        }
        // Stop Refresh Timer if Index Impact Widget is closed
        if ($('#market_movers_table').length == 0) {
            if (index_impact_interval != null) clearInterval(index_impact_interval);
        }

    });
}

function updateWidgetContent(container, content) {
    container.getElement().html(content);
}

function get_terminal_data(terminal_dynamic_id)
{
    let table = $('#' + terminal_dynamic_id).find('#market_table_' + terminal_dynamic_id);
    let tbodyTr = table?.find('tbody tr');
    if(tbodyTr.length <= 0)
    {
        let local_side_val = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_orderside_' + terminal_dynamic_id);  
        let local_exchange_val = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_exchange_' + terminal_dynamic_id);
        let local_dealer_val = localStorage.getItem(system_username + '_' + profile_page + '_' + pid + '_dealer_' + terminal_dynamic_id); 
        
        if(local_side_val){
            $("#order_side_filter_" + terminal_dynamic_id + " option").each(function() {
                if ($(this).val() == local_side_val) {
                    $(this).attr("selected", "selected");
                } else {
                    $(this).removeAttr("selected");
                }
            });
        } 

        if(local_exchange_val){
            $("#order_exchange_filter_" + terminal_dynamic_id + " option").each(function() {
                if ($(this).val() == local_exchange_val) {
                    $(this).attr("selected", "selected");
                } else {
                    $(this).removeAttr("selected");
                }
            });
        } 
       
        if(local_dealer_val){ 
            $('#order_terminal_dealer_id_' + terminal_dynamic_id).val(local_dealer_val).trigger('change.select2');
        } 

        get_order_history(terminal_dynamic_id);
    }
}

function updatesWidgetContensFromApi(tradingwindow) {
    var widgetsToUpdate = findWidgetsToUpdate(tradingwindow); 
    var pid_selected = document.querySelector("#profile li.profile-selected-li");
    var pid = pid_selected.getAttribute("data-value");
    if (widgetsToUpdate) {
        for (var i = 0; i < widgetsToUpdate.length; i++) {
            var widgetTitle = widgetsToUpdate[i].config.title;
            if (widgetTitle.includes('Watchlist')) { 
                // Split the widget title into words
                var words = widgetTitle.split(' '); 
                var widgetTitlePart2 = words[1];  
                var watchlist_dynamic_id = 'wl_table_' + widgetTitlePart2;

                (function (index) {
                    $.get('shared/widget_watchlist_advanced/' + widgetTitlePart2, function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i); 

                let watchlist_header = $('#' + watchlist_dynamic_id).closest('.lm_item.lm_stack');
                let watchlist_header_text = watchlist_header.find('.lm_active').children().eq(1).text(); 
                let watchlist_header_dropdown = watchlist_header.find('.selectedColor'); 

                let watchlist_color = getLocalStorageValue(`${widgetTitle}_color`); 
                if(watchlist_color && watchlist_header_text === widgetTitle){ 
                   watchlist_header_dropdown.css('background-color', watchlist_color ); 
                }  

            }
            else if (widgetTitle.includes('Order Terminal')) {  
                var words = widgetTitle.split(' ');
                var widgetTitlePart2 = words[2];

                if (widgetTitlePart2 === undefined) {
                    (function(index) {
                        $.get('shared/widget_orderterminal/' + '1', function(data) {
                            updateWidgetContent(widgetsToUpdate[index].container, data);
                            get_terminal_data('terminal_1');

                            let order_header = $('#terminal_1').closest('.lm_item.lm_stack');
                            let order_header_elem = order_header.children().eq(0).find('.lm_title');  
                            let order_header_dropdown = order_header.find('.selectedColor');

                            for (var i = 0; i < order_header_elem.length; i++) {
                                let title_texts = $(order_header_elem[i]).text();  
                                if(title_texts == 'Order Terminal'){
                                    $(order_header_elem[i]).text('Order Terminal 1')
                                }
                            }
                          
                            let order_terminal_color =  getLocalStorageValue('Order Terminal 1_color');
                            if (order_terminal_color) {
                                order_header_dropdown.css('background-color', order_terminal_color);
                            }

                        });
                    })(i);
                } else {
                    (function(index, terminalId) {
                        $.get('shared/widget_orderterminal/' + terminalId, function(data) {
                            updateWidgetContent(widgetsToUpdate[index].container, data);
                            get_terminal_data('terminal_' + terminalId);
                            // Apply custom color if stored in localStorage
                            let order_header = $('#terminal_' + terminalId).closest('.lm_item.lm_stack');
                            let order_header_text = order_header.find('.lm_active').children().eq(1).text(); 
                            let order_header_dropdown = order_header.find('.selectedColor'); 
                        
                            let order_terminal_color = getLocalStorageValue(`${widgetTitle}_color`);
                            if (order_terminal_color && order_header_text === widgetTitle) {
                                order_header_dropdown.css('background-color', order_terminal_color);
                            }
                        });
                    })(i, widgetTitlePart2);
                }
            
            }

            else if (widgetTitle.includes('Quote')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_quotebox/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let quote_header = $('#quote_box').closest('.lm_item.lm_stack');
                let quote_text = quote_header.find('.lm_active').children().eq(1).text(); 
                let quote_header_dropdown = quote_header.find('.selectedColor'); 

                let quote_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (quote_color && quote_text === 'Quote') {
                    quote_header_dropdown.css('background-color', quote_color);
                }
            }
            else if (widgetTitle.includes('Market Watch')) {
                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_screener/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let mwatch_header = $('#web-market-watch-container').closest('.lm_item.lm_stack');
                let mwatch_text = mwatch_header.find('.lm_active').children().eq(1).text(); 
                let mwatch_header_dropdown = mwatch_header.find('.selectedColor');

                let mwatch_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (mwatch_color && mwatch_text === 'Market Watch') {
                    mwatch_header_dropdown.css('background-color', mwatch_color);
                }

            }
            else if (widgetTitle == 'Chart') {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_chart/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let chart_header = $('#tv_chart_container_advanced').closest('.lm_item.lm_stack');
                let chart_header_text = chart_header.find('.lm_active').children().eq(1).text(); 
                let chart_header_dropdown = chart_header.find('.selectedColor');

                let chart_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (chart_color && chart_header_text === 'Chart') {
                    chart_header_dropdown.css('background-color', chart_color);
                }
            }
            else if (widgetTitle.includes('Stock Info')) { 
                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('analysis/stock_analysis', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
                let stock_header = $('#stock_analysis').closest('.lm_item.lm_stack');
                let stock_header_text = stock_header.find('.lm_active').children().eq(1).text(); 
                let stock_header_dropdown = stock_header.find('.selectedColor');

                let stock_info_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (stock_info_color && stock_header_text === 'Stock Info') {
                    stock_header_dropdown.css('background-color', stock_info_color);
                }
            }
            else if (widgetTitle.includes('Order Summary')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_ordersummary/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let summary_header = $('#code-summary').closest('.lm_item.lm_stack');
                let summary_header_text = summary_header.find('.lm_active').children().eq(1).text(); 
                let summary_header_dropdown = summary_header.find('.selectedColor');

                let order_summary_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (order_summary_color && summary_header_text === 'Order Summary') {
                    summary_header_dropdown.css('background-color', order_summary_color);
                }
            }
            else if (widgetTitle.includes('Account Limits')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_accountlimits/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let acc_header = $('#account_limit_summary').closest('.lm_item.lm_stack');
                let acc_header_text = acc_header.find('.lm_active').children().eq(1).text(); 
                let acc_header_dropdown = acc_header.find('.selectedColor');

                let account_limit_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (account_limit_color && acc_header_text === 'Account Limits') {
                    acc_header_dropdown.css('background-color', account_limit_color);
                }            
            }
            else if (widgetTitle.includes('Portfolio')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_portfolio/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let portfolio_header = $('#account-portfolio').closest('.lm_item.lm_stack');
                let portfolio_header_text = portfolio_header.find('.lm_active').children().eq(1).text(); 
                let portfolio_header_dropdown = portfolio_header.find('.selectedColor');
               
                let portfolio_color = getLocalStorageValue(`${widgetTitle}_color`); 
                if (portfolio_color && portfolio_header_text === 'Portfolio') {
                    portfolio_header_dropdown.css('background-color', portfolio_color);
                }
            }
            else if (widgetTitle.includes('Market Depth')) { 
                let market_depth_title = widgetTitle;
                // Split the widget title into words
                var words = widgetTitle.split(' '); 
                var widgetTitlePart2 = words[2]; 
                var mkt_dynamic_id = 'mktdpt_table_' + widgetTitlePart2;
        
                (function (index) {
                    $.get('shared/widget_marketdepth/' + widgetTitlePart2, function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                        // Retrieve data from local storage
                        let get_local_mkt_symbol = localStorage.getItem(system_username + '_mkt' + market_depth_title); 
                        if (get_local_mkt_symbol) { 
                            
                            let mktSymbolArray = JSON.parse(get_local_mkt_symbol);
                            let symbol_mktdpt_input_id = mktSymbolArray[0].symbol_id;  
                            let mktdpt_symbol = mktSymbolArray[0].mkt_symbol;

                            // Update DOM elements
                            if ($('.mktdpt_symbol_name').length > 0) { 
                                    $('#' + symbol_mktdpt_input_id).val(mktdpt_symbol);
                                    getmktdepth(mktdpt_symbol, symbol_mktdpt_input_id,true);
                            }
                        }
                    });
                })(i);

                let mkt_header = $('#exchange_' + mkt_dynamic_id).closest('.lm_item.lm_stack');
                let mktdpt_header_text = mkt_header.find('.lm_active').children().eq(1).text();
                let mkt_header_dropdown = mkt_header.find('.selectedColor');

                let mktdpt_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (mktdpt_color && mktdpt_header_text === widgetTitle) {
                    mkt_header_dropdown.css('background-color', mktdpt_color);
                }
                
            }
            else if (widgetTitle.includes('News')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_news/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let news_header = $('#all-news-content').closest('.lm_item.lm_stack');
                let news_header_text =  news_header.find('.lm_active').children().eq(1).text();
                let news_header_dropdown = news_header.find('.selectedColor');

                let news_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (news_color && news_header_text === 'News') {
                    news_header_dropdown.css('background-color', news_color);
                } 
            }
          
            else if (widgetTitle.includes('Account Snapshot')) {
                // Close the widget
                widgetsToUpdate[i].container.close();
                // Remove the widget from the list if needed
                widgetsToUpdate.splice(i, 1);
                // Decrement 'i' to account for the removed widget
                i--;
            }
            else if (widgetTitle.includes('Market Sentiment')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_market_sentiment/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle.includes('Advance Decline')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_advance_decline/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle.includes('Top Sectors')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_top_sectors/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

            }
            else if (widgetTitle.includes('Sector Gain')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_sector_gain/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle.includes('Top Stocks')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_top_stocks/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let top_stock_header = $('#traded_symbol').closest('.lm_item.lm_stack');
                let top_stock_header_text = top_stock_header.find('.lm_active').children().eq(1).text();
                let top_stock_header_dropdown = top_stock_header.find('.selectedColor');

                let top_stock_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (top_stock_color && top_stock_header_text === 'Top Sectors') {
                    top_stock_header_dropdown.css('background-color', top_stock_color);
                }
            }

            else if (widgetTitle.includes('Top Gainer')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_top_gainer/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                
                let top_gainer_header = $('#top_gainer_container').closest('.lm_item.lm_stack');
                let top_gainer_header_text = top_gainer_header.find('.lm_active').children().eq(1).text();
                let top_gainer_header_dropdown = top_gainer_header.find('.selectedColor');

                let top_gainer_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (top_gainer_color && top_gainer_header_text === 'Top Gainer') {
                    top_gainer_header_dropdown.css('background-color', top_gainer_color);
                }
            }

            else if (widgetTitle.includes('Top Loser')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_top_loser/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);

                let top_loser_header = $('#top_loser_container').closest('.lm_item.lm_stack');
                let top_loser_header_text = top_loser_header.find('.lm_active').children().eq(1).text();
                let top_loser_header_dropdown = top_loser_header.find('.selectedColor');

                let top_loser_color = getLocalStorageValue(`${widgetTitle}_color`);
                if (top_loser_color && top_loser_header_text === 'Top Loser') {
                    top_loser_header_dropdown.css('background-color', top_loser_color);
                }
            }

            else if (widgetTitle.includes('Corp. Events')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_corp_events/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle.includes('Index Impact')) {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_index_impact/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle == 'Index Chart') {

                // Create an IIFE to capture the current value of i
                (function (index) {
                    $.get('shared/widget_index_chart/', function (data) {
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle.includes('Time & Sales Ticker')) { 
          
                (function (index) {
                    $.get('shared/widget_time_sale_ticker/', function (data) {
                    
                        updateWidgetContent(widgetsToUpdate[index].container, data);
                    });
                })(i);
            }
            else if (widgetTitle == 'Time & Sale ' ) {
                // Close the widget
                widgetsToUpdate[i].container.close();
                // Remove the widget from the list if needed
                widgetsToUpdate.splice(i, 1);
                // Decrement 'i' to account for the removed widget
                i--;
            } 
        }

    }

}

function findWidgetsToUpdate(layout) {
    var widgets = layout.root.getItemsByType('component');
    return widgets.length > 0 ? widgets : null;
}

var addWidget = function (title, content, width, height) {

    var newItemConfig = {
        title: title,
        type: 'component',
        width: width,
        height: height,
        componentName: 'widget',
        componentState: {
            content: content
        }
    };
    watchlistwindow.root.contentItems[0].addChild(newItemConfig);
};

function saveGrid(pid, profile_page) {
    if (profile_page != null) {
        var state = JSON.stringify(watchlistwindow.toConfig());
        localStorage.setItem(system_username + '_layout_' + profile_page + '_' + pid, state);
        var url = '/shared/saveprofile/';
        var data = {
            // pname: profilename,
            pdata: 'localstorage',
            pid: pid,
            profile_content_watchlist: state,
            overwrite: '1'
        };


        $.post(url, data)
            .done(function (data) {

                show_flash_messages("Profile Saved", 'success');
                // refresh_profile();
            })
            .fail(function (data) {

                show_flash_messages("Failed to Save Profile", 'danger');
            });

    }
}

function loadGrid(pid, profile_page) {
    if (profile_page != null) { 
        $.get('/shared/loadprofile/', { profile: pid })
            .done(function (data) { 
                var tradingLayout = data.profile_content_watchlist;
                if (tradingLayout !== null) {
                    call_multiwindow(JSON.parse(tradingLayout), true); 
                } else {
                    //Default Content for Trading Portal
                    $.getJSON("static/default_content/watchlist_default_content.json", function (json) {
                        call_multiwindow(json, true);
                    });
                }
                // show_flash_messages("Profile Loaded",'success');
            })
            .fail(function (data) {
                show_flash_messages("Failed to Load Profile", 'danger');
            });
    }
}

function deleteGrid(pid, profile_page) {
    if (profile_page != null) {
        localStorage.removeItem(system_username + '_layout_' + profile_page + '_' + pid);
    }
}


$('#watchlistContainer').on('click', '.wd_settings', function () {   
    let target_widget_title = $(this).parent().siblings().find('.lm_active').children().eq(1).text();
    let id_number = target_widget_title.match(/\d+/);
    id_number = id_number ? id_number[0] : null;  
    
    if (target_widget_title.includes('Watchlist')) {
        showSettings('Watchlist', id_number); 
    } else if (target_widget_title.includes('Market Depth')) {
        showSettings('Market Depth', id_number); 
    } else if (target_widget_title.includes('Order Terminal')) {
        showSettings('Order Terminal', id_number);
    } else { 
        showSettings(target_widget_title);
    }
});