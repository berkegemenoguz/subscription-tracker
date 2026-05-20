# Abonelik Takip Yöneticisi 

Kişisel aboneliklerinizi takip etmenizi sağlayan full-stack web uygulaması. JWT tabanlı kimlik doğrulama ile kullanıcı bazlı veri izolasyonu sunar. Aylık ve yıllık aboneliklerinizi ekleyin, düzenleyin, silin, ödeme kartlarınızı yönetin ve harcama özetinizi görüntüleyin.

## Teknolojiler

- **Backend:** Node.js, Express
- **Veritabanı:** PostgreSQL
- **Kimlik Doğrulama:** JWT (jsonwebtoken), bcrypt
- **Frontend:** Vanilla JavaScript (SPA)
- **Test:** Jest
- **API Dokümantasyonu:** Swagger UI

## Proje Yapısı

```
subscription-tracker/
├── backend/
│   ├── src/
│   │   ├── database.js              # PostgreSQL bağlantı havuzu
│   │   ├── userModel.js             # Kullanıcı veritabanı sorguları
│   │   ├── userService.js           # Kayıt ve giriş iş mantığı
│   │   ├── authMiddleware.js        # JWT doğrulama middleware
│   │   ├── auth.js                  # Kimlik doğrulama endpoint'leri
│   │   ├── subscriptionModel.js     # Abonelik veritabanı sorguları
│   │   ├── subscriptionService.js   # Abonelik iş mantığı
│   │   ├── subscriptions.js         # Abonelik API endpoint'leri
│   │   ├── paymentCardModel.js      # Ödeme kartı veritabanı sorguları
│   │   ├── paymentCardService.js    # Ödeme kartı iş mantığı
│   │   ├── paymentCards.js          # Ödeme kartı API endpoint'leri
│   │   ├── validation.js            # Input doğrulama
│   │   └── app.js                   # Express uygulama yapılandırması
│   ├── tests/
│   │   ├── subscriptionService.test.js  # Abonelik unit testleri
│   │   └── paymentCardService.test.js   # Ödeme kartı unit testleri
│   ├── swagger.js                   # Swagger yapılandırması
│   ├── server.js                    # Giriş noktası
│   └── package.json
├── frontend/
│   ├── auth.html                    # Giriş / Kayıt sayfası
│   ├── index.html                   # SPA ana sayfası
│   ├── style.css                    # Stiller
│   └── app.js                       # Frontend mantığı
├── init.sql                         # Veritabanı şeması
└── README.md
```

## Kurulum

### Gereksinimler

- Node.js  (v18+)
- PostgreSQL (v14+)

### 1. Depoyu klonlayın

```bash
git clone <repo-url>
cd subscription-tracker
```

### 2. PostgreSQL veritabanını oluşturun

```bash
psql -U postgres -c "CREATE DATABASE subscription_tracker;"
psql -U postgres -d subscription_tracker -f init.sql
```

### 3. Ortam değişkenlerini ayarlayın

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını kendi bilgilerinize göre düzenleyin:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/subscription_tracker
PORT=3000
JWT_SECRET=guclu-ve-benzersiz-bir-anahtar
JWT_EXPIRES_IN=7d
```

### 4. Bağımlılıkları yükleyin

```bash
cd backend
npm install
```

### 5. Uygulamayı başlatın

```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## Kullanım

### Kayıt ve Giriş

`http://localhost:3000/auth.html` adresini açın:

1. **Register** sekmesinden e-posta ve şifre ile kayıt olun
2. **Login** sekmesinden giriş yapın
3. Giriş sonrası otomatik olarak ana sayfaya yönlendirilirsiniz

### Web Arayüzü

Giriş yaptıktan sonra `http://localhost:3000` adresinde:

- **Özet kartları:** Aylık toplam, yıllık toplam ve tahmini maliyetler
- **Abonelik formu:** Yeni abonelik ekleyin veya mevcut olanı düzenleyin
- **Ödeme kartı yönetimi:** Aboneliklere ödeme kartı atayın
- **Abonelik tablosu:** Tüm abonelikleri görüntüleyin, düzenleyin veya silin
- **12 aylık takvim:** Aylara göre harcama dağılımını görün
- **Logout:** Sağ üst köşeden güvenli çıkış yapın

Her kullanıcı yalnızca kendi verilerini görebilir ve yönetebilir.

### Swagger UI

API dokümantasyonu ve interaktif test: `http://localhost:3000/api-docs`

## API Endpoint'leri

### Kimlik Doğrulama (Herkese Açık)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Kullanıcı girişi |

### Abonelikler (JWT Gerekli)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/subscriptions` | Kullanıcının aboneliklerini listele |
| GET | `/api/subscriptions/:id` | Tek abonelik getir |
| POST | `/api/subscriptions` | Yeni abonelik ekle |
| PUT | `/api/subscriptions/:id` | Abonelik güncelle |
| DELETE | `/api/subscriptions/:id` | Abonelik sil |
| GET | `/api/subscriptions/summary` | Maliyet özeti |

### Ödeme Kartları (JWT Gerekli)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/payment-cards` | Kullanıcının kartlarını listele |
| POST | `/api/payment-cards` | Yeni kart ekle |
| DELETE | `/api/payment-cards/:id` | Kart sil |

### Örnek İstek

```bash
# Kayıt ol
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'

# Giriş yap (dönen token'ı kullanın)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'

# Yeni abonelik ekle (JWT token gerekli)
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Netflix",
    "price": 99.99,
    "cycle": "monthly",
    "start_date": "2024-01-15",
    "notes": "Premium plan"
  }'
```

### Örnek Yanıt (Login)

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2024-01-15T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | - |
| `PORT` | Sunucu portu | `3000` |
| `JWT_SECRET` | JWT imzalama anahtarı | - |
| `JWT_EXPIRES_IN` | Token geçerlilik süresi | `7d` |

## Testler

```bash
cd backend
npm test
```

Jest ile `subscriptionService` ve `paymentCardService` içindeki iş mantığı fonksiyonları test edilir. Model katmanı mock'lanarak veritabanı bağımlılığı olmadan çalışır.
