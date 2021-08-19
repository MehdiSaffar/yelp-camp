mapboxgl.accessToken = token
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center,
    zoom: 8
})

new mapboxgl.Marker().setLngLat(center).addTo(map)
