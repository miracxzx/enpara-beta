const screens = document.querySelectorAll("[data-screen]");
const pageTitle = document.querySelector("#page-title");
const pageHero = document.querySelector("#page-hero");
const pageBody = document.querySelector("#page-body");
const pageFooter = document.querySelector("#page-footer");
const toast = document.querySelector("#toast");
const tabItems = document.querySelectorAll(".tabbar__item");

const state = {
  currentRoute: "summary",
  history: [],
  forms: {
    loan: { amount: "120.000", maturity: "12 ay", income: "75.000 TL" },
    card: { limit: "85.000", city: "İstanbul", delivery: "Ev adresim" },
    support: { topic: "Bekleyen SWIFT işlemi", message: "" },
    transfer: { name: "MELIKE LACIN", iban: "TRXX XXXX XXXX XX", amount: "7.500" },
  },
  latestActions: {
    loan: null,
    card: null,
    support: null,
    transfer: null,
  },
};

const HOURGLASS_ICON = `
  <div class="pending-card__icon pending-card__icon--large" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M18 10h28M18 54h28M22 10c0 12 20 10 20 22S22 42 22 54M42 10c0 12-20 10-20 22s20 10 20 22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  </div>
`;

function iconHero(iconClass, title, text) {
  return `
    <div class="page-icon ${iconClass}" aria-hidden="true"></div>
    <h2>${title}</h2>
    <p>${text}</p>
  `;
}

