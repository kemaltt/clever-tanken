import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, Fuel, Info } from 'lucide-react-native';

export default function FavoritesScreen() {
  return (
    <View className="flex-1 bg-black px-6 pt-20">
      <Text className="text-3xl font-bold text-white mb-2">Favoriler</Text>
      <Text className="text-gray-400 mb-8">Sık kullandığınız istasyonlar burada görünür</Text>

      <View className="flex-1 items-center justify-center -mt-20">
        <View className="bg-gray-900/50 p-6 rounded-full border border-white/5 mb-6">
          <Heart size={48} color="#374151" fill="#1f2937" />
        </View>
        <Text className="text-white font-semibold text-lg mb-2">Henüz favori yok</Text>
        <Text className="text-gray-500 text-center px-10 mb-8">
          Arama sonuçlarından beğendiğiniz istasyonları kalbe tıklayarak buraya ekleyebilirsiniz.
        </Text>
        
        <TouchableOpacity className="bg-blue-600/10 border border-blue-500/20 px-8 py-3 rounded-2xl">
          <Text className="text-blue-400 font-bold">İstasyon Ara</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
