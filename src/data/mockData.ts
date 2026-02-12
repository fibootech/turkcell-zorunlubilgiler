import type { ZorunluBilgi, Sayfa, Kategori } from '../types/index.ts';

// Kategoriler
export const mockKategoriler: Kategori[] = [
  { id: "sifir-satis", name: "SIFIR SATIŞ", color: "#005F9E", displayOrder: 1 },
  { id: "retention", name: "RETENTION", color: "#005F9E", displayOrder: 2 },
  { id: "fatura-vergi", name: "FATURA & VERGİ", color: "#005F9E", displayOrder: 3 },
  { id: "cihaz-modem", name: "CİHAZ & MODEM", color: "#005F9E", displayOrder: 4 }
];

// Mock Zorunlu Bilgiler - Master Liste (her biri bir kategoriye bağlı)
export const mockZorunluBilgiler: ZorunluBilgi[] = [
  {
    id: 1,
    title: "Kampanya Genel Bilgisi",
    kategoriId: "sifir-satis",
    displayOrder: 1,
    contentHtml: `
      <p>Kampanya hakkında genel bilgi (taahhüt sözünüze cihaz hediye, sadece internet kampanyası, turkcellilere özel ya da tv'li internet kampanyası)</p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Okunması Gereken Script</span>
        <div class="script-content">
          "Kampanyanız 100 Mbps Fiber kampanyasıdır, 24 ay taahhütlüdür, tcellilere özeldir. Download hızınız 100 Mbps upload hızınız 10 Mbps'dir. İndirimsiz fiyatı 350 TL olan hizmetten kampanyaya katılmanız durumunda 209.9 TL olarak ücretlendirileceksiniz."
        </div>
      </div>
      
      <p>Taahhüt konusu hizmet, ilgili kampanya dahilinde aboneye sunulacak hizmetin adı ve içeriği bilgilerini kapsamaktadır.</p>
    `,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2026-02-05",
    usageCount: 45
  },
  {
    id: 2,
    title: "Cayma Bedeli Bilgisi",
    kategoriId: "sifir-satis",
    displayOrder: 2,
    contentHtml: `
      <p><strong>Taahhüt bitmeden caydığı durumda ne olacağı hakkında bilgi:</strong></p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Okunması Gereken Script</span>
        <div class="script-content">
          "Fatura ödenmemesi ya da taahhütnamede bulunan aykırılık hallerinde Superonline cayma bedeli yansıtarak iptal etme hakkına sahiptir. Kampanya iptal bedeli, iptal tarihine kadar sağlanan indirimler ile geriye kalan aylarda tahsil edilecek tutarlar karşılaştırılarak düşük olan tutar üzerinden hesaplanmaktadır."
        </div>
      </div>
      
      <p>Ek olarak, bir önceki kampanyanın taahhüt süresi dolmadan iptal işlemi yapıldığında, ilgili kampanyaya ait cayma bedeli de bu tutara dahil edilecektir.</p>
      
      <ul>
        <li>Cayma hakkı bulunmuyorsa müşteriye bilgi verilmelidir</li>
        <li>Anında ifa edilen hizmetlerde cayma hakkı olmayabilir</li>
      </ul>
    `,
    isActive: true,
    createdAt: "2026-02-05",
    updatedAt: "2026-02-05",
    usageCount: 52
  },
  {
    id: 3,
    title: "Taşınma Durumu Bilgisi",
    kategoriId: "sifir-satis",
    displayOrder: 3,
    contentHtml: `
      <p>Taşınma durumunda uygun altyapısı yoksa belgelenmesi durumunda cayma bedelsiz iptal hakkına sahip olduğunun bilgisi.</p>
      
      <p><strong>Önemli:</strong> Müşteri taşınma durumunda yeni adresinde altyapı kontrolü yaptırmalıdır. Altyapı yoksa gerekli belgeleri sunarak cayma bedelsiz iptal hakkını kullanabilir.</p>
      
      <ul>
        <li>Taşınma belgesi (ikametgah veya kira sözleşmesi)</li>
        <li>Yeni adres bilgileri</li>
        <li>Altyapı kontrol sonucu</li>
      </ul>
    `,
    isActive: true,
    createdAt: "2024-03-05",
    updatedAt: "2024-10-15",
    usageCount: 38
  },
  {
    id: 6,
    title: "Taahhüt Faydaları Bilgisi",
    kategoriId: "sifir-satis",
    displayOrder: 4,
    contentHtml: `
      <p>Taahhüt verilmesi sebebiyle sağlanan ek faydaların tutarı:</p>
      
      <ul>
        <li><strong>Kurulum ücreti:</strong> Ücretsiz (Normal: 150 TL)</li>
        <li><strong>Aktivasyon ücreti:</strong> Ücretsiz (Normal: 50 TL)</li>
        <li><strong>İlk ay hız faydası:</strong> 2x hız avantajı</li>
        <li><strong>Modem:</strong> WiFi 6 modem dahil</li>
      </ul>
      
      <p>Bu faydalar taahhüt kapsamında sağlanmakta olup, cayma durumunda geri talep edilebilir.</p>
    `,
    isActive: true,
    createdAt: "2024-06-08",
    updatedAt: "2024-11-25",
    usageCount: 35
  },
  {
    id: 12,
    title: "Son Onay",
    kategoriId: "sifir-satis",
    displayOrder: 5,
    contentHtml: `
      <p><strong>Tüm bilgilendirmeler yapıldıktan sonra:</strong></p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Zorunlu Onay Scripti</span>
        <div class="script-content">
          "Bu kapsamda kampanya değişikliğini onaylıyor musunuz?"
        </div>
      </div>
      
      <p>Müşteriden sözlü onay alınmalı ve sisteme kaydedilmelidir.</p>
    `,
    isActive: true,
    createdAt: "2024-11-15",
    updatedAt: "2024-12-15",
    usageCount: 50
  },
  {
    id: 5,
    title: "BTK Riskli - Retention Uyarısı",
    kategoriId: "retention",
    displayOrder: 1,
    contentHtml: `
      <p><strong>ÇOK ÖNEMLİ:</strong> Retention esnasında taahhüdünün bitip bitmediğine bakılmalıdır. Taahhüdü bitmeden yeni kampanyaya geçiş yapmak isterse okunacak:</p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">BTK Zorunlu Script</span>
        <div class="script-content">
          "Mevcut kampanyanızın taahhüt süresi bitmeden kampanya değişikliği yapıyorsunuz; bu sebeple bir cayma bedeli doğacak. Ancak mevcut kampanyanıza ait cayma bedeli kampanya değişikliği anında yansıtılmayacak; eski kampanyanın taahhüt süresi tamamlanmadan önce yeni kampanyanızı da iptal ettirmeniz durumunda tarafınıza, yeni kampanyanız kapsamında hesaplanacak cayma bedeline ilave olarak fatura edilecektir."
        </div>
      </div>
      
      <p>Bu bilgi Turkcell Uygulamasından yapılan değişikliklerde sipariş özet sayfasında yer almaktadır.</p>
    `,
    isActive: true,
    createdAt: "2024-05-20",
    updatedAt: "2024-12-10",
    usageCount: 28
  },
  {
    id: 8,
    title: "Kampanya Geçişi Bilgisi",
    kategoriId: "retention",
    displayOrder: 2,
    contentHtml: `
      <p>Geçtiği kampanyadan başka kampanyalara geçiş olup olmadığı:</p>
      
      <p>Mevcut kampanyanızdan aşağıdaki paketlere geçiş yapabilirsiniz:</p>
      
      <ul>
        <li>Alt paketlere geçiş: Mümkün (güncel fiyatlarla)</li>
        <li>Üst paketlere geçiş: Mümkün (güncel fiyatlarla)</li>
        <li>TV+ ekleme: Mümkün</li>
        <li>Farklı kampanyalara geçiş: Taahhüt durumuna göre değişir</li>
      </ul>
    `,
    isActive: true,
    createdAt: "2024-08-22",
    updatedAt: "2024-11-15",
    usageCount: 30
  },
  {
    id: 11,
    title: "Diğer ISS KİB Bedeli",
    kategoriId: "retention",
    displayOrder: 3,
    contentHtml: `
      <p><strong>Diğer ISS kib bedeli ödenecek müşteri:</strong> Henüz evraklarını göndermemiş ve sisteme girişi yapılmamış ise; retention yapılacağı durumda, geçeceği kampanyada kib bedeli karşılanmıyor ise müşteriye bunun bilgisi verilerek retention yapılmalı.</p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Okunması Gereken Script</span>
        <div class="script-content">
          "Diğer Servis Sağlayıcı İndirimi onaylanma süreciniz bulunmakta ise geçiş yapılacak kampanyada karşılanacaktır/karşılanmayacaktır."
        </div>
      </div>
    `,
    isActive: true,
    createdAt: "2024-11-01",
    updatedAt: "2024-12-12",
    usageCount: 18
  },
  {
    id: 9,
    title: "Damga Vergisi Bilgisi",
    kategoriId: "fatura-vergi",
    displayOrder: 1,
    contentHtml: `
      <p>Damga vergisinin çıkıp çıkmadığı bilgisi:</p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Okunması Gereken Script</span>
        <div class="script-content">
          "Kampanya kapsamında bir defaya mahsus ilk faturanıza binde 9.48 oranında damga vergisi yansıyacaktır."
        </div>
      </div>
    `,
    isActive: true,
    createdAt: "2024-09-10",
    updatedAt: "2024-12-01",
    usageCount: 25
  },
  {
    id: 10,
    title: "Parçalı Fatura Bilgisi",
    kategoriId: "fatura-vergi",
    displayOrder: 2,
    contentHtml: `
      <p>Geçiş sonrası parçalı fatura çıkacağı bilgisi:</p>
      
      <p>Kampanya değişikliği yapıldığında faturalama şu şekilde olacaktır:</p>
      
      <ul>
        <li>Değişiklik tarihine kadar olan kullanım: Eski kampanya ücreti</li>
        <li>Değişiklik tarihinden sonraki kullanım: Yeni kampanya ücreti</li>
      </ul>
      
      <p>Bu nedenle ilk faturanız parçalı olarak yansıyacaktır.</p>
    `,
    isActive: true,
    createdAt: "2024-10-05",
    updatedAt: "2024-12-08",
    usageCount: 33
  },
  {
    id: 7,
    title: "Paket Limiti Bilgisi",
    kategoriId: "fatura-vergi",
    displayOrder: 3,
    contentHtml: `
      <p>Paketlerin limitsiz veya kotalı olduğuna dair bilgi:</p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Okunması Gereken Script</span>
        <div class="script-content">
          "Paketiniz limitsizdir, kotasızdır, ancak faturanın ödenmemesi halinde hizmetiniz kısıtlanacaktır (hız düşümü)."
        </div>
      </div>
      
      <p>Kotalı bir paketten aşım varsa aşıma ilişkin bilgi, kotasında duruyorsa buna ilişkin bilgi iletilmelidir.</p>
    `,
    isActive: true,
    createdAt: "2024-07-15",
    updatedAt: "2024-10-30",
    usageCount: 42
  },
  {
    id: 4,
    title: "Modem Bilgisi",
    kategoriId: "cihaz-modem",
    displayOrder: 1,
    contentHtml: `
      <p><strong>Abonelik iptal sonrasında modemin iade edilmemesi durumunda fatura edileceği:</strong></p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Okunması Gereken Script</span>
        <div class="script-content">
          "Kampanya kapsamında verilen modemler stoklarla sınırlıdır ve Turkcell Superonline mülkiyetindedir. Hizmetin sonlandırılması halinde modem Turkcell Superonline Abone Merkez'lerine çalışır durumda ve tüm parçaları eksiksiz olarak teslim edilmelidir."
        </div>
      </div>
      
      <p>Kampanya içindeki modem kiralama ücreti: 9 TL/ay</p>
      
      <div class="script-block" data-script="true">
        <span class="script-label">Modem Kullanım Bedeli Scripti</span>
        <div class="script-content">
          "Aboneliğin sona ermesi halinde modem kullanım bedeli son çıkan faturanıza yansıtılacaktır."
        </div>
      </div>
    `,
    isActive: true,
    createdAt: "2024-04-12",
    updatedAt: "2024-12-05",
    usageCount: 41
  }
];

