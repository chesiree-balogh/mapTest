import React, { useState } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

const data = [
  { latitude: 27.7733, longitude: -82.6389, text: 'A' },
  { latitude: 27.7766, longitude: -82.7365, text: 'B' },
  { latitude: 27.8777, longitude: -82.7582, text: 'C' },
]

export function Home() {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 27.7743,
    longitude: -82.6389,
    zoom: 8,
  })

  const [showPopup, setShowPopup] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState({})

  const markerClicked = place => {
    console.log('marker clicked', place)
    setSelectedPlace(place)
    setShowPopup(true)
  }

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Show popup</button>
      <section className="map-container">
        <ReactMapGL
          {...viewport}
          onViewportChange={setViewport}
          mapboxApiAccessToken={
            'pk.eyJ1IjoiY2hlemJpYW4iLCJhIjoiY2s5MzM5Z2VjMDFlOTNrc2p1N2M1cWZjeSJ9.OhBsG3p6qB9AfvtMEGhLOg'
          }
        >
          {showPopup && (
            <Popup
              latitude={selectedPlace.latitude}
              longitude={selectedPlace.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
              anchor="top"
              offsetTop={15}
            >
              <div className="popup-window">😊{selectedPlace.text}</div>
            </Popup>
          )}
          <Marker
            latitude={27.7743}
            longitude={-82.6389}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <div>📍central</div>
          </Marker>
          {data.map(place => {
            return (
              <Marker
                latitude={place.latitude}
                longitude={place.longitude}
                key={place.text}
              >
                <div onClick={() => markerClicked(place)}>{place.text}</div>
              </Marker>
            )
          })}
        </ReactMapGL>
      </section>
    </div>
  )
}
