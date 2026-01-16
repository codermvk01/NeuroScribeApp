import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '../../constants/Colors';

const clinics = [
  // Example dummy data of clinics
  { id: '1', name: 'Dr. A Tata Hospital', lat: 19.004676, lng: 72.843042, contact: '1234567890' },
  { id: '2', name: 'Dr. B Neuro Center', lat: 12.9736, lng: 77.5956, contact: '0987654321' },
];

export default function DoctorsScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Show the map only if region is available */}
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation>
          {/* Map markers for clinics */}
          {clinics.map((clinic) => (
            <Marker
              key={clinic.id}
              coordinate={{ latitude: clinic.lat, longitude: clinic.lng }}
              pinColor={Colors.light.primary}
              title={clinic.name}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {locationError ? locationError : 'Loading map...'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