// Mock Sayfalar - Artık kategori bazlı
export const mockSayfalar: Sayfa[] = [
  {
    id: 1,
    title: "100 Mbps Fiber Turkcell Biz Devam Kampanyası",
    campaignType: "Diğer Kampanyalar",
    kategoriIds: ["sifir-satis", "cihaz-modem"]
  },
  {
    id: 2,
    title: "Turkcell Emeklilerine Fiber İnternet Kampanyası",
    campaignType: "Işık Hızında Fiber Kampanyaları",
    kategoriIds: ["sifir-satis", "retention", "fatura-vergi", "cihaz-modem"]
  },
  {
    id: 3,
    title: "500 Mbps Süper Hız Kampanyası",
    campaignType: "Turkcell Biz Kampanyaları",
    kategoriIds: ["sifir-satis", "fatura-vergi"]
  }
];

// Helper: Kategoriye ait ZB'leri getir
export const getZorunluBilgilerByKategori = (kategoriId: string): ZorunluBilgi[] => {
  return mockZorunluBilgiler
    .filter(zb => zb.kategoriId === kategoriId && zb.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

// Helper: Sayfanın kategori ID'lerine göre tüm ZB'lerini getir
export const getZorunluBilgilerForSayfa = (sayfaId: number): ZorunluBilgi[] => {
  const sayfa = mockSayfalar.find(s => s.id === sayfaId);
  if (!sayfa) return [];
  
  return sayfa.kategoriIds.flatMap(katId => getZorunluBilgilerByKategori(katId));
};

// Helper: Sayfanın kategorilerini sıralı getir
export const getKategorilerForSayfa = (sayfaId: number): Kategori[] => {
  const sayfa = mockSayfalar.find(s => s.id === sayfaId);
  if (!sayfa) return [];
  
  return sayfa.kategoriIds
    .map(katId => mockKategoriler.find(k => k.id === katId))
    .filter((k): k is Kategori => k !== undefined);
};

// Helper: ID'ye göre zorunlu bilgi getir
export const getZorunluBilgiById = (id: number): ZorunluBilgi | undefined => {
  return mockZorunluBilgiler.find(zb => zb.id === id);
};

// Helper: Kategori adını getir
export const getKategoriById = (id: string): Kategori | undefined => {
  return mockKategoriler.find(k => k.id === id);
};
