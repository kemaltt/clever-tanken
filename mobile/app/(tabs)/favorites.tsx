import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Heart, MapPin, Navigation, Info, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Favorites, FavoriteStation } from '@/utils/Favorites';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<FavoriteStation[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await Favorites.getAll();
    setFavorites(favs);
  };

  const renderFavorite = ({ item }: { item: FavoriteStation }) => (
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
          <View className="bg-red-500/10 px-2 py-0.5 rounded-md mt-1">
            <Heart size={10} color="#ef4444" fill="#ef4444" />
          </View>
        </View>
      </View>
      
      <View className="flex-row items-center pt-3 border-t border-white/5">
        <View className="flex-row items-center flex-1">
          <View className="bg-white/5 p-1.5 rounded-full">
            <MapPin size={12} color="#94a3b8" />
          </View>
          <Text className="text-gray-400 text-xs ml-2 flex-1" numberOfLines={1}>{item.street}, {item.place}</Text>
        </View>
        <ChevronRight size={18} color="#334155" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#020617]">
      {/* Header */}
      <View className="px-6 pt-14 pb-5 bg-gradient-to-b from-blue-600/10 to-transparent">
        <Text className="text-white font-bold text-3xl tracking-tighter">{t('favorites.title')}</Text>
        <Text className="text-gray-500 text-sm mt-1">{t('favorites.subtitle')}</Text>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-white/5 p-8 rounded-full mb-6">
            <Heart size={48} color="#334155" />
          </View>
          <Text className="text-white font-bold text-xl mb-2">{t('favorites.no_favorites')}</Text>
          <Text className="text-gray-500 text-center font-medium leading-5">
            {t('favorites.no_favorites_desc')}
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)')}
            className="mt-8 bg-blue-600 px-8 py-4 rounded-2xl"
          >
            <Text className="text-white font-bold">{t('favorites.explore')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavorite}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
