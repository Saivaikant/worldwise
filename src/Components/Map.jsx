import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesProvider";
import CountryLogo from "./CountryLogo";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";
import GetUrlLocation from "../Components/GetUrlLocation";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setmapPosition] = useState([40, 0]);
  const { lat, lng } = GetUrlLocation();

  const {
    isloading: isloadPosition,
    getPosition,
    position: { lat: geolat, lng: geolang },
  } = useGeolocation();

  useEffect(() => {
    if (lat && lng) setmapPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geolat & geolang) setmapPosition([geolat, geolang]);
  }, [geolat, geolang]);

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isloadPosition ? "loading.." : "Get location"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                <CountryLogo emoji={city.emoji} />
              </span>
              {city.cityName}
            </Popup>
          </Marker>
        ))}
        <AddPosition position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function AddPosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
