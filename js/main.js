var startCoords = []
var endCoords = []
var activityCode = 0;

var fromOptions = {
    fillColor: '#00BF32',
    fillOpacity: 0.3,
    strokeWeight: 5,
    clickable: false,
    editable: true,
    zIndex: 1
}
var toOptions = {
    fillColor: '#FF7F00',
    fillOpacity: 0.3,
    strokeWeight: 5,
    clickable: false,
    editable: true,
    zIndex: 2
}


function initialize() {

    var latlng = new google.maps.LatLng(48.110278, 16.569722);
    var myOptions = {
        zoom: 4,
        center: latlng,
        draggable: true
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,

            ]
        },
        polygonOptions: fromOptions
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete',  function (polygon) {
        if(startCoords.length == 0){
            startCoords = (polygon.getPath().getArray());
            drawingManager.setOptions({
                polygonOptions: toOptions
            });
            console.log(startCoords);
        } else {
            endCoords = (polygon.getPath().getArray());
            drawingManager.setOptions({
                drawingControl: false
            });
            drawingManager.setMap(null);
        }
    });


    var client = new XMLHttpRequest();

    var cypher = {"statements": [{"statement": "MATCH (n:Airport) RETURN n.latitude,n.longitude,n.name LIMIT 25"}]};

    client.open('POST', 'http://localhost:7474/db/data/transaction/commit');
    client.setRequestHeader('Content-Type', 'application/json');

    var received = 0;

    client.onreadystatechange = function () {
        if (client.readyState == 4 && received == 0) {
            received++;

            var airports = JSON.parse(client.responseText)["results"][0]["data"];

            for (i = 0; i < airports.length; i++) {
                var airport = airports[i]["row"];
                new google.maps.Marker({
                    position: new google.maps.LatLng(airport[0], airport[1], airport[2]),
                    map: map,
                    title: airports[i].name
                });
            }
        }
    };
    client.send(JSON.stringify(cypher));

}

