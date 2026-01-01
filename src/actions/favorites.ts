"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { TankerKoenigStation } from "@/lib/tankerkoenig";

export async function toggleFavorite(stationId: string, stationData?: TankerKoenigStation) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if already favorited
    const existing = await (prisma as any).favorite.findUnique({
      where: {
        userId_stationId: {
          userId: session.user.id,
          stationId: stationId,
        },
      },
    });

    if (existing) {
      // Remove from favorites - no station data needed
      await (prisma as any).favorite.delete({
        where: {
          id: existing.id,
        },
      });
      return { success: true, isFavorite: false };
    } else {
      // Add to favorites - station data is required
      if (!stationData) {
        // If station not in DB and no data provided, we can't create relation
        // Check if station exists in DB first
        const stationExists = await (prisma as any).station.findUnique({
             where: { id: stationId }
        });

        if (!stationExists) {
             return { success: false, error: "Station data required for first-time favorite" };
        }
      } else {
          // Upsert station data
          await (prisma as any).station.upsert({
            where: { id: stationId },
            create: {
                id: stationData.id,
                name: stationData.name,
                brand: stationData.brand,
                street: stationData.street,
                houseNumber: stationData.houseNumber ? String(stationData.houseNumber) : null,
                postCode: String(stationData.postCode),
                place: stationData.place,
                lat: stationData.lat,
                lng: stationData.lng,
                isOpen: stationData.isOpen ?? true,
                // We don't save prices to DB for now to keep it simple, or we could add them
            },
            update: {
                // Update basic info in case it changed
                name: stationData.name,
                brand: stationData.brand,
                isOpen: stationData.isOpen ?? true,
            }
          });
      }

      // Create favorite relation
      await (prisma as any).favorite.create({
        data: {
          userId: session.user.id,
          stationId: stationId,
        },
      });
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to toggle favorite" };
  }
}

export async function isFavorite(stationId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return false;
    }

    const favorite = await (prisma as any).favorite.findUnique({
      where: {
        userId_stationId: {
          userId: session.user.id,
          stationId: stationId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
}

export async function getFavorites() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return [];
    }

    const favorites = await (prisma as any).favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        station: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return favorites;
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
}
