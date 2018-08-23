import mgnGmaps from './mgn-gmaps';

let gmaps = new mgnGmaps(
    ".j-maps",
    {
        scrollwheel: true,
        zoom: {
            default: 17,
            min: 3,
            max: 18,
        },
        pin: {
            icon: "./images/pin.svg",
            width: 36,
            height: 50,
            animation: 'BOUNCE'
        },
        responsive: {
            breakpoint: 640,
            zoom: {
                default: 15,
                min: 5,
                max: 18,
            },
            pin: {
                width: 18,
                height: 25
            }
        },
        styles: {
            pattern: "mono"
        },
        mapTypeControl: true, //マップタイプコントロールの有無を指定できます。 true or false デフォルトはfalse
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.HYBRID
            ],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    }
);

gmaps.CreateEnd = function(){
    console.log("CreateEnd");
};
