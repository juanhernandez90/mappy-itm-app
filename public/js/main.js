const map = L.map('map-template').setView([4.610, -74.082], 13);

const tile = L.tileLayer('https://b.tile.openstreetmap.org/{z}/{x}/{y}.png');

// Socket Io
const socket = io.connect();

// Geolocation
map.locate({enableHighAccuracy: true});

const homeIcon = L.icon({
    iconUrl: '../assets/home.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
});

const meIcon = L.icon({
    iconUrl: '../assets/me.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
});

const otherIcon = L.icon({
    iconUrl: '../assets/other.png',
    iconSize: [30, 30],
    iconAnchor: [30, 30],
});

map.on('locationfound', event => {
    const meMarker = L.marker([event.latlng.lat, event.latlng.lng], {icon: meIcon});
    meMarker.bindPopup('You are Here!');
    map.addLayer(meMarker);
    map.setView([event.latlng.lat, event.latlng.lng], 13)
    socket.emit('userCoordinates', event.latlng);
});

// socket new User connected
socket.on('newUserCoordinates', coords => {
    const newUserMarker = L.marker([coords.lat, coords.lng], {icon: otherIcon});
    newUserMarker.bindPopup('Hi!');
    map.addLayer(newUserMarker);
});

map.addLayer(tile);

function addHomeLocation(lat, lng, inf) {
    const meMarker = L.marker([lat, lng], {icon: homeIcon});
    meMarker.bindPopup(inf);
    map.addLayer(meMarker);
}

function upload(event) {
    postData('http://localhost:8080/rest/v0/analyzer', event.target.files[0])
        .then(data => {
            console.log(data);
            data.forEach(home => {
                if (home.latitud !== null && home.longitud !== null) {
                    addHomeLocation(
                        home.latitud.replace(',', '.'),
                        home.longitud.replace(',', '.'),
                        `Tipo de vivienda: ${home.tipoVivienda}, Tamaño: ${home.tamanio}, Sector: ${home.sector}, 
                        Habitaciones: ${home.habitaciones}, Direccion: ${home.direccion}`
                    )
                }
            })
        })
        .catch(error => console.error(error));
}

async function postData(url = '', file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    return response.json();
}

