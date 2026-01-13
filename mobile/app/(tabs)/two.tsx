import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Map, List, ChevronLeft, MapPin, Navigation, Info } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Config from '@/constants/Config';

interface Station {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  lat: number;
  lng: number;
  dist: number;
  price: number;
  isOpen: boolean;
}

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mapRegion, setMapRegion] = useState({
    latitude: 52.5200,
    longitude: 13.4050,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    fetchStations();
  }, [params.zipCode, params.fuelType, params.lat, params.lng]);

  const fetchStations = async () => {
    try {
      setLoading(true);
      let queryLat = params.lat;
      let queryLng = params.lng;
      let queryLocation = (params.zipCode as string) || '';

      // If no search params, try to get current location
      if (!queryLat && !queryLng && !queryLocation) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          queryLat = loc.coords.latitude.toString();
          queryLng = loc.coords.longitude.toString();
        }
      }

      const apiParams: any = {
        type: params.fuelType || 'diesel',
        rad: 10
      };

      if (queryLat && queryLng) {
        apiParams.lat = queryLat;
        apiParams.lng = queryLng;
      } else if (queryLocation) {
        apiParams.location = queryLocation;
      }

      const response = await axios.get(`${Config.API_BASE_URL}/stations`, {
        params: apiParams
      });
      
      if (response.data.ok) {
        setStations(response.data.stations);
        if (response.data.center) {
          setMapRegion({
            ...mapRegion,
            latitude: response.data.center.lat,
            longitude: response.data.center.lng,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStation = ({ item }: { item: Station }) => (
    <TouchableOpacity 
      className="bg-[#0f172a]/80 mx-4 mb-4 rounded-3xl p-5 border border-white/5 shadow-2xl"
      onPress={() => router.push(`/station/${item.id}`)}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-4">
          <Text className="text-white font-bold text-lg mb-1" numberOfLines={1}>{item.name}</Text>
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{item.brand || 'Libre'}</Text>
        </View>
        <View className="items-end">
          <Text className="text-blue-400 font-bold text-2xl">
            {item.price ? item.price.toFixed(3) : '---'}
            <Text className="text-xs text-blue-400/60 font-medium ml-0.5">€</Text>
          </Text>
          <Text className={`text-[10px] font-black uppercase mt-1 tracking-tighter ${item.isOpen ? 'text-green-500' : 'text-red-500'}`}>
            {item.isOpen ? 'AÇIK' : 'KAPALI'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center pt-3 border-t border-white/5">
        <View className="flex-row items-center flex-1">
          <View className="bg-white/5 p-1.5 rounded-full">
            <MapPin size={12} color="#94a3b8" />
          </View>
          <Text className="text-gray-400 text-xs ml-2 flex-1" numberOfLines={1}>{item.street}, {item.place}</Text>
        </View>
        <View className="bg-gray-800/80 px-3 py-1.5 rounded-xl border border-white/5">
          <Text className="text-gray-300 text-[10px] font-bold">{item.dist.toFixed(1)} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#020617]">
      {/* Header */}
      <View className="px-6 pt-14 pb-5 bg-[#020617] flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/5 p-2 rounded-xl border border-white/5">
          <ChevronLeft size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl tracking-tight">İstasyonlar</Text>
        <TouchableOpacity 
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="bg-blue-600/10 p-2.5 rounded-xl border border-blue-500/20"
        >
          {viewMode === 'list' ? <Map size={20} color="#3b82f6" /> : <List size={20} color="#3b82f6" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-500 mt-4 font-medium">İstasyonlar aranıyor...</Text>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id}
          renderItem={renderStation}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20 px-10">
              <View className="bg-white/5 p-6 rounded-full mb-4">
                <Info size={40} color="#334155" />
              </View>
              <Text className="text-gray-400 text-center font-medium leading-5">Yakınınızda istasyon bulunamadı. Lütfen filtreleri kontrol edin.</Text>
            </View>
          }
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#020617' }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            userInterfaceStyle='dark'
          >
            {stations.map((station) => (
              <Marker
                key={station.id}
                coordinate={{ latitude: station.lat, longitude: station.lng }}
                title={station.name}
                description={station.price ? `${station.price.toFixed(3)}€` : 'Fiyat Yok'}
                onCalloutPress={() => router.push(`/station/${station.id}`)}
              >
                <View className="bg-blue-600 px-3 py-1.5 rounded-2xl border border-white/20 shadow-lg">
                   <Text className="text-white font-black text-xs">
                     {station.price ? station.price.toFixed(2) : '---'}
                   </Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>
      )}
    </View>
  );
}
