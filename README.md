# 🚗 Clever Tanken

<p align="center">
  <img src="public/logo.png" alt="Clever Tanken Logo" width="200"/>
</p>

<p align="center">
  <strong>Almanya'daki en uygun benzin fiyatlarını bulmanızı sağlayan modern bir web uygulaması</strong>
</p>

<p align="center">
  <a href="#özellikler">Özellikler</a> •
  <a href="#teknolojiler">Teknolojiler</a> •
  <a href="#kurulum">Kurulum</a> •
  <a href="#kullanım">Kullanım</a> •
  <a href="#api-entegrasyonları">API</a> •
  <a href="#proje-yapısı">Proje Yapısı</a>
</p>

---

## 📋 Hakkında

**Clever Tanken**, Almanya genelinde 15.000'den fazla benzin istasyonunun güncel fiyatlarını karşılaştırmanıza olanak tanıyan modern bir Next.js uygulamasıdır. Tankerkönig API'si ile entegre çalışarak canlı fiyat güncellemelerini sunar.

## ✨ Özellikler

### 🔍 Akıllı Arama

- **Konum bazlı arama**: Posta kodu veya şehir adıyla benzin istasyonlarını bulun
- **Yakıt tipi filtreleme**: Diesel, E5, E10, SuperPlus, LPG, CNG ve daha fazlası
- **Yarıçap ayarı**: 1km - 20km arası arama yarıçapı seçimi
- **Canlı fiyatlar**: 5 dakikalık önbellekleme ile güncel fiyatlar

### 🗺️ Harita Entegrasyonu

- **Leaflet harita**: İstasyonların interaktif harita üzerinde görüntülenmesi
- **İstasyon detayları**: Tam adres, marka ve tüm yakıt fiyatları

### 👤 Kullanıcı Yönetimi

- **Kayıt sistemi**: E-posta doğrulamalı güvenli kayıt
- **Giriş sistemi**: JWT tabanlı oturum yönetimi
- **Şifre sıfırlama**: E-posta ile şifre sıfırlama desteği
- **Favoriler**: Sık kullanılan istasyonları kaydetme (geliştirme aşamasında)

### 🎨 Modern Arayüz

- **Responsive tasarım**: Mobil ve masaüstü uyumlu
- **Glassmorphism efektleri**: Modern ve şık görünüm
- **Sidebar navigasyon**: Kolay kullanımlı menü sistemi
- **Animasyonlar**: Smooth geçiş efektleri

## 🛠️ Teknolojiler

### Frontend

