import { useEffect, useMemo, useRef } from "react";
import { GeoJSON, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { bbox } from "@turf/turf";
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from "../../data/mapDefaults";
import { SCHOOL_AREA } from "../../data/schoolArea";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import { useEligibility, useRecommendations } from "../../hooks/useAnalysis";
import { buildZoneBuffer, formatDistance } from "../../services/spatialAnalysis";
import { homeIcon, passiveSchoolIcon, recommendedSchoolIcon, selectedSchoolIcon } from "./markerIcons";
import { MapControlsDock } from "./MapControlsDock";
import { LayersPanel } from "./LayersPanel";
import { Legend } from "./Legend";
import { FloatingHint } from "./FloatingHint";
import type { School } from "../../types/school";

// Peta dikunci di sekitar area sekolah, dengan ruang geser agar tepinya tidak tertutup panel.
const PAN_MARGIN_DEGREES = 0.35;
const [AREA_WEST, AREA_SOUTH, AREA_EAST, AREA_NORTH] = bbox(SCHOOL_AREA);
const MAP_BOUNDS: [[number, number], [number, number]] = [
  [AREA_SOUTH - PAN_MARGIN_DEGREES, AREA_WEST - PAN_MARGIN_DEGREES],
  [AREA_NORTH + PAN_MARGIN_DEGREES, AREA_EAST + PAN_MARGIN_DEGREES],
];
/** Paling jauh: seluruh area sekolah masih terlihat. Paling dekat: tingkat jalan. */
const MAP_MIN_ZOOM = 11;
const MAP_MAX_ZOOM = 18;

function toLatLng([lng, lat]: [number, number]): [number, number] {
  return [lat, lng];
}

/** Keeps the Leaflet view in sync with the selected school (smooth pan+zoom). */
function FlyToSelection({ school }: { school: School }) {
  const map = useMap();
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      map.setView(toLatLng(school.coordinates), 15.5, { animate: true });
      return;
    }
    map.flyTo(toLatLng(school.coordinates), 15.5, { duration: 1.1 });
  }, [school.id, map]);

  return null;
}

function FlyToSearchLocation() {
  const map = useMap();
  const coordinates = useSchoolFinderStore((s) => s.mapFocusCoordinates);

  useEffect(() => {
    if (coordinates) map.flyTo(toLatLng(coordinates), 15.5, { duration: 1 });
  }, [coordinates, map]);

  return null;
}

/** Handles map clicks to reposition the home/domicile marker. */
function ClickToSetHome() {
  const setHome = useSchoolFinderStore((s) => s.setHome);
  useMapEvents({
    click(e) {
      setHome([e.latlng.lng, e.latlng.lat], "Titik domisili (dipilih di peta)");
    },
  });
  return null;
}

export function MapView() {
  const schools = useSchoolFinderStore((s) => s.schools);
  const selectedSchoolId = useSchoolFinderStore((s) => s.selectedSchoolId);
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const home = useSchoolFinderStore((s) => s.home);
  const setHome = useSchoolFinderStore((s) => s.setHome);
  const layers = useSchoolFinderStore((s) => s.layers);
  const radiusOverrideMeters = useSchoolFinderStore((s) => s.radiusOverrideMeters);
  const eligibility = useEligibility();
  const recommendations = useRecommendations();

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId) ?? schools[0];
  const radius = radiusOverrideMeters ?? selectedSchool.zoneRadiusMeters;

  const bufferGeoJson = useMemo(
    () => buildZoneBuffer(selectedSchool.coordinates, radius),
    [selectedSchool.id, selectedSchool.coordinates, radius]
  );

  const homeLatLng = toLatLng(home.coordinates);
  const schoolLatLng = toLatLng(selectedSchool.coordinates);
  const midpoint: [number, number] = [(homeLatLng[0] + schoolLatLng[0]) / 2, (homeLatLng[1] + schoolLatLng[1]) / 2];

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      maxZoom={MAP_MAX_ZOOM}
      maxBounds={MAP_BOUNDS}
      maxBoundsViscosity={1}
      zoomControl={false}
      className="w-full h-full"
      id="gis-viewport"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains="abc"
        maxZoom={MAP_MAX_ZOOM}
        className="dark-basemap-tiles"
      />

      <ClickToSetHome />
      <FlyToSelection school={selectedSchool} />
      <FlyToSearchLocation />

      {layers.buffer && (
        <GeoJSON
          key={`${selectedSchool.id}-${radius}`}
          data={bufferGeoJson}
          style={{
            color: "#4d8eff",
            weight: 2,
            dashArray: "5,4",
            fillColor: "#4d8eff",
            fillOpacity: 0.14,
            className: "tutorial-buffer-zone",
          }}
        />
      )}

      <Polyline
        positions={[homeLatLng, schoolLatLng]}
        pathOptions={{
          color: eligibility.isEligible ? "#4ae176" : "#ef4444",
          weight: 2.5,
          dashArray: "6,4",
          opacity: 0.9,
        }}
      />

      {/* Distance readout pill at the connector midpoint */}
      <Marker
        position={midpoint}
        icon={L.divIcon({
          className: "school-marker-icon",
          html: `<div style="width:max-content;white-space:nowrap;transform:translate(-50%,-50%);padding:4px 10px;border-radius:9999px;background:#0c1321;border:1.5px solid ${
            eligibility.isEligible ? "#4ae176" : "#ef4444"
          };color:#dce2f6;font:600 11px 'Inter',sans-serif;">${formatDistance(eligibility.distanceMeters)}</div>`,
          iconSize: [0, 0],
        })}
        interactive={false}
      />

      {schools.map((school) => {
        const isSelected = school.id === selectedSchool.id;
        const rec = recommendations.find((r) => r.school.id === school.id);
        const icon = isSelected
          ? selectedSchoolIcon()
          : rec
          ? recommendedSchoolIcon(rec.rank)
          : passiveSchoolIcon();

        return (
          <Marker
            key={school.id}
            position={toLatLng(school.coordinates)}
            icon={icon}
            eventHandlers={{ click: () => selectSchool(school.id) }}
          >
            <Tooltip direction="top" offset={[0, -14]} opacity={0.95} className="!font-body-sm">
              <span className="font-semibold">{school.name}</span>
              {rec ? ` · Pilihan #${rec.rank}` : isSelected ? " · Target" : ""}
            </Tooltip>
          </Marker>
        );
      })}

      <Marker
        position={homeLatLng}
        icon={homeIcon()}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const latlng = e.target.getLatLng();
            setHome([latlng.lng, latlng.lat], "Titik domisili (digeser di peta)");
          },
        }}
      >
        <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
          Domisili: {home.label}
        </Tooltip>
      </Marker>

      <FloatingHint />
      <MapControlsDock />
      <LayersPanel />
      <Legend />
    </MapContainer>
  );
}
