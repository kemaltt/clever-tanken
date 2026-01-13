import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, Linking, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, MapPin, Clock, Phone, Navigation, Heart, Share2, Info, Fuel } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Config from '@/constants/Config';
import { Favorites } from '@/utils/Favorites';

interface StationDetail {
  id: string;
  name: string;
  brand: string;
  street: string;
  houseNumber: string;
  postCode: number;
  place: string;
  openingTimes: any[];
  isOpen: boolean;
  diesel: number;
  e5: number;
  e10: number;
  lat: number;
  lng: number;
}

export default function StationDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [station, setStation] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchStationDetail();
    checkIfFavorite();
  }, [id]);

  const checkIfFavorite = async () => {
    if (typeof id === 'string') {
      const fav = await Favorites.isFavorite(id);
      setIsFavorite(fav);
    }
  };

  const fetchStationDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Config.API_BASE_URL}/stations/${id}`);
      if (response.data.ok) {
        setStation(response.data.station);
      } else {
        alert(response.data.message || t('station_detail.unavailable'));
        router.back();
      }
    } catch (error: any) {
      console.error('Error fetching station detail:', error);
      alert(t('common.error') + ': ' + t('station_detail.unavailable'));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!station) return;
    const isAdded = await Favorites.toggle({
      id: station.id,
      name: station.name,
      brand: station.brand,
      street: station.street,
      place: station.place,
      isOpen: station.isOpen,
      lat: station.lat,
      lng: station.lng,
      price: station.diesel,
    });
    setIsFavorite(isAdded);
  };

  const handleGetDirections = () => {
    if (!station) return;
    
    const latLng = `${station.lat},${station.lng}`;
    const label = station.name;
    const appleMapsUrl = `maps:0,0?q=${label}@${latLng}`;
    const googleMapsUrl = `comgooglemaps://?q=${latLng}(${label})`;
    const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;

    if (Platform.OS === 'ios') {
      Alert.alert(
        t('common.directions'),
        t('station_detail.choose_map'),
        [
          {
            text: 'Apple Haritalar',
            onPress: () => Linking.openURL(appleMapsUrl),
          },
          {
            text: 'Google Haritalar',
            onPress: () => {
              Linking.canOpenURL(googleMapsUrl).then((supported) => {
                if (supported) {
                  Linking.openURL(googleMapsUrl);
                } else {
                  Linking.openURL(googleMapsWebUrl);
                }
              });
            },
          },
          {
            text: t('station_detail.cancel'),
            style: 'cancel',
          },
        ]
      );
    } else {
      const androidUrl = `geo:0,0?q=${latLng}(${label})`;
      Linking.openURL(androidUrl);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-400 mt-4 font-medium">{t('common.loading')}</Text>
      </View>
    );
  }

  if (!station) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-10">
        <Info size={48} color="#374151" />
        <Text className="text-gray-400 text-center mt-4">{t('results.no_stations')}</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-8 py-3 rounded-full"
        >
          <Text className="text-white font-bold">{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=1000&auto=format&fit=crop' }}
          className="h-72 w-full"
        >
          <View className="flex-1 bg-black/40 px-6 pt-14 justify-between pb-8">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="bg-black/40 p-2 rounded-full backdrop-blur-md"
              >
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-row gap-3">
                <TouchableOpacity className="bg-black/40 p-2 rounded-full backdrop-blur-md">
                  <Share2 size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={handleToggleFavorite}
                  className="bg-black/40 p-2 rounded-full backdrop-blur-md"
                >
                  <Heart size={22} color={isFavorite ? "#ef4444" : "white"} fill={isFavorite ? "#ef4444" : "transparent"} />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-white font-bold text-3xl mb-1">{station.name}</Text>
              <View className="flex-row items-center">
                <View className={`px-2 py-1 rounded-md mr-3 ${station.isOpen ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <Text className={`text-[10px] font-bold ${station.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                    {station.isOpen ? t('common.open') : t('common.closed')}
                  </Text>
                </View>
                <Text className="text-gray-300 text-sm">{station.brand}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Content */}
        <View className="px-6 -mt-6">
          <BlurView intensity={30} tint="dark" style={{ borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <Text className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-widest">{t('home.fuel_type')}</Text>
            
            <View className="flex-row gap-4 mb-2">
              <PriceCard label="Diesel" price={station.diesel} />
              <PriceCard label="Super E5" price={station.e5} />
            </View>
            <View className="flex-row gap-4">
              <PriceCard label="Super E10" price={station.e10} highlight />
              <PriceCard label="Super Plus" price={0} disabled />
            </View>
          </BlurView>

          {/* Info Sections */}
          <View className="mt-8 gap-4">
            <InfoRow 
              icon={<MapPin size={22} color="#3b82f6" />} 
              label={t('station_detail.address')} 
              value={`${station.street} ${station.houseNumber}, ${station.postCode} ${station.place}`} 
            />
            <InfoRow 
              icon={<Clock size={22} color="#3b82f6" />} 
              label={t('station_detail.status')} 
              value={station.isOpen ? `${t('common.open')} • 24h` : t('common.closed')} 
            />
            <InfoRow 
              icon={<Fuel size={22} color="#3b82f6" />} 
              label={t('home.fuel_type')} 
              value={station.brand || "Independent"} 
            />
          </View>

          {/* Map Preview */}
          <View className="mt-8 h-48 rounded-3xl overflow-hidden border border-white/10 shadow-lg bg-gray-900">
            <MapView
              style={{ width: '100%', height: '100%' }}
              region={{
                latitude: station.lat,
                longitude: station.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              userInterfaceStyle='dark'
            >
              <Marker
                coordinate={{ latitude: station.lat, longitude: station.lng }}
                title={station.name}
              />
            </MapView>
          </View>

          <TouchableOpacity 
            onPress={handleGetDirections}
            className="bg-blue-600 mt-10 mb-20 py-5 rounded-3xl flex-row justify-center items-center shadow-lg shadow-blue-500/50"
          >
            <Navigation size={22} color="white" />
            <Text className="text-white font-bold text-lg ml-3">{t('station_detail.get_directions')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function PriceCard({ label, price, highlight = false, disabled = false }: { label: string, price: number, highlight?: boolean, disabled?: boolean }) {
  return (
    <View className={`flex-1 p-4 rounded-2xl border ${highlight ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/5'} ${disabled ? 'opacity-40' : ''}`}>
      <Text className={`text-[10px] font-bold uppercase mb-1 ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{label}</Text>
      <Text className={`text-xl font-bold ${highlight ? 'text-white' : 'text-blue-400'}`}>
        {price > 0 ? `${price.toFixed(3)}€` : '---'}
      </Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <View className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/5">
      <View className="bg-blue-500/10 p-2 rounded-xl">
        {icon}
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-tighter">{label}</Text>
        <Text className="text-white font-medium text-base">{value}</Text>
      </View>
    </View>
  );
}
