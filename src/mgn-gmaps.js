/*

Megane Template

Website: http://megane-template.com/
License: Dentsu Isobar All Rights Reserved.

*/
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.mgnGmaps = factory();
    }
}(this, function() {

    function mgnGmaps(selector, option) {

        this.selector = selector;
        this.mapElm = document.querySelectorAll( this.selector );

        //option
        if(option == null) option = {};

        this.scrollwheel = option.scrollwheel ? option.scrollwheel : false;

        if( option.zoom ) this.zoomDefault = option.zoom.default ? option.zoom.default : 14;
        if( option.zoom ) this.zoomMin = option.zoom.min ? option.zoom.min : 2;
        if( option.zoom ) this.zoomMax = option.zoom.max ? option.zoom.max : 20;

        if( option.pin ) this.pinIcon = option.pin.icon ? option.pin.icon : false;
        if( option.pin ) this.pinWidth = option.pin.width ? option.pin.width : 220;
        if( option.pin ) this.pinHeight = option.pin.height ? option.pin.height : 54;
        if( option.pin ) this.pinAnimation = option.pin.animation ? option.pin.animation : null;

        this.responsiveFlag;
        if( option.responsive ) this.responsiveZoomDefault = option.responsive.zoom.default ? option.responsive.zoom.default : 12;
        if( option.responsive ) this.responsiveBreakpoint = option.responsive.breakpoint ? option.responsive.breakpoint : null;
        if( option.responsive ) this.responsiveZoomMin = option.responsive.zoom.min ? option.responsive.zoom.min : 11;
        if( option.responsive ) this.responsiveZoomMax = option.responsive.zoom.max ? option.responsive.zoom.max : 14;
        if( option.responsive ) this.responsivePinWidth = option.responsive.pin.width ? option.responsive.pin.width : 115;
        if( option.responsive ) this.responsivePinHeight = option.responsive.pin.height ? option.responsive.pin.height : 27;

        if( option.styles ) this.stylesPattern = option.styles.pattern ? option.styles.pattern : null;
        if( option.styles ) this.stylesOriginal = option.styles.original ? option.styles.original : null;

        this.mapTypeControl = option.mapTypeControl ? option.mapTypeControl : false;
        this.mapTypeControlOptions = option.mapTypeControlOptions ? option.mapTypeControlOptions : null;

        this.CreateEnd = function(){};

        this.latLng = [];
        this.map    = [];

        if( this.mapElm[0] ) {
            this.Init();
        }

    }

    /**
    **
    ** Init
    **
    **/
    mgnGmaps.prototype.Init = function() {

        var this_ = this;
        var INTERVAL = 100;
        var timer = null;

        this.Ready();

        window.addEventListener( "resize", function() {

            this.Ready();

            // 中心位置再設定
            clearTimeout(timer);
            timer = setTimeout(function() {

                this.RefreshPosition();

            }, INTERVAL);

        });

    }


    /**
    **
    ** Ready
    **
    **/
    mgnGmaps.prototype.Ready = function() {

        if( window.innerWidth < this.responsiveBreakpoint ){

            if( this.responsiveFlag || !this.responsiveFlag ){

                // SP
                this.GetOption('responsive');
                this.responsiveFlag = false;
            }

        } else {

            if( !this.responsiveFlag || !this.responsiveFlag ){

                // PC
                this.GetOption();
                this.responsiveFlag = true;
            }

        }

    }


    /**
    **
    ** GetOption
    **
    **/
    mgnGmaps.prototype.GetOption = function( responsive ) {

        var zoom = [],
            pin = [];

        var zoomDefault,
            zoomMin,
            zoomMax,
            pinWidth,
            pinHeight;

        // zoom & pin 設定
        for ( var i = 0; i < this.mapElm.length; i++ ) {

            var DATA_LAT = Number( this.mapElm[i].getAttribute("data-lat") );
            var DATA_LMG = Number( this.mapElm[i].getAttribute("data-lng") );
            var DATA_ZOOM_SP = Number( this.mapElm[i].getAttribute("data-spzoom") );
            var DATA_ZOOM = Number( this.mapElm[i].getAttribute("data-zoom") );

            this.latLng[i] = new google.maps.LatLng( DATA_LAT, DATA_LMG, false );

            if( responsive ){

                zoomDefault = DATA_ZOOM_SP ? DATA_ZOOM_SP : this.zoomDefault;
                zoomMin = this.responsiveZoomMin;
                zoomMax = this.responsiveZoomMax;
                pinWidth = this.responsivePinWidth;
                pinHeight = this.responsivePinHeight;

            } else {

                zoomDefault = DATA_ZOOM ? DATA_ZOOM : this.zoomDefault;
                zoomMin = this.zoomMin;
                zoomMax = this.zoomMax;
                pinWidth = this.pinWidth;
                pinHeight = this.pinHeight;

            }

            zoom[i] = {
                default: zoomDefault,
                min: zoomMin,
                max: zoomMax
            };

            pin[i] = {
                width: pinWidth,
                height: pinHeight
            };

        }

        this.SetOption( zoom, pin );

    }

    /**
    **
    ** SetOption
    **
    **/
    mgnGmaps.prototype.SetOption = function( zoom, pin ) {

        var mapOption    = [],
            mapOptionSp    = [],
            markerOption = [],
            markerOptionSp = [],
            animationOption,
            styleOption;

        switch ( this.pinAnimation ){

            case "DROP":
            animationOption = google.maps.Animation.DROP;
            break;

            case "BOUNCE":
            animationOption = google.maps.Animation.BOUNCE;
            break;

            default:
            animationOption = null;
            break;

        }

        // map 設定
        for (var i = 0; i < this.mapElm.length; i++) {

            mapOption[i] = {
                zoom: zoom[i].default,
                minZoom: zoom[i].min,
                maxZoom: zoom[i].max,
                center: this.latLng[i],
                scrollwheel: this.scrollwheel,
                mapTypeControl: this.mapTypeControl,
                mapTypeControlOptions: this.mapTypeControlOptions
            };

            markerOption[i] = {
                position: this.latLng[i],
                icon: {
                    url: this.pinIcon,
                    scaledSize: new google.maps.Size( pin[i].width, pin[i].height )
                },
                animation: animationOption
            };

        }

        // style 設定
        if( this.stylesOriginal ){

            styleOption = this.stylesOriginal;

        }else if( this.stylesPattern ){

            switch ( this.stylesPattern ){

                case "mono":
                styleOption = [
                    {
                        "featureType": "all",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": "-100"
                            }
                        ]
                    }
                ];
                break;

                case "sepia":
                styleOption = [
                    {
                        "featureType": "all",
                        "elementType": "all",
                        "stylers": [
                        {
                            "saturation": "-29"
                        },
                        {
                            "lightness": "0"
                        },
                        {
                            "hue": "#ff8d00"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative.country",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative.province",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative.locality",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "on"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative.neighborhood",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                        {
                            "lightness": "0"
                        }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "saturation": "-50"
                        }
                        ]
                    },
                    {
                        "featureType": "landscape.natural",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "saturation": "5"
                        }
                        ]
                    },
                    {
                        "featureType": "landscape.natural.landcover",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "saturation": "-2"
                        }
                        ]
                    },
                    {
                        "featureType": "landscape.natural.terrain",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "saturation": "-17"
                        }
                        ]
                    },
                    {
                        "featureType": "landscape.natural.terrain",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "on"
                        }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                        {
                            "saturation": "-64"
                        },
                        {
                            "lightness": "-8"
                        }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": "-40"
                        },
                        {
                            "saturation": "-61"
                        }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#ffffff"
                        },
                        {
                            "weight": "1.5"
                        }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels",
                        "stylers": [
                        {
                            "visibility": "off"
                        }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                        {
                            "color": "#c1bdb5"
                        }
                        ]
                    }
                ];
                break;

                case "retro":
                styleOption = [
                    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
                    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
                    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
                    {
                        featureType: 'administrative',
                        elementType: 'geometry.stroke',
                        stylers: [{color: '#c9b2a6'}]
                    },
                    {
                        featureType: 'administrative.land_parcel',
                        elementType: 'geometry.stroke',
                        stylers: [{color: '#dcd2be'}]
                    },
                    {
                        featureType: 'administrative.land_parcel',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#ae9e90'}]
                    },
                    {
                        featureType: 'landscape.natural',
                        elementType: 'geometry',
                        stylers: [{color: '#dfd2ae'}]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'geometry',
                        stylers: [{color: '#dfd2ae'}]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#93817c'}]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry.fill',
                        stylers: [{color: '#a5b076'}]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#447530'}]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{color: '#f5f1e6'}]
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'geometry',
                        stylers: [{color: '#fdfcf8'}]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{color: '#f8c967'}]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{color: '#e9bc62'}]
                    },
                    {
                        featureType: 'road.highway.controlled_access',
                        elementType: 'geometry',
                        stylers: [{color: '#e98d58'}]
                    },
                    {
                        featureType: 'road.highway.controlled_access',
                        elementType: 'geometry.stroke',
                        stylers: [{color: '#db8555'}]
                    },
                    {
                        featureType: 'road.local',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#806b63'}]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'geometry',
                        stylers: [{color: '#dfd2ae'}]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#8f7d77'}]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'labels.text.stroke',
                        stylers: [{color: '#ebe3cd'}]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'geometry',
                        stylers: [{color: '#dfd2ae'}]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry.fill',
                        stylers: [{color: '#b9d3c2'}]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#92998d'}]
                    }
                ];
                break;

                default:
                styleOption = null;
                break;
            }
        }else{
            styleOption = null;
        }

        this.CreateMap( mapOption, markerOption, styleOption );

    }

    /**
    **
    ** CreateMap
    **
    **/
    mgnGmaps.prototype.CreateMap = function( mapOption, markerOption, styleOption ) {

        var marker = [];

        for (var i = 0; i < this.mapElm.length; i++) {

            // map
            this.map[i] = new google.maps.Map( this.mapElm[i], mapOption[i] );

            // marker
            markerOption[i].map = this.map[i];
            marker[i] = new google.maps.Marker( markerOption[i] );

            // style
            this.map[i].setOptions( { styles: styleOption } );

            this.CreateEnd();

        }

    }

    /**
    **
    ** RefreshPosition
    **
    **/
    mgnGmaps.prototype.RefreshPosition = function() {

        for (var i = 0; i < this.mapElm.length; i++) {

            this.map[i].panTo( this.latLng[i] );

        }

    }

    return mgnGmaps;

}));
