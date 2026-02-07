# Zorunlu Bilgiler Yönetim Sistemi - Proje Kapsamı

## 1. Proje Özeti

Bu proje, Turkcell EkstraJet sistemindeki "Müşteriyle Paylaşılması Gereken Zorunlu Bilgiler" alanının yeniden tasarlanmasını kapsamaktadır. Mevcut RichTextEditor tabanlı yapı yerine, merkezi yönetim ve lookup tabanlı dinamik bir sistem geliştirilecektir.

## 2. Mevcut Durum ve Problem

- Zorunlu bilgiler şu an sayfa bazlı RichTextEditor alanı olarak yönetiliyor
- Her sayfada ayrı ayrı içerik girişi yapılıyor
- Uzun metinler call center çalışanları tarafından okunması güç
- Tekrarlayan bilgiler farklı sayfalarda tutarsız olabiliyor
- Script metinleri (müşteriye okunması gereken) ayrıştırılamıyor

## 3. Önerilen Çözüm

### 3.1 Mimari

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SİSTEM MİMARİSİ                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│   REACT FRONTEND     │         │      REST API        │         │      DATABASE        │
│   (SPA)              │  HTTP   │      (Backend)       │  SQL    │      (SQL Server)    │
│                      │ ──────► │                      │ ──────► │                      │
│  - Admin Paneli      │         │  - /api/zorunlu      │         │  - ZorunluBilgiler   │
│  - Kampanya Sayfası  │         │  - /api/sayfa        │         │  - Sayfalar          │
│  - Lookup Selector   │         │  - /api/kategori     │         │  - SayfaZorunluBilgi │
│  - Tab/Accordion UI  │         │                      │         │  - Kategoriler       │
└──────────────────────┘         └──────────────────────┘         └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              VERİ AKIŞI                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ZORUNLU BİLGİLER LİSTESİ                     │
│                      (Merkezi Master Liste)                      │
├─────────────────────────────────────────────────────────────────┤
│  ID  │  Başlık              │  İçerik (RichText + Script)       │
│  1   │  Kampanya Genel      │  <p>Açıklama...</p>               │
│  2   │  Cayma Bedeli        │  <script-block>Script...</>       │
│  3   │  Modem Bilgisi       │  ...                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Lookup (Çoktan-Çoğa)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      KAMPANYA SAYFALARI                          │
├─────────────────────────────────────────────────────────────────┤
│  Sayfa A  →  Zorunlu Bilgi: 1, 2, 5                             │
│  Sayfa B  →  Zorunlu Bilgi: 1, 3, 4, 5                          │
│  Sayfa C  →  Zorunlu Bilgi: 2, 3                                │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Veri Modeli

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              VERİ İLİŞKİLERİ                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Kategoriler │ 1 ───► N│  ZorunluBilgiler │         │    Sayfalar      │
│              │         │                  │         │                  │
│  - Id        │         │  - Id            │         │  - Id            │
│  - Name      │         │  - Title         │         │  - Name          │
│  - Color     │         │  - ContentHtml   │         │  - Description   │
│              │         │  - KategoriId    │         │                  │
└──────────────┘         │  - IsActive      │         └────────┬─────────┘
       │                 └──────────────────┘                  │
       │                                                       │
       │                 ┌──────────────────┐                  │
       └────────────────►│  SayfaKategori   │◄─────────────────┘
                    N    │  (Many-to-Many)  │    N
                         │                  │
                         │  - SayfaId       │
                         │  - KategoriId    │
                         │  - DisplayOrder  │
                         └──────────────────┘

