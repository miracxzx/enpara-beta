const screens = document.querySelectorAll("[data-screen]");
const pageTitle = document.querySelector("#page-title");
const pageHero = document.querySelector("#page-hero");
const pageBody = document.querySelector("#page-body");
const pageFooter = document.querySelector("#page-footer");

const HOURGLASS_ICON = `
  <div class="pending-card__icon pending-card__icon--large" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M18 10h28M18 54h28M22 10c0 12 20 10 20 22S22 42 22 54M42 10c0 12-20 10-20 22s20 10 20 22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  </div>
`;

const appPages = {
  menu: {
    title: "Hızlı Menü",
    hero: `
      <div class="page-icon page-icon--menu" aria-hidden="true"><span></span><span></span><span></span></div>
      <h2>Sık kullanılan işlemler</h2>
      <p>En sık ziyaret edilen bölümlere tek dokunuşla geç.</p>
    `,
    sections: [
      {
        type: "list",
        title: "Menü",
        items: [
          { label: "Vadesiz TL hesabım", value: "Detaya git", route: "tl-account" },
          { label: "Diğer banka hesapları", value: "Görüntüle", route: "other-accounts" },
          { label: "Bildirim merkezi", value: "Aç", route: "notifications" },
          { label: "Destek merkezi", value: "Aç", route: "support" },
        ],
      },
    ],
    footer: [
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
      { label: "Bildirimler", route: "notifications", kind: "outline" },
    ],
  },
  notifications: {
    title: "Bildirimler",
    hero: `
      <div class="page-icon page-icon--bell" aria-hidden="true"></div>
      <h2>Son sistem bildirimleri</h2>
      <p>İşlem ve durum güncellemelerin burada listelenir.</p>
    `,
    sections: [
      {
        type: "timeline",
        title: "Bugün",
        items: [
          { label: "SWIFT transferin dağıtım aşamasında", meta: "14:29", route: "swift-detail" },
          { label: "Gelen transfer hesabına işlendi", meta: "13:10", route: "incoming-transfer" },
          { label: "Kredi kartı ön onayı hazır", meta: "10:41", route: "credit-card" },
        ],
      },
    ],
    footer: [
      { label: "Destek Al", route: "support", kind: "outline" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  "tl-account": {
    title: "Vadesiz TL",
    hero: `
      <div class="page-icon page-icon--account" aria-hidden="true"></div>
      <h2>TL hesap detayın</h2>
      <p>Bakiyen, hesap bilgilerin ve işlem kısayolların burada.</p>
    `,
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
        title: "İşlemler",
        items: [
          { label: "Son işlemler", value: "Görüntüle", route: "incoming-transfer" },
          { label: "Bekleyen transfer", value: "Detay", route: "swift-detail" },
        ],
      },
    ],
    footer: [
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
      { label: "Destek Al", route: "support", kind: "outline" },
    ],
  },
  "usd-account": {
    title: "Vadesiz USD",
    hero: `
      <div class="page-icon page-icon--account" aria-hidden="true"></div>
      <h2>USD hesap detayın</h2>
      <p>Döviz hesabına ait bakiye ve hareket özetini görüntüle.</p>
    `,
    sections: [
      {
        type: "stats",
        items: [
          { label: "Bakiye", value: "0,00 USD", tone: "default" },
          { label: "Kullanılabilir", value: "0,00 USD", tone: "default" },
          { label: "SWIFT uygunluğu", value: "Aktif", tone: "success" },
        ],
      },
    ],
    footer: [
      { label: "Bekleyen SWIFT", route: "swift-detail", kind: "outline" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  "other-accounts": {
    title: "Diğer Banka Hesapları",
    hero: `
      <div class="page-icon page-icon--bank" aria-hidden="true"></div>
      <h2>Tanınan banka hesapların</h2>
      <p>Transferlerinde kullanabileceğin kayıtlı dış hesaplar.</p>
    `,
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
    footer: [
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
      { label: "Destek Al", route: "support", kind: "outline" },
    ],
  },
  loan: {
    title: "İhtiyaç Kredisi",
    hero: `
      <div class="page-icon page-icon--loan" aria-hidden="true"></div>
      <h2>Başvuru özeti</h2>
      <p>Ön değerlendirme ve teklif detaylarını bu ekranda topladım.</p>
    `,
    sections: [
      {
        type: "stats",
        items: [
          { label: "Hazır limit", value: "250.000 TL", tone: "success" },
          { label: "Vade seçeneği", value: "3-36 ay", tone: "default" },
          { label: "Durum", value: "Başvuruya uygun", tone: "warning" },
        ],
      },
      {
        type: "text",
        title: "Bilgilendirme",
        content: "Faiz ve vade seçenekleri kimlik doğrulaması sonrasında netleşir. Devam ederek dijital başvuru akışına geçebilirsin.",
      },
    ],
    footer: [
      { label: "Başvuruya Devam", route: "support", kind: "primary" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  "credit-card": {
    title: "Kredi Kartı",
    hero: `
      <div class="page-icon page-icon--card" aria-hidden="true"></div>
      <h2>Kart başvuru ekranı</h2>
      <p>Limit, teslimat ve kart özellikleri için özet görünüm.</p>
    `,
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
      { label: "Başvuruya Geç", route: "support", kind: "primary" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  ekpara: {
    title: "Ekpara (KMH)",
    hero: `
      <div class="page-icon page-icon--wallet" aria-hidden="true"></div>
      <h2>Ekpara teklifin</h2>
      <p>Hesabına tanımlanabilecek ek limit bilgisi burada.</p>
    `,
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
    footer: [
      { label: "Aktivasyon Bilgisi", route: "support", kind: "primary" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  findeks: {
    title: "Findeks Risk Raporu",
    hero: `
      <div class="page-icon page-icon--score" aria-hidden="true"></div>
      <h2>Rapor başvurusu</h2>
      <p>Risk raporu talebi için kısa özet ve işlem adımları.</p>
    `,
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
    footer: [
      { label: "Raporu İste", route: "support", kind: "primary" },
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
    ],
  },
  "outgoing-transfer": {
    title: "Giden Transfer",
    hero: `
      <div class="page-icon page-icon--transfer-out" aria-hidden="true"></div>
      <h2>İşlem detayı</h2>
      <p>Bugün gerçekleşen giden transfer hareketinin özeti.</p>
    `,
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
    footer: [
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
      { label: "Destek Al", route: "support", kind: "outline" },
    ],
  },
  "incoming-transfer": {
    title: "Gelen Transfer",
    hero: `
      <div class="page-icon page-icon--transfer-in" aria-hidden="true"></div>
      <h2>İşlem detayı</h2>
      <p>Bugün hesabına geçen bireysel transfer bilgisi.</p>
    `,
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
    footer: [
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
      { label: "Destek Al", route: "support", kind: "outline" },
    ],
  },
  "swift-detail": {
    title: "SWIFT Transfer Detayı",
    hero: `
      ${HOURGLASS_ICON}
      <h2>Bekleyen Transfer</h2>
    `,
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
        type: "text",
        title: "Bilgilendirme",
        content:
          "Fon kaynağı teyidi, koruma ve işlem yoğunluğuna göre dağıtım süreci devam eder. Belge talebi oluşmadığı sürece bekleyen işlem bakiyeye yansımak üzere takip edilir.",
      },
    ],
    footer: [
      { label: "Vazgeç", route: "summary", kind: "outline" },
      { label: "Destek Al", route: "support", kind: "outline" },
    ],
  },
  support: {
    title: "Destek Al",
    hero: `
      <div class="page-icon page-icon--support" aria-hidden="true"></div>
      <h2>Destek merkezi</h2>
      <p>İşleminle ilgili yardım seçenekleri ve hızlı yönlendirmeler.</p>
    `,
    sections: [
      {
        type: "list",
        title: "Yardım seçenekleri",
        items: [
          { label: "Bekleyen SWIFT işlemi", value: "Detaya git", route: "swift-detail" },
          { label: "Kart başvurusu desteği", value: "Aç", route: "credit-card" },
          { label: "Kredi başvurusu desteği", value: "Aç", route: "loan" },
        ],
      },
      {
        type: "text",
        title: "Not",
        content:
          "Bu beta sürümde destek akışı bilgi ekranı olarak çalışır. İlgili işlemlere geri dönerek sayfa geçişlerini sürdürebilirsin.",
      },
    ],
    footer: [
      { label: "Ana Sayfa", route: "summary", kind: "outline" },
      { label: "Bildirimler", route: "notifications", kind: "outline" },
    ],
  },
};

let currentRoute = "summary";
const historyStack = [];

function showScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle("screen--active", screen.dataset.screen === screenName);
  });
}

function renderSection(section) {
  if (section.type === "stats") {
    return `
      <section class="card detail-card">
        ${section.items
          .map((item) => {
            const value =
              item.tone === "badge"
                ? `<span class="badge">${item.value}</span>`
                : `<strong class="${item.tone === "muted" ? "page-muted" : item.tone || ""}">${item.value}</strong>`;
            return `
              <div class="detail-row">
                <span>${item.label}</span>
                ${value}
              </div>
            `;
          })
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

  return "";
}

function renderFooter(footer = []) {
  pageFooter.innerHTML = footer
    .map(
      (action) => `
        <button
          class="${action.kind === "primary" ? "primary-button" : "outline-button"}"
          type="button"
          data-route="${action.route}"
        >
          ${action.label}
        </button>
      `,
    )
    .join("");
}

function renderPage(route) {
  const page = appPages[route];
  if (!page) {
    showRoute("summary", false);
    return;
  }

  currentRoute = route;
  pageTitle.textContent = page.title;
  pageHero.innerHTML = page.hero || "";
  pageBody.innerHTML = (page.sections || []).map(renderSection).join("");
  renderFooter(page.footer);
  showScreen("page");
}

function showRoute(route, pushHistory = true) {
  if (route === "summary") {
    if (pushHistory && currentRoute !== "summary") {
      historyStack.push(currentRoute);
    }
    currentRoute = "summary";
    showScreen("summary");
    return;
  }

  if (pushHistory && currentRoute !== route) {
    historyStack.push(currentRoute);
  }

  renderPage(route);
}

function goBack() {
  const previous = historyStack.pop() || "summary";
  showRoute(previous, false);
}

function handleInteraction(event) {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    event.preventDefault();
    showRoute(routeButton.dataset.route);
    return;
  }

  const backButton = event.target.closest("[data-action='back']");
  if (backButton) {
    event.preventDefault();
    goBack();
  }
}

document.addEventListener("click", handleInteraction);
document.addEventListener("pointerup", handleInteraction);

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
