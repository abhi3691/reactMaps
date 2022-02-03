import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, StyleSheet, View, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const GoGLE_PLACES_API_KEY = 'AIzaSyDRKyUzBNnGeLdKXfL0xZmkHmQueJs5z5A';
const screenWidth = Dimensions.get('window').width;
export default function App() {
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  async function getPermission() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
  useEffect(() => {
    getPermission().then(() => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      </MapView>

      <GooglePlacesAutocomplete
        styles={styles.searchbar}
        placeholder="Search Place"
        query={{
          key: GoGLE_PLACES_API_KEY,
          language: 'en',
        }}
        GooglePlacesDetailsQuery={{
          fields: 'geometry',
        }}
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log(details?.geometry?.location);
          setLocation({
            latitude: details?.geometry?.location.lat,
            longitude: details?.geometry?.location.lng,
          });
        }}
        onFail={error => {
          console.log(error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },
  searchbar: {
    description: {
      fontWeight: 'bold',
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
    textInputContainer: {
      backgroundColor: '#fff',
      width: screenWidth-20,
      top:10,
      borderRadius: 5,
      
      
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 45,
      color: '#5d5d5d',
      fontSize: 16,
      borderWidth: 0,
      
    },
    listView: {
      backgroundColor: 'rgba(192,192,192,0.9)',
      top: 23,
    },
  },
  
});