Akış: Sayfa → Kategori seçer → Kategoriye bağlı ZB'ler otomatik görüntülenir
```

**Kategoriler**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | int | Benzersiz kimlik |
| name | string | Kategori adı (ör: SIFIR SATIŞ, DATA, TV) |
| color | string | Kategori rengi (hex) |
| displayOrder | int | Gösterim sırası |

**ZorunluBilgi (Master Liste)**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | int | Benzersiz kimlik |
| title | string | Tab/başlık adı |
| contentHtml | string | RichText içerik (script blokları embedded) |
| kategoriId | int | Bağlı olduğu kategori (FK) |
| isActive | boolean | Aktif/Pasif durumu |
| displayOrder | int | Kategori içi sıralama |
| createdAt | datetime | Oluşturulma tarihi |
| updatedAt | datetime | Güncellenme tarihi |

**SayfaKategori (İlişki - Many-to-Many)**
| Alan | Tip | Açıklama |
|------|-----|----------|
| sayfaId | int | Kampanya sayfa ID |
| kategoriId | int | Kategori ID |
| displayOrder | int | Kategori gösterim sırası |

## 4. Ekranlar

### 4.1 Admin Paneli - Zorunlu Bilgi ve Kategori Yönetimi

#### 4.1.1 Kategori Yönetimi

Admin panelinde ayrı bir sekme olarak **Kategori Yönetimi** bulunacak.

Özellikler:
- Kategori listesi (tablo görünümü)
- Yeni kategori ekleme
- Kategori düzenleme (ad, renk)
- Kategori silme (bağlı ZB yoksa)
- Kategori sıralama (drag-drop veya yukarı/aşağı)
- Her kategoriye bağlı ZB sayısı gösterimi

#### 4.1.2 Zorunlu Bilgi Yönetimi

**Liste Görünümü:**
![Admin Panel Liste](assets/04-admin-panel-liste.png)

Özellikler:
- Tüm zorunlu bilgilerin tablo görünümü
- **Kategori kolonu** (hangi kategoriye ait)
- **Kategoriye göre filtreleme**
- Arama ve filtreleme (Tümü/Aktif/Pasif)
- Script içeren kayıtların işaretlenmesi
- Kullanım sayısı gösterimi
- Aktif/Pasif toggle
- Düzenleme, silme, önizleme işlemleri

**Form Görünümü:**
![Admin Panel Form](assets/05-admin-panel-form.png)

Özellikler:
- **Kategori seçimi** (zorunlu dropdown)
- Başlık alanı
- RichText Editor ile içerik girişi
- "Script Ekle" butonu ile içeriğe script bloğu ekleme
- Aktif/Pasif durumu toggle
- Kategori içi sıralama
- Önizleme özelliği

### 4.2 Kampanya Sayfası - Kategori Seçimi

Kampanya sayfalarında artık doğrudan zorunlu bilgi değil, **kategori seçimi** yapılacak. Seçilen kategorilere bağlı tüm zorunlu bilgiler otomatik olarak görüntülenecek.

**Kategori Seçim Görünümü:**
![Zorunlu Bilgi Lookup](assets/06-zorunlu-bilgi-lookup.png)

**Dropdown Açık Görünümü:**
![Zorunlu Bilgi Dropdown](assets/07-zorunlu-bilgi-dropdown-acik.png)

Özellikler:
- **Multi-select dropdown ile kategori seçimi**
- Mevcut kategorilerin listesi
- Seçilen kategorilerin sıralamasını değiştirme (yukarı/aşağı)
- Her kategorideki ZB sayısı gösterimi
- Seçilen kategorilere bağlı ZB'lerin önizlemesi
- Kaldır butonu ile kategori seçiminden çıkarma

**Seçim Akışı:**
1. Admin "Kategori Ekle" butonuna tıklar
2. Mevcut kategoriler listesinden seçim yapar (multi-select)
3. Seçilen kategoriler sıralanabilir
4. Kategorilere bağlı tüm aktif ZB'ler otomatik olarak sayfada görüntülenir

### 4.3 Son Kullanıcı Görünümü

Son kullanıcı (call center çalışanı) iki görünüm modu arasında geçiş yapabilir. Görünüm modu **toggle butonu** ile değiştirilir.

```
┌─────────────────────────────────────────────────────────────────┐
│  Görünüm Modu:   [Tab Görünümü]  ◄──toggle──►  [Kategorili]     │
└─────────────────────────────────────────────────────────────────┘
```

#### 4.3.1 Tab Görünümü

![Tab Görünümü](assets/01-kampanya-sayfasi-tab.png)

Özellikler:
- Sarı (#FFC900) kenarlıklı container
- Tab'lı navigasyon (tüm ZB'ler tek seviyede)
- Önceki/Sonraki butonları ile geçiş
- Aktif tab otomatik scroll
- Script blokları vurgulanmış gösterim

#### 4.3.2 Kategorili Görünüm

![Kategorili Görünümü](assets/03-kampanya-sayfasi-kategorili.png)

Özellikler:
- Kategorilere göre gruplama (SIFIR SATIŞ, DATA, TV, CİHAZ vb.)
- Her kategori açılır/kapanır (accordion)
- Kategori içinde ZB listesi
- **Okundu Takibi** - Her ZB için checkbox
- Hepsini Aç/Kapat butonları
- Script içeren maddelerin işaretlenmesi

#### 4.3.3 Okundu Takibi (Kategorili Görünüm)

Kategorili görünümde her zorunlu bilgi için **okundu** durumu takip edilir.

Özellikler:
- Her ZB yanında checkbox (okundu/okunmadı)
- Okundu işaretlenen ZB'ler görsel olarak farklı stil (soluk renk, üstü çizili vb.)
- **Oturum bazlı** - Sayfa yenilendiğinde sıfırlanır
- Kategori başlığında "X/Y okundu" sayacı
- "Tümünü Okundu İşaretle" butonu (kategori bazlı)
- Görüşme sırasında hangi bilgilerin okunduğunu takip etme imkanı

```
┌─────────────────────────────────────────────────────────────────┐
│  SIFIR SATIŞ (3/5 okundu)                              [Aç/Kapat]│
├─────────────────────────────────────────────────────────────────┤
│  [✓] Kampanya Genel Bilgisi          ── okundu (soluk)          │
│  [✓] Cayma Bedeli Bilgisi            ── okundu (soluk)          │
│  [ ] Taşınma Durumu Bilgisi          ── okunmadı                │
│  [✓] Modem Bilgisi                   ── okundu (soluk)          │
│  [ ] BTK Riskli Uyarısı              ── okunmadı                │
└─────────────────────────────────────────────────────────────────┘
```

## 5. Script Blokları

Script blokları, RichText içeriğinde herhangi bir yere eklenebilen özel bloklardır:

```html
<div class="script-block">
  <span class="script-label">Okunması Gereken Script</span>
  <div class="script-content">
    "Müşteriye okunacak metin buraya..."
  </div>
