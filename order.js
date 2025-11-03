var exchange = 'All';
var ITEMS_PER_PAGE = 10;
var news_filter = '';

$(document).ready(function() {
    let storedFontSize = localStorage.getItem(`${system_username}_${pid}_news_font`) || 'system';
    changenewsFontSize(storedFontSize);
    $('#fontSize_news').find(`input[value="${storedFontSize}"]`).prop('checked', true);

    //Symbol-News Hide
    $("#announcement-content").hide();
    market_news();
    symbol_input();
});

// Function to change font size
function changenewsFontSize(fontSize) { 
    let mkt_news_content = $("#mkt-news-content"); 
    mkt_news_content.removeClass('font-size-extra-large-body font-size-large-body font-size-normal-body font-size-small-body font-size-extra-small-body font-size-xxs-small-body');
   
    // Add font size classes based on the selected font size
    switch (fontSize) {
        case 'extra-large': 
            mkt_news_content.addClass('font-size-extra-large-body');
            break;
        case 'large': 
            mkt_news_content.addClass('font-size-large-body');
            break;
        case 'system': 
            let customFont = localStorage.getItem("customFont") || '0.80';
            let customWeight = localStorage.getItem("customWeight") || 500;
            mkt_news_content.css({ "font-size": customFont + 'rem', "font-weight": customWeight });
            break;
        case 'normal': 
            mkt_news_content.addClass('font-size-normal-body');
            break;
        case 'small': 
            mkt_news_content.addClass('font-size-small-body');
            break;
        case 'extra-small': 
            mkt_news_content.addClass('font-size-extra-small-body');
            break;
        case 'xxs-small': 
            mkt_news_content.addClass('font-size-xxs-small-body');
            break;
        default:
            break;
    }

    // Save font size to localStorage
    localStorage.setItem(`${system_username}_${pid}_news_font`, fontSize);
};

// Event listener for radio buttons
 $(document).on('change', '.news-font-group input[type="radio"]', function() {
    let fontSize = $(this).val(); 
    changenewsFontSize(fontSize);
});

// Handle news type selection
$('#news_selector').change(function() {
    const selectedValue = $(this).val();
 
    // Hide all content sections first
    $('#mkt-news-content, #announcement-content').hide();
    
    switch(selectedValue) {
        case 'mkt_news': 
            $('#mkt-news-content').show(); 
            $('#news_sym_filter').show();
            $('#exchange_news').show();
            market_news();
            break;   
        case 'announcement': 
            $('#announcement-content').show();
            $('#news_sym_filter').hide();
            $('#exchange_news').hide();
            fetch_announcement();
            break;
    }
});

$('#exchange_news').change(function(e){
    exchange = $(this).val(); 
    if ($('#mkt-news-content').length > 0 && $('#mkt-news-content').is(":visible")) {
        market_news();
    }
});

