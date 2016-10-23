// Map and Mapbox init
const coordinatesOulu = [65.0126, 25.4715];
const initialZoomLevel = 14;

// L is loaded in index.html
L.mapbox.accessToken = 'pk.eyJ1Ijoic2hlbWVpa2thIiwiYSI6ImNpdWpscGI3NzAwMDgyem1tMm1qZTdiMnAifQ.7QMFrGPz-nNsbSkhC_Sv6w';

const mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

let markers = new L.FeatureGroup();

const map = L.map('map')
    .addLayer(mapboxTiles)    
    .setView(coordinatesOulu, initialZoomLevel);

// Markers

let markerMap = new Map();

const clearMarkers = () => {
    markers.clearLayers();
}

const addMarker = node => {
    const content = `<h3>${node.address}</h3>Power level: ${node.powerLevel}`;
    const marker = L.marker([node.latitude, node.longitude]).bindPopup(content);

    // Add node to marker so we can easily use it later on
    marker.data_node = node;

    markerMap.set(node.address, marker);

    marker.on('mouseover', function (e) {
        this.openPopup();
    });
    marker.on('mouseout', function (e) {
        this.closePopup();
    });

    markers.addLayer(marker);
};

const loopMarkers = data => {
    data.eachLayer(function (marker) {
        console.debug(marker.getLatLng());
    });
};

// Requests

const fetchNodes = () => {
    clearMarkers();
    clearNodeContainer();

    $.getJSON("api/nodes", function (data) {
        data.forEach(node => {            
            addMarker(node);
            createNodeElement(node);
        });
        
        map.addLayer(markers);
        setNodeCount(data.length);
    });
};

const randomizeNodes = () => {
    $.post("api/nodes/randomize", function (_data) {
        fetchNodes();
    })
};

// DOM

const clearNodeContainer = () => {
    const parent = document.querySelector("#node-container");
    parent.innerHTML = "";
};

const setNodeCount = count => {
    const elem = document.querySelector("#node_count");
    elem.innerHTML = `${count} nodes in system`;
};

const createNodeElement = node => {
    const parent = document.querySelector("#node-container");
    const elem = document.createElement("div");
    elem.classList.add("node-element");
    elem.dataset.address = node.address;
    elem.innerHTML = `Address: ${node.address}<br />Power level: ${node.powerLevel}`;
    parent.appendChild(elem);
};

const nodeOverEvent = e => {
    if (e.target && e.target.className == "node-element") {        
        const address = e.target.dataset.address;
        const marker = markerMap.get(address);
        marker.openPopup();        
    }    
};

const nodeOutEvent = e => {
    if (e.target && e.target.className == "node-element") {        
        const address = e.target.dataset.address;
        const marker = markerMap.get(address);
        marker.closePopup();        
    }    
};

// Calls

const main = () => {
    fetchNodes();
};

// Run scripts after DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    main();

    document.querySelector('#btn_randomize').addEventListener('click', randomizeNodes);
    document.querySelector("#node-container").addEventListener("mouseover", nodeOverEvent);
    document.querySelector("#node-container").addEventListener("mouseout", nodeOutEvent);
});
