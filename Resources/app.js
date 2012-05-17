var dius = {};

var Ti = Titanium;

dius.liveAuction = function() {
    "use strict";
    var _total = "";
    var _lastBid = 0;
    var _currentListingId;
    var _auctionAddressLabel;
    var _hostname = "http://10.0.1.3:3000";
    var _tabGroup = Titanium.UI.createTabGroup();
    var _font = "Arial"
    var _totalView;
    var _winBS, _winAuction;
    var _indicator;


    var success = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'ding.wav');
    var sound_success = Titanium.Media.createSound({sound:success});

//
//    var db = {};
//
//    db.init = function() {
//        var db = Titanium.Database.open('mydb');
//        db.execute('CREATE TABLE IF NOT EXISTS CONFIG (ID TEXT, NAME TEXT)');
//        var rows = db.execute('SELECT * FROM CONFIG');
//        if (rows.getRowCount() === 0) {
//            Ti.API.debug("************ INSERTING into db the default config ***************");
//            db.execute('INSERT INTO CONFIG (ID, NAME ) VALUES(?,?)', 'agent_id', '<enter agent id>');
//        }
//        rows.close();
//        db.close();
//    }
//
//    db.config = function() {
//        var db = Titanium.Database.open('mydb');
//        var rows = db.execute('SELECT * FROM CONFIG');
//        var config = {};
//        while (rows.isValidRow()) {
//            config[rows.field(0)] = rows.field(1);
//            rows.next();
//        }
//        rows.close()
//        db.close()
//        return config
//    }
//
//    db.update = function(config) {
//        var db = Titanium.Database.open('mydb');
//        for (var i in config) {
//            Ti.API.debug('key is: ' + config[i].name + ', value is: ' + config[i].value.value);
//            db.execute('UPDATE CONFIG SET NAME = ? WHERE ID = ?', config[i].value.value, config[i].name);
//        }
//        db.close()
//    }

    function _registerFailedCallback(e) {
        Ti.API.debug(e.error);
        _indicator.hide();
        _alertDialog("We're having problems..", "Failed to access REA, please try again later " + e.error);
    }

    function _ajaxRequest(url, callback) {
        var xhr = Ti.Network.createHTTPClient({
            onload : function(e) {
                var parsedResponse = JSON.parse(this.responseText);
                //Ti.API.debug(parsedResponse);
                Ti.API.debug("_ajaxRequest.onload - Jenkins called");
                callback(parsedResponse);
                //do something
            },
            onerror : _registerFailedCallback,
            timeout : 10000
        });


        Ti.API.debug("_ajaxRequest - calling url " + url);
        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.send();
    }


    function _createTabGroup() {
        return _tabGroup;
    }

    function _createTab(window, title, icon) {
        return Titanium.UI.createTab({
            icon: icon ? icon : 'images/tabs/KS_nav_ui.png',
            title: title ? title : 'Unknown',
            window:window
        });
    }

    function _createWindow(title) {
        var win = Titanium.UI.createWindow({
            title: title ? title : 'REA Live Auctions'
        });
        if (Ti.Platform.name != 'android') {
            win.hideNavBar();// disable the windows default navigation bar as it doesn't allow much styling
        }
        return win;
    }

    function _createLabel(text, left, top, fontSize) {
        return Titanium.UI.createLabel({
            color:'#fff',
            text:  text,
            font:{fontSize: fontSize || 50,fontFamily:_font, fontStyle:'bold'},
            width:'auto',
            left : left || 0,
            top : top || 0
        });
    }

    function _createListingsView(listings) {
        var data = [];

        Ti.API.debug("Creating listings " + listings + " view for total listings = " + listings.length);
        Ti.API.info(listings);

        for (var c = 0; c < listings.listings.length; c++) {

            var listing = listings.listings[c].listing;

            var address = listing.street_address + ", " + listing.suburb;
            //var user = listing.user.screen_name;
            var listing_image = _hostname + listing.thumb;
            var created_at = _prettyDate(listing.auction_date);
            var bgcolor = (c % 2) == 0 ? '#000' : '#252525';

            var row = Ti.UI.createTableViewRow({hasChild:true,height:'auto',backgroundColor:bgcolor, borderStyle :'0'});

            // Create a vertical layout view to hold all the info labels and images for each tweet
            var post_view = Ti.UI.createView({
                height:'auto',
                layout:'vertical',
                left:5,
                top:5,
                bottom:5,
                right:5
            });

            post_view.addEventListener('click', function(e) {
                Ti.API.debug("Go to auction view...");
                _auctionAddressLabel.text = e.rowData.address;
                _currentListingId = e.rowData.listingId;
                _totalView.text = "$0,000";
                _totalView.color = "#fff";
                _total = "";
                _lastBid = 0;
                _tabGroup.setActiveTab(1);
            });

            var av = Ti.UI.createImageView({
                image:listing_image,
                left:0,
                top:0,
                height:48,
                width:62
            });
            // Add the avatar image to the view
            post_view.add(av);

            var date_label = Ti.UI.createLabel({
                text:created_at,
                right:0,
                top:-18,
                bottom:2,
                height:14,
                textAlign:'right',
                width:110,
                color:'#fff',
                font:{fontFamily:_font,fontSize:12}
            });
            // Add the date to the view
            post_view.add(date_label);

            var address_text = Ti.UI.createLabel({
                text:address,
                left:70,
                top:-50,
                bottom:2,
                height: 50,
                width:220,
                textAlign:'left',
                color:'#fff',
                font:{fontFamily:_font, fontSize:14}
            });
            // Add the tweet to the view
            post_view.add(address_text);
            // Add the vertical layout view to the row
            row.add(post_view);
            row.listingId = listing.id;
            row.address = address;

            data[c] = row;


        }

        var tableview = Titanium.UI.createTableView({data:data,minRowHeight:58});
        return tableview;

    }


    function _createActivityIndicator() {
        return Titanium.UI.createActivityIndicator({
            top:-240,
            left: 0,
            style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
        });
    }

    function _createSlider() {
        return Titanium.UI.createSlider({
            min:0,
            max:250000,
            value:5000,
            width:268,
            height:11,
            top:90,
            leftTrackImage:'/images/slider_orangebar.png',
            rightTrackImage:'/images/slider_lightbar.png',
            thumbImage:'/images/slider_thumb.png'
        });

    }

    function _createButton(title, width, height, left, top, bgcolor) {
        return Titanium.UI.createButton({
            title:title,
            width: width || 50,
            height: height || 50,
            color: '#fff',
            backgroundColor: bgcolor || '#202020',
            borderRadius: 2,
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            left: left || 0,
            top: top || 0,
            font:{fontFamily:_font, fontSize:34, fontStyle:'bold'}
        });

    }

    function _createText(title) {
        return Titanium.UI.createLabel()
    }


    function _alertDialog(title, message) {
        Titanium.UI.createAlertDialog({title:title, message:message}).show();
    }


    function _currentWindow() {
        return Titanium.UI.currentWindow;
    }


    function _addBidNumber(bidNumber) {
        _totalView.hide();
        Ti.API.debug("bid " + bidNumber);
        _total = _total + bidNumber;
        var totalViewText = "$" + _total + ",000";
        Ti.API.debug("bid " + bidNumber + " new total " + totalViewText);
        _totalView.text = totalViewText;
        _totalView.color = "#fff";
        _totalView.show();
    }

    function _placeBid() {
        _indicator.show();
        Ti.API.debug("place bid");
        var bidInc = new Number(_total) - _lastBid;
        _ajaxRequest(_hostname + '/services/bid?bid_amount=' + _total + '000bid_inc=' + bidInc + '000&listing_id=' + _currentListingId, function() {
            sound_success.play();
            _totalView.color = "#ff0000";
            _lastBid = new Number(_total);
            _total = "";
            _indicator.hide();
        });
    }

