import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { Search, MapPin, Fuel, ChevronRight, Navigation, Map as MapIcon } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
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

export default function HomeScreen() {
  const [zipCode, setZipCode] = useState('');
  const [fuelType, setFuelType] = useState('diesel');
  const [loading, setLoading] = useState(false);
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [fetchingNearby, setFetchingNearby] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const fuelTypes = [
    { id: 'diesel', label: 'Diesel' },
    { id: 'e10', label: 'Super E10' },
    { id: 'e5', label: 'Super E5' },
    { id: 'superplus', label: 'SuperPlus' },
    { id: 'premium_diesel', label: 'Premium Diesel' },
    { id: 'hvo_diesel', label: 'HVO Diesel' },
    { id: 'gtl_diesel', label: 'GTL-Diesel' },
    { id: 'lkw_diesel', label: 'LKW-Diesel' },
    { id: 'lpg', label: 'LPG' },
    { id: 'cng', label: 'CNG' },
    { id: 'lng', label: 'LNG' },
    { id: 'bioethanol', label: 'Bioethanol' },
    { id: 'adblue_lkw', label: 'AdBlue LKW' },
    { id: 'adblue_pkw', label: 'AdBlue PKW' },
  ];

  const visibleFuelTypes = showAllTypes ? fuelTypes : fuelTypes.slice(0, 3);

  useEffect(() => {
    // Request permission on mount and re-fetch if fuelType changes
    initLocation();
  }, [fuelType]);

  const initLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        fetchNearbyStations();
      }
    } catch (error) {
      console.error('Init location error:', error);
    }
  };

  const fetchNearbyStations = async () => {
    try {
      setFetchingNearby(true);
      const location = await Location.getCurrentPositionAsync({});
      const response = await axios.get(`${Config.API_BASE_URL}/stations`, {
        params: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          type: fuelType,
          rad: 5
        }
      });
      if (response.data.ok) {
        setNearbyStations(response.data.stations.slice(0, 3));
      }
    } catch (error) {
      console.error('Fetch nearby error:', error);
    } finally {
      setFetchingNearby(false);
    }
  };

  const handleSearch = () => {
    // Navigate to results
    router.push({
        pathname: '/(tabs)/two', 
        params: { zipCode, fuelType }
    });
  };

  const handleCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Yetki Reddedildi', 'Konumunuza erişmek için izin vermeniz gerekmektedir.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      router.push({
        pathname: '/(tabs)/two',
        params: {
          lat: location.coords.latitude.toString(),
          lng: location.coords.longitude.toString(),
          fuelType
        }
      });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Hata', 'Konumunuz alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-950">
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000&auto=format&fit=crop' }}
        className="flex-1"
        resizeMode="cover"
      >
        <ScrollView className="flex-1 bg-black/40 px-6 pt-20">
          <Text className="text-4xl font-bold text-white mb-2">Günstiger Tanken</Text>
          <Text className="text-lg text-gray-300 mb-8">En uygun fiyatları keşfedin</Text>

          {/* Using style instead of className for BlurView to avoid cssInterop complexity for now */}
          <BlurView intensity={30} tint="dark" style={{ borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-400 mb-2 uppercase">Konum</Text>
              <View className="flex-row items-center bg-white/10 rounded-2xl px-4 py-3 border border-white/5">
                <MapPin size={20} color="#9ca3af" />
                <TextInput
                  placeholder="Posta kodu veya şehir"
                  placeholderTextColor="#6b7280"
                  className="flex-1 ml-3 text-white text-base"
                  value={zipCode}
                  onChangeText={setZipCode}
                />
              </View>
            </View>

            <View className="mb-8">
              <View className="flex-row justify-between items-end mb-3">
                <Text className="text-sm font-semibold text-gray-400 uppercase">Yakıt Tipi</Text>
                <TouchableOpacity onPress={() => setShowAllTypes(!showAllTypes)}>
                  <Text className="text-blue-400 text-xs font-bold uppercase">
                    {showAllTypes ? 'Daha Az' : 'Daha Fazla'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {visibleFuelTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => setFuelType(type.id)}
                    style={{ width: '31%' }}
                    className={`py-3 items-center rounded-2xl border ${
                      fuelType === type.id 
                        ? 'bg-blue-600 border-blue-500' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <Text className={`font-medium ${
                      fuelType === type.id ? 'text-white' : 'text-gray-400'
                    }`}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleSearch}
              disabled={loading}
              className={`bg-blue-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg shadow-blue-500/50 ${loading ? 'opacity-50' : ''}`}
            >
              <Search size={22} color="white" />
              <Text className="text-white font-bold text-lg ml-2">{loading ? 'Aranıyor...' : 'Fiyatları Bul'}</Text>
            </TouchableOpacity>
          </BlurView>

          <View className="mt-10 mb-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-white">Yakındaki İstasyonlar</Text>
              <TouchableOpacity onPress={handleCurrentLocation}>
                <Text className="text-blue-400 font-semibold">Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {fetchingNearby ? (
              <ActivityIndicator color="#3b82f6" style={{ marginTop: 20 }} />
            ) : nearbyStations.length > 0 ? (
              nearbyStations.map((station) => (
                <TouchableOpacity 
                  key={station.id}
                  className="flex-row items-center bg-white/5 rounded-2xl p-4 border border-white/5 mb-3"
                  onPress={() => {
                    router.push({
                      pathname: '/(tabs)/two',
                      params: { lat: station.lat.toString(), lng: station.lng.toString(), fuelType }
                    });
                  }}
                >
                  <View className="bg-blue-500/20 p-3 rounded-xl">
                    <Navigation size={22} color="#3b82f6" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-white font-semibold text-base" numberOfLines={1}>{station.name}</Text>
                    <Text className="text-gray-500 text-sm">{station.dist.toFixed(1)} km • {station.brand || 'Libre'}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-blue-400 font-bold text-lg">{station.price.toFixed(2)}€</Text>
                  </View>
                  <ChevronRight size={18} color="#4b5563" className="ml-2" />
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity 
                onPress={handleCurrentLocation}
                className="flex-row items-center bg-white/5 rounded-2xl p-4 border border-white/5 mb-4"
              >
                <View className="bg-blue-500/20 p-3 rounded-xl">
                  <Navigation size={22} color="#3b82f6" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold text-base">Geçerli Konumum</Text>
                  <Text className="text-gray-500 text-sm">En yakın istasyonları göster</Text>
                </View>
                <ChevronRight size={20} color="#4b5563" />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