</div>
```

Görsel Özellikleri:
- Sarı arka plan
- Sol kenarlık vurgusu
- "Okunması Gereken Script" etiketi
- İtalik metin stili

## 6. Efor Tahmini

### React + REST API Geliştirme

| Modül | Efor (Adam/Gün) |
|-------|-----------------|
| **Frontend (React)** | |
| - Kategori yönetimi UI (liste, form) | 2 |
| - Admin Panel ZB liste komponenti | 2 |
| - Admin Panel ZB form komponenti (RichText + Script + Kategori) | 3 |
| - Kategori Selector komponenti (multi-select) | 2 |
| - Tab görünümü | 2 |
| - Kategorili görünüm (okundu takibi dahil) | 3 |
| - Görünüm toggle (Tab/Kategorili) | 0.5 |
| - API entegrasyonu (Axios) | 2 |
| - State management | 1 |
| **Backend (REST API)** | |
| - Proje kurulumu ve yapılandırma | 1 |
| - Database tasarımı ve migration | 2 |
| - Kategori CRUD API | 2 |
| - ZorunluBilgi CRUD API | 2 |
| - Sayfa-Kategori ilişki API | 2 |
| - Authentication/Authorization | 2 |
| **Ortak Geliştirmeler** | |
| - CSS/Stil çalışmaları (Tailwind) | 2 |
| - Test ve hata düzeltme | 3 |
| - API dokümantasyonu (Swagger) | 1 |
| - Kullanıcı dokümantasyonu | 1 |
| **TOPLAM** | **35.5 Adam/Gün** |

### Termin Planı

| Faz | Süre | Açıklama |
|-----|------|----------|
| **Faz 1: Altyapı** | 1 Hafta | Database tasarımı, API proje kurulumu, React proje kurulumu |
| **Faz 2: Backend API** | 1.5 Hafta | Kategori CRUD, ZB CRUD, Sayfa-Kategori ilişki API, authentication |
| **Faz 3: Admin Paneli** | 2 Hafta | Kategori yönetimi, ZB yönetimi, RichText editor, script blok desteği |
| **Faz 4: Sayfa Entegrasyonu** | 1 Hafta | Kategori selector (multi-select), sıralama, API entegrasyonu |
| **Faz 5: Görünüm Modları** | 1 Hafta | Tab görünümü, Kategorili görünüm, toggle, okundu takibi |
| **Faz 6: Test & UAT** | 1 Hafta | Test, hata düzeltme, kullanıcı kabul testi |
| **TOPLAM** | **7.5 Hafta** |

## 7. Teknik Gereksinimler

### Frontend
- React 18+
- TypeScript 5+
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (HTTP client)

### Backend (REST API)
- .NET Core 8 / Node.js 20+
- Entity Framework Core / Prisma
- Swagger/OpenAPI (API dokümantasyonu)
- JWT Authentication

### Database
- SQL Server 2019+ / PostgreSQL 15+
- Entity Framework Migrations

### API Endpoints

```
# Kategori API
GET    /api/kategoriler               - Tüm kategorileri listele
GET    /api/kategoriler/:id           - Tek kategori getir (ZB'leri ile birlikte)
POST   /api/kategoriler               - Yeni kategori ekle
PUT    /api/kategoriler/:id           - Kategori güncelle
DELETE /api/kategoriler/:id           - Kategori sil (bağlı ZB yoksa)
PUT    /api/kategoriler/siralama      - Kategori sıralamasını güncelle

# Zorunlu Bilgi API
GET    /api/zorunlu-bilgiler          - Tüm zorunlu bilgileri listele
GET    /api/zorunlu-bilgiler/:id      - Tek zorunlu bilgi getir
POST   /api/zorunlu-bilgiler          - Yeni zorunlu bilgi ekle (kategoriId zorunlu)
PUT    /api/zorunlu-bilgiler/:id      - Zorunlu bilgi güncelle
DELETE /api/zorunlu-bilgiler/:id      - Zorunlu bilgi sil
GET    /api/kategoriler/:id/zorunlu   - Kategoriye ait zorunlu bilgileri getir

# Sayfa API
GET    /api/sayfalar                  - Tüm sayfaları listele
GET    /api/sayfalar/:id              - Sayfa detayı (seçili kategoriler ile)
GET    /api/sayfalar/:id/kategoriler  - Sayfanın kategorilerini getir
POST   /api/sayfalar/:id/kategoriler  - Sayfaya kategori ekle
PUT    /api/sayfalar/:id/kategoriler  - Sayfa kategori sıralamasını güncelle
DELETE /api/sayfalar/:id/kategoriler/:kid - Sayfadan kategori kaldır

# Görüntüleme API (Son kullanıcı için)
GET    /api/sayfalar/:id/zorunlu-bilgiler - Sayfanın tüm ZB'lerini getir (kategorilere göre gruplanmış)
```

### Database Şeması

```sql
-- Kategoriler Tablosu
CREATE TABLE Kategoriler (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100) NOT NULL,
    Color NVARCHAR(7) DEFAULT '#005F9E',
    DisplayOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Zorunlu Bilgiler Tablosu
CREATE TABLE ZorunluBilgiler (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(255) NOT NULL,
    ContentHtml NVARCHAR(MAX) NOT NULL,
    KategoriId INT NOT NULL FOREIGN KEY REFERENCES Kategoriler(Id),
    IsActive BIT DEFAULT 1,
    DisplayOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Sayfalar Tablosu
CREATE TABLE Sayfalar (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Sayfa-Kategori İlişki Tablosu (Many-to-Many)
CREATE TABLE SayfaKategori (
    Id INT PRIMARY KEY IDENTITY,
    SayfaId INT NOT NULL FOREIGN KEY REFERENCES Sayfalar(Id),
    KategoriId INT NOT NULL FOREIGN KEY REFERENCES Kategoriler(Id),
    DisplayOrder INT DEFAULT 0,
    CONSTRAINT UQ_SayfaKategori UNIQUE (SayfaId, KategoriId)
);

-- Index'ler
CREATE INDEX IX_ZorunluBilgiler_KategoriId ON ZorunluBilgiler(KategoriId);
CREATE INDEX IX_SayfaKategori_SayfaId ON SayfaKategori(SayfaId);
CREATE INDEX IX_SayfaKategori_KategoriId ON SayfaKategori(KategoriId);
```

## 8. Riskler ve Kısıtlamalar

| Risk | Etki | Önlem |
|------|------|-------|
| RichText editor sınırlamaları | Orta | TinyMCE veya Quill gibi kanıtlanmış editör kullanımı |
| API performansı (çok sayıda istek) | Düşük | Caching, pagination, lazy loading |
| Mevcut veri migrasyonu | Orta | Migration script hazırlanması, test ortamında doğrulama |
| Kullanıcı eğitimi | Düşük | Dokümantasyon ve eğitim |
| Cross-browser uyumluluk | Düşük | Modern browser desteği, polyfill kullanımı |
| API güvenliği | Yüksek | JWT authentication, input validation, CORS yapılandırması |
| Database bağlantı yönetimi | Düşük | Connection pooling, retry mekanizması |

## 9. Çıktılar

### Frontend
1. React uygulama build paketi (production ready)
2. Docker container image (frontend)

### Backend
3. REST API servisi (.NET Core / Node.js)
4. Docker container image (backend)
5. Database migration scriptleri

### Dokümantasyon
6. API dokümantasyonu (Swagger/OpenAPI)
7. Kullanıcı kılavuzu
8. Teknik dokümantasyon
9. Deployment kılavuzu

### Diğer
10. Migration script (mevcut veriler için)
11. Postman collection (API test)

---

**Hazırlayan:** Geliştirme Ekibi  
**Tarih:** Ocak 2026  
**Versiyon:** 1.0
