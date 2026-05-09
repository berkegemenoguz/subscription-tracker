# Abonelik Takip Yöneticisi

Kişisel aboneliklerinizi takip etmenizi sağlayan full-stack web uygulaması. Aylık ve yıllık aboneliklerinizi ekleyin, düzenleyin, silin ve harcama özetinizi görüntüleyin.

## Teknolojiler

- **Backend:** Node.js, Express
- **Veritabanı:** PostgreSQL
- **Frontend:** Vanilla JavaScript (SPA)
- **Test:** Jest
- **API Dokümantasyonu:** Swagger UI

## Proje Yapısı

```
subscription-tracker/
├── backend/
│   ├── src/
│   │   ├── database.js              # PostgreSQL bağlantı havuzu
│   │   ├── subscriptionModel.js     # Veritabanı sorguları
│   │   ├── subscriptionService.js   # İş mantığı
│   │   ├── subscriptions.js         # API endpoint'leri
│   │   ├── validation.js            # Input doğrulama
│   │   └── app.js                   # Express uygulama yapılandırması
│   ├── tests/subscriptionService.test.js  # Unit testler
│   ├── swagger.js                   # Swagger yapılandırması
│   ├── server.js                    # Giriş noktası
│   └── package.json
├── frontend/
│   ├── index.html                   # SPA ana sayfası
│   ├── style.css                    # Stiller
│   └── app.js                       # Frontend mantığı
├── init.sql                         # Veritabanı şeması
└── README.md
```

## Kurulum

### Gereksinimler

- Node.js (v18+)
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

`.env` dosyasını kendi PostgreSQL bilgilerinize göre düzenleyin:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/subscription_tracker
PORT=3000
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

### Web Arayüzü

`http://localhost:3000` adresini tarayıcınızda açın:

- **Özet kartları:** Aylık toplam, yıllık toplam ve tahmini aylık maliyet
- **Abonelik formu:** Yeni abonelik ekleyin veya mevcut olanı düzenleyin
- **Abonelik tablosu:** Tüm abonelikleri görüntüleyin, düzenleyin veya silin
- **12 aylık takvim:** Aylara göre harcama dağılımını görün

### Swagger UI

API dokümantasyonu ve interaktif test: `http://localhost:3000/api-docs`

## API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/subscriptions` | Tüm abonelikleri listele |
| GET | `/api/subscriptions/:id` | Tek abonelik getir |
| POST | `/api/subscriptions` | Yeni abonelik ekle |
| PUT | `/api/subscriptions/:id` | Abonelik güncelle |
| DELETE | `/api/subscriptions/:id` | Abonelik sil |
| GET | `/api/subscriptions/summary` | Maliyet özeti |

### Örnek İstek

```bash
# Yeni abonelik ekle
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Netflix",
    "price": 99.99,
    "cycle": "monthly",
    "start_date": "2024-01-15",
    "notes": "Premium plan"
  }'
```

### Örnek Yanıt

```json
{
  "id": 1,
  "name": "Netflix",
  "price": "99.99",
  "cycle": "monthly",
  "start_date": "2024-01-15",
  "status": "active",
  "notes": "Premium plan",
  "created_at": "2024-01-15T12:00:00.000Z"
}
```

## Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | - |
| `PORT` | Sunucu portu | `3000` |

## Testler

```bash
cd backend
npm test
```

Jest ile `subscriptionService.js` içindeki iş mantığı fonksiyonları test edilir. Model katmanı mock'lanarak veritabanı bağımlılığı olmadan çalışır.