const appPages = {
  menu: {
    tab: "summary",
    title: "Hızlı Menü",
    hero: iconHero("page-icon--menu", "Sık kullanılan işlemler", "Ana akışların tamamına hızlı erişim sağlar."),
    sections: [
      {
        type: "grid",
        items: [
          { label: "Transfer", value: "Gönder", route: "transfer-form" },
          { label: "Kredi", value: "Başvur", route: "loan-form" },
          { label: "Kart", value: "İncele", route: "cards" },
          { label: "Profil", value: "Aç", route: "profile" },
        ],
      },
      {
        type: "list",
        title: "Kısayollar",
        items: [
          { label: "Bildirim merkezi", value: "Aç", route: "notifications" },
          { label: "Destek merkezi", value: "Aç", route: "support" },
          { label: "Bekleyen SWIFT", value: "İzle", route: "swift-tracker" },
        ],
      },
    ],
  },
  notifications: {
    tab: "summary",
    title: "Bildirimler",
    hero: iconHero("page-icon--bell", "Son bildirimler", "İşlem, başvuru ve transfer güncellemeleri burada görünür."),
    sections: [
      {
        type: "timeline",
        title: "Bugün",
        items: [
          { label: "SWIFT transferin dağıtım aşamasında", meta: "14:29", route: "swift-detail" },
          { label: "Transfer alıcı bilgisi son kayıtta kullanıldı", meta: "13:52", route: "transfer-form" },
          { label: "Kredi kartı başvuruna özel teklif hazır", meta: "10:41", route: "credit-card-form" },
        ],
      },
    ],
  },
  transfers: {
    tab: "transfers",
    title: "Transferler",
    hero: iconHero("page-icon--transfer-in", "Para transfer merkezi", "Gönder, geçmişi incele ve bekleyen işlemleri takip et."),
    sections: [
      {
        type: "grid",
        items: [
          { label: "Para Gönder", value: "Yeni işlem", route: "transfer-form" },
          { label: "Bekleyen SWIFT", value: "Detay", route: "swift-detail" },
          { label: "Gelen Transfer", value: "İncele", route: "incoming-transfer" },
          { label: "Giden Transfer", value: "İncele", route: "outgoing-transfer" },
        ],
      },
      {
        type: "stats",
        items: [
          { label: "Bugünkü çıkış", value: "-190,00 TL", tone: "warning" },
          { label: "Bugünkü giriş", value: "+190,00 TL", tone: "success" },
          { label: "Bekleyen işlem", value: "1 adet", tone: "default" },
        ],
      },
    ],
  },
  cards: {
    tab: "cards",
    title: "Kartlar",
    hero: iconHero("page-icon--card", "Kart merkezim", "Kart başvuruları, limit teklifi ve dijital kart işlemleri."),
    sections: [
      {
        type: "card-showcase",
        title: "Enpara Kredi Kartı",
        content: "Temassız, sanal kart uyumlu ve taksitli alışveriş özellikli.",
        actionLabel: "Başvuruya Geç",
        route: "credit-card-form",
      },
      {
        type: "list",
        title: "Kart işlemleri",
        items: [
          { label: "Başvuru ekranı", value: "Aç", route: "credit-card-form" },
          { label: "Mevcut teklif", value: "İncele", route: "credit-card" },
          { label: "Destek", value: "Aç", route: "support-form" },
        ],
      },
    ],
  },
  profile: {
    tab: "profile",
    title: "Profil",
    hero: iconHero("page-icon--profile", "Hesap ve ayarlar", "Kişisel bilgiler, güvenlik ve uygulama tercihleri."),
    sections: [
      {
        type: "profile",
        name: "Miraç Özbağ",
        meta: "Bireysel müşteri • Güvenli giriş aktif",
      },
      {
        type: "list",
        title: "Profil seçenekleri",
        items: [
          { label: "Hesap ayarları", value: "Görüntüle", route: "settings" },
          { label: "Bildirim tercihleri", value: "Aç", route: "notifications" },
          { label: "Destek merkezi", value: "Aç", route: "support" },
        ],
      },
    ],
  },
  settings: {
    tab: "profile",
    title: "Hesap Ayarları",
    hero: iconHero("page-icon--support", "Uygulama tercihleri", "Güvenlik, bildirim ve hesap yönetimi seçenekleri."),
    sections: [
      {
        type: "list",
        title: "Ayarlar",
        items: [
          { label: "Bildirimler", value: "Açık" },
          { label: "Biyometrik giriş", value: "Aktif" },
          { label: "Uygulama dili", value: "Türkçe" },
        ],
      },
    ],
  },
  "tl-account": {
    tab: "summary",
    title: "Vadesiz TL",
    hero: iconHero("page-icon--account", "TL hesap detayın", "Bakiye, IBAN ve hızlı işlem seçenekleri."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Bakiye", value: "0,00 TL", tone: "default" },
          { label: "Kullanılabilir", value: "0,00 TL", tone: "default" },
          { label: "IBAN", value: "TRXX XXXX XXXX XXXX", tone: "muted" },
        ],
      },
      {
        type: "list",
        title: "Hızlı işlemler",
        items: [
          { label: "Para gönder", value: "Başlat", route: "transfer-form" },
          { label: "Son gelen transfer", value: "İncele", route: "incoming-transfer" },
        ],
      },
    ],
  },
  "usd-account": {
    tab: "summary",
    title: "Vadesiz USD",
    hero: iconHero("page-icon--account", "USD hesap detayın", "Döviz hesap görünümü ve SWIFT uyumluluk durumu."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Bakiye", value: "0,00 USD", tone: "default" },
          { label: "Kullanılabilir", value: "0,00 USD", tone: "default" },
          { label: "SWIFT uygunluğu", value: "Aktif", tone: "success" },
        ],
      },
      {
        type: "list",
        title: "İlgili akışlar",
        items: [
          { label: "Bekleyen SWIFT", value: "Detay", route: "swift-detail" },
          { label: "Transfer merkezi", value: "Aç", route: "transfers" },
        ],
      },
    ],
  },
  "other-accounts": {
    tab: "summary",
    title: "Diğer Banka Hesapları",
    hero: iconHero("page-icon--bank", "Tanımlı dış hesapların", "Transferlerde kullanabileceğin kayıtlı banka hesapları."),
    sections: [
      {
        type: "list",
        title: "Kayıtlı hesaplar",
        items: [
          { label: "QNB Finansbank - TRXX ... 4821", value: "Varsayılan" },
          { label: "Yapı Kredi - TRXX ... 1054", value: "Doğrulandı" },
          { label: "Garanti BBVA - TRXX ... 9930", value: "Doğrulandı" },
        ],
      },
    ],
  },
  loan: {
    tab: "summary",
    title: "İhtiyaç Kredisi",
    hero: iconHero("page-icon--loan", "Hazır teklifin", "Ön değerlendirme, limit ve vade özeti."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Hazır limit", value: "250.000 TL", tone: "success" },
          { label: "Vade seçeneği", value: "3-36 ay", tone: "default" },
          { label: "Durum", value: "Başvuruya uygun", tone: "warning" },
        ],
      },
    ],
    footer: [
      { label: "Başvuru Formu", route: "loan-form", kind: "primary" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  "loan-form": {
    tab: "summary",
    title: "Kredi Başvurusu",
    hero: iconHero("page-icon--loan", "Başvuru formu", "Tutar, vade ve gelir bilgini girerek dijital başvuruyu tamamla."),
    sections: [
      {
        type: "form",
        formId: "loan",
        title: "Başvuru bilgileri",
        fields: [
          { name: "amount", label: "Talep edilen tutar", placeholder: "120.000" },
          { name: "maturity", label: "Vade", placeholder: "12 ay" },
          { name: "income", label: "Aylık gelir", placeholder: "75.000 TL" },
        ],
        submitLabel: "Başvuruyu Gönder",
        successRoute: "loan-success",
        successMessage: "Kredi başvurun ön değerlendirmeye alındı.",
      },
    ],
  },
  "loan-success": {
    tab: "summary",
    title: "Başvuru Alındı",
    hero: iconHero("page-icon--success", "Kredi başvurun alındı", "Ön değerlendirme ekranı oluşturuldu."),
    sections: [
      {
        type: "receipt",
        title: "Başvuru özeti",
        formId: "loan",
        lines: [
          { label: "Tutar", key: "amount", suffix: " TL" },
          { label: "Vade", key: "maturity" },
          { label: "Gelir", key: "income" },
        ],
      },
    ],
  },
  "credit-card": {
    tab: "cards",
    title: "Kredi Kartı",
    hero: iconHero("page-icon--card", "Kart teklif ekranı", "Önerilen limit ve teslimat özellikleri."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Önerilen limit", value: "85.000 TL", tone: "success" },
          { label: "Kart tipi", value: "Temassız / Sanal kart uygun", tone: "default" },
          { label: "Teslimat", value: "2-4 iş günü", tone: "default" },
        ],
      },
    ],
    footer: [
      { label: "Başvuru Formu", route: "credit-card-form", kind: "primary" },
      { label: "Kartlar", route: "cards", kind: "outline" },
    ],
  },
  "credit-card-form": {
    tab: "cards",
    title: "Kart Başvurusu",
    hero: iconHero("page-icon--card", "Kart formu", "Limit ve teslimat bilgilerini onaylayarak başvur."),
    sections: [
      {
        type: "form",
        formId: "card",
        title: "Kart başvuru bilgileri",
        fields: [
          { name: "limit", label: "Talep edilen limit", placeholder: "85.000" },
          { name: "city", label: "Teslimat ili", placeholder: "İstanbul" },
          { name: "delivery", label: "Teslimat tipi", placeholder: "Ev adresim" },
        ],
        submitLabel: "Kart Başvurusunu Gönder",
        successRoute: "credit-card-success",
        successMessage: "Kart başvurun kaydedildi.",
      },
    ],
  },
  "credit-card-success": {
    tab: "cards",
    title: "Kart Başvurusu",
    hero: iconHero("page-icon--success", "Başvurun tamamlandı", "Teslimat ve limit bilgileri kaydedildi."),
    sections: [
      {
        type: "receipt",
        title: "Kart özeti",
        formId: "card",
        lines: [
          { label: "Limit", key: "limit", suffix: " TL" },
          { label: "İl", key: "city" },
          { label: "Teslimat", key: "delivery" },
        ],
      },
    ],
  },
  ekpara: {
    tab: "summary",
    title: "Ekpara (KMH)",
    hero: iconHero("page-icon--wallet", "Ekpara teklifin", "Tanımlanabilir ek limit ve aktivasyon bilgisi."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Tanımlanabilir limit", value: "35.000 TL", tone: "success" },
          { label: "Faiz yapısı", value: "Günlük işletim", tone: "default" },
          { label: "Durum", value: "Aktivasyona hazır", tone: "warning" },
        ],
      },
    ],
  },
  findeks: {
    tab: "summary",
    title: "Findeks Risk Raporu",
    hero: iconHero("page-icon--score", "Rapor başvurusu", "Risk raporu talebin için özet akış."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Teslim süresi", value: "Aynı gün", tone: "default" },
          { label: "Rapor türü", value: "Bireysel özet", tone: "default" },
          { label: "Durum", value: "Başvuruya uygun", tone: "success" },
        ],
      },
    ],
  },
  "outgoing-transfer": {
    tab: "transfers",
    title: "Giden Transfer",
    hero: iconHero("page-icon--transfer-out", "İşlem detayı", "Bugün gerçekleşen giden transfer hareketi."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Tutar", value: "-190,00 TL", tone: "warning" },
          { label: "Alıcı", value: "Miraç Özbağ", tone: "default" },
          { label: "Kanal", value: "Bireysel ödeme", tone: "muted" },
        ],
      },
    ],
  },
  "incoming-transfer": {
    tab: "transfers",
    title: "Gelen Transfer",
    hero: iconHero("page-icon--transfer-in", "İşlem detayı", "Bugün hesabına geçen bireysel transfer bilgisi."),
    sections: [
      {
        type: "stats",
        items: [
          { label: "Tutar", value: "+190,00 TL", tone: "success" },
          { label: "Gönderen", value: "MELIKE LACIN", tone: "default" },
          { label: "Kanal", value: "Bireysel ödeme", tone: "muted" },
        ],
      },
    ],
  },
  "swift-detail": {
    tab: "transfers",
    title: "SWIFT Transfer Detayı",
    hero: `${HOURGLASS_ICON}<h2>Bekleyen Transfer</h2>`,
    sections: [
      {
        type: "stats",
        items: [
          { label: "Tutar", value: "+521.670,00 TL", tone: "success" },
          { label: "Güvenlik Seri", value: "UETR End-to-End Verified", tone: "badge" },
          { label: "Gönderici", value: "Freelancer.com / Aracı PTE LTD", tone: "default" },
          { label: "Hesap Numaranız / IBAN", value: "TRXX XXXX XXXX XX", tone: "default" },
          { label: "Muhabir Banka", value: "DEUTSCHE BANK AG", tone: "default" },
          { label: "Durum", value: "Yerel Dağıtım Aşamasında", tone: "warning" },
          { label: "Konum", value: "interim Account (Genel Havuz)", tone: "default" },
          { label: "İnceleme", value: "Onay alındı", tone: "success" },
        ],
      },
      {
        type: "tracker",
        title: "İşlem akışı",
        items: [
          { label: "UETR doğrulaması", state: "done" },
          { label: "Muhabir banka eşleşmesi", state: "done" },
          { label: "Yerel dağıtım", state: "active" },
          { label: "Bakiyeye yansıma", state: "pending" },
        ],
      },
    ],
    footer: [
      { label: "Takip Ekranı", route: "swift-tracker", kind: "primary" },
      { label: "Destek Al", route: "support-form", kind: "outline" },
    ],
  },
  "swift-tracker": {
    tab: "transfers",
    title: "SWIFT Takip",
    hero: iconHero("page-icon--transfer-in", "İşlem hareketi", "Bekleyen transferin etap bazlı canlı görünümü."),
    sections: [
      {
        type: "tracker",
        title: "Etaplar",
        items: [
          { label: "Fon kaynağı teyidi", state: "done" },
          { label: "UETR eşleştirme", state: "done" },
          { label: "Yerel dağıtım masası", state: "active" },
          { label: "Son bakiye dağıtımı", state: "pending" },
        ],
      },
      {
        type: "text",
        title: "Not",
        content: "Bu demo ekranda işlem ilerledikçe adımlar görsel olarak işaretlenir. Gerçek zamanlı veri yerine beta içerik kullanılır.",
      },
    ],
  },
  support: {
    tab: "profile",
    title: "Destek Al",
    hero: iconHero("page-icon--support", "Destek merkezi", "İlgili işlemler için yardım ve yönlendirme seçenekleri."),
    sections: [
      {
        type: "list",
        title: "Yardım seçenekleri",
        items: [
          { label: "Bekleyen SWIFT işlemi", value: "Detay", route: "swift-detail" },
          { label: "Kart başvurusu desteği", value: "Form", route: "support-form" },
          { label: "Kredi başvurusu desteği", value: "Form", route: "support-form" },
        ],
      },
    ],
    footer: [
      { label: "Destek Formu", route: "support-form", kind: "primary" },
      { label: "Profil", route: "profile", kind: "outline" },
    ],
  },
  "support-form": {
    tab: "profile",
    title: "Destek Talebi",
    hero: iconHero("page-icon--support", "Mesaj gönder", "Konu ve kısa açıklama ile destek talebi oluştur."),
    sections: [
      {
        type: "form",
        formId: "support",
        title: "Destek bilgileri",
        fields: [
          { name: "topic", label: "Konu", placeholder: "Bekleyen SWIFT işlemi" },
          { name: "message", label: "Mesaj", placeholder: "İşlemimdeki son durumu öğrenmek istiyorum.", multiline: true },
        ],
        submitLabel: "Talebi Oluştur",
        successRoute: "support-success",
        successMessage: "Destek talebin oluşturuldu.",
      },
    ],
  },
  "support-success": {
    tab: "profile",
    title: "Talep Alındı",
    hero: iconHero("page-icon--success", "Destek kaydı açıldı", "Talebin sistemde işlendi ve takip numarası üretildi."),
    sections: [
      {
        type: "receipt",
        title: "Talep özeti",
        formId: "support",
        lines: [
          { label: "Konu", key: "topic" },
          { label: "Mesaj", key: "message" },
        ],
      },
    ],
  },
  "transfer-form": {
    tab: "transfers",
    title: "Para Gönder",
    hero: iconHero("page-icon--transfer-out", "Yeni transfer", "Alıcı bilgilerini doldur ve örnek işlem oluştur."),
    sections: [
      {
        type: "form",
        formId: "transfer",
        title: "Transfer bilgileri",
        fields: [
          { name: "name", label: "Alıcı adı", placeholder: "MELIKE LACIN" },
          { name: "iban", label: "IBAN", placeholder: "TRXX XXXX XXXX XX" },
          { name: "amount", label: "Tutar", placeholder: "7.500" },
        ],
        submitLabel: "Transferi Oluştur",
        successRoute: "transfer-success",
        successMessage: "Transfer emri oluşturuldu.",
      },
    ],
  },
  "transfer-success": {
    tab: "transfers",
    title: "Transfer Hazır",
    hero: iconHero("page-icon--success", "Transfer emri oluşturuldu", "Örnek işlem başarıyla kayıt edildi."),
    sections: [
      {
        type: "receipt",
        title: "İşlem özeti",
        formId: "transfer",
        lines: [
          { label: "Alıcı", key: "name" },
          { label: "IBAN", key: "iban" },
          { label: "Tutar", key: "amount", suffix: " TL" },
        ],
      },
    ],
  },
};

function showScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle("screen--active", screen.dataset.screen === screenName);
  });
}

function showToast(message) {
  if (!message) return;
  toast.textContent = message;
  toast.classList.add("toast--visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2200);
}

function updateTabs(route) {
  const tab = route === "summary" ? "summary" : appPages[route]?.tab || "summary";
  tabItems.forEach((item) => {
    item.classList.toggle("tabbar__item--active", item.dataset.tab === tab);
  });
}

function renderStatValue(item) {
  if (item.tone === "badge") return `<span class="badge">${item.value}</span>`;
  return `<strong class="${item.tone === "muted" ? "page-muted" : item.tone || ""}">${item.value}</strong>`;
}

function renderSection(section) {
  if (section.type === "stats") {
    return `
      <section class="card detail-card">
        ${section.items
          .map(
            (item) => `
              <div class="detail-row">
                <span>${item.label}</span>
                ${renderStatValue(item)}
              </div>
            `,
          )
          .join("")}
      </section>
    `;
  }

  if (section.type === "list") {
    return `
      <section class="list-block page-panel">
        ${section.title ? `<div class="list-block__title">${section.title}</div>` : ""}
        ${section.items
          .map(
            (item) => `
              <button class="list-row" type="button" ${item.route ? `data-route="${item.route}"` : ""}>
                <span>${item.label}</span>
                <span class="list-row__suffix">${item.value || ""}${item.route ? ' <span class="chevron">&rsaquo;</span>' : ""}</span>
              </button>
            `,
          )
          .join("")}
      </section>
    `;
  }

  if (section.type === "timeline") {
    return `
      <section class="list-block page-panel">
        ${section.title ? `<div class="list-block__title">${section.title}</div>` : ""}
        ${section.items
          .map(
            (item) => `
              <button class="history-item history-item--button" type="button" ${item.route ? `data-route="${item.route}"` : ""}>
                <div>
                  <small>${item.meta}</small>
                  <p>${item.label}</p>
                </div>
                <span class="chevron">&rsaquo;</span>
              </button>
            `,
          )
          .join("")}
      </section>
    `;
  }

  if (section.type === "text") {
    return `
      <section class="notice-text page-panel">
        ${section.title ? `<p><strong>${section.title}</strong></p>` : ""}
        <p>${section.content}</p>
      </section>
    `;
  }

  if (section.type === "grid") {
    return `
      <section class="quick-grid page-panel">
        ${section.items
          .map(
            (item) => `
              <button class="quick-grid__item" type="button" ${item.route ? `data-route="${item.route}"` : ""}>
                <strong>${item.label}</strong>
                <span>${item.value}</span>
              </button>
            `,
          )
          .join("")}
      </section>
    `;
  }

  if (section.type === "tracker") {
    return `
      <section class="list-block page-panel tracker-panel">
        ${section.title ? `<div class="list-block__title">${section.title}</div>` : ""}
        ${section.items
          .map(
            (item) => `
              <div class="tracker-item">
                <span class="tracker-item__dot tracker-item__dot--${item.state}"></span>
                <span>${item.label}</span>
              </div>
            `,
          )
          .join("")}
      </section>
    `;
  }

  if (section.type === "profile") {
    return `
      <section class="profile-card page-panel">
        <div class="profile-card__avatar">M</div>
        <div>
          <strong>${section.name}</strong>
          <p>${section.meta}</p>
        </div>
      </section>
    `;
  }

  if (section.type === "card-showcase") {
    return `
      <section class="card-showcase page-panel">
        <div class="card-showcase__visual">
          <span>enpara.com</span>
          <strong>Digital Card</strong>
        </div>
        <div class="card-showcase__content">
          <h3>${section.title}</h3>
          <p>${section.content}</p>
          <button class="primary-button card-showcase__button" type="button" data-route="${section.route}">${section.actionLabel}</button>
        </div>
      </section>
    `;
  }

  if (section.type === "form") {
    const values = state.forms[section.formId] || {};
    return `
      <section class="form-panel page-panel">
        ${section.title ? `<div class="list-block__title">${section.title}</div>` : ""}
        <div class="form-panel__fields">
          ${section.fields
            .map((field) => {
              const value = values[field.name] || "";
              if (field.multiline) {
                return `
                  <label class="form-field">
                    <span>${field.label}</span>
                    <textarea data-form="${section.formId}" data-field="${field.name}" rows="4" placeholder="${field.placeholder || ""}">${value}</textarea>
                  </label>
                `;
              }
              return `
                <label class="form-field">
                  <span>${field.label}</span>
                  <input data-form="${section.formId}" data-field="${field.name}" value="${value}" placeholder="${field.placeholder || ""}" />
                </label>
              `;
            })
            .join("")}
        </div>
        <button
          class="primary-button form-panel__submit"
          type="button"
          data-submit="${section.formId}"
          data-success-route="${section.successRoute}"
          data-success-message="${section.successMessage || ""}"
        >
          ${section.submitLabel}
        </button>
      </section>
    `;
  }

  if (section.type === "receipt") {
    const values = state.forms[section.formId] || {};
    return `
      <section class="card detail-card">
        ${section.title ? `<div class="receipt-title">${section.title}</div>` : ""}
        ${section.lines
          .map(
            (line) => `
              <div class="detail-row">
                <span>${line.label}</span>
                <strong>${(values[line.key] || "-") + (line.suffix || "")}</strong>
              </div>
            `,
          )
          .join("")}
      </section>
    `;
  }

  return "";
}

function renderFooter(footer = [], route) {
  const actions = footer.length
    ? footer
    : [
        { label: "Geri", route: state.history[state.history.length - 1] || "summary", kind: "outline" },
        { label: "Ana Sayfa", route: "summary", kind: "outline" },
      ];

  pageFooter.innerHTML = actions
    .map(
      (action) => `
        <button class="${action.kind === "primary" ? "primary-button" : "outline-button"}" type="button" data-route="${action.route}">
          ${action.label}
        </button>
      `,
    )
    .join("");
  pageFooter.dataset.route = route;
}

function renderPage(route) {
  const page = appPages[route];
  if (!page) {
    showRoute("summary", false);
    return;
  }

  state.currentRoute = route;
  pageTitle.textContent = page.title;
  pageHero.innerHTML = page.hero || "";
  pageBody.innerHTML = (page.sections || []).map(renderSection).join("");
  renderFooter(page.footer, route);
  showScreen("page");
  updateTabs(route);
}

function showRoute(route, pushHistory = true) {
  if (pushHistory && state.currentRoute !== route) {
    state.history.push(state.currentRoute);
  }

  if (route === "summary") {
    state.currentRoute = "summary";
    showScreen("summary");
    updateTabs("summary");
    return;
  }

  renderPage(route);
}

function goBack() {
  const previous = state.history.pop() || "summary";
  showRoute(previous, false);
}

function persistField(input) {
  const { form, field } = input.dataset;
  if (!form || !field) return;
  state.forms[form][field] = input.value.trim();
}

function handleSubmit(button) {
  const formId = button.dataset.submit;
  const successRoute = button.dataset.successRoute;
  const message = button.dataset.successMessage;

  document.querySelectorAll(`[data-form="${formId}"]`).forEach((field) => persistField(field));
  state.latestActions[formId] = new Date().toISOString();
  if (message) showToast(message);
  if (successRoute) showRoute(successRoute);
}

function handleInteraction(event) {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    showRoute(routeButton.dataset.route);
    return;
  }

  const submitButton = event.target.closest("[data-submit]");
  if (submitButton) {
    event.preventDefault();
    handleSubmit(submitButton);
    return;
  }

  const backButton = event.target.closest("[data-action='back']");
  if (backButton) {
    event.preventDefault();
    goBack();
  }
}

document.addEventListener("click", handleInteraction);
document.addEventListener("input", (event) => {
  const field = event.target.closest("[data-form][data-field]");
  if (field) persistField(field);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  });
}

if ("caches" in window) {
  window.addEventListener("load", () => {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  });
}

updateTabs("summary");
