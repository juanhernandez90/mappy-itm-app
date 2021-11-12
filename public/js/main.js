const map = L.map('map-template').setView([4.610, -74.082], 13);

const tile = L.tileLayer('https://b.tile.openstreetmap.org/{z}/{x}/{y}.png');

// Socket Io
const socket = io.connect();

// Geolocation
map.locate({enableHighAccuracy: true});

map.on('locationfound', event => {
    const coords = [event.latlng.lat, event.latlng.lng];
    const newMarker = L.marker(coords);
    newMarker.bindPopup('You are Here!');
    map.addLayer(newMarker);
    socket.emit('userCoordinates', event.latlng);
});

// socket new User connected
socket.on('newUserCoordinates', coords => {
    const newUserMarker = L.marker([coords.lat, coords.lng], {icon: userIcon});
    newUserMarker.bindPopup('New User!');
    map.addLayer(newUserMarker);
    map.setView([4.610, -74.082]);
});

map.addLayer(tile);

