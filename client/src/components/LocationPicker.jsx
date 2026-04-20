import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { MapPin, X, Search } from 'lucide-react';

const libraries = ['places'];
const campusCenter = { lat: 16.4836, lng: 80.4987 };

const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c3e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a1a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
];

const LocationPicker = ({ onLocationSelect, selectedLocation }) => {
  const [showMap, setShowMap] = useState(false);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const searchBoxRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries
  });

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setAddress(addr);
    onLocationSelect({ lat, lng, address: addr });
  }, [onLocationSelect]);

  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const addr = place.formatted_address || place.name;
        setMarker({ lat, lng });
        setAddress(addr);
        onLocationSelect({ lat, lng, address: addr });
      }
    }
  };

  const handleConfirm = () => {
    setShowMap(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowMap(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium glass border transition-all w-full justify-center"
        style={{
          borderColor: selectedLocation ? 'var(--success)' : 'rgba(108,99,255,0.3)',
          color: selectedLocation ? 'var(--success)' : 'var(--accent)'
        }}
      >
        <MapPin size={15} />
        {selectedLocation ? `📍 Location Selected ✓` : 'Pick Exact Location on Map'}
      </button>

      {selectedLocation && (
        <p className="text-xs mt-1.5 px-1" style={{ color: 'var(--muted)' }}>
          📍 {selectedLocation.address}
        </p>
      )}

      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="glass rounded-2xl border border-[var(--border)] w-full max-w-2xl overflow-hidden"
            style={{ maxHeight: '90vh' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div>
                <h3 className="font-display font-semibold text-white">
                  Pick Location on Map
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Search or click on map to mark location
                </p>
              </div>
              <button onClick={() => setShowMap(false)}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                <X size={18} />
              </button>
            </div>

            {!isLoaded ? (
              <div className="h-96 flex items-center justify-center"
                style={{ color: 'var(--muted)' }}>
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-3" />
                  Loading map...
                </div>
              </div>
            ) : (
              <>
                {/* Search box */}
                <div className="p-3 border-b border-[var(--border)]">
                  <StandaloneSearchBox
                    onLoad={ref => searchBoxRef.current = ref}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--muted)' }} />
                      <input
                        type="text"
                        placeholder="Search for a place on campus..."
                        className="input-dark w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                  </StandaloneSearchBox>
                </div>

                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '380px' }}
                  center={marker || campusCenter}
                  zoom={17}
                  onClick={handleMapClick}
                  options={{
                    styles: mapStyles,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {marker && (
                    <Marker
                      position={marker}
                      animation={2}
                    />
                  )}
                </GoogleMap>
              </>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border)]">
              {marker ? (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs flex-1 truncate" style={{ color: 'var(--muted)' }}>
                    📍 {address}
                  </p>
                  <button
                    onClick={handleConfirm}
                    className="btn-primary px-5 py-2 rounded-xl text-sm font-medium flex-shrink-0"
                  >
                    Confirm Location
                  </button>
                </div>
              ) : (
                <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                  Click anywhere on the map or search to mark the location
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;