// creates a 'pretty date' from a unix time stamp
    function _prettyDate(time) {
        var monthname = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var date = new Date(time * 1000), diff = ((((new Date()).getTime() - date.getTime()) / 1000) * -1 ), day_diff = Math.floor(diff / 86400);
        //Ti.API.debug("**" + day_diff + " ** " +  diff);
        if (isNaN(day_diff) || day_diff < 0) {
            return '';
        }
        if (day_diff >= 31) {
            var date_year = date.getFullYear();
            var month_name = monthname[date.getMonth()];
            var date_month = date.getMonth() + 1;
            if (date_month < 10) {
                date_month = "0" + date_month;
            }
            var date_monthday = date.getDate();
            if (date_monthday < 10) {
                date_monthday = "0" + date_monthday;
            }
            return date_monthday + " " + month_name + " " + date_year;
        }
        return day_diff == 0 && (
            diff < 60 && "just now" ||
                diff < 120 && "1 minute to go" ||
                diff < 3600 && Math.floor(diff / 60) + " minutes to go" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && "about " + Math.floor(diff / 3600) + " hours to go") ||
            day_diff == 1 && "Tomorrow" ||
            day_diff < 7 && day_diff + " days to go" ||
            day_diff < 31 && Math.ceil(day_diff / 7) + " week" + ((Math.ceil(day_diff / 7)) == 1 ? "" : "s") + " to go";
    }


    return {

        init : function() {
            //db.init();
            Titanium.UI.setBackgroundColor('#000');
            _winBS = _createWindow("Listings");

            _ajaxRequest(_hostname + "/services/listings.json", function(listings) {
                _winBS.add(_createListingsView(listings));
            });

            _winAuction = _createWindow("Auction");
            _totalView = _createLabel("$0,000", 50, -300);
            _auctionAddressLabel = _createLabel("", 50, -390, 12);
            _winAuction.add(_auctionAddressLabel);
            _winAuction.add(_totalView);

            var count = 10;
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 3; x++) {
                    var button = _createButton(--count, 70, 70, 40 + (((-x) + 2) * 80), 90 + (y * 80));

                    button.addEventListener('click', function(count) {
                        return function(e) {
                            _addBidNumber(count);
                        };
                    }(count));

                    _winAuction.add(button);
                }
            }
            var button = _createButton(0, 70, 70, 40, 330);
            button.addEventListener('click', function() {
                _addBidNumber(0);
            });
            _winAuction.add(button);
            _indicator = _createActivityIndicator();

            button = _createButton("Bid", 150, 70, 120, 330, "#99CC00");
            _winAuction.add(button);
            button.addEventListener('click', function() {
                _placeBid();
            });

            _winAuction.add(_indicator);

            _tabGroup.addTab(_createTab(_winBS, "Listings"));
            _tabGroup.addTab(_createTab(_winAuction, "Auction"));

            _tabGroup.setActiveTab(0);

            if (Ti.Platform.name != 'android') {
                _tabGroup.open({
                    transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
                });
            }
            _tabGroup.open();

        }

    };
}
    ();


dius.liveAuction.init();



