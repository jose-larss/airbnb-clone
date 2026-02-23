"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los íconos en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


interface MapProps {
    center?: [number, number];
}

const Maps: React.FC<MapProps> = ({ center }) => {
    return (
        <MapContainer
            center={center || [51, -0.09]}
            zoom={center ? 4 : 2}
            scrollWheelZoom={false}
            className="h-[35vh] rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && <Marker position={center} />}
        </MapContainer>
    );
};

export default Maps;