function market_news(page=1, ticker=null){
    var newsDiv = document.querySelector("#accordion_today_news");
    newsDiv.innerHTML = "";

    // Hide pagination button immediately
    $("#news_pagination").addClass('news_pagination_hide');

    $.get("/shared/getnews/", { 
            inst:ticker, 
            page: page, 
            limit: ITEMS_PER_PAGE, 
            search: news_filter, 
            exchange: exchange,
        }, function (response) { 
        if (response?.data.items.length > 0) {   
            realTimeNewsIndex = response?.data.items.length; 
            for (i = 0; i < response?.data.items.length; i++) {
                const data = response?.data.items; 
                const news_title = data[i].news_title; 
                const news_text = data[i].news_text;
                const news_type = data[i].news_type;
                const news_url = data[i].news_url;
                const exchange = data[i].exchange;
                const news_ref = data[i].news_ref;
                const news_date = data[i].news_date;
                const last_update_string = formatDateTime(data[i].last_update);

                var accordionItem = document.createElement("div");
                accordionItem.classList.add("accordion-item");

                accordionItem.innerHTML = `
                    <div class="accordion-header text-overflow-ellipsis" id="today_heading${i}">
                        <div class="d-flex justify-content-between align-items-center" onclick="toggleAccordionToday(this)">
                            <h2 class="mb-0 accordion-header-h2">
                                <span class="accordion-header-icon"><i class="fa fa-chevron-right toggle-chevron-today"></i></span>
                                <button class="btn btn-link text-left today-news-btn custom-btn pl-0 collapsed" 
                                        type="button" 
                                        aria-expanded="false" 
                                        aria-controls="today_collapse${i}">
                                    <b class="d-none current_news_symbol">${news_ref}</b>
                                    ${news_title}
                                    <br>
                                    <span style="margin-left: 2px; font-size: 13px;">${exchange}</span>
                                    <span style="margin-left: 5px; color: #3B61EB;">${news_type}</span>
                                </button>
                            </h2>
                            <div class="mt-2 mr-2 text-right">
                                <p class="m-0" style="font-size: 14px;">${last_update_string}</p>
                                <p class="m-0" style="font-size: 14px;">${news_date}</p>
                            </div>
                        </div>
                    </div>
                    <div id="today_collapse${i}" 
                        class="accordion-collapse collapse" 
                        aria-labelledby="today_heading${i}">
                        <div class="accordion-body accordion-text-body">
                            ${news_text} ${(news_url ? ` Ref-<a href="${news_url}" target="_blank">${news_url}</a>` : '')}
                        </div>
                    </div>
                `; 
                newsDiv.appendChild(accordionItem); 
            } 

             // Now show pagination after data is fully added
             $("#news_pagination").removeClass('news_pagination_hide');
            
            /// Generate pagination
            let selector = '#pagination_news';
            let limit_selector = '#news_limit';
            let total_record_selector = '#news_record';
            const paginationData = {
                page:response.data.page,
                pages:response.data.pages,
                per_page:response.data.per_page,
                total:response.data.total_items
            }
            generateCommonPagination(paginationData, market_news, selector, limit_selector, total_record_selector);

        } else { 
            $("#news_pagination").addClass('news_pagination_hide');
        }
    });
}

function toggleAccordionToday(clickedDiv) {
    // Find the button element within the clicked div
    const button = clickedDiv.querySelector('button[aria-controls]');
    const icon = clickedDiv.querySelector('.toggle-chevron-today');
    const collapseId = button.getAttribute('aria-controls');
    const collapseElement = document.getElementById(collapseId);
    const accordionItem = clickedDiv.closest('.accordion-item');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Close all other accordion items first
    document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== accordionItem) {
            const otherDiv = item.querySelector('.d-flex');
            const otherButton = otherDiv.querySelector('button[aria-controls]');
            const otherCollapseId = otherButton.getAttribute('aria-controls');
            const otherCollapse = document.getElementById(otherCollapseId);
            const otherIcon = otherDiv.querySelector('.toggle-chevron-today');

            otherButton.setAttribute('aria-expanded', 'false');
            otherCollapse.classList.remove('show');
            otherIcon.classList.remove('fa-chevron-down');
            otherIcon.classList.add('fa-chevron-right');
            item.querySelector('.accordion-header').style.borderRadius = '8px';
        }
    });

    // Toggle the clicked accordion
    if (isExpanded) {
        // Close it
        button.setAttribute('aria-expanded', 'false');
        collapseElement.classList.remove('show');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
        accordionItem.querySelector('.accordion-header').style.borderRadius = '8px';
    } else {
        // Open it
        button.setAttribute('aria-expanded', 'true');
        collapseElement.classList.add('show');
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
        accordionItem.querySelector('.accordion-header').style.borderRadius = '8px 8px 0px 0px';
    }
}

$('#news_key_filter').keyup(function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        news_filter = $(this).val();
        if ($('#mkt-news-content').length > 0 && $('#mkt-news-content').is(":visible")) {
            market_news();
        }
        if ($('#announcement-content').length > 0 && $('#announcement-content').is(":visible")) {
            fetch_announcement();
        }
    }
});

