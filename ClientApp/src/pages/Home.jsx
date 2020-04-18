import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import { usePosition } from 'use-position'

// hard coded locations
// const data = [
//   { latitude: 27.7733, longitude: -82.6389, text: 'A' },
//   { latitude: 27.7766, longitude: -82.7365, text: 'B' },
//   { latitude: 27.8777, longitude: -82.7582, text: 'C' },
// ]

export function Home() {
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(
    false,
    { enableHighAccuracy: true }
  )
  // console.log(latitude, longitude, timestamp, accuracy, error)

  const [viewport, setViewport] = useState({
    width: 800,
    height: 800,
    latitude: latitude,
    longitude: longitude,
    zoom: 8,
  })

  useEffect(() => {
    setViewport(prev => {
      return {
        ...prev,
        latitude: latitude,
        longitude: longitude,
      }
    })
  }, [latitude, longitude])

  const [showPopup, setShowPopup] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState({})
  const [markers, setMarkers] = useState([])
  const [locationAddress, setLocationAddress] = useState('')
  const loadAllLocations = async () => {
    const resp = await axios.get('/api/location')
    setMarkers(resp.data)
  }

  useEffect(() => {
    loadAllLocations()
  }, [])

  const markerClicked = place => {
    console.log('marker clicked', place)
    setSelectedPlace(place)
    setShowPopup(true)
  }

  const addNewLocation = () => {
    const resp = axios.post('/api/location', {
      description: 'from UI',
      fullAddress: locationAddress,
    })
    if (resp.status === 200) {
      setMarkers(prevMarkers => {
        return [resp.data, ...prevMarkers]
      })
    }
  }
  return (
    <div>
      <section>
        <input
          type="text"
          placeholder="Full address..."
          value={locationAddress}
          onChange={e => setLocationAddress(e.target.value)}
        />
        <button onClick={addNewLocation}>Add New Location</button>
      </section>

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
              <div className="popup-window">😊{selectedPlace.description}</div>
            </Popup>
          )}
          {markers.map(place => {
            return (
              <Marker
                latitude={place.latitude}
                longitude={place.longitude}
                key={place.id}
              >
                <div onClick={() => markerClicked(place)}>📍</div>
              </Marker>
            )
          })}
          {/* <Marker
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
          })} */}
        </ReactMapGL>
      </section>
    </div>
  )
}
