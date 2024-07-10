import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export const VenueMap = ({ coords }) => {
  if (!coords || !coords[0] || !coords[1]) return null;
  return (
    <MapContainer
      key={JSON.stringify(coords)}
      center={coords}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 180, width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coords}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