function clear_news_filter(){
    news_filter = '';
    $('#news_key_filter').val('');
    $('#news_sym_filter').val('');

    if ($('#mkt-news-content').length > 0 && $('#mkt-news-content').is(":visible")) {
        market_news();
    }
    if ($('#announcement-content').length > 0 && $('#announcement-content').is(":visible")) {
        fetch_announcement();
    }
}

function fetch_announcement(page=1) {
    $.get('announcement/list', { search: news_filter, user: system_username, page: page, limit: ITEMS_PER_PAGE }, function (response) {
        let announcementDiv = document.querySelector("#announcement-content");
        announcementDiv.innerHTML = "";
        if (response.data?.items.length > 0) {
            $("#news_pagination").removeClass('news_pagination_hide');

            let accordion = document.createElement("div");
            accordion.classList.add("accordion");
            accordion.id = "accordionExampleAnnounce";
            realTimeAnnounceIndex = response.data?.items.length;

            for (i = 0; i < response.data?.items.length; i++) {
                const record = response.data?.items[i];
                const announcement_title = record.title;
                const announcement_text = record.text;
                const last_update_string = record.created_at;

                let accordionItem = document.createElement("div");
                accordionItem.classList.add("accordion-item");

                let accordionHeader = document.createElement("div");
                accordionHeader.classList.add("accordion-header", "text-overflow-ellipsis");
                accordionHeader.id = `announce_heading${i}`;

                let buttonClass = i === 0 ? "" : "collapsed";

                accordionHeader.innerHTML = `
                    <h2 class="mb-0 accordion-header-h2" onclick="toggleAccordionToday(this)">
                        <span class="accordion-header-icon"><i class="fa fa-chevron-right toggle-chevron-today"></i></span>
                        <button class="btn btn-link today-news-btn custom-btn pl-0 ${buttonClass}" type="button" aria-expanded="${i === 1 ? 'true' : 'false'}" aria-controls="collapse${i}">
                            ${announcement_title}
                            <br>
                            <span style="font-size: 14px;">${last_update_string}</span>
                        </button>
                    </h2>
                `;

                accordionHeader.setAttribute("data-toggle", "collapse");
                accordionHeader.setAttribute("data-target", `#announce_collapse${i}`);

                let accordionCollapse = document.createElement("div");
                accordionCollapse.id = `announce_collapse${i}`;
                let collapseClasses = i === 0 ? "collapse" : "collapse"; // Initial accordion item is expanded
                accordionCollapse.classList.add(collapseClasses, "accordion-body", "accordion-text-body-today");

                accordionCollapse.setAttribute("aria-labelledby", `announce_heading${i}`);
                accordionCollapse.setAttribute("data-parent", "#accordionExampleAnnounce");

                accordionCollapse.innerHTML = `${announcement_text}`;

                accordionItem.appendChild(accordionHeader);
                accordionItem.appendChild(accordionCollapse);
                accordion.appendChild(accordionItem);

            }  
            announcementDiv.appendChild(accordion); 

            // Generate pagination
            let selector = '#pagination_news';
            let limit_selector = '#news_limit';
            let total_record_selector = '#news_record';
            const paginationData = {
                page:response.data.page,
                pages:response.data.pages,
                per_page:response.data.per_page,
                total:response.data.total_items
            }
            generateCommonPagination(paginationData, fetch_announcement, selector, limit_selector, total_record_selector);
        } else {
            $("#news_pagination").addClass('news_pagination_hide');
        }
    });
}

function set_updated_news_limit(selectedValue) { 
    ITEMS_PER_PAGE = selectedValue;
    if ($('#mkt-news-content').length > 0 && $('#mkt-news-content').is(":visible")) {
        market_news();
    }
    if ($('#announcement-content').length > 0 && $('#announcement-content').is(":visible")) {
        fetch_announcement();
    }
}