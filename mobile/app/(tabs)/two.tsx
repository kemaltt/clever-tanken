import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Map, List, ChevronLeft, MapPin, Navigation, Info } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
  const { zipCode, fuelType, lat, lng } = useLocalSearchParams();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mapRegion, setMapRegion] = useState({
    latitude: lat ? parseFloat(lat as string) : 52.5200,
    longitude: lng ? parseFloat(lng as string) : 13.4050,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    fetchStations();
  }, [zipCode, fuelType, lat, lng]);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const params: any = {
        type: fuelType || 'diesel',
        rad: 10
      };

      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      } else {
        params.location = zipCode;
      }

      const response = await axios.get(`${Config.API_BASE_URL}/stations`, {
        params
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
      className="bg-gray-900 mx-4 mb-4 rounded-2xl p-4 border border-white/5"
      onPress={() => {/* Open Detail */}}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-white font-bold text-lg" numberOfLines={1}>{item.name}</Text>
          <Text className="text-gray-400 text-sm">{item.brand || 'Libre'}</Text>
        </View>
        <View className="items-end">
          <Text className="text-blue-400 font-bold text-xl">
            {item.price ? `${item.price.toFixed(3)}€` : '--- €'}
          </Text>
          <Text className={`text-[10px] font-bold uppercase mt-1 ${item.isOpen ? 'text-green-500' : 'text-red-500'}`}>
            {item.isOpen ? 'AÇIK' : 'KAPALI'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-2 pt-2 border-t border-white/5">
        <MapPin size={14} color="#6b7280" />
        <Text className="text-gray-400 text-xs ml-1 flex-1">{item.street}, {item.place}</Text>
        <View className="bg-gray-800 px-2 py-1 rounded-md ml-2">
          <Text className="text-gray-300 text-[10px] font-medium">{item.dist.toFixed(1)} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-gray-950 border-b border-white/5 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">İstasyonlar</Text>
        <TouchableOpacity 
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="bg-white/5 p-2 rounded-xl border border-white/10"
        >
          {viewMode === 'list' ? <Map size={20} color="#3b82f6" /> : <List size={20} color="#3b82f6" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-400 mt-4">Fiyatlar getiriliyor...</Text>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={stations}
          keyExtractor={(item) => item.id}
          renderItem={renderStation}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20 px-10">
              <Info size={48} color="#374151" />
              <Text className="text-gray-400 text-center mt-4">İstasyon bulunamadı. Lütfen arama kriterlerini değiştirin.</Text>
            </View>
          }
        />
      ) : (
        <View className="flex-1">
          <MapView
            className="flex-1"
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
              >
                <View className="bg-blue-600 px-2 py-1 rounded-lg border border-white/20 shadow-md">
                   <Text className="text-white font-bold text-xs">
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