| Teknoloji                                     | Açıklama                     |
| --------------------------------------------- | ---------------------------- |
| [Next.js 16](https://nextjs.org/)             | React framework (App Router) |
| [React 19](https://react.dev/)                | UI kütüphanesi               |
| [TypeScript](https://www.typescriptlang.org/) | Tip güvenli JavaScript       |
| [Tailwind CSS 4](https://tailwindcss.com/)    | Utility-first CSS framework  |
| [Leaflet](https://leafletjs.com/)             | Harita kütüphanesi           |
| [Lucide React](https://lucide.dev/)           | İkon kütüphanesi             |

### Backend & Veritabanı

| Teknoloji                                          | Açıklama                   |
| -------------------------------------------------- | -------------------------- |
| [Prisma](https://www.prisma.io/)                   | ORM ve veritabanı yönetimi |
| [PostgreSQL](https://www.postgresql.org/)          | Veritabanı                 |
| [NextAuth.js v5](https://authjs.dev/)              | Kimlik doğrulama           |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Şifre hashleme             |
| [Nodemailer](https://nodemailer.com/)              | E-posta gönderimi          |

### Harici API'ler

| API                                                     | Açıklama                |
| ------------------------------------------------------- | ----------------------- |
| [Tankerkönig](https://creativecommons.tankerkoenig.de/) | Benzin fiyatları API'si |
| [Nominatim (OSM)](https://nominatim.openstreetmap.org/) | Geocoding servisi       |

## 📦 Kurulum

### Ön Gereksinimler

- Node.js 18+
- npm veya yarn
- PostgreSQL veritabanı
- Tankerkönig API anahtarı ([Ücretsiz kayıt](https://creativecommons.tankerkoenig.de/))

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/yourusername/clever-tanken.git
cd clever-tanken
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```env
# Veritabanı
DATABASE_URL="postgresql://username:password@localhost:5432/clever_tanken"

# NextAuth.js
AUTH_SECRET="your-secret-key-here"

# Tankerkönig API
TANKERKOENIG_API_KEY="your-tankerkoenig-api-key"

# E-posta (SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-email-password"
EMAIL_FROM="noreply@clever-tanken.de"

# Uygulama URL
NEXT_PUBLIC_APP_URL="http://localhost:4000"
```

### 4. Veritabanını Hazırlayın

```bash
# Prisma migration'ları çalıştır
npx prisma migrate dev

# Prisma Client oluştur
npx prisma generate
```

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:4000](http://localhost:4000) adresinde çalışacaktır.

## 🚀 Kullanım

### Benzin İstasyonu Arama

1. Ana sayfadaki arama kutusuna posta kodu veya şehir adı girin
2. Yakıt tipini seçin (Diesel, E5, E10 vb.)
3. Arama yarıçapını belirleyin (1-20 km)
4. Arama butonuna tıklayın

### Kullanıcı Kaydı

1. Menüden "Kayıt Ol" seçeneğine tıklayın
2. Ad, e-posta ve şifre bilgilerinizi girin
3. Gelen doğrulama e-postasındaki linke tıklayın
4. Hesabınız aktif olacaktır

### İstasyon Detayları

1. Arama sonuçlarından bir istasyon seçin
2. Tüm yakıt fiyatlarını, adresi ve konumu görüntüleyin
3. "Haritada Göster" ile lokasyonu inceleyin

## 📁 Proje Yapısı

```
clever-tanken/
├── prisma/
│   ├── schema.prisma      # Veritabanı şeması
│   └── migrations/        # Veritabanı migration'ları
├── public/
│   ├── logo.png           # Uygulama logosu
│   └── hero-bg2.png       # Arkaplan görseli
├── src/
│   ├── actions/           # Server Actions
│   │   ├── register.ts           # Kullanıcı kaydı
│   │   ├── new-verification.ts   # E-posta doğrulama
│   │   ├── reset-password.ts     # Şifre sıfırlama
│   │   └── ...
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx              # Ana sayfa
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global stiller
│   │   ├── api/                  # API rotaları
│   │   ├── login/                # Giriş sayfası
│   │   ├── register/             # Kayıt sayfası
│   │   ├── forgot-password/      # Şifre sıfırlama
│   │   ├── new-verification/     # E-posta doğrulama
│   │   └── search/               # Arama sayfası
│   ├── components/        # React bileşenleri
│   │   ├── SearchForm.tsx        # Arama formu
│   │   ├── StationList.tsx       # İstasyon listesi
│   │   ├── StationDetail.tsx     # İstasyon detayı
│   │   ├── Map.tsx               # Leaflet harita
│   │   ├── Navbar.tsx            # Navigasyon çubuğu
│   │   ├── Sidebar.tsx           # Yan menü
│   │   ├── FavoriteButton.tsx    # Favori butonu
│   │   └── ...
│   ├── contexts/          # React Context'ler
│   │   ├── FavoritesContext.tsx  # Favoriler state
│   │   └── SidebarContext.tsx    # Sidebar state
│   ├── lib/               # Yardımcı fonksiyonlar
│   │   ├── tankerkoenig.ts       # Tankerkönig API
│   │   ├── geocoding.ts          # Adres çözümleme
│   │   ├── mail.ts               # E-posta servisi
│   │   ├── prisma.ts             # Prisma instance
│   │   ├── tokens.ts             # Token yönetimi
│   │   └── utils.ts              # Utility fonksiyonlar
│   └── auth.ts            # NextAuth.js yapılandırması
├── .env                   # Ortam değişkenleri
├── package.json           # Bağımlılıklar
├── tsconfig.json          # TypeScript yapılandırması
└── README.md              # Bu dosya
```

## 🗄️ Veritabanı Şeması

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  sessions      Session[]
}

model Station {
  id          String      @id
  name        String
  brand       String?
  street      String?
  houseNumber String?
  postCode    String
  place       String
  lat         Float
  lng         Float
  isOpen      Boolean
  prices      FuelPrice[]
}

model FuelPrice {
  id        String  @id
  type      String  // Diesel, E5, E10
  price     Float
  stationId String
  station   Station @relation(...)
}
```

## 🔧 API Entegrasyonları

### Tankerkönig API

Arama endpointi:

```
GET https://creativecommons.tankerkoenig.de/json/list.php
  ?lat={latitude}
  &lng={longitude}
  &rad={radius}
  &sort={price|dist}
  &type={diesel|e5|e10|all}
  &apikey={API_KEY}
```

### Nominatim Geocoding

Adres çözümleme:

```
GET https://nominatim.openstreetmap.org/search
  ?q={address}
  &format=json
  &limit=1
  &countrycodes=de
```

## 📋 Scriptler

| Script                   | Açıklama                                   |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Geliştirme sunucusunu başlatır (port 4000) |
| `npm run build`          | Production build oluşturur                 |
| `npm run start`          | Production sunucusunu başlatır             |
| `npm run lint`           | ESLint kontrolü yapar                      |
| `npx prisma studio`      | Prisma Studio'yu açar                      |
| `npx prisma migrate dev` | Veritabanı migration'ı çalıştırır          |

## 🔒 Güvenlik

- **Şifre hashleme**: bcryptjs ile güvenli şifre saklama
- **JWT oturumlar**: Stateless ve güvenli oturum yönetimi
- **E-posta doğrulama**: Spam hesapların önlenmesi
- **CSRF koruması**: NextAuth.js entegre koruma

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👏 Teşekkürler

- [Tankerkönig](https://creativecommons.tankerkoenig.de/) - Benzin fiyatları API'si
- [OpenStreetMap](https://www.openstreetmap.org/) - Harita ve geocoding verileri
- [Vercel](https://vercel.com/) - Next.js geliştirme ekibi

---

<p align="center">
  Made with ❤️ in Germany
</p>
