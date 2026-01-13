import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites_stations";

export interface FavoriteStation {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  price?: number;
  isOpen: boolean;
  lat: number;
  lng: number;
}

export const Favorites = {
  async getAll(): Promise<FavoriteStation[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error fetching favorites:", e);
      return [];
    }
  },

  async toggle(station: FavoriteStation): Promise<boolean> {
    try {
      const favorites = await this.getAll();
      const index = favorites.findIndex((f) => f.id === station.id);

      let newFavorites;
      let isAdded = false;

      if (index >= 0) {
        newFavorites = favorites.filter((f) => f.id !== station.id);
      } else {
        newFavorites = [...favorites, station];
        isAdded = true;
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return isAdded;
    } catch (e) {
      console.error("Error toggling favorite:", e);
      return false;
    }
  },

  async isFavorite(id: string): Promise<boolean> {
    const favorites = await this.getAll();
    return favorites.some((f) => f.id === id);
  },
};
