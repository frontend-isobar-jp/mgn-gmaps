# mgn-gmaps ( Don't Need jQuery )


Implement Google Maps API.
You can get Google Maps API key from [here](https://developers.google.com/maps/documentation/javascript/get-api-key).

- Target browser : IE11+

___

# Install

```
npm i mgn-gmaps -S
```

## Or Download raw data
[↓ download "mgn-gmaps.js"](https://raw.githubusercontent.com/frontend-isobar-jp/mgn-gmaps/master/src/mgn-gmaps.js)


___

# Import

```
import mgnGmaps from 'mgn-gmaps';
```

Prepare an element with latitude, longitude, zoom level initially displayed in data attribute.
```
<div class="[className]" data-lat="[緯度]" data-lng="[経度]" data-zoom="[ズームレベル]"></div>
```


___

# Constructor

```
new mgnGmaps( element [, option] )
```
|Argument|Data type|Default|Descroption|
|:-------|:--------|:------|:----------|
|element|String|-(Required)|Specify target element.<br>ex) ".j-maps"|
|option|Object|-|option = {<br>　scrollwheel: true,<br>　zoom: {<br>　　default: 17,<br>　　min: 2,<br>　　max: 20<br>　},<br>　pin: {<br>　　icon: "./images/flag.png",<br>　　width: 60,<br>　　height: 60,<br>　　animation: 'BOUNCE'<br>　},<br>　responsive: {<br>　　breakpoint: 640,<br>　　zoom: {<br>　　　default: 14,<br>　　　min: 5,<br>　　　max: 18<br>　　},<br>　　pin: {<br>　　　width: 20,<br>　　　height: 20<br>　　}<br>　},<br>　styles: {<br>　　pattern: "mono",<br>　　original: [<br>　　　{<br>　　　　featureType: "all",<br>　　　　elementType: "all",<br>　　　　stylers: [<br>　　　{　hue: "#ec4501"　}<br>　　　　]<br>　　　}<br>　　]<br>　},<br>　mapTypeControl: true,<br>　mapTypeControlOptions: {<br>　　mapTypeIds: [<br>　　　google.maps.MapTypeId.ROADMAP,<br>　　　google.maps.MapTypeId.HYBRID<br>　　],<br>　　style:google.maps.MapTypeControlStyle.DROPDOWN_MENU<br>　}<br>}|

|option|Data type|Default|Descroption|
|:-------|:--------|:------|:----------|
|scrollwheel|Boolean|false|Specify whether to use mouse wheel zoom.|
|zoom|Object|{<br>default: 14,<br>min: 2,<br>max: 20<br>}|Specify default/minium/maximum zoom level.|
|pin|Object|-|Specify the path and size of the original pin image.|
|responsive|Object|-|Specify breakpoint, zoom level and original pin image for responsive time.|
|styles|Object|-|pattern can be specified as "mono", "sepia" or "retro".<br>original can be specified with json code.|
|mapTypeControl|Boolean|false|Specify whether to use map type control.|
|mapTypeControlOptions|Object|-|Specify options for map type control.|

___

# Method

|Method|Argument|Descroption|
|:-------|:--------|:------|
|CreateEnd = function(){};|-|To be executed after map is created.|

___

# Demo

[https://frontend-isobar-jp.github.io/mgn-gmaps/](https://frontend-isobar-jp.github.io/mgn-gmaps/)

```
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
```
