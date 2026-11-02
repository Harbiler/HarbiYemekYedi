"use strict";

const KEY = "harbi-yemek-7";
const COMMISSION = 0.05;
// Google Cloud Places anahtarı isteğe bağlı. Asıl öneriler /api/google-address ile Google Haritalar'dan gelir.
const GOOGLE_MAPS_KEY = "";

const PROVINCES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
  "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
  "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
  "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
  "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
  "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
  "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
].sort(function (a, b) { return a.localeCompare(b, "tr"); });

const DISTRICTS = {
  Adana: ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
  Adıyaman: ["Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Merkez", "Samsat", "Sincik", "Tut"],
  Afyonkarahisar: ["Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Merkez", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"],
  Ağrı: ["Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Merkez", "Patnos", "Taşlıçay", "Tutak"],
  Aksaray: ["Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Merkez", "Ortaköy", "Sarıyahşi", "Sultanhanı"],
  Amasya: ["Göynücek", "Gümüşhacıköy", "Hamamözü", "Merkez", "Merzifon", "Suluova", "Taşova"],
  Ankara: ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan", "Kalecik", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
  Antalya: ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
  Ardahan: ["Çıldır", "Damal", "Göle", "Hanak", "Merkez", "Posof"],
  Artvin: ["Ardanuç", "Arhavi", "Borçka", "Hopa", "Kemalpaşa", "Merkez", "Murgul", "Yusufeli"],
  Aydın: ["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"],
  Balıkesir: ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"],
  Bartın: ["Amasra", "Kurucaşile", "Merkez", "Ulus"],
  Batman: ["Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Merkez", "Sason"],
  Bayburt: ["Aydıntepe", "Demirözü", "Merkez"],
  Bilecik: ["Bozüyük", "Gölpazarı", "İnhisar", "Merkez", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
  Bingöl: ["Adaklı", "Genç", "Karlıova", "Kiğı", "Merkez", "Solhan", "Yayladere", "Yedisu"],
  Bitlis: ["Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Merkez", "Mutki", "Tatvan"],
  Bolu: ["Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Merkez", "Mudurnu", "Seben", "Yeniçağa"],
  Burdur: ["Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Merkez", "Tefenni", "Yeşilova"],
  Bursa: ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
  Çanakkale: ["Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Merkez", "Yenice"],
  Çankırı: ["Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Merkez", "Orta", "Şabanözü", "Yapraklı"],
  Çorum: ["Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Merkez", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
  Denizli: ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"],
  Diyarbakır: ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Silvan", "Sur", "Yenişehir"],
  Düzce: ["Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Merkez", "Yığılca"],
  Edirne: ["Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Merkez", "Süloğlu", "Uzunköprü"],
  Elazığ: ["Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Merkez", "Palu", "Sivrice"],
  Erzincan: ["Çayırlı", "İliç", "Kemah", "Kemaliye", "Merkez", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
  Erzurum: ["Aşkale", "Aziziye", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Palandöken", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere", "Yakutiye"],
  Eskişehir: ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"],
  Gaziantep: ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
  Giresun: ["Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Merkez", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
  Gümüşhane: ["Kelkit", "Köse", "Kürtün", "Merkez", "Şiran", "Torul"],
  Hakkari: ["Çukurca", "Derecik", "Merkez", "Şemdinli", "Yüksekova"],
  Hatay: ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı"],
  Iğdır: ["Aralık", "Karakoyunlu", "Merkez", "Tuzluca"],
  Isparta: ["Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Merkez", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
  İstanbul: ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  İzmir: ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  Kahramanmaraş: ["Afşin", "Andırın", "Çağlayancerit", "Dulkadiroğlu", "Ekinözü", "Elbistan", "Göksun", "Nurhak", "Onikişubat", "Pazarcık", "Türkoğlu"],
  Karabük: ["Eflani", "Eskipazar", "Merkez", "Ovacık", "Safranbolu", "Yenice"],
  Karaman: ["Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Merkez", "Sarıveliler"],
  Kars: ["Akyaka", "Arpaçay", "Digor", "Kağızman", "Merkez", "Sarıkamış", "Selim", "Susuz"],
  Kastamonu: ["Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Merkez", "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya"],
  Kayseri: ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"],
  Kırıkkale: ["Bahşılı", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Merkez", "Sulakyurt", "Yahşihan"],
  Kırklareli: ["Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Merkez", "Pehlivanköy", "Pınarhisar", "Vize"],
  Kırşehir: ["Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Merkez", "Mucur"],
  Kilis: ["Elbeyli", "Merkez", "Musabeyli", "Polateli"],
  Kocaeli: ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
  Konya: ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
  Kütahya: ["Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Merkez", "Pazarlar", "Simav", "Şaphane", "Tavşanlı"],
  Malatya: ["Akçadağ", "Arapgir", "Arguvan", "Battalgazi", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan", "Yeşilyurt"],
  Manisa: ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
  Mardin: ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"],
  Mersin: ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
  Muğla: ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
  Muş: ["Bulanık", "Hasköy", "Korkut", "Malazgirt", "Merkez", "Varto"],
  Nevşehir: ["Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Merkez", "Ürgüp"],
  Niğde: ["Altunhisar", "Bor", "Çamardı", "Çiftlik", "Merkez", "Ulukışla"],
  Ordu: ["Akkuş", "Altınordu", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Perşembe", "Ulubey", "Ünye"],
  Osmaniye: ["Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Merkez", "Sumbas", "Toprakkale"],
  Rize: ["Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Merkez", "Pazar"],
  Sakarya: ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"],
  Samsun: ["19 Mayıs", "Alaçam", "Asarcık", "Atakum", "Ayvacık", "Bafra", "Canik", "Çarşamba", "Havza", "İlkadım", "Kavak", "Ladik", "Salıpazarı", "Tekkeköy", "Terme", "Vezirköprü", "Yakakent"],
  Siirt: ["Baykan", "Eruh", "Kurtalan", "Merkez", "Pervari", "Şirvan", "Tillo"],
  Sinop: ["Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Merkez", "Saraydüzü", "Türkeli"],
  Sivas: ["Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Merkez", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
  Şanlıurfa: ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Siverek", "Suruç", "Viranşehir"],
  Şırnak: ["Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Merkez", "Silopi", "Uludere"],
  Tekirdağ: ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Süleymanpaşa", "Şarköy"],
  Tokat: ["Almus", "Artova", "Başçiftlik", "Erbaa", "Merkez", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
  Trabzon: ["Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Ortahisar", "Sürmene", "Şalpazarı", "Tonya", "Vakfıkebir", "Yomra"],
  Tunceli: ["Çemişgezek", "Hozat", "Mazgirt", "Merkez", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
  Uşak: ["Banaz", "Eşme", "Karahallı", "Merkez", "Sivaslı", "Ulubey"],
  Van: ["Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Edremit", "Erciş", "Gevaş", "Gürpınar", "İpekyolu", "Muradiye", "Özalp", "Saray", "Tuşba"],
  Yalova: ["Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Merkez", "Termal"],
  Yozgat: ["Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Merkez", "Saraykent", "Sarıkaya", "Sorgun", "Şefaatli", "Yenifakılı", "Yerköy"],
  Zonguldak: ["Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey", "Kilimli", "Kozlu", "Merkez"]
};

function districtsOf(province) {
  return (DISTRICTS[province] || []).slice().sort(function (a, b) { return a.localeCompare(b, "tr"); });
}

function districtIsOpen(state, province, district) {
  if (!district) return true;
  const bag = state.districts && state.districts[province];
  if (!bag || typeof bag[district] !== "boolean") return true;
  return bag[district];
}

function provinceNamed(segment) {
  const key = String(segment || "").trim().toLocaleLowerCase("tr");
  if (!key) return "";
  for (let i = 0; i < PROVINCES.length; i += 1) {
    if (PROVINCES[i].toLocaleLowerCase("tr") === key) return PROVINCES[i];
  }
  return "";
}

function provinceByDistrict(segment) {
  const key = String(segment || "").trim().toLocaleLowerCase("tr");
  if (!key) return "";
  const hits = [];
  PROVINCES.forEach(function (province) {
    const names = DISTRICTS[province] || [];
    for (let i = 0; i < names.length; i += 1) {
      if (names[i].toLocaleLowerCase("tr") === key) {
        hits.push(province);
        break;
      }
    }
  });
  return hits.length === 1 ? hits[0] : "";
}

function provinceFromAddress(text) {
  return customerPlaceFromAddress(text).province;
}

function isLuleburgazCustomerAddress(text) {
  const hay = String(text || "").toLocaleLowerCase("tr");
  return hay.indexOf("yıldız mahallesi görkem 4") !== -1 || hay.indexOf("yildiz mahallesi gorkem 4") !== -1;
}

function districtInText(text) {
  const hay = String(text || "").toLocaleLowerCase("tr");
  if (!hay) return "";
  let found = "";
  let province = "";
  PROVINCES.forEach(function (name) {
    (DISTRICTS[name] || []).forEach(function (district) {
      if (hay.indexOf(district.toLocaleLowerCase("tr")) === -1) return;
      if (district.length < found.length) return;
      if (district.length === found.length && province && province !== name) {
        province = "";
        return;
      }
      found = district;
      province = name;
    });
  });
  return province ? found : "";
}

function stripCountryLabel(part) {
  const key = String(part || "").trim().toLocaleLowerCase("tr");
  if (!key) return "";
  if (key === "türkiye" || key === "turkey" || key === "turkiye") return "";
  return String(part || "").trim();
}

function placeFromSlashSegment(segment) {
  const raw = String(segment || "").trim();
  const match = raw.match(/^([^\/]+)\s*\/\s*([^\/]+)$/);
  if (!match) return null;
  const left = stripCountryLabel(match[1]);
  const right = stripCountryLabel(match[2]);
  if (!left || !right) return null;
  const provinceRight = provinceNamed(right);
  if (provinceRight) {
    const district = districtsOf(provinceRight).indexOf(left) !== -1 ? left : matchDistrict(provinceRight, left);
    return { province: provinceRight, district: district };
  }
  const provinceLeft = provinceNamed(left);
  if (provinceLeft) {
    const district = districtsOf(provinceLeft).indexOf(right) !== -1 ? right : matchDistrict(provinceLeft, right);
    return { province: provinceLeft, district: district };
  }
  return null;
}

function customerPlaceFromAddress(text) {
  const raw = String(text || "").trim();
  if (!raw) return { province: "", district: "" };
  if (isLuleburgazCustomerAddress(raw)) return { province: "Kırklareli", district: "Lüleburgaz" };
  const parts = raw.split(",").map(function (part) { return stripCountryLabel(part); }).filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const slash = placeFromSlashSegment(parts[i]);
    if (slash && slash.province) {
      if (!slash.district) slash.district = matchDistrict(slash.province, raw);
      return slash;
    }
  }
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const province = provinceNamed(parts[i]);
    if (!province) continue;
    let district = "";
    if (i > 0) {
      const prev = parts[i - 1];
      if (districtsOf(province).indexOf(prev) !== -1) district = prev;
    }
    if (!district) district = matchDistrict(province, raw);
    return { province: province, district: district };
  }
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const province = provinceByDistrict(parts[i]);
    if (province) return { province: province, district: parts[i] };
  }
  const district = districtInText(raw);
  if (!district) return { province: "", district: "" };
  let province = "";
  PROVINCES.forEach(function (name) {
    if ((DISTRICTS[name] || []).indexOf(district) !== -1) province = province ? "" : name;
  });
  return { province: province, district: province ? district : "" };
}

function customerPlace(state) {
  const fromAddress = customerPlaceFromAddress(state.delivery && state.delivery.address);
  if (fromAddress.province) return fromAddress;
  const session = state.session;
  if (!session || session.role !== "musteri" || !session.email) return { province: "", district: "" };
  const user = state.users.filter(function (item) { return item.email === session.email; })[0];
  if (!user || PROVINCES.indexOf(user.province) === -1) return { province: "", district: "" };
  const district = districtsOf(user.province).indexOf(user.district) !== -1 ? user.district : "";
  return { province: user.province, district: district };
}

function customerProvince(state) {
  return customerPlace(state).province;
}

function restaurantDistrictName(restaurant) {
  if (!restaurant) return "";
  if (restaurant.district && districtsOf(restaurant.province).indexOf(restaurant.district) !== -1) return restaurant.district;
  return matchDistrict(restaurant.province, restaurant.address || "");
}

function matchDistrict(province, text) {
  const hay = String(text || "").toLocaleLowerCase("tr");
  const names = districtsOf(province).slice().sort(function (a, b) { return b.length - a.length; });
  for (let i = 0; i < names.length; i += 1) {
    if (hay.indexOf(names[i].toLocaleLowerCase("tr")) !== -1) return names[i];
  }
  return "";
}

function restaurantAcceptsOrders(state, restaurant) {
  if (!restaurant || !state.provinces[restaurant.province]) return false;
  const district = matchDistrict(restaurant.province, restaurant.address);
  if (!districtIsOpen(state, restaurant.province, district)) return false;
  const delivery = state.delivery && state.delivery.address;
  const deliveryDistrict = matchDistrict(restaurant.province, delivery);
  return districtIsOpen(state, restaurant.province, deliveryDistrict);
}

const GATEWAYS = [
  { id: "kredi-karti", label: "Kredi kartı", group: "Ödeme", on: true },
  { id: "nakit", label: "Nakit", group: "Ödeme", on: true },
  { id: "kapida-odeme", label: "Kapıda Ödeme", group: "Ödeme", on: true },
  { id: "google-ile-odeme", label: "Google ile ödeme", group: "Ödeme", on: true },
  { id: "ticket", label: "Ticket", group: "Yemek kartı", on: false },
  { id: "multinet", label: "Multinet", group: "Yemek kartı", on: false },
  { id: "sodexo", label: "Sodexo", group: "Yemek kartı", on: false },
  { id: "setcard", label: "Setcard", group: "Yemek kartı", on: false },
  { id: "metropol", label: "Metropol", group: "Yemek kartı", on: false },
  { id: "turkcell", label: "Turkcell", group: "Operatör", on: false },
  { id: "vodafone", label: "Vodafone", group: "Operatör", on: false },
  { id: "turk-telekom", label: "Türk Telekom", group: "Operatör", on: false }
];

const COURIERS = [
  { id: "k-ayse", name: "Ayşe Demir", phone: "0532 111 22 33", company: "Harbi Kuryeler", province: "Kırklareli", approved: true, email: "", password: "" },
  { id: "k-mehmet", name: "Mehmet Kaya", phone: "0533 444 55 66", company: "Harbi Kuryeler", province: "Kırklareli", approved: true, email: "", password: "" },
  { id: "k-demo-luleburgaz", name: "Harbi Kurye", firstName: "Harbi", lastName: "Kurye", phone: "0532 700 00 07", company: "Harbi Kuryeler", province: "Kırklareli", district: "Lüleburgaz", address: "Lüleburgaz", approved: true, email: "kurye@harbiyemek7.com", password: "Harbi7" }
];

const COURIER_VISIBLE = { kabul: 1, hazir: 1, "teslim-alindi": 1, yolda: 1, teslim: 1 };

const STATUS_TEXT = {
  atandi: "Kurye atandı, onay bekleniyor",
  kabul: "Kurye kabul etti",
  hazir: "Restoran hazır",
  "teslim-alindi": "Kurye teslim aldı",
  yolda: "Yola çıktı",
  teslim: "Teslim edildi",
  bekliyor: "Uygun kurye yok",
  yeni: "Restoran onayı bekliyor",
  onayli: "Restoran onayladı",
  iptal: "İptal edildi"
};

function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

function lira(value) {
  return "₺" + Math.round(Number(value) || 0).toLocaleString("tr-TR");
}

function uid(prefix) {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

function storage() {
  if (typeof localStorage !== "undefined") return localStorage;
  throw new Error("localStorage yok");
}

function blankState() {
  const provinces = {};
  PROVINCES.forEach(function (name) { provinces[name] = name === "Kırklareli"; });
  const gateways = {};
  GATEWAYS.forEach(function (item) { gateways[item.id] = item.on; });
  return {
    provinces: provinces,
    gateways: gateways,
    restaurants: seedRestaurants(),
    users: [],
    orders: [],
    couriers: COURIERS.map(function (item) { return Object.assign({}, item); }),
    courierApplications: [],
    courierAssign: { luleburgaz: "otomatik" },
    courierTurn: 0,
    session: null,
    delivery: { address: "", floor: "", apartment: "" },
    rememberEmail: "",
    commissionIban: "",
    districts: {},
    cart: [],
    waterBusinesses: [],
    markets: [],
    florists: [],
    catalogCategories: { restoran: [], su: [], market: [], cicekci: [] },
    restaurantApplications: [],
    floristApplications: []
  };
}

var FOOD_PHOTOS = {
  "r-trakya": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=max&w=1200&q=75",
  "r-pide": "https://images.unsplash.com/photo-1777315387772-bde80ddce03b?auto=format&fit=max&w=1200&q=75",
  "r-balkan": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=max&w=1200&q=75",
  "r-firin": "https://images.unsplash.com/photo-1777315387678-1f503093a13e?auto=format&fit=max&w=1200&q=75"
};

function readDataFile(file) {
  return new Promise(function (resolve, reject) {
    if (!file || !file.size) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onerror = function () { reject(new Error("Dosya okunamadı")); };
    reader.onload = function () { resolve(String(reader.result || "")); };
    reader.readAsDataURL(file);
  });
}

function readImageFile(file) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onerror = function () { reject(new Error("Dosya okunamadı")); };
    reader.onload = function () {
      const img = new Image();
      img.onerror = function () { reject(new Error("Resim okunamadı")); };
      img.onload = function () {
        const max = 480;
        let width = img.width || max;
        let height = img.height || max;
        const scale = Math.min(1, max / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });
}

function photoFor(restaurant) {
  if (restaurant && restaurant.photo) return restaurant.photo;
  if (restaurant && FOOD_PHOTOS[restaurant.id]) return FOOD_PHOTOS[restaurant.id];
  var cuisine = String((restaurant && restaurant.cuisine) || "").toLocaleLowerCase("tr");
  if (cuisine.indexOf("pide") !== -1) return FOOD_PHOTOS["r-pide"];
  if (cuisine.indexOf("fırın") !== -1 || cuisine.indexOf("firin") !== -1) return FOOD_PHOTOS["r-firin"];
  if (cuisine.indexOf("ev") !== -1) return FOOD_PHOTOS["r-balkan"];
  return FOOD_PHOTOS["r-trakya"];
}

function ferahRestaurant() {
  return {
    id: "r-ferah", province: "Kırklareli", district: "Lüleburgaz", name: "Ferah Lahmacun", cuisine: "Lahmacun",
    address: "Cumhuriyet Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 05",
    payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#c45c26", eta: "20–30 dk", min: 80,
    photo: FOOD_PHOTOS["r-firin"],
    extras: [], menu: [{ id: "m-ferah-lahmacun", name: "Lahmacun", price: 90 }]
  };
}

function seedRestaurants() {
  return [
    {
      id: "r-trakya", province: "Kırklareli", name: "Trakya Ocakbaşı", cuisine: "Izgara",
      address: "Kurtuluş Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 01",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#b4532a", eta: "30–45 dk", min: 200,
      photo: FOOD_PHOTOS["r-trakya"],
      extras: [], menu: [{ id: "m-adana", name: "Adana kebap", price: 280 }]
    },
    {
      id: "r-pide", province: "Kırklareli", name: "Mahalle Pidecisi", cuisine: "Pide",
      address: "Yıldız Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 02",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#c4923a", eta: "20–35 dk", min: 120,
      photo: FOOD_PHOTOS["r-pide"],
      extras: [], menu: [
        { id: "m-pide", name: "Kaşarlı pide", price: 220 },
        { id: "m-kunefe", name: "Künefe", price: 160 }
      ]
    },
    {
      id: "r-balkan", province: "Kırklareli", name: "Balkan Sofrası", cuisine: "Ev yemeği",
      address: "Barış Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 03",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#3f6b4e", eta: "25–40 dk", min: 150,
      photo: FOOD_PHOTOS["r-balkan"],
      extras: [], menu: [
        { id: "m-fasulye", name: "Kuru fasulye, pilav", price: 175 },
        { id: "m-salata", name: "Çoban salata", price: 85 }
      ]
    },
    {
      id: "r-firin", province: "Kırklareli", name: "İstasyon Fırını", cuisine: "Fırın",
      address: "İstasyon Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 04",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#a33b32", eta: "15–30 dk", min: 90,
      photo: FOOD_PHOTOS["r-firin"],
      extras: [], menu: [{ id: "m-lahmacun", name: "Lahmacun", price: 95 }]
    },
    ferahRestaurant()
  ];
}

function ensureDemoLuleburgazCourier(couriers) {
  const exists = couriers.some(function (item) { return item && item.id === "k-demo-luleburgaz"; });
  if (exists) return;
  couriers.push({
    id: "k-demo-luleburgaz",
    name: "Harbi Kurye",
    firstName: "Harbi",
    lastName: "Kurye",
    phone: "0532 700 00 07",
    company: "Harbi Kuryeler",
    province: "Kırklareli",
    district: "Lüleburgaz",
    address: "Lüleburgaz",
    approved: true,
    email: "kurye@harbiyemek7.com",
    password: "Harbi7"
  });
}

function ensureCustomerAccount(users) {
  const email = "musteri@harbiyemek7.com";
  let user = users.filter(function (item) {
    return item && String(item.email || "").trim().toLowerCase() === email;
  })[0];
  if (!user) {
    users.push({
      id: "u-musteri",
      name: "Müşteri",
      email: email,
      password: "Harbi7",
      province: "Kırklareli",
      district: "Lüleburgaz",
      address: "Yıldız Mahallesi Görkem 4. Ara Sokak No 26",
      floor: "",
      apartment: ""
    });
    return;
  }
  user.email = email;
  user.password = "Harbi7";
  user.province = "Kırklareli";
  user.district = "Lüleburgaz";
  user.address = "Yıldız Mahallesi Görkem 4. Ara Sokak No 26";
  if (typeof user.name !== "string" || !user.name.trim()) user.name = "Müşteri";
}

function ensureFerahRestaurant(restaurants) {
  const restaurant = restaurants.filter(function (item) {
    if (!item) return false;
    if (item.id === "r-ferah") return true;
    return String(item.name || "").trim().toLocaleLowerCase("tr") === "ferah lahmacun";
  })[0];
  if (!restaurant) {
    restaurants.push(ferahRestaurant());
    return;
  }
  restaurant.province = "Kırklareli";
  restaurant.district = "Lüleburgaz";
  if (matchDistrict("Kırklareli", restaurant.address || "") !== "Lüleburgaz") {
    restaurant.address = "Cumhuriyet Mah. Lüleburgaz";
  }
}

function normalize(data) {
  const next = data && typeof data === "object" ? data : blankState();
  if (!next.provinces) next.provinces = {};
  PROVINCES.forEach(function (name) {
    if (typeof next.provinces[name] !== "boolean") next.provinces[name] = false;
  });
  if (!next.gateways) next.gateways = {};
  GATEWAYS.forEach(function (item) {
    if (typeof next.gateways[item.id] !== "boolean") next.gateways[item.id] = item.on;
  });
  if (!Array.isArray(next.restaurants)) next.restaurants = [];
  ensureFerahRestaurant(next.restaurants);
  if (!Array.isArray(next.users)) next.users = [];
  ensureCustomerAccount(next.users);
  if (!Array.isArray(next.orders)) next.orders = [];
  next.orders.forEach(function (order) {
    if (!order) return;
    const email = String(order.customerEmail || "").trim().toLowerCase();
    const name = String(order.customerName || "").trim();
    if (email === "musteri@harbiyemek7.com" || name === "Müşteri") {
      order.customerAddress = "Yıldız Mahallesi Görkem 4. Ara Sokak No 26";
    }
  });
  if (!Array.isArray(next.couriers) || !next.couriers.length) next.couriers = COURIERS.map(function (item) { return Object.assign({}, item); });
  next.couriers.forEach(function (courier) {
    if (!courier || typeof courier !== "object") return;
    if (typeof courier.province !== "string") courier.province = "";
    if (!courier.province && (courier.id === "k-ayse" || courier.id === "k-mehmet")) courier.province = "Kırklareli";
    if (typeof courier.approved !== "boolean") courier.approved = true;
    if (typeof courier.email !== "string") courier.email = "";
    if (typeof courier.password !== "string") courier.password = "";
    if (typeof courier.phone !== "string") courier.phone = "";
    if (typeof courier.name !== "string") courier.name = "";
    if (typeof courier.firstName !== "string") courier.firstName = "";
    if (typeof courier.lastName !== "string") courier.lastName = "";
    if (typeof courier.address !== "string") courier.address = "";
    if (typeof courier.photo !== "string") courier.photo = "";
    if (typeof courier.tc !== "string") courier.tc = "";
    if (typeof courier.residence !== "string") courier.residence = "";
    if (typeof courier.criminalRecord !== "string") courier.criminalRecord = "";
    if (typeof courier.district !== "string") courier.district = "";
    if (typeof courier.iban !== "string") courier.iban = "";
    if (typeof courier.skipUntil !== "number" || !isFinite(courier.skipUntil)) courier.skipUntil = 0;
    if (courier.skipReason !== "Hastayım" && courier.skipReason !== "Kaza yaptım") courier.skipReason = "";
  });
  ensureDemoLuleburgazCourier(next.couriers);
  if (!Array.isArray(next.restaurantApplications)) next.restaurantApplications = [];
  next.restaurantApplications = next.restaurantApplications.filter(function (item) {
    return item && typeof item.name === "string" && typeof item.email === "string";
  });
  next.restaurantApplications.forEach(function (item) {
    if (typeof item.phone !== "string") item.phone = "";
    if (typeof item.address !== "string") item.address = "";
    if (typeof item.province !== "string") item.province = "";
    if (typeof item.district !== "string") item.district = "";
    if (item.kind !== "su" && item.kind !== "market" && item.kind !== "cicekci") item.kind = "restoran";
    if (typeof item.id !== "string" || !item.id) item.id = uid("rb");
    if (typeof item.password !== "string") item.password = "";
    if (typeof item.photo !== "string") item.photo = "";
    if (item.status !== "onayli") item.status = "bekliyor";
  });
  if (!Array.isArray(next.floristApplications)) next.floristApplications = [];
  next.floristApplications = next.floristApplications.filter(function (item) {
    return item && typeof item.name === "string" && typeof item.email === "string";
  });
  next.floristApplications.forEach(function (item) {
    if (typeof item.phone !== "string") item.phone = "";
    if (typeof item.address !== "string") item.address = "";
    if (typeof item.province !== "string") item.province = "";
    if (typeof item.district !== "string") item.district = "";
    if (typeof item.id !== "string" || !item.id) item.id = uid("fb");
    if (typeof item.password !== "string") item.password = "";
    if (typeof item.photo !== "string") item.photo = "";
    if (item.status !== "onayli") item.status = "bekliyor";
  });
  if (!Array.isArray(next.courierApplications)) next.courierApplications = [];
  next.courierApplications = next.courierApplications.filter(function (item) { return item && typeof item.email === "string" && typeof item.name === "string"; });
  next.courierApplications.forEach(function (item) {
    if (item.status !== "onayli") item.status = "bekliyor";
    if (typeof item.province !== "string") item.province = "";
    if (typeof item.district !== "string") item.district = "";
    if (typeof item.phone !== "string") item.phone = "";
    if (typeof item.password !== "string") item.password = "";
    if (typeof item.photo !== "string") item.photo = "";
  });
  if (!next.courierAssign || typeof next.courierAssign !== "object") next.courierAssign = {};
  if (next.courierAssign.luleburgaz !== "manuel" && next.courierAssign.luleburgaz !== "otomatik") {
    next.courierAssign.luleburgaz = next.courierAssign.auto === false ? "manuel" : "otomatik";
  }
  if (typeof next.courierTurn !== "number") next.courierTurn = 0;
  if (!next.delivery || typeof next.delivery !== "object") next.delivery = { address: "", floor: "", apartment: "" };
  if (typeof next.delivery.address !== "string") next.delivery.address = "";
  if (typeof next.delivery.floor !== "string") next.delivery.floor = "";
  if (typeof next.delivery.apartment !== "string") next.delivery.apartment = "";
  if (typeof next.rememberEmail !== "string") next.rememberEmail = "";
  if (typeof next.commissionIban !== "string") next.commissionIban = "";
  if (!Array.isArray(next.cart)) next.cart = [];
  next.cart = next.cart.filter(function (line) {
    return line && typeof line.restaurantId === "string" && typeof line.itemId === "string" && Number(line.qty) > 0;
  });
  next.cart.forEach(function (line) {
    line.qty = Number(line.qty) || 0;
    line.price = Number(line.price) || 0;
    if (typeof line.name !== "string") line.name = "";
    if (typeof line.photo !== "string") line.photo = "";
  });
  if (!next.districts || typeof next.districts !== "object") next.districts = {};
  PROVINCES.forEach(function (province) {
    if (!next.districts[province] || typeof next.districts[province] !== "object") next.districts[province] = {};
  });
  next.users.forEach(function (user) {
    if (!user || typeof user !== "object") return;
    if (typeof user.province !== "string") user.province = "";
    if (typeof user.district !== "string") user.district = "";
    if (typeof user.address !== "string") user.address = "";
    if (typeof user.floor !== "string") user.floor = "";
    if (typeof user.apartment !== "string") user.apartment = "";
  });
  next.restaurants.forEach(function (restaurant) {
    if (!Array.isArray(restaurant.extras)) restaurant.extras = [];
    if (!Array.isArray(restaurant.menu)) restaurant.menu = [];
    if (typeof restaurant.payoutIban !== "string") restaurant.payoutIban = "";
    if (typeof restaurant.payoutAddress !== "string") restaurant.payoutAddress = "";
    if (typeof restaurant.payoutSaved !== "boolean") restaurant.payoutSaved = false;
    if (typeof restaurant.district !== "string") restaurant.district = "";
    if (restaurant.deliveryMode !== "kendi" && restaurant.deliveryMode !== "harbi") restaurant.deliveryMode = "harbi";
    if (typeof restaurant.photo !== "string" || !restaurant.photo) restaurant.photo = photoFor(restaurant);
    restaurant.menu.forEach(function (item) {
      if (!item || typeof item !== "object") return;
      if (typeof item.photo !== "string") item.photo = "";
      if (typeof item.name !== "string") item.name = "";
      if (typeof item.description !== "string") item.description = "";
      if (typeof item.categoryId !== "string") item.categoryId = "";
      if (typeof item.category !== "string") item.category = "";
      item.price = Number(item.price) || 0;
    });
  });
  next.waterBusinesses = normalizeShopList(next.waterBusinesses);
  next.markets = normalizeShopList(next.markets);
  next.florists = normalizeShopList(next.florists);
  next.catalogCategories = normalizeCatalogCategories(next.catalogCategories);
  return next;
}

function normalizeCatalogCategories(bag) {
  const source = bag && typeof bag === "object" ? bag : {};
  return {
    restoran: normalizeCategoryList(source.restoran),
    su: normalizeCategoryList(source.su),
    market: normalizeCategoryList(source.market),
    cicekci: normalizeCategoryList(source.cicekci)
  };
}

function normalizeCategoryList(list) {
  if (!Array.isArray(list)) return [];
  const seen = {};
  return list.filter(function (item) {
    if (!item || typeof item !== "object") return false;
    const name = String(item.name || "").trim();
    if (!name) return false;
    const key = name.toLocaleLowerCase("tr");
    if (seen[key]) return false;
    seen[key] = true;
    item.name = name;
    if (typeof item.id !== "string" || !item.id) item.id = uid("cat");
    return true;
  });
}

function normalizeShopList(list) {
  if (!Array.isArray(list)) return [];
  list.forEach(function (shop) {
    if (!shop || typeof shop !== "object") return;
    if (typeof shop.name !== "string") shop.name = "";
    if (typeof shop.province !== "string") shop.province = "";
    if (typeof shop.district !== "string") shop.district = "";
    if (typeof shop.address !== "string") shop.address = "";
    if (typeof shop.iban !== "string") shop.iban = "";
    if (typeof shop.email !== "string") shop.email = "";
    if (typeof shop.password !== "string") shop.password = "";
    if (typeof shop.phone !== "string") shop.phone = "";
    if (typeof shop.photo !== "string") shop.photo = "";
    if (typeof shop.approved !== "boolean") shop.approved = true;
    if (typeof shop.id !== "string" || !shop.id) shop.id = uid("shop");
    if (!Array.isArray(shop.menu)) shop.menu = [];
    shop.menu.forEach(function (item) {
      if (!item || typeof item !== "object") return;
      if (typeof item.name !== "string") item.name = "";
      if (typeof item.description !== "string") item.description = "";
      if (typeof item.photo !== "string") item.photo = "";
      if (typeof item.categoryId !== "string") item.categoryId = "";
      if (typeof item.category !== "string") item.category = "";
      item.price = Number(item.price) || 0;
    });
  });
  return list.filter(function (shop) {
    return shop && typeof shop === "object" && String(shop.name || "").trim();
  });
}

function load() {
  try {
    const raw = storage().getItem(KEY);
    if (!raw) return normalize(blankState());
    return normalize(JSON.parse(raw));
  } catch (err) {
    return normalize(blankState());
  }
}

function save(state) {
  storage().setItem(KEY, JSON.stringify(state));
}

function openRestaurants(state, query) {
  const place = customerPlace(state);
  if (!place.province) return [];
  const q = (query || "").trim().toLocaleLowerCase("tr");
  return state.restaurants.filter(function (restaurant) {
    if (restaurant.province !== place.province) return false;
    if (restaurant.approved === false) return false;
    if (place.district && restaurantDistrictName(restaurant) !== place.district) return false;
    if (!restaurantAcceptsOrders(state, restaurant)) return false;
    if (!q) return true;
    const blob = [restaurant.name, restaurant.cuisine, restaurant.address, restaurant.province].join(" ").toLocaleLowerCase("tr");
    return blob.indexOf(q) !== -1;
  });
}

function findRestaurant(state, id) {
  return state.restaurants.filter(function (item) { return item.id === id; })[0] || null;
}

function findShop(id) {
  const lists = (state.waterBusinesses || []).concat(state.markets || []).concat(state.florists || []);
  return lists.filter(function (shop) { return shop && shop.id === id; })[0] || null;
}

function findCourier(state, id) {
  return state.couriers.filter(function (item) { return item.id === id; })[0] || null;
}

function findOrder(state, id) {
  return state.orders.filter(function (item) { return item.id === id; })[0] || null;
}

function gatewayLabel(id) {
  const match = GATEWAYS.filter(function (item) { return item.id === id; })[0];
  return match ? match.label : id;
}

function deliveryModeOf(restaurant) {
  return restaurant && restaurant.deliveryMode === "kendi" ? "kendi" : "harbi";
}

function deliveryLabel(mode) {
  return mode === "kendi" ? "Kendi Kuryemle" : "Harbi Kurye İle Teslimat";
}

function statusText(order) {
  if (order && (order.status === "yeni" || order.status === "onayli" || order.status === "iptal")) return STATUS_TEXT[order.status];
  if (order && order.deliveryMode === "kendi") {
    if (order.status === "kabul") return "Restoran hazırlıyor";
    if (order.status === "hazir") return "Kendi kurye ile yola çıkacak";
  }
  return STATUS_TEXT[order.status] || order.status;
}

function enabledGateways(state) {
  return GATEWAYS.filter(function (item) { return state.gateways[item.id]; });
}

function couriersInCity(state, province) {
  return state.couriers.filter(function (courier) {
    return courier && courier.approved !== false && courier.province === province;
  });
}

function luleburgazMode(state) {
  return state.courierAssign && state.courierAssign.luleburgaz === "manuel" ? "manuel" : "otomatik";
}

function orderPlace(state, order) {
  const restaurant = findRestaurant(state, order.restaurantId);
  const province = (restaurant && restaurant.province) || order.province || "";
  const district = (restaurant && restaurant.district) || matchDistrict(province, (restaurant && restaurant.address) || order.address || "");
  return { province: province, district: district };
}

function isLuleburgazPlace(place) {
  return place.province === "Kırklareli" && place.district === "Lüleburgaz";
}

function courierServesLuleburgaz(courier) {
  if (!courier || courier.approved === false) return false;
  const district = courier.district || matchDistrict(courier.province || "Kırklareli", courier.address || "");
  if (district) return courier.province !== "Kırklareli" ? false : district === "Lüleburgaz";
  return courier.province === "Kırklareli";
}

function courierIsPaused(courier, now) {
  return !!(courier && Number(courier.skipUntil) > (now || Date.now()));
}

function assignCourier(state, order) {
  const place = orderPlace(state, order);
  const luleburgaz = isLuleburgazPlace(place);
  if (luleburgaz && luleburgazMode(state) === "manuel") {
    order.courierId = null;
    order.status = "bekliyor";
    return null;
  }
  const pool = luleburgaz
    ? state.couriers.filter(courierServesLuleburgaz)
    : couriersInCity(state, place.province || order.province);
  const declined = {};
  (order.declinedBy || []).forEach(function (id) { declined[id] = true; });
  if (!pool.length) {
    order.courierId = null;
    order.status = "bekliyor";
    return null;
  }
  const start = ((state.courierTurn % pool.length) + pool.length) % pool.length;
  for (let step = 0; step < pool.length; step += 1) {
    const index = (start + step) % pool.length;
    const courier = pool[index];
    if (!declined[courier.id] && !courierIsPaused(courier)) {
      order.courierId = courier.id;
      order.status = "atandi";
      state.courierTurn = (index + 1) % pool.length;
      return courier;
    }
  }
  order.courierId = null;
  order.status = "bekliyor";
  return null;
}

function assignCourierManual(state, orderId, courierId) {
  if (luleburgazMode(state) !== "manuel") return null;
  const order = findOrder(state, orderId);
  const courier = findCourier(state, courierId);
  if (!order || !courier || order.deliveryMode === "kendi") return null;
  if (!isLuleburgazPlace(orderPlace(state, order))) return null;
  if (order.status !== "bekliyor" && order.status !== "atandi") return null;
  if (courierIsPaused(courier) || !courierServesLuleburgaz(courier)) return null;
  order.courierId = courier.id;
  order.status = "atandi";
  return courier;
}

function placeOrder(state, input) {
  const restaurant = findRestaurant(state, input.restaurantId);
  if (!restaurant) throw new Error("Restoran yok");
  if (!state.provinces[restaurant.province]) throw new Error("İl kapalı");
  if (!restaurantAcceptsOrders(state, restaurant)) throw new Error("İlçe kapalı");
  if (!state.gateways[input.gatewayId]) throw new Error("Ödeme kapalı");
  const lines = (input.lines || []).filter(function (line) { return line.qty > 0; });
  if (!lines.length) throw new Error("Ürün yok");
  let total = 0;
  const savedLines = lines.map(function (line) {
    const extras = line.extras || [];
    const extraSum = extras.reduce(function (sum, extra) { return sum + Number(extra.plus || 0); }, 0);
    const lineTotal = (Number(line.price) + extraSum) * Number(line.qty);
    total += lineTotal;
    return {
      name: line.name,
      qty: line.qty,
      price: line.price,
      extras: extras.map(function (extra) { return { name: extra.name, plus: Number(extra.plus) }; }),
      lineTotal: lineTotal
    };
  });
  const person = splitPersonName((state.session && state.session.name) || "");
  const order = {
    id: uid("s"),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    province: restaurant.province,
    address: restaurant.address,
    customerAddress: customerPlaceText(state),
    customerFirstName: person.firstName,
    customerLastName: person.lastName,
    lines: savedLines,
    total: total,
    commissionRate: COMMISSION,
    commission: Math.round(total * COMMISSION),
    gatewayId: input.gatewayId,
    gatewayLabel: gatewayLabel(input.gatewayId),
    courierId: null,
    status: "yeni",
    declinedBy: [],
    createdAt: new Date().toISOString(),
    customerName: (state.session && state.session.name) || "Misafir",
    deliveryMode: deliveryModeOf(restaurant),
    deliveryLabel: deliveryLabel(deliveryModeOf(restaurant))
  };
  state.orders.unshift(order);
  return order;
}

function approveRestaurantOrder(state, orderId, restaurantId) {
  const order = findOrder(state, orderId);
  if (!order || order.restaurantId !== restaurantId || order.status !== "yeni") return order;
  order.courierId = null;
  order.status = "onayli";
  return order;
}

function cancelRestaurantOrder(state, orderId, restaurantId) {
  const order = findOrder(state, orderId);
  if (!order || order.restaurantId !== restaurantId || order.status === "iptal") return order;
  order.courierId = null;
  order.status = "iptal";
  return order;
}

function acceptOrder(state, orderId, courierId) {
  const order = findOrder(state, orderId);
  const courier = findCourier(state, courierId);
  if (!order || !courier || order.status !== "atandi" || order.courierId !== courierId) return order;
  if (courier.approved === false || courier.province !== order.province) return order;
  order.status = "kabul";
  return order;
}

function declineOrder(state, orderId, courierId) {
  const order = findOrder(state, orderId);
  if (!order || order.status !== "atandi" || order.courierId !== courierId) return order;
  order.declinedBy = order.declinedBy || [];
  if (order.declinedBy.indexOf(courierId) === -1) order.declinedBy.push(courierId);
  assignCourier(state, order);
  return order;
}

function skipCourierOrder(state, orderId, courierId, reason) {
  const order = findOrder(state, orderId);
  const courier = findCourier(state, courierId);
  if (!order || !courier || order.courierId !== courierId) return order;
  if (order.status === "teslim" || order.status === "iptal") return order;
  if (reason !== "Hastayım" && reason !== "Kaza yaptım") return order;
  courier.skipUntil = Date.now() + 30 * 60 * 1000;
  courier.skipReason = reason;
  order.declinedBy = order.declinedBy || [];
  if (order.declinedBy.indexOf(courierId) === -1) order.declinedBy.push(courierId);
  order.courierId = null;
  assignCourier(state, order);
  return order;
}

function pickCourier(state, order) {
  const place = orderPlace(state, order);
  const pool = isLuleburgazPlace(place)
    ? state.couriers.filter(courierServesLuleburgaz)
    : couriersInCity(state, place.province || order.province);
  const declined = {};
  (order.declinedBy || []).forEach(function (id) { declined[id] = true; });
  const available = pool.filter(function (courier) { return !declined[courier.id] && !courierIsPaused(courier); });
  if (!available.length) return null;
  const start = ((state.courierTurn % available.length) + available.length) % available.length;
  const courier = available[start];
  state.courierTurn = (start + 1) % available.length;
  return courier;
}

function markReady(state, orderId, restaurantId) {
  const order = findOrder(state, orderId);
  if (!order || order.restaurantId !== restaurantId) return order;
  if (order.status === "iptal" || order.status === "teslim" || order.status === "yolda" || order.status === "teslim-alindi" || order.status === "hazir") return order;
  order.status = "hazir";
  if (order.deliveryMode !== "kendi") {
    const courier = pickCourier(state, order);
    order.courierId = courier ? courier.id : null;
  }
  return order;
}

function deliverOwnOrder(state, orderId, restaurantId) {
  const order = findOrder(state, orderId);
  if (!order || order.restaurantId !== restaurantId || order.deliveryMode !== "kendi" || order.status !== "hazir") return order;
  order.status = "teslim";
  return order;
}

function courierStep(state, orderId, courierId, step) {
  const order = findOrder(state, orderId);
  if (!order || order.courierId !== courierId) return order;
  const allowed = (step === "teslim-alindi" && order.status === "hazir")
    || (step === "yolda" && order.status === "teslim-alindi")
    || (step === "teslim" && order.status === "yolda");
  if (allowed) {
    order.status = step;
    if (step === "teslim" && !order.deliveredAt) order.deliveredAt = new Date().toISOString();
  }
  return order;
}

function courierPublic(state, order) {
  if (!order || !COURIER_VISIBLE[order.status]) return null;
  return findCourier(state, order.courierId);
}

function addRestaurant(state, input) {
  const restaurant = {
    id: uid("r"),
    province: input.province,
    name: input.name.trim(),
    cuisine: input.cuisine.trim(),
    address: input.address.trim(),
    iban: input.iban.trim(),
    payoutIban: "",
    payoutAddress: "",
    payoutSaved: false,
    deliveryMode: "harbi",
    color: ["#b4532a", "#c4923a", "#3f6b4e", "#a33b32"][state.restaurants.length % 4],
    eta: "25–45 dk",
    min: 0,
    extras: [],
    menu: []
  };
  state.restaurants.push(restaurant);
  return restaurant;
}

function commissionText() {
  return "Komisyon %5";
}

function orderMoney(order) {
  const total = Number(order && order.total) || 0;
  const commission = order && typeof order.commission === "number" ? order.commission : Math.round(total * COMMISSION);
  return { total: total, commission: commission, net: total - commission };
}

function periodStart(kind, now) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (kind === "week") {
    const day = start.getDay();
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  }
  if (kind === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return start;
}

function earningTotals(restaurant, kind) {
  const start = periodStart(kind, new Date());
  let gross = 0;
  let commission = 0;
  state.orders.forEach(function (order) {
    if (!order || order.restaurantId !== restaurant.id || order.status === "iptal" || order.status === "yeni") return;
    const when = new Date(order.createdAt);
    if (isNaN(when.getTime()) || when < start) return;
    const money = orderMoney(order);
    gross += money.total;
    commission += money.commission;
  });
  return { gross: gross, commission: commission, net: gross - commission };
}

function courierDeliveryWhen(order) {
  const when = new Date(order && (order.deliveredAt || order.createdAt));
  return isNaN(when.getTime()) ? null : when;
}

function courierEarningAmount(orders, kind) {
  const start = periodStart(kind, new Date());
  let count = 0;
  (orders || []).forEach(function (order) {
    if (!order || order.status !== "teslim") return;
    const when = courierDeliveryWhen(order);
    if (!when || when < start) return;
    count += 1;
  });
  return count * 99;
}

function courierEarningRow(period, title, amount) {
  const open = !!(courierEarningOpen && courierEarningOpen[period]);
  return '<h2><button class="section-toggle" type="button" data-action="toggle-earning" data-period="' + period + '" aria-expanded="' + (open ? "true" : "false") + '">' + esc(title) + "</button></h2>"
    + '<p id="courier-earning-' + period + '" class="price courier-earning"' + (open ? "" : " hidden") + ">" + lira(amount) + "</p>";
}

function earningCard(title, totals) {
  return '<article class="earning"><h3>' + esc(title) + "</h3>"
    + '<p class="price">' + lira(totals.net) + "</p>"
    + '<p class="meta">Ciro ' + lira(totals.gross) + " · Komisyon " + lira(totals.commission) + "</p></article>";
}

function paintEarnings(restaurant) {
  const root = document.querySelector("#restaurant-earnings");
  if (!root) return;
  root.innerHTML = '<h2>Kazanç</h2>'
    + '<p class="section-note">Her siparişten %5 komisyon otomatik düşülür. Kazanç, cirodan komisyon çıktıktan sonraki tutardır. İptal ve onay bekleyen siparişler dahil değildir.</p>'
    + '<div class="earnings-grid">'
    + earningCard("Günlük Kazanç", earningTotals(restaurant, "day"))
    + earningCard("Haftalık Kazanç", earningTotals(restaurant, "week"))
    + earningCard("Aylık Kazanç", earningTotals(restaurant, "month"))
    + "</div>";
}

const Harbi = {
  PROVINCES: PROVINCES,
  GATEWAYS: GATEWAYS,
  COMMISSION: COMMISSION,
  load: load,
  save: save,
  blankState: blankState,
  openRestaurants: openRestaurants,
  placeOrder: placeOrder,
  acceptOrder: acceptOrder,
  declineOrder: declineOrder,
  markReady: markReady,
  courierStep: courierStep,
  assignCourier: assignCourier,
  courierPublic: courierPublic
};

function qs(name) {
  return new URLSearchParams(location.search).get(name) || "";
}

function pageRoot() {
  return document.body.dataset.page || "";
}

let state = null;

function persist() {
  save(state);
}

function cartQty(restaurantId, itemId) {
  const line = (state.cart || []).filter(function (entry) {
    return entry.restaurantId === restaurantId && entry.itemId === itemId;
  })[0];
  return line ? Number(line.qty) || 0 : 0;
}

function changeCart(restaurant, item, dir) {
  if (!state.cart) state.cart = [];
  let line = state.cart.filter(function (entry) {
    return entry.restaurantId === restaurant.id && entry.itemId === item.id;
  })[0];
  if (dir > 0) {
    if (line) line.qty += 1;
    else state.cart.push({
      restaurantId: restaurant.id,
      itemId: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      qty: 1,
      photo: item.photo || ""
    });
  } else if (line) {
    line.qty -= 1;
    if (line.qty < 1) state.cart = state.cart.filter(function (entry) { return entry !== line; });
  }
  persist();
  paintCartCount();
}

function sessionRole() {
  return state && state.session && state.session.role ? state.session.role : "";
}

function accountHome() {
  const role = sessionRole();
  if (role === "yonetim") return "admin.html";
  if (role === "kurye-yonetim" || role === "kurye") return role === "kurye" ? "kurye.html" : "kurye-yonetim.html";
  if (role === "restoran" || role === "su" || role === "market" || role === "cicekci") return "restoran.html";
  if (role === "musteri") return "siparisler.html";
  return "index.html";
}

function paintAccount() {
  const nav = document.querySelector("nav.account");
  if (!nav) return;
  const loggedIn = !!sessionRole();
  nav.querySelectorAll('a[href="uye-ol.html"], a[href="giris.html"], .slash').forEach(function (node) {
    node.hidden = loggedIn;
  });
  let profile = nav.querySelector("[data-account]");
  let logoutButton = nav.querySelector("[data-action='logout']");
  const cart = nav.querySelector("a.cart");
  if (!profile) {
    profile = document.createElement("a");
    profile.dataset.account = "home";
    profile.textContent = "Hesabım";
    nav.insertBefore(profile, cart);
  }
  if (!logoutButton) {
    logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "account-logout";
    logoutButton.dataset.action = "logout";
    logoutButton.textContent = "Çıkış yap";
    nav.insertBefore(logoutButton, cart);
  }
  profile.href = accountHome();
  profile.hidden = !loggedIn;
  logoutButton.hidden = !loggedIn;
}

function logout() {
  state.session = null;
  persist();
  const page = pageRoot();
  const guarded = page === "admin" || page === "city" || page === "district" || page === "courier-admin" || page === "restaurant" || page === "courier";
  if (guarded) {
    location.href = "index.html";
    return;
  }
  render();
}

function paintCartCount() {
  if (!state) return;
  const count = (state.cart || []).reduce(function (sum, line) { return sum + (Number(line.qty) || 0); }, 0);
  document.querySelectorAll("a.cart").forEach(function (link) {
    let badge = link.querySelector(".cart-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count";
      link.appendChild(badge);
    }
    badge.hidden = !count;
    badge.textContent = count ? String(count) : "";
  });
}

function render() {
  const page = pageRoot();
  if (page === "home") renderHome();
  else if (page === "restaurants") renderRestaurantList();
  else if (page === "water") renderShopStandalone(state.waterBusinesses, "Şehrindeki Su Dağıtım İşletmeleri");
  else if (page === "market") renderShopStandalone(state.markets, "Şehrindeki market İşletmeleri");
  else if (page === "florist") renderShopStandalone(visibleFlorists(), "Şehrindeki Çiçekçiler");
  else if (page === "admin") renderAdmin();
  else if (page === "city") renderCity();
  else if (page === "district") renderDistrictPage();
  else if (page === "signup") renderSignup();
  else if (page === "menu") renderMenu();
  else if (page === "order") renderOrder();
  else if (page === "orders") {
    renderCart();
    renderOrders();
  }
  else if (page === "restaurant") renderRestaurant();
  else if (page === "courier") renderCourier();
  else if (page === "courier-admin") renderCourierAdmin();
  else if (page === "login") renderLogin();
  else if (page === "partner") renderPartnerPage();
  paintCartCount();
  paintAccount();
}

const LOCAL_ADDRESSES = [
  "Kurtuluş Mah. İstanbul Cad. No:12, Lüleburgaz",
  "Kurtuluş Mah. Atatürk Cad. No:28, Lüleburgaz",
  "Yıldız Mah. İstasyon Cad. No:5, Lüleburgaz",
  "Yıldız Mah. Sevgi Sok. No:14, Lüleburgaz",
  "Barış Mah. Cumhuriyet Cad. No:9, Lüleburgaz",
  "Barış Mah. Lale Sok. No:3, Lüleburgaz",
  "İstasyon Mah. Gar Cad. No:1, Lüleburgaz",
  "İstasyon Mah. Yeni Sok. No:18, Lüleburgaz",
  "8 Kasım Mah. Fatih Cad. No:21, Lüleburgaz",
  "Dere Mah. Kenar Sok. No:7, Lüleburgaz",
  "Gündoğu Mah. Okul Cad. No:4, Lüleburgaz",
  "Kocasinan Mah. Pazar Cad. No:16, Lüleburgaz",
  "Sevgi Mah. Gül Sok. No:11, Lüleburgaz",
  "Yıldırım Mah. Çınar Cad. No:6, Lüleburgaz",
  "Zafer Mah. Millet Cad. No:33, Lüleburgaz",
  "Gençlik Mah. Spor Cad. No:2, Lüleburgaz",
  "Siteler Mah. Sanayi Cad. No:45, Lüleburgaz",
  "Hürriyet Mah. İnönü Cad. No:19, Lüleburgaz"
];

let addressTimer = 0;
let addressRequest = 0;
let googlePlacesPromise = null;
let googlePlacesOk = false;

function rememberMapsKeyFromUrl() {
  const key = qs("mapsKey") || qs("mapskey") || "";
  if (!key) return;
  try { storage().setItem("harbiMapsKey", key); } catch (err) {}
}

function googleMapsKey() {
  rememberMapsKeyFromUrl();
  if (GOOGLE_MAPS_KEY && String(GOOGLE_MAPS_KEY).trim()) return String(GOOGLE_MAPS_KEY).trim();
  try {
    const saved = storage().getItem("harbiMapsKey");
    if (saved && String(saved).trim()) return String(saved).trim();
  } catch (err) {}
  return "";
}

function ensureGooglePlaces() {
  if (googlePlacesOk && window.google && google.maps && google.maps.places) {
    return Promise.resolve(true);
  }
  if (googlePlacesPromise) return googlePlacesPromise;
  const key = googleMapsKey();
  if (!key) {
    googlePlacesPromise = Promise.resolve(false);
    return googlePlacesPromise;
  }
  googlePlacesPromise = new Promise(function (resolve) {
    const done = function (ok) {
      googlePlacesOk = !!ok;
      resolve(!!ok);
    };
    window.gm_authFailure = function () { done(false); };
    if (window.google && google.maps && google.maps.places) {
      done(true);
      return;
    }
    const existing = document.querySelector("script[data-harbi-maps]");
    if (existing) {
      existing.addEventListener("load", function () { done(!!(window.google && google.maps && google.maps.places)); });
      existing.addEventListener("error", function () { done(false); });
      return;
    }
    const callbackName = "__harbiGoogleMapsReady";
    window[callbackName] = function () { done(!!(window.google && google.maps && google.maps.places)); };
    const script = document.createElement("script");
    script.async = true;
    script.dataset.harbiMaps = "1";
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key)
      + "&libraries=places&language=tr&region=TR&loading=async&callback=" + callbackName;
    script.onerror = function () { done(false); };
    document.head.appendChild(script);
  });
  return googlePlacesPromise;
}

function localAddressMatches(query) {
  const q = query.toLocaleLowerCase("tr");
  return LOCAL_ADDRESSES.filter(function (line) {
    return line.toLocaleLowerCase("tr").indexOf(q) !== -1;
  }).slice(0, 6);
}

function formatPhoton(feature) {
  const props = feature && feature.properties ? feature.properties : {};
  if (props.countrycode && props.countrycode !== "TR") return "";
  const street = [props.street, props.housenumber].filter(Boolean).join(" ");
  const place = props.name && props.name !== street ? props.name : "";
  const city = props.city || props.town || props.county || "";
  const district = props.district || props.locality || "";
  const parts = [];
  if (street) parts.push(street);
  else if (place) parts.push(place);
  if (district && parts.indexOf(district) === -1) parts.push(district);
  if (city && parts.indexOf(city) === -1) parts.push(city);
  if (props.state && parts.indexOf(props.state) === -1) parts.push(props.state);
  return parts.join(", ");
}

function formatGooglePrediction(item) {
  if (!item) return "";
  return String(item.description || "").trim();
}

function mergeAddressLines() {
  const seen = {};
  const merged = [];
  Array.prototype.forEach.call(arguments, function (list) {
    (list || []).forEach(function (line) {
      const text = String(line || "").trim();
      if (!text) return;
      const key = text.toLocaleLowerCase("tr");
      if (seen[key]) return;
      seen[key] = true;
      merged.push(text);
    });
  });
  return merged;
}

function fetchGoogleMapsSuggest(query) {
  const url = "/api/google-address?q=" + encodeURIComponent(query);
  return fetch(url).then(function (res) { return res.json(); }).then(function (data) {
    if (!data || !data.ok) return [];
    return (data.suggestions || []).map(function (line) { return String(line || "").trim(); }).filter(Boolean);
  }).catch(function () { return []; });
}

function fetchGooglePlacesSdkSuggestions(query) {
  return ensureGooglePlaces().then(function (ok) {
    if (!ok || !window.google || !google.maps || !google.maps.places) return [];
    return new Promise(function (resolve) {
      try {
        const svc = new google.maps.places.AutocompleteService();
        svc.getPlacePredictions({
          input: query,
          componentRestrictions: { country: "tr" },
          language: "tr",
          types: ["geocode"]
        }, function (predictions, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            resolve([]);
            return;
          }
          resolve(predictions.map(formatGooglePrediction).filter(Boolean).slice(0, 6));
        });
      } catch (err) {
        resolve([]);
      }
    });
  });
}

function fetchGoogleAddressSuggestions(query) {
  return fetchGoogleMapsSuggest(query).then(function (lines) {
    if (lines && lines.length) return lines;
    return fetchGooglePlacesSdkSuggestions(query);
  });
}

function formatNominatim(item) {
  if (!item) return "";
  const display = String(item.display_name || "").trim();
  if (!display) return "";
  const addr = item.address || {};
  if (addr.country_code && String(addr.country_code).toLowerCase() !== "tr") return "";
  return display
    .replace(/, Marmara Bölgesi/gi, "")
    .replace(/, İç Anadolu Bölgesi/gi, "")
    .replace(/, Ege Bölgesi/gi, "")
    .replace(/, Akdeniz Bölgesi/gi, "")
    .replace(/, Karadeniz Bölgesi/gi, "")
    .replace(/, Doğu Anadolu Bölgesi/gi, "")
    .replace(/, Güneydoğu Anadolu Bölgesi/gi, "");
}

function fetchNominatimAddressSuggestions(query) {
  const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6"
    + "&countrycodes=tr&accept-language=tr&q=" + encodeURIComponent(query);
  return fetch(url, { headers: { Accept: "application/json" } })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      return (Array.isArray(data) ? data : []).map(formatNominatim).filter(Boolean);
    })
    .catch(function () { return []; });
}

function fetchPhotonAddressSuggestions(query) {
  const url = "https://photon.komoot.io/api/?q=" + encodeURIComponent(query)
    + "&limit=6&lang=en";
  return fetch(url).then(function (res) { return res.json(); }).then(function (data) {
    return (data.features || []).map(formatPhoton).filter(Boolean);
  }).catch(function () { return []; });
}

function fetchFallbackAddressSuggestions(query) {
  return fetchNominatimAddressSuggestions(query).then(function (lines) {
    if (lines && lines.length) return lines;
    return fetchPhotonAddressSuggestions(query);
  });
}

function cancelAddressLookup() {
  window.clearTimeout(addressTimer);
  addressRequest += 1;
}

function showSuggestions(items) {
  const box = document.querySelector("#address-suggest");
  const extra = document.querySelector("#address-extra");
  if (!box) return;
  if (extra && !extra.hidden) return;
  if (!items.length) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  box.hidden = false;
  box.innerHTML = items.map(function (line) {
    return '<button type="button" role="option" data-action="pick-address" data-address="' + esc(line) + '">' + esc(line) + "</button>";
  }).join("");
}

function showAddressExtra(address) {
  const extra = document.querySelector("#address-extra");
  const input = document.querySelector("#q");
  if (!extra || !address) return;
  cancelAddressLookup();
  if (input) input.value = address;
  const suggest = document.querySelector("#address-suggest");
  if (suggest) {
    suggest.hidden = true;
    suggest.innerHTML = "";
  }
  const floor = document.querySelector("#addr-kat");
  const apartment = document.querySelector("#addr-daire");
  const same = extra.dataset.picked === address;
  extra.dataset.picked = address;
  extra.hidden = false;
  if (!state.delivery || state.delivery.address !== address) {
    state.delivery = { address: address, floor: "", apartment: "" };
    persist();
    if (pageRoot() === "home" || pageRoot() === "restaurants") render();
  }
  if (!same) {
    const saved = state.delivery && state.delivery.address === address ? state.delivery : null;
    if (floor) floor.value = saved ? saved.floor : "";
    if (apartment) apartment.value = saved ? saved.apartment : "";
  }
  const status = document.querySelector("#address-status");
  if (status) status.textContent = "";
  const active = document.activeElement;
  if (floor && active !== floor && active !== apartment) floor.focus();
}

function saveDeliveryAddress() {
  const input = document.querySelector("#q");
  const floor = document.querySelector("#addr-kat");
  const apartment = document.querySelector("#addr-daire");
  const status = document.querySelector("#address-status");
  const address = input ? input.value.trim() : "";
  const floorValue = floor ? floor.value.trim() : "";
  const apartmentValue = apartment ? apartment.value.trim() : "";
  if (!address || !floorValue || !apartmentValue) {
    if (status) status.textContent = "Kat ve daire gerekli.";
    return;
  }
  state.delivery = { address: address, floor: floorValue, apartment: apartmentValue };
  persist();
  if (status) status.textContent = "Adres kaydedildi.";
  if (pageRoot() === "home" || pageRoot() === "restaurants") render();
}

function onAddressInput() {
  const input = document.querySelector("#q");
  if (!input) return;
  const query = input.value.trim();
  const extra = document.querySelector("#address-extra");
  if (extra) {
    extra.hidden = true;
    extra.dataset.picked = "";
  }
  window.clearTimeout(addressTimer);
  if (query.length < 2) {
    showSuggestions([]);
    return;
  }
  const local = localAddressMatches(query);
  showSuggestions(local);
  const token = ++addressRequest;
  addressTimer = window.setTimeout(function () {
    fetchGoogleAddressSuggestions(query).then(function (googleLines) {
      if (token !== addressRequest) return null;
      if (googleLines && googleLines.length) {
        showSuggestions(mergeAddressLines(local, googleLines).slice(0, 6));
        return null;
      }
      return fetchFallbackAddressSuggestions(query);
    }).then(function (fallbackLines) {
      if (fallbackLines == null || token !== addressRequest) return;
      showSuggestions(mergeAddressLines(local, fallbackLines).slice(0, 6));
    }).catch(function () {
      if (token !== addressRequest) return;
      showSuggestions(local);
    });
  }, 280);
}

function bindAddressSearch() {
  const form = document.querySelector("form.search");
  const input = document.querySelector("#q");
  if (!form || !input || form.dataset.addressBound) return;
  form.dataset.addressBound = "1";
  if (!document.querySelector("#address-suggest")) {
    form.insertAdjacentHTML("beforeend",
      '<div id="address-suggest" class="suggest" role="listbox" hidden></div>'
      + '<div id="address-extra" class="address-extra" hidden>'
      + '<label>Kat <input id="addr-kat" type="text" autocomplete="off"></label>'
      + '<label>Daire <input id="addr-daire" type="text" autocomplete="off"></label>'
      + '<button class="btn" type="button" data-action="save-address">Kaydet</button>'
      + '<p id="address-status"></p></div>');
  }
  const extra = document.querySelector("#address-extra");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (extra && document.activeElement && extra.contains(document.activeElement)) return;
    const suggest = document.querySelector("#address-suggest");
    const first = suggest && !suggest.hidden ? suggest.querySelector("button") : null;
    if (first) {
      showAddressExtra(first.dataset.address || "");
      return;
    }
    showAddressExtra(input.value.trim());
  });
  if (extra) {
    extra.addEventListener("keydown", function (event) {
      if (event.key === "Enter") event.preventDefault();
    });
    extra.addEventListener("mousedown", function (event) {
      event.stopPropagation();
    });
  }
  input.addEventListener("input", onAddressInput);
  document.addEventListener("click", function (event) {
    if (form.contains(event.target)) return;
    const suggest = document.querySelector("#address-suggest");
    if (suggest) suggest.hidden = true;
  });
  if (!qs("q") && state.delivery && state.delivery.address) input.value = state.delivery.address;
}

function boot() {
  state = load();
  hasAdminSession();
  save(state);
  rememberMapsKeyFromUrl();
  ensureGooglePlaces();
  const query = qs("q");
  const search = document.querySelector("#q");
  if (search && query) search.value = query;
  render();
  bindAddressSearch();
  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", onInput);
  document.addEventListener("change", onChange);
  window.addEventListener("storage", function (event) {
    if (event.key !== KEY) return;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT")) return;
    state = load();
    render();
  });
}

function onClick(event) {
  if (event.target && event.target.id === "earnings-dialog") {
    event.target.close();
    return;
  }
  if (event.target && event.target.classList && event.target.classList.contains("apply-dialog")) {
    event.target.close();
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "toggle-district") {
    const province = button.dataset.province;
    const district = button.dataset.district;
    if (!state.districts[province]) state.districts[province] = {};
    state.districts[province][district] = !districtIsOpen(state, province, district);
    persist();
    renderDistricts(province);
    return;
  }
  if (action === "toggle-province") {
    const name = button.dataset.province;
    state.provinces[name] = !state.provinces[name];
    persist();
    button.setAttribute("aria-checked", state.provinces[name] ? "true" : "false");
    button.setAttribute("aria-label", name + (state.provinces[name] ? " açık" : " kapalı"));
    renderAdminRestaurants();
    return;
  }
  if (action === "toggle-gateway") {
    const id = button.dataset.gateway;
    state.gateways[id] = !state.gateways[id];
    persist();
    button.setAttribute("aria-checked", state.gateways[id] ? "true" : "false");
    button.setAttribute("aria-label", gatewayLabel(id) + (state.gateways[id] ? " açık" : " kapalı"));
    return;
  }
  if (action === "toggle-luleburgaz-assign") {
    if (!state.courierAssign) state.courierAssign = {};
    state.courierAssign.luleburgaz = luleburgazMode(state) === "otomatik" ? "manuel" : "otomatik";
    if (state.courierAssign.luleburgaz === "otomatik") {
      state.orders.forEach(function (order) {
        if (!order || order.deliveryMode === "kendi" || order.status !== "bekliyor") return;
        if (!isLuleburgazPlace(orderPlace(state, order))) return;
        assignCourier(state, order);
      });
    }
    persist();
    renderCourierAdmin();
    return;
  }
  if (action === "delete-courier") {
    const id = button.dataset.id;
    if (courierEditId === id) courierEditId = "";
    state.couriers = (state.couriers || []).filter(function (courier) { return courier && courier.id !== id; });
    persist();
    renderCourierAdmin();
    return;
  }
  if (action === "edit-courier") {
    const id = button.dataset.id;
    courierEditId = courierEditId === id ? "" : id;
    renderCourierAdmin();
    return;
  }
  if (action === "approve-application") {
    approveCourierApplication(button.dataset.id);
    persist();
    if (pageRoot() === "admin") renderAdmin();
    else renderCourierAdmin();
    return;
  }
  if (action === "approve-restaurant-application") {
    approveRestaurantApplication(button.dataset.id);
    persist();
    renderAdmin();
    return;
  }
  if (action === "approve-florist-application") {
    approveFloristApplication(button.dataset.id);
    persist();
    renderAdmin();
    return;
  }
  if (action === "toggle-florist") {
    const florist = (state.florists || []).filter(function (item) { return item && item.id === button.dataset.id; })[0];
    if (!florist) return;
    florist.approved = florist.approved === false;
    persist();
    renderAdminFlorists();
    return;
  }
  if (action === "manual-assign") {
    const card = button.closest("[data-order]");
    const select = card ? card.querySelector("select") : null;
    assignCourierManual(state, button.dataset.id, select ? select.value : "");
    persist();
    renderCourierAdmin();
    return;
  }
  if (action === "toggle-restaurant-form") {
    const form = document.querySelector("#district-restaurant-form");
    if (!form) return;
    const open = form.hidden;
    form.hidden = !open;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    return;
  }
  if (action === "toggle-partner-panel") {
    const panel = document.getElementById(button.getAttribute("aria-controls") || "");
    if (!panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    return;
  }
  if (action === "delete-restaurant") {
    const id = button.dataset.id;
    state.restaurants = state.restaurants.filter(function (restaurant) { return restaurant.id !== id; });
    state.cart = (state.cart || []).filter(function (line) { return line.restaurantId !== id; });
    persist();
    paintCartCount();
    renderDistrictRestaurants(qs("il"), qs("ilce"));
    return;
  }
  if (action === "qty") {
    const line = button.closest("[data-line]");
    const node = line.querySelector("[data-qty]");
    if (line.dataset.item) {
      const restaurant = line.dataset.restaurant ? findRestaurant(state, line.dataset.restaurant) : null;
      const shop = restaurant ? null : findShop(line.dataset.shop);
      const owner = restaurant || shop;
      const item = owner && (owner.menu || []).filter(function (entry) { return entry.id === line.dataset.item; })[0];
      if (!owner || !item) return;
      changeCart(owner, item, Number(button.dataset.dir));
      node.textContent = String(cartQty(owner.id, item.id));
      updateMenuTotal();
      if (Number(button.dataset.dir) > 0) note("#cart-status", item.name + " sepete eklendi.", true);
      return;
    }
    const next = Math.max(0, Number(node.textContent) + Number(button.dataset.dir));
    node.textContent = String(next);
    updateMenuTotal();
    return;
  }
  if (action === "remove-extra") {
    const restaurant = currentRestaurant();
    if (!restaurant) return;
    restaurant.extras = restaurant.extras.filter(function (extra) { return extra.id !== button.dataset.id; });
    persist();
    renderRestaurant();
    return;
  }
  if (action === "remove-category") {
    const kind = button.dataset.kind;
    const list = categoriesOf(kind);
    if (!list) return;
    state.catalogCategories[kind] = list.filter(function (item) { return item.id !== button.dataset.id; });
    persist();
    renderCategoryLists();
    return;
  }
  if (action === "remove-menu-item") {
    const seller = currentSeller();
    if (!seller) return;
    seller.menu = seller.menu.filter(function (item) { return item.id !== button.dataset.id; });
    persist();
    renderRestaurant();
    return;
  }
  if (action === "accept") return mutateCourier(button.dataset.id, "accept");
  if (action === "decline") return mutateCourier(button.dataset.id, "decline");
  if (action === "show-category") {
    const next = button.dataset.category;
    if (next === "su" || next === "market" || next === "restoran" || next === "cicekci") homeCategory = next;
    renderHome();
    return;
  }
  if (action === "open-apply") {
    const dialog = document.getElementById(button.dataset.dialog || "");
    if (dialog && dialog.showModal) dialog.showModal();
    return;
  }
  if (action === "close-apply") {
    const dialog = button.closest("dialog");
    if (dialog) dialog.close();
    return;
  }
  if (action === "open-earnings") {
    const dialog = document.querySelector("#earnings-dialog");
    if (dialog && dialog.showModal) dialog.showModal();
    return;
  }
  if (action === "close-earnings") {
    const dialog = document.querySelector("#earnings-dialog");
    if (dialog) dialog.close();
    return;
  }
  if (action === "approve-order") return approveRestaurant(button.dataset.id);
  if (action === "cancel-order") return cancelRestaurant(button.dataset.id);
  if (action === "ready") return mutateRestaurant(button.dataset.id);
  if (action === "deliver") return deliverRestaurant(button.dataset.id);
  if (action === "step") return mutateCourier(button.dataset.id, button.dataset.step);
  if (action === "toggle-earning") {
    const period = button.dataset.period;
    if (period !== "day" && period !== "week" && period !== "month") return;
    courierEarningOpen[period] = !courierEarningOpen[period];
    const amount = document.querySelector("#courier-earning-" + period);
    if (amount) amount.hidden = !courierEarningOpen[period];
    button.setAttribute("aria-expanded", courierEarningOpen[period] ? "true" : "false");
    return;
  }
  if (action === "toggle-delivered") {
    deliveredListOpen = !deliveredListOpen;
    const list = document.querySelector("#delivered-orders");
    if (list) list.hidden = !deliveredListOpen;
    button.setAttribute("aria-expanded", deliveredListOpen ? "true" : "false");
    return;
  }
  if (action === "show-skip") {
    const card = button.closest(".order");
    const box = card ? card.querySelector(".skip-reasons") : null;
    if (box) box.hidden = !box.hidden;
    return;
  }
  if (action === "skip-order") {
    const courierId = state.session && state.session.role === "kurye" ? state.session.courierId : "";
    skipCourierOrder(state, button.dataset.id, courierId, button.dataset.reason);
    persist();
    renderCourier();
    return;
  }
  if (action === "toggle-password") return togglePassword(button);
  if (action === "forgot-password") {
    const box = document.querySelector("#forgot-box");
    if (box) box.hidden = !box.hidden;
    return;
  }
  if (action === "reset-password") return resetCustomerPassword();
  if (action === "pick-address") return showAddressExtra(button.dataset.address || "");
  if (action === "save-address") return saveDeliveryAddress();
  if (action === "logout") return logout();
}

function onChange(event) {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.name === "deliveryMode") {
    const restaurant = currentRestaurant();
    const mode = target.value === "kendi" || target.value === "harbi" ? target.value : "";
    if (!restaurant || !mode) return;
    restaurant.deliveryMode = mode;
    persist();
    const noteNode = document.querySelector("#delivery-note");
    if (noteNode) {
      noteNode.hidden = false;
      noteNode.textContent = "Teslimat seçimi kaydedildi.";
    }
    return;
  }
  if (!(target instanceof HTMLSelectElement) || !target.form) return;
  const formKind = target.form.dataset.form || "";
  if (target.name === "tur" && formKind === "partner-apply") {
    syncPartnerPhotoField(target.form);
    return;
  }
  if (target.name !== "il") return;
  if (formKind !== "signup" && formKind !== "partner-apply" && formKind !== "courier-apply") return;
  fillDistrictOptions(target.form.elements.ilce, target.value);
}

function onInput(event) {
  if (event.target.matches("[data-extra], input[name=gateway]")) updateMenuTotal();
  if (event.target.matches("[data-payout]")) {
    const restaurant = currentRestaurant();
    if (!restaurant) return;
    restaurant.payoutSaved = false;
    const note = document.querySelector("#saved-note");
    if (note) note.hidden = true;
  }
}

function onSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.dataset.form) return;
  event.preventDefault();
  const kind = form.dataset.form;
  if (kind === "signup") return submitSignup(form);
  if (kind === "login-customer") return submitCustomer(form);
  if (kind === "login-admin") return submitAdminLogin(form);
  if (kind === "login-restaurant") return submitRestaurantLogin(form);
  if (kind === "login-courier") return submitCourierLogin(form);
  if (kind === "login-courier-account") return submitCourierAccount(form);
  if (kind === "courier-apply") return submitCourierApplication(form);
  if (kind === "partner-apply") return submitPartnerApplication(form);
  if (kind === "restaurant-apply") return submitRestaurantApplication(form);
  if (kind === "florist-apply") return submitFloristApplication(form);
  if (kind === "edit-florist") return submitEditFlorist(form);
  if (kind === "add-courier") return submitAddCourier(form);
  if (kind === "edit-courier") return submitEditCourier(form);
  if (kind === "add-restaurant") return submitRestaurant(form);
  if (kind === "add-extra") return submitExtra(form);
  if (kind === "add-menu-item") return submitMenuItem(form);
  if (kind === "add-category") return submitCategory(form);
  if (kind === "save-payout") return submitPayout(form);
  if (kind === "save-seller-iban") return submitSellerIban(form);
  if (kind === "save-courier-iban") return submitCourierIban(form);
  if (kind === "save-commission-iban") return submitCommissionIban(form);
  if (kind === "checkout") return submitCheckout(form);
  if (kind === "district-restaurant") return submitDistrictRestaurant(form);
  if (kind === "cart-checkout") return submitCartCheckout(form);
}

function note(id, text, ok) {
  const node = document.querySelector(id);
  if (!node) return;
  node.hidden = false;
  node.textContent = text;
  node.className = ok ? "notice" : "notice warn";
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isAdminCredentials(email, password) {
  return normalizeEmail(email) === "admin@harbiyemek7.com"
    && String(password || "").trim().toLowerCase() === "harbi7";
}

function isCourierAdminCredentials(email, password) {
  return normalizeEmail(email) === "kurye@harbiyemek7.com"
    && String(password || "").trim().toLowerCase() === "harbi7";
}

function isFerahCredentials(email, password) {
  return normalizeEmail(email) === "ferah@harbiyemek7.com"
    && String(password || "").trim().toLowerCase() === "harbi7";
}

function findFerahRestaurant(state) {
  const named = state.restaurants.filter(function (restaurant) {
    return restaurant && String(restaurant.name || "").trim().toLocaleLowerCase("tr") === "ferah lahmacun";
  })[0];
  return named || findRestaurant(state, "r-ferah");
}

function readStoredSession() {
  try {
    const raw = storage().getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && data.session ? data.session : null;
  } catch (err) {
    return null;
  }
}

function writeAdminSession(email) {
  state.session = { role: "yonetim", name: "admin", email: normalizeEmail(email) };
  save(state);
  try {
    const raw = storage().getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (!data.session || data.session.role !== "yonetim") {
      data.session = state.session;
      storage().setItem(KEY, JSON.stringify(data));
    }
  } catch (err) {
    storage().setItem(KEY, JSON.stringify(state));
  }
}

function hasAdminSession() {
  if (state && state.session && state.session.role === "yonetim") return true;
  const stored = readStoredSession();
  if (stored && stored.role === "yonetim") {
    state.session = stored;
    return true;
  }
  return false;
}

function submitSignup(form) {
  const name = form.ad.value.trim();
  const email = normalizeEmail(form.eposta.value);
  const password = form.sifre.value;
  const province = form.il ? form.il.value : "";
  const district = form.ilce ? form.ilce.value : "";
  const address = form.adres.value.trim();
  const floor = form.kat.value.trim();
  const apartment = form.daire.value.trim();
  if (!name || !email || !password) {
    note("#signup-note", "Ad, e-posta ve şifre gerekli.", false);
    return;
  }
  if (PROVINCES.indexOf(province) === -1 || districtsOf(province).indexOf(district) === -1) {
    note("#signup-note", "İl ve ilçe seçin.", false);
    return;
  }
  if (!address || !floor || !apartment) {
    note("#signup-note", "Adres, kat ve daire gerekli.", false);
    return;
  }
  if (state.users.some(function (user) { return user.email === email; })) {
    note("#signup-note", "Bu e-posta ile kayıt var.", false);
    return;
  }
  state.users.push({
    id: uid("u"),
    name: name,
    email: email,
    password: password,
    province: province,
    district: district,
    address: address,
    floor: floor,
    apartment: apartment
  });
  persist();
  note("#signup-note", "Kaydedildi", true);
}

function submitCustomer(form) {
  const emailEl = form.querySelector('[name="eposta"]');
  const passwordEl = form.querySelector('[name="sifre"]');
  const email = String(emailEl ? emailEl.value : "").trim().toLowerCase();
  const password = String(passwordEl ? passwordEl.value : "").trim();
  if (email === "admin@harbiyemek7.com" && password.toLowerCase() === "harbi7") {
    state.session = { role: "yonetim", name: "admin", email: email };
    persist();
    location.href = "admin.html";
    return;
  }
  if (isCourierAdminCredentials(email, password)) {
    const courier = (state.couriers || []).filter(function (item) {
      return item && normalizeEmail(item.email) === "kurye@harbiyemek7.com" && item.approved !== false;
    })[0];
    if (!courier) {
      note("#customer-note", "Kurye hesabı bulunamadı.", false);
      return;
    }
    state.session = { role: "kurye", courierId: courier.id, name: courier.name, email: email };
    persist();
    location.href = "kurye.html";
    return;
  }
  if (isFerahCredentials(email, password)) {
    const restaurant = findFerahRestaurant(state);
    if (!restaurant) {
      note("#customer-note", "Restoran bulunamadı.", false);
      return;
    }
    state.session = { role: "restoran", restaurantId: restaurant.id, name: restaurant.name, email: email };
    persist();
    location.href = "restoran.html";
    return;
  }
  const restaurantAccount = (state.restaurants || []).filter(function (item) {
    return item && normalizeEmail(item.email) === email && item.password === password && item.approved !== false;
  })[0];
  if (restaurantAccount) {
    state.session = { role: "restoran", restaurantId: restaurantAccount.id, name: restaurantAccount.name, email: email };
    persist();
    location.href = "restoran.html";
    return;
  }
  const floristAccount = (state.florists || []).filter(function (item) {
    return item && normalizeEmail(item.email) === email && item.password === password && item.approved !== false;
  })[0];
  if (floristAccount) {
    state.session = { role: "cicekci", restaurantId: floristAccount.id, name: floristAccount.name, email: email };
    persist();
    location.href = "restoran.html";
    return;
  }
  const waterAccount = (state.waterBusinesses || []).filter(function (item) {
    return item && normalizeEmail(item.email) === email && item.password === password && item.approved !== false;
  })[0];
  if (waterAccount) {
    state.session = { role: "su", restaurantId: waterAccount.id, name: waterAccount.name, email: email };
    persist();
    location.href = "restoran.html";
    return;
  }
  const marketAccount = (state.markets || []).filter(function (item) {
    return item && normalizeEmail(item.email) === email && item.password === password && item.approved !== false;
  })[0];
  if (marketAccount) {
    state.session = { role: "market", restaurantId: marketAccount.id, name: marketAccount.name, email: email };
    persist();
    location.href = "restoran.html";
    return;
  }
  const courierAccount = (state.couriers || []).filter(function (item) {
    return item && normalizeEmail(item.email) === email && item.password === password && item.approved !== false;
  })[0];
  if (courierAccount) {
    state.session = { role: "kurye", courierId: courierAccount.id, name: courierAccount.name, email: email };
    persist();
    location.href = "kurye.html";
    return;
  }
  const user = state.users.filter(function (item) { return item.email === email && item.password === password; })[0];
  if (!user) {
    const waitingPartner = (state.restaurantApplications || []).some(function (item) {
      return item && normalizeEmail(item.email) === email && item.status !== "onayli";
    }) || (state.floristApplications || []).some(function (item) {
      return item && normalizeEmail(item.email) === email && item.status !== "onayli";
    }) || (state.courierApplications || []).some(function (item) {
      return item && normalizeEmail(item.email) === email && item.status !== "onayli";
    });
    note("#customer-note", waitingPartner ? "Başvurunuz henüz onaylanmadı." : "E-posta veya şifre uyuşmadı.", false);
    return;
  }
  state.session = { role: "musteri", name: user.name, email: user.email };
  state.rememberEmail = form.hatirla && form.hatirla.checked ? email : "";
  persist();
  location.href = "siparisler.html";
}

function submitAdminLogin(form) {
  const email = normalizeEmail(form.eposta.value);
  const password = form.sifre.value;
  if (isAdminCredentials(email, password)) {
    writeAdminSession(email);
    location.href = "admin.html";
    return;
  }
  note("#admin-note", "E-posta veya şifre uyuşmadı.", false);
}

function togglePassword(button) {
  const input = document.getElementById(button.dataset.target || "");
  if (!input) return;
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  button.setAttribute("aria-pressed", show ? "true" : "false");
  button.textContent = show ? "Şifreyi gizle" : "Şifreyi göster";
}

function resetCustomerPassword() {
  const form = document.querySelector('[data-form="login-customer"]');
  if (!form) return;
  const email = normalizeEmail(form.eposta.value);
  const next = document.querySelector("#yeni-sifre");
  const password = next ? next.value : "";
  const user = state.users.filter(function (item) { return item.email === email; })[0];
  if (!user) {
    note("#customer-note", "Bu e-posta ile kayıt yok.", false);
    return;
  }
  if (!password) {
    note("#customer-note", "Yeni şifre gerekli.", false);
    return;
  }
  user.password = password;
  persist();
  note("#customer-note", "Yeni şifre kaydedildi.", true);
}

function submitRestaurantLogin(form) {
  const id = form.restaurant.value;
  const restaurant = findRestaurant(state, id);
  if (!restaurant) {
    note("#restaurant-note", "Önce yönetimden restoran ekleyin.", false);
    return;
  }
  state.session = { role: "restoran", restaurantId: restaurant.id, name: restaurant.name };
  persist();
  location.href = "restoran.html";
}

function submitCourierLogin(form) {
  const id = form.courier.value;
  const courier = findCourier(state, id);
  if (!courier || courier.approved === false) return;
  state.session = { role: "kurye", courierId: courier.id, name: courier.name };
  persist();
  location.href = "kurye.html";
}

function submitCourierAccount(form) {
  const email = normalizeEmail(form.eposta.value);
  const password = String(form.sifre.value || "").trim();
  const courier = state.couriers.filter(function (item) {
    return item.email === email && item.password === password && item.approved !== false;
  })[0];
  if (!courier) {
    const waiting = state.courierApplications.some(function (item) {
      return item.email === email && item.status !== "onayli";
    });
    note("#courier-login-note", waiting ? "Başvurunuz henüz onaylanmadı." : "E-posta veya şifre uyuşmadı.", false);
    return;
  }
  state.session = { role: "kurye", courierId: courier.id, name: courier.name };
  persist();
  renderCourier();
}

function pickedFile(form, name) {
  const input = form.elements[name];
  const file = input && input.files ? input.files[0] : null;
  return file && file.size ? file : null;
}

function submitEditCourier(form) {
  const courier = (state.couriers || []).filter(function (item) { return item && item.id === form.dataset.id; })[0];
  if (!courier) return;
  const firstName = form.isim.value.trim();
  const lastName = form.soyisim.value.trim();
  const phone = form.telefon.value.trim();
  const address = form.adres.value.trim();
  const email = normalizeEmail(form.eposta.value);
  const password = String(form.sifre.value || "").trim();
  if (!firstName || !lastName || !phone || !address || !email || !password) {
    note("#edit-courier-note", "Ad, soyad, telefon, adres, mail ve şifre gerekli.", false);
    return;
  }
  const taken = (state.couriers || []).some(function (item) {
    return item && item.id !== courier.id && normalizeEmail(item.email) === email;
  });
  if (taken) {
    note("#edit-courier-note", "Bu e-posta başka bir kuryede kayıtlı.", false);
    return;
  }
  courier.firstName = firstName;
  courier.lastName = lastName;
  courier.name = firstName + " " + lastName;
  courier.phone = phone;
  courier.address = address;
  const province = provinceFromAddress(address);
  if (province) courier.province = province;
  courier.district = matchDistrict(courier.province || "", address) || "";
  courier.email = email;
  courier.password = password;
  if (state.session && state.session.role === "kurye" && state.session.courierId === courier.id) {
    state.session.name = courier.name;
    state.session.email = email;
  }
  courierEditId = "";
  persist();
  renderCourierAdmin();
}

function submitAddCourier(form) {
  const firstName = form.isim.value.trim();
  const lastName = form.soyisim.value.trim();
  const phone = form.telefon.value.trim();
  const address = form.adres.value.trim();
  const tc = form.tc.value.trim();
  const photoFile = pickedFile(form, "resim");
  const residenceFile = pickedFile(form, "ikametgah");
  const recordFile = pickedFile(form, "sabika");
  if (!firstName || !lastName || !phone || !address || !photoFile || !tc || !residenceFile || !recordFile) {
    note("#add-courier-note", "İsim, soyisim, telefon, adres, resim, TC, ikametgah ve sabıka kaydı gerekli.", false);
    return;
  }
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  Promise.all([readImageFile(photoFile), readDataFile(residenceFile), readDataFile(recordFile)]).then(function (files) {
    const photo = files[0];
    const residence = files[1];
    const criminalRecord = files[2];
    if (!photo || !residence || !criminalRecord) {
      note("#add-courier-note", "İsim, soyisim, telefon, adres, resim, TC, ikametgah ve sabıka kaydı gerekli.", false);
      return;
    }
    state.couriers.push({
      id: uid("k"),
      firstName: firstName,
      lastName: lastName,
      name: firstName + " " + lastName,
      phone: phone,
      address: address,
      tc: tc,
      photo: photo,
      residence: residence,
      criminalRecord: criminalRecord,
      email: "",
      password: "",
      iban: "",
      province: provinceFromAddress(address),
      company: "Harbi Kuryeler",
      approved: true
    });
    persist();
    renderCourierAdmin();
    note("#add-courier-note", "Kurye eklendi.", true);
  }).catch(function () {
    note("#add-courier-note", "Dosya kaydedilemedi.", false);
  }).then(function () {
    const again = document.querySelector('[data-form="add-courier"] [type="submit"]');
    if (again) again.disabled = false;
  });
}

function partnerKindLabel(kind) {
  if (kind === "su") return "Su";
  if (kind === "market") return "Market";
  if (kind === "cicekci") return "Çiçekçi";
  return "Restoran";
}

function syncPartnerPhotoField(form) {
  if (!form) return;
  const field = form.querySelector("#partner-photo-field") || document.querySelector("#partner-photo-field");
  const input = form.resim;
  if (!field || !input) return;
  const florist = form.tur && form.tur.value === "cicekci";
  field.hidden = !florist;
  input.required = florist;
  if (!florist) input.value = "";
}

function partnerEmailTaken(email) {
  const lists = []
    .concat(state.restaurantApplications || [])
    .concat(state.floristApplications || [])
    .concat(state.restaurants || [])
    .concat(state.florists || [])
    .concat(state.waterBusinesses || [])
    .concat(state.markets || []);
  return lists.some(function (item) {
    return item && item.email && normalizeEmail(item.email) === email;
  });
}

function addShopAccount(listName, application) {
  if (!state[listName]) state[listName] = [];
  let shop = state[listName].filter(function (item) {
    return item && item.email && normalizeEmail(item.email) === application.email;
  })[0];
  if (!shop) {
    shop = {
      id: uid("shop"),
      name: application.name,
      province: application.province,
      district: application.district || "",
      address: application.address,
      iban: "",
      email: application.email,
      password: application.password,
      phone: application.phone,
      photo: application.photo || "",
      approved: true,
      menu: []
    };
    state[listName].push(shop);
  }
  shop.email = application.email;
  shop.password = application.password;
  shop.phone = application.phone;
  shop.approved = true;
  shop.name = application.name;
  shop.province = application.province;
  shop.district = application.district || "";
  shop.address = application.address;
  if (application.photo) shop.photo = application.photo;
  return shop;
}

function submitPartnerApplication(form) {
  const kind = form.tur ? form.tur.value : "";
  const name = form.ad.value.trim();
  const phone = form.telefon.value.trim();
  const email = normalizeEmail(form.eposta.value);
  const password = form.sifre ? String(form.sifre.value || "").trim() : "";
  const address = form.adres.value.trim();
  const province = form.il.value;
  const district = form.ilce ? form.ilce.value : "";
  const photoFile = form.resim && form.resim.files ? form.resim.files[0] : null;
  const noteId = "#partner-apply-note";
  if (kind !== "restoran" && kind !== "su" && kind !== "market" && kind !== "cicekci") {
    note(noteId, "İşletme türü seçin.", false);
    return;
  }
  if (!name || !phone || !email || !password || !address || PROVINCES.indexOf(province) === -1 || districtsOf(province).indexOf(district) === -1) {
    note(noteId, "Ad, telefon, e-posta, şifre, adres, il ve ilçe gerekli.", false);
    return;
  }
  if (kind === "cicekci" && !photoFile) {
    note(noteId, "Çiçekçi için profil resmi gerekli.", false);
    return;
  }
  if (email === "admin@harbiyemek7.com" || email === "ferah@harbiyemek7.com" || email === "kurye@harbiyemek7.com") {
    note(noteId, "Bu e-posta kullanılamaz.", false);
    return;
  }
  if (partnerEmailTaken(email)) {
    note(noteId, "Bu e-posta ile başvuru var.", false);
    return;
  }
  const finish = function (photo) {
    const payload = {
      id: uid(kind === "cicekci" ? "fb" : "rb"),
      kind: kind,
      name: name,
      phone: phone,
      email: email,
      password: password,
      address: address,
      province: province,
      district: district,
      photo: photo || "",
      status: "bekliyor"
    };
    if (kind === "cicekci") {
      if (!state.floristApplications) state.floristApplications = [];
      state.floristApplications.push(payload);
    } else {
      if (!state.restaurantApplications) state.restaurantApplications = [];
      state.restaurantApplications.push(payload);
    }
    persist();
    form.reset();
    fillDistrictOptions(form.ilce, "");
    syncPartnerPhotoField(form);
    note(noteId, "Başvurunuz alındı. Onaydan sonra giriş yapabilirsiniz.", true);
  };
  if (!photoFile) {
    finish("");
    return;
  }
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  readImageFile(photoFile).then(function (photo) {
    if (!photo) {
      note(noteId, "Profil resmi kaydedilemedi.", false);
      return;
    }
    finish(photo);
  }).catch(function () {
    note(noteId, "Profil resmi kaydedilemedi.", false);
  }).then(function () {
    if (button) button.disabled = false;
  });
}

function submitRestaurantApplication(form) {
  if (!form.elements.tur) {
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "tur";
    hidden.value = "restoran";
    form.appendChild(hidden);
  }
  if (!form.elements.ilce) {
    const hiddenDistrict = document.createElement("input");
    hiddenDistrict.type = "hidden";
    hiddenDistrict.name = "ilce";
    hiddenDistrict.value = matchDistrict(form.il.value, form.adres.value) || "";
    form.appendChild(hiddenDistrict);
  }
  return submitPartnerApplication(form);
}

function approveRestaurantApplication(id) {
  const application = (state.restaurantApplications || []).filter(function (item) { return item.id === id; })[0];
  if (!application || application.status === "onayli") return;
  application.status = "onayli";
  const kind = application.kind === "su" || application.kind === "market" ? application.kind : "restoran";
  if (kind === "su") {
    addShopAccount("waterBusinesses", application);
    return;
  }
  if (kind === "market") {
    addShopAccount("markets", application);
    return;
  }
  let restaurant = state.restaurants.filter(function (item) {
    return item && item.email && normalizeEmail(item.email) === application.email;
  })[0];
  if (!restaurant) {
    restaurant = addRestaurant(state, {
      province: application.province,
      name: application.name,
      cuisine: "Restoran",
      address: application.address,
      iban: ""
    });
  }
  restaurant.email = application.email;
  restaurant.password = application.password;
  restaurant.phone = application.phone;
  restaurant.approved = true;
  restaurant.name = application.name;
  restaurant.province = application.province;
  restaurant.district = application.district || "";
  restaurant.address = application.address;
  if (application.photo) restaurant.photo = application.photo;
}

function submitFloristApplication(form) {
  const name = form.ad.value.trim();
  const phone = form.telefon.value.trim();
  const email = normalizeEmail(form.eposta.value);
  const password = form.sifre ? String(form.sifre.value || "").trim() : "";
  const address = form.adres.value.trim();
  const province = form.il.value;
  const photoFile = form.resim && form.resim.files ? form.resim.files[0] : null;
  if (!name || !phone || !email || !password || !address || PROVINCES.indexOf(province) === -1 || !photoFile) {
    note("#florist-apply-note", "Ad, telefon, e-posta, şifre, adres, şehir ve profil resmi gerekli.", false);
    return;
  }
  if (email === "admin@harbiyemek7.com" || email === "ferah@harbiyemek7.com" || email === "kurye@harbiyemek7.com") {
    note("#florist-apply-note", "Bu e-posta kullanılamaz.", false);
    return;
  }
  if (!state.floristApplications) state.floristApplications = [];
  if (!state.florists) state.florists = [];
  const taken = state.floristApplications.some(function (item) { return normalizeEmail(item.email) === email; })
    || state.florists.some(function (item) { return item.email && normalizeEmail(item.email) === email; })
    || (state.restaurantApplications || []).some(function (item) { return normalizeEmail(item.email) === email; })
    || (state.restaurants || []).some(function (item) { return item.email && normalizeEmail(item.email) === email; });
  if (taken) {
    note("#florist-apply-note", "Bu e-posta ile başvuru var.", false);
    return;
  }
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  readImageFile(photoFile).then(function (photo) {
    if (!photo) {
      note("#florist-apply-note", "Profil resmi kaydedilemedi.", false);
      return;
    }
    state.floristApplications.push({
      id: uid("fb"),
      name: name,
      phone: phone,
      email: email,
      password: password,
      address: address,
      province: province,
      photo: photo,
      status: "bekliyor"
    });
    persist();
    form.reset();
    note("#florist-apply-note", "Başvurunuz alındı. Onaydan sonra giriş yapabilirsiniz.", true);
  }).catch(function () {
    note("#florist-apply-note", "Profil resmi kaydedilemedi.", false);
  }).then(function () {
    if (button) button.disabled = false;
  });
}

function approveFloristApplication(id) {
  const application = (state.floristApplications || []).filter(function (item) { return item.id === id; })[0];
  if (!application || application.status === "onayli") return;
  application.status = "onayli";
  if (!state.florists) state.florists = [];
  let florist = state.florists.filter(function (item) {
    return item && item.email && normalizeEmail(item.email) === application.email;
  })[0];
  if (!florist) {
    florist = {
      id: uid("fl"),
      name: application.name,
      province: application.province,
      district: "",
      address: application.address,
      iban: "",
      email: application.email,
      password: application.password,
      phone: application.phone,
      photo: application.photo || "",
      approved: true,
      menu: []
    };
    state.florists.push(florist);
  }
  florist.email = application.email;
  florist.password = application.password;
  florist.phone = application.phone;
  florist.approved = true;
  florist.name = application.name;
  florist.province = application.province;
  florist.district = application.district || "";
  florist.address = application.address;
  if (application.photo) florist.photo = application.photo;
}

function submitEditFlorist(form) {
  const id = form.dataset.id || "";
  const florist = (state.florists || []).filter(function (item) { return item && item.id === id; })[0];
  if (!florist) return;
  const name = form.ad.value.trim();
  const phone = form.telefon.value.trim();
  const address = form.adres.value.trim();
  const province = form.il.value;
  if (!name || !phone || !address || PROVINCES.indexOf(province) === -1) {
    note("#florist-edit-note-" + id, "Ad, telefon, adres ve şehir gerekli.", false);
    return;
  }
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  const photoFile = form.resim && form.resim.files ? form.resim.files[0] : null;
  const done = function (photo) {
    florist.name = name;
    florist.phone = phone;
    florist.address = address;
    florist.province = province;
    if (photo) florist.photo = photo;
    persist();
    renderAdminFlorists();
    note("#florist-edit-note-" + id, "Profil kaydedildi.", true);
  };
  if (!photoFile) {
    done("");
    if (button) button.disabled = false;
    return;
  }
  readImageFile(photoFile).then(function (photo) {
    done(photo);
  }).catch(function () {
    note("#florist-edit-note-" + id, "Profil resmi kaydedilemedi.", false);
  }).then(function () {
    if (button) button.disabled = false;
  });
}

function submitCourierApplication(form) {
  const name = form.ad.value.trim();
  const phone = form.telefon.value.trim();
  const email = normalizeEmail(form.eposta.value);
  const password = String(form.sifre.value || "").trim();
  const province = form.il.value;
  const district = form.ilce ? form.ilce.value : "";
  const photoFile = pickedFile(form, "resim") || (form.resim && form.resim.files ? form.resim.files[0] : null);
  if (!name || !phone || !email || !password || PROVINCES.indexOf(province) === -1 || districtsOf(province).indexOf(district) === -1 || !photoFile) {
    note("#courier-apply-note", "Ad, telefon, e-posta, şifre, şehir, ilçe ve profil resmi gerekli.", false);
    return;
  }
  if (email === "kurye@harbiyemek7.com" || email === "admin@harbiyemek7.com") {
    note("#courier-apply-note", "Bu e-posta kayıtlı kurye hesabına ayrılmış.", false);
    return;
  }
  const taken = state.courierApplications.some(function (item) { return item.email === email; })
    || state.couriers.some(function (item) { return item.email && item.email === email; });
  if (taken) {
    note("#courier-apply-note", "Bu e-posta ile başvuru var.", false);
    return;
  }
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  readImageFile(photoFile).then(function (photo) {
    if (!photo) {
      note("#courier-apply-note", "Profil resmi kaydedilemedi.", false);
      return;
    }
    state.courierApplications.push({
      id: uid("b"),
      name: name,
      phone: phone,
      email: email,
      password: password,
      province: province,
      district: district,
      photo: photo,
      status: "bekliyor"
    });
    persist();
    form.reset();
    if (form.ilce) fillDistrictOptions(form.ilce, "");
    note("#courier-apply-note", "Başvurunuz alındı. Onaydan sonra giriş yapabilirsiniz.", true);
  }).catch(function () {
    note("#courier-apply-note", "Profil resmi kaydedilemedi.", false);
  }).then(function () {
    if (button) button.disabled = false;
  });
}

function approveCourierApplication(id) {
  const application = state.courierApplications.filter(function (item) { return item.id === id; })[0];
  if (!application || application.status === "onayli") return;
  application.status = "onayli";
  let courier = state.couriers.filter(function (item) { return item.email && item.email === application.email; })[0];
  if (!courier) {
    courier = {
      id: uid("k"),
      name: application.name,
      phone: application.phone,
      email: application.email,
      password: application.password,
      province: application.province,
      district: application.district || "",
      photo: application.photo || "",
      company: "Harbi Kuryeler",
      approved: true,
      iban: ""
    };
    state.couriers.push(courier);
  }
  if (application.district) courier.district = application.district;
  courier.approved = true;
  courier.email = application.email;
  courier.province = application.province;
  courier.name = application.name;
  courier.phone = application.phone;
  courier.password = application.password;
  if (application.photo) courier.photo = application.photo;
}

function submitRestaurant(form) {
  const province = qs("il");
  const name = form.ad.value.trim();
  const cuisine = form.mutfak.value.trim();
  const address = form.adres.value.trim();
  const iban = form.iban.value.trim();
  if (!name || !cuisine || !address || !iban) {
    note("#city-note", "Ad, mutfak, adres ve IBAN gerekli.", false);
    return;
  }
  addRestaurant(state, { province: province, name: name, cuisine: cuisine, address: address, iban: iban });
  persist();
  form.reset();
  note("#city-note", "Restoran eklendi.", true);
  renderCityList();
}

function currentRestaurant() {
  const seller = currentSeller();
  if (!seller || sellerKind(seller) !== "restoran") return null;
  return seller;
}

function currentSeller() {
  const id = qs("id");
  if (id && hasAdminSession()) return findRestaurant(state, id) || findShop(id);
  const role = state.session && state.session.role;
  const sessionId = state.session && state.session.restaurantId ? state.session.restaurantId : "";
  if (!sessionId) return null;
  if (role === "restoran") return findRestaurant(state, sessionId);
  if (role === "cicekci" || role === "su" || role === "market") return findShop(sessionId);
  return findRestaurant(state, sessionId) || findShop(sessionId);
}

function sellerKind(seller) {
  if (!seller) return "";
  if ((state.florists || []).some(function (shop) { return shop.id === seller.id; })) return "cicekci";
  if ((state.markets || []).some(function (shop) { return shop.id === seller.id; })) return "market";
  if ((state.waterBusinesses || []).some(function (shop) { return shop.id === seller.id; })) return "su";
  return "restoran";
}

function categoriesOf(kind) {
  if (!state.catalogCategories) return [];
  if (kind !== "restoran" && kind !== "su" && kind !== "market" && kind !== "cicekci") return null;
  return state.catalogCategories[kind] || [];
}

function submitCategory(form) {
  const kind = form.dataset.kind;
  const list = categoriesOf(kind);
  const name = form.ad.value.trim();
  if (!list || !name) {
    note("#category-note-" + kind, "Kategori adı gerekli.", false);
    return;
  }
  const exists = list.some(function (item) {
    return item.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr");
  });
  if (exists) {
    note("#category-note-" + kind, "Bu kategori zaten var.", false);
    return;
  }
  list.push({ id: uid("cat"), name: name });
  persist();
  form.reset();
  note("#category-note-" + kind, "Kategori eklendi.", true);
  renderCategoryLists();
}

function renderCategoryLists() {
  ["restoran", "su", "market", "cicekci"].forEach(function (kind) {
    const root = document.querySelector("#categories-" + kind);
    if (!root) return;
    const list = categoriesOf(kind) || [];
    root.innerHTML = list.length
      ? list.map(function (item) {
        return '<div class="province-row"><span>' + esc(item.name) + "</span>"
          + '<button class="btn ghost" type="button" data-action="remove-category" data-kind="' + esc(kind) + '" data-id="' + esc(item.id) + '">Sil</button></div>';
      }).join("")
      : '<p class="empty">Henüz kategori yok.</p>';
  });
}

function productFormHtml() {
  return '<form data-form="add-menu-item"><label class="field">Ürün adı<input name="ad" required></label>'
    + '<label class="field">Fiyat (₺)<input name="fiyat" type="number" min="0" step="1" required></label>'
    + '<label class="field">Kategori<select id="menu-category" name="kategori"></select></label>'
    + '<p id="menu-category-empty" class="empty" hidden>Seçilecek kategori yok.</p>'
    + '<label class="field">Açıklama<textarea name="aciklama" rows="3"></textarea></label>'
    + '<label class="field">Ürün resmi<input name="resim" type="file" accept="image/*"></label>'
    + '<p id="menu-note" class="notice" hidden></p><button class="btn" type="submit">Ürün ekle</button></form>';
}

function paintCategorySelect(kind) {
  const select = document.querySelector("#menu-category");
  const emptyNode = document.querySelector("#menu-category-empty");
  const list = categoriesOf(kind) || [];
  if (emptyNode) emptyNode.hidden = list.length > 0;
  if (!select) return;
  const current = select.value;
  if (!list.length) {
    select.innerHTML = "";
    select.required = false;
    select.hidden = true;
    return;
  }
  select.hidden = false;
  select.required = true;
  select.innerHTML = '<option value="">Kategori seçin</option>' + list.map(function (item) {
    return '<option value="' + esc(item.id) + '">' + esc(item.name) + "</option>";
  }).join("");
  if (list.some(function (item) { return item.id === current; })) select.value = current;
}

function paintOwnerMenu(seller) {
  const menuList = document.querySelector("#menu-list");
  if (!menuList) return;
  menuList.innerHTML = seller.menu.length
    ? seller.menu.map(function (item) {
      const photo = item.photo ? '<img class="item-photo" src="' + esc(item.photo) + '" alt="">' : "";
      const category = item.category ? " · " + esc(item.category) : "";
      return '<div class="province-row">' + photo + "<span>" + esc(item.name) + " · " + lira(item.price) + category
        + (item.description ? "<br>" + esc(item.description) : "") + "</span>"
        + '<button class="btn ghost" type="button" data-action="remove-menu-item" data-id="' + esc(item.id) + '">Sil</button></div>';
    }).join("")
    : '<p class="empty">Ürün yok.</p>';
}

function submitMenuItem(form) {
  const seller = currentSeller();
  if (!seller) return;
  const kind = sellerKind(seller);
  const name = form.ad.value.trim();
  const price = Number(form.fiyat.value);
  const description = form.aciklama ? form.aciklama.value.trim() : "";
  const list = categoriesOf(kind) || [];
  const category = list.filter(function (item) { return item.id === (form.kategori ? form.kategori.value : ""); })[0];
  if (!name || !(price >= 0)) {
    note("#menu-note", "Ürün adı ve fiyat gerekli.", false);
    return;
  }
  if (!list.length) {
    note("#menu-note", "Seçilecek kategori yok.", false);
    return;
  }
  if (!category) {
    note("#menu-note", "Kategori seçin.", false);
    return;
  }
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  readImageFile(form.resim && form.resim.files ? form.resim.files[0] : null).then(function (photo) {
    seller.menu.push({
      id: uid("m"),
      name: name,
      price: price,
      photo: photo,
      description: description,
      categoryId: category.id,
      category: category.name
    });
    persist();
    form.reset();
    note("#menu-note", "Ürün eklendi.", true);
    renderRestaurant();
  }).catch(function () {
    note("#menu-note", "Resim kaydedilemedi.", false);
  }).then(function () {
    if (button) button.disabled = false;
  });
}

function submitExtra(form) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  const name = form.ad.value.trim();
  const plus = Number(form.fiyat.value);
  if (!name || !(plus >= 0)) {
    note("#extra-note", "Ürün adı ve artı fiyat gerekli.", false);
    return;
  }
  restaurant.extras.push({ id: uid("e"), name: name, plus: plus });
  persist();
  form.reset();
  renderRestaurant();
}

function submitCommissionIban(form) {
  state.commissionIban = form.iban.value.trim();
  persist();
  note("#commission-iban-note", "Kaydedildi", true);
}

function submitSellerIban(form) {
  const seller = currentSeller();
  if (!seller) return;
  const iban = form.iban.value.trim();
  seller.iban = iban;
  if (sellerKind(seller) === "restoran") seller.payoutIban = iban;
  const payoutInput = document.querySelector('[data-form="save-payout"] [name="iban"]');
  if (payoutInput) payoutInput.value = iban;
  persist();
  note("#seller-iban-note", "Kaydedildi", true);
}

function submitCourierIban(form) {
  const courier = findCourier(state, state.session && state.session.courierId);
  if (!courier || !state.session || state.session.role !== "kurye") return;
  courier.iban = form.iban.value.trim();
  persist();
  note("#courier-iban-note", "Kaydedildi", true);
}

function ibanSheet(value) {
  return '<section class="sheet"><h2>IBAN</h2>'
    + '<form data-form="save-seller-iban"><label class="field">IBAN<input name="iban" autocomplete="off" value="' + esc(value || "") + '"></label>'
    + '<p id="seller-iban-note" class="notice" hidden></p>'
    + '<button class="btn" type="submit">Kaydet</button></form></section>';
}

function submitPayout(form) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  restaurant.payoutIban = form.iban.value.trim();
  restaurant.iban = restaurant.payoutIban;
  const sellerInput = document.querySelector('[data-form="save-seller-iban"] [name="iban"]');
  if (sellerInput) sellerInput.value = restaurant.iban;
  restaurant.payoutAddress = form.adres.value.trim();
  restaurant.payoutSaved = true;
  persist();
  const noteNode = document.querySelector("#saved-note");
  if (noteNode) {
    noteNode.hidden = false;
    noteNode.textContent = "Kaydedildi";
  }
}

function submitCheckout(form) {
  const restaurant = findRestaurant(state, form.dataset.restaurant);
  if (!restaurant || !state.provinces[restaurant.province]) {
    note("#checkout-note", "Bu restoran şu an kapalı.", false);
    return;
  }
  if (!restaurantAcceptsOrders(state, restaurant)) {
    note("#checkout-note", "Bu ilçe siparişe kapalı.", false);
    return;
  }
  const gateway = form.gateway ? form.gateway.value : "";
  if (!gateway || !state.gateways[gateway]) {
    note("#checkout-note", "Açık bir ödeme yöntemi seçin.", false);
    return;
  }
  const lines = [];
  form.querySelectorAll("[data-line]").forEach(function (row) {
    const qty = Number(row.querySelector("[data-qty]").textContent);
    if (!qty) return;
    const extras = [];
    row.querySelectorAll("[data-extra]:checked").forEach(function (box) {
      const extra = restaurant.extras.filter(function (item) { return item.id === box.dataset.extra; })[0];
      if (extra) extras.push({ name: extra.name, plus: extra.plus });
    });
    lines.push({ itemId: row.dataset.item || "", name: row.dataset.name, price: Number(row.dataset.price), qty: qty, extras: extras });
  });
  if (!lines.length) {
    note("#checkout-note", "Bir ürün seçin.", false);
    return;
  }
  const order = placeOrder(state, { restaurantId: restaurant.id, lines: lines, gatewayId: gateway });
  const ordered = {};
  lines.forEach(function (line) { if (line.itemId) ordered[line.itemId] = true; });
  state.cart = (state.cart || []).filter(function (entry) {
    return !(entry.restaurantId === restaurant.id && ordered[entry.itemId]);
  });
  persist();
  location.href = "siparis.html?id=" + encodeURIComponent(order.id);
}

function submitDistrictRestaurant(form) {
  const province = qs("il");
  const district = qs("ilce");
  if (PROVINCES.indexOf(province) === -1 || districtsOf(province).indexOf(district) === -1) return;
  const name = form.ad.value.trim();
  const cuisine = form.mutfak.value.trim();
  let address = form.adres.value.trim();
  const iban = form.iban.value.trim();
  if (!name || !cuisine || !address || !iban) {
    note("#district-restaurant-note", "Ad, mutfak, adres ve IBAN gerekli.", false);
    return;
  }
  if (matchDistrict(province, address) !== district) address = address + ", " + district;
  const button = form.querySelector('[type="submit"]');
  if (button) button.disabled = true;
  readImageFile(form.resim.files[0]).then(function (photo) {
    const restaurant = addRestaurant(state, { province: province, name: name, cuisine: cuisine, address: address, iban: iban });
    restaurant.district = district;
    restaurant.photo = photo || photoFor(restaurant);
    persist();
    form.reset();
    renderDistrictRestaurants(province, district);
    form.hidden = true;
    const toggle = document.querySelector("[data-action='toggle-restaurant-form']");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    const savedNote = document.querySelector("#district-restaurant-note");
    if (savedNote) savedNote.hidden = true;
  }).catch(function () {
    note("#district-restaurant-note", "Resim kaydedilemedi.", false);
  }).then(function () {
    if (button) button.disabled = false;
  });
}

function submitCartCheckout(form) {
  const gateway = form.gateway ? form.gateway.value : "";
  if (!state.cart || !state.cart.length) {
    note("#cart-note", "Sepet boş.", false);
    return;
  }
  if (!gateway || !state.gateways[gateway]) {
    note("#cart-note", "Açık bir ödeme yöntemi seçin.", false);
    return;
  }
  const groups = {};
  state.cart.forEach(function (line) {
    if (!groups[line.restaurantId]) groups[line.restaurantId] = [];
    groups[line.restaurantId].push(line);
  });
  const ids = Object.keys(groups);
  const restaurantIds = ids.filter(function (id) { return findRestaurant(state, id); });
  if (!restaurantIds.length) {
    note("#cart-note", "Sepette siparişe hazır restoran ürünü yok.", false);
    return;
  }
  for (let i = 0; i < restaurantIds.length; i += 1) {
    const restaurant = findRestaurant(state, restaurantIds[i]);
    if (!restaurant || !state.provinces[restaurant.province]) {
      note("#cart-note", "Bu restoran şu an kapalı.", false);
      return;
    }
    if (!restaurantAcceptsOrders(state, restaurant)) {
      note("#cart-note", "Bu ilçe siparişe kapalı.", false);
      return;
    }
  }
  restaurantIds.forEach(function (id) {
    placeOrder(state, {
      restaurantId: id,
      gatewayId: gateway,
      lines: groups[id].map(function (line) {
        return { name: line.name, price: line.price, qty: line.qty, extras: [] };
      })
    });
  });
  state.cart = (state.cart || []).filter(function (line) {
    return restaurantIds.indexOf(line.restaurantId) === -1;
  });
  persist();
  paintCartCount();
  renderCart();
  renderOrders();
  note("#cart-note", "Siparişiniz onaylandı", true);
}

function mutateCourier(orderId, step) {
  const courierId = state.session && state.session.courierId;
  if (!courierId) return;
  if (step === "accept") acceptOrder(state, orderId, courierId);
  else if (step === "decline") declineOrder(state, orderId, courierId);
  else courierStep(state, orderId, courierId, step);
  persist();
  renderCourier();
  if (step === "yolda") {
    const order = findOrder(state, orderId);
    if (order && order.status === "yolda") location.href = googleMapsHref(orderCustomerPlace(order));
  }
}

function mutateRestaurant(orderId) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  markReady(state, orderId, restaurant.id);
  persist();
  renderRestaurant();
}

function approveRestaurant(orderId) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  approveRestaurantOrder(state, orderId, restaurant.id);
  persist();
  renderRestaurant();
}

function cancelRestaurant(orderId) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  cancelRestaurantOrder(state, orderId, restaurant.id);
  persist();
  renderRestaurant();
}

function deliverRestaurant(orderId) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  deliverOwnOrder(state, orderId, restaurant.id);
  persist();
  renderRestaurant();
}

function restaurantCard(restaurant) {
  const onHome = document.body && document.body.dataset.page === "home";
  const eta = restaurant.eta ? esc(restaurant.eta) + (onHome ? " 24.99 TL Teslimat" : "") : "";
  const deliveryText = onHome && deliveryModeOf(restaurant) !== "kendi" ? "Avantajlı Teslimat" : deliveryLabel(deliveryModeOf(restaurant));
  return '<a class="rest" href="menu.html?id=' + encodeURIComponent(restaurant.id) + '">'
    + '<div class="photo"><img src="' + esc(photoFor(restaurant)) + '" alt="' + esc(restaurant.name + ", " + restaurant.cuisine) + '"></div>'
    + '<div class="body"><h3>' + esc(restaurant.name) + "</h3>"
    + (onHome ? "" : '<p class="meta">' + esc(restaurant.cuisine) + " · " + esc(restaurant.address) + "</p>")
    + '<p class="meta">' + esc(deliveryText) + "</p>"
    + '<p class="meta">' + esc(onHome ? (restaurantDistrictName(restaurant) || restaurant.province) : restaurant.province) + (eta ? " · " + eta : "") + (restaurant.min ? " · Min. " + lira(restaurant.min) : "") + "</p>"
    + "</div></a>";
}

function renderRestaurantList() {
  const query = qs("q");
  const restaurants = openRestaurants(state, query);
  const grid = document.querySelector("#restaurants");
  const empty = document.querySelector("#empty-restaurants");
  if (!grid) return;
  if (!restaurants.length) {
    grid.innerHTML = "";
    if (empty) {
      empty.hidden = false;
      const place = customerPlace(state);
      const city = place.district || place.province;
      empty.textContent = city
        ? (query ? "Bu aramaya uygun restoran yok." : "Şu an " + city + " içinde siparişe açık restoran yok.")
        : "Adres seçin veya üye olun. Restoranlar şehrinize göre listelenir.";
    }
    return;
  }
  if (empty) empty.hidden = true;
  grid.innerHTML = restaurants.map(restaurantCard).join("");
}

function priceStack(amount, qty) {
  return '<span class="price-stack"><span class="price">' + lira(amount) + '</span><span class="qty">'
    + '<button type="button" data-action="qty" data-dir="-1" aria-label="Azalt">−</button>'
    + '<strong data-qty>' + qty + '</strong>'
    + '<button type="button" data-action="qty" data-dir="1" aria-label="Sepete ekle">+</button></span></span>';
}

function productListItem(item, seller, kind) {
  const qty = seller ? cartQty(seller.id, item.id) : 0;
  const description = item.description
    ? '<p class="meta">' + esc(item.description) + "</p>"
    : "";
  const name = kind === "restaurant"
    ? '<a href="menu.html?id=' + encodeURIComponent(seller.id) + '"><strong>' + esc(item.name) + "</strong></a>"
    : "<strong>" + esc(item.name) + "</strong>";
  const owner = kind === "restaurant"
    ? ' data-restaurant="' + esc(seller.id) + '"'
    : ' data-shop="' + esc(seller.id) + '"';
  return '<li class="item-card" data-line data-item="' + esc(item.id) + '"' + owner
    + ' data-name="' + esc(item.name) + '" data-price="' + esc(item.price) + '">'
    + '<span class="item-title"><span class="item-copy">' + name + description + "</span>"
    + priceStack(item.price, qty) + "</span></li>";
}

function shopsInCity(list) {
  const city = customerProvince(state);
  if (!city) return [];
  return (list || []).filter(function (shop) {
    if (!shop || !String(shop.name || "").trim()) return false;
    if (shop.approved === false) return false;
    if (shop.province && shop.province !== city) return false;
    return true;
  });
}

function visibleFlorists() {
  return (state.florists || []).filter(function (shop) {
    return shop && shop.approved !== false && String(shop.name || "").trim();
  });
}

function shopProducts(shop) {
  return (shop.menu || []).filter(function (item) {
    return item && String(item.name || "").trim();
  });
}

function shopPanelHtml(heading, shops) {
  const city = customerProvince(state);
  let html = '<p class="section-note">' + esc(heading) + "</p>";
  if (!city) {
    html += '<p class="empty">Adres seçin veya üye olun.</p>';
    return html;
  }
  if (!shops.length) {
    html += '<p class="empty">Bu şehirde henüz işletme yok.</p>';
    return html;
  }
  html += shops.map(function (shop) {
    const products = shopProducts(shop);
    const list = products.length
      ? '<ul class="menu">' + products.map(function (item) { return productListItem(item, shop, "shop"); }).join("") + "</ul>"
      : '<p class="empty">Henüz ürün yok.</p>';
    const photo = shop.photo
      ? '<img class="restaurant-thumb" src="' + esc(shop.photo) + '" alt="' + esc(shop.name) + '">'
      : "";
    return '<article class="order">' + photo + "<h3>" + esc(shop.name) + "</h3>"
      + (shop.address ? '<p class="meta">' + esc(shop.address) + "</p>" : "")
      + list + "</article>";
  }).join("");
  return html;
}

function renderShopStandalone(list, heading) {
  const root = document.querySelector("#shop-panel");
  if (!root) return;
  root.innerHTML = shopPanelHtml(heading, shopsInCity(list));
}

let homeCategory = "restoran";

function renderHome() {
  document.querySelectorAll('[data-action="show-category"]').forEach(function (button) {
    button.setAttribute("aria-pressed", button.dataset.category === homeCategory ? "true" : "false");
  });
  const panel = document.querySelector("#category-panel");
  if (panel) {
    if (homeCategory === "su") {
      panel.innerHTML = shopPanelHtml("Şehrindeki Su Dağıtım İşletmeleri", shopsInCity(state.waterBusinesses));
    } else if (homeCategory === "market") {
      panel.innerHTML = shopPanelHtml("Şehrindeki market İşletmeleri", shopsInCity(state.markets));
    } else if (homeCategory === "cicekci") {
      panel.innerHTML = shopPanelHtml("Şehrindeki Çiçekçiler", shopsInCity(visibleFlorists()));
    } else {
      panel.innerHTML = '<p class="section-note">Şehrindeki Restoranlar</p><p id="empty-restaurants" class="empty" hidden></p><div class="rest-grid" id="restaurants"></div>';
      renderRestaurantList();
    }
  }
  fillApplyProvinces();
}

function fillApplyProvinces() {
  document.querySelectorAll("form[data-form='courier-apply'] select[name='il'], form[data-form='partner-apply'] select[name='il'], form[data-form='restaurant-apply'] select[name='il'], form[data-form='florist-apply'] select[name='il'], form[data-form='edit-florist'] select[name='il']").forEach(function (select) {
    if (select.dataset.ready === "1" && select.options.length > 1) return;
    select.dataset.ready = "1";
    const current = select.value || select.dataset.province || "";
    select.innerHTML = provinceSelectHtml();
    if (current) select.value = current;
    if (select.form && select.form.elements.ilce) fillDistrictOptions(select.form.elements.ilce, select.value || "");
  });
}

function renderPartnerPage() {
  fillApplyProvinces();
  const form = document.querySelector('[data-form="partner-apply"]');
  if (form) syncPartnerPhotoField(form);
}

function switchButton(on, attrs, label) {
  return '<button type="button" class="switch" role="switch" aria-checked="' + (on ? "true" : "false") + '" aria-label="' + esc(label) + '" ' + attrs + "></button>";
}

function renderAdmin() {
  const list = document.querySelector("#provinces");
  if (!list) return;
  if (!hasAdminSession()) {
    location.replace("giris.html");
    return;
  }
  list.innerHTML = PROVINCES.map(function (name) {
    const on = !!state.provinces[name];
    return '<div class="province-row"><a href="il.html?il=' + encodeURIComponent(name) + '">' + esc(name) + "</a>"
      + switchButton(on, 'data-action="toggle-province" data-province="' + esc(name) + '"', name + (on ? " açık" : " kapalı"))
      + "</div>";
  }).join("");
  renderGateways();
  renderCategoryLists();
  renderPartnerApplications();
  renderAdminRestaurants();
  renderAdminFlorists();
  const iban = document.querySelector("#commission-iban");
  if (iban && document.activeElement !== iban) iban.value = state.commissionIban || "";
}

function renderGateways() {
  const root = document.querySelector("#gateways");
  if (!root) return;
  let html = "";
  let group = "";
  GATEWAYS.forEach(function (item) {
    if (item.group !== group) {
      if (group) html += "</div>";
      group = item.group;
      html += '<p class="group-label">' + esc(group) + '</p><div class="gateway-grid">';
    }
    const on = !!state.gateways[item.id];
    html += '<div class="gateway-row"><span>' + esc(item.label) + "</span>"
      + switchButton(on, 'data-action="toggle-gateway" data-gateway="' + esc(item.id) + '"', item.label + (on ? " açık" : " kapalı"))
      + "</div>";
  });
  if (group) html += "</div>";
  root.innerHTML = html;
}

function partnerApplicationCard(item, kind) {
  const resolved = kind === "business"
    ? (item.kind === "su" || item.kind === "market" || item.kind === "cicekci" ? item.kind : "restoran")
    : kind;
  const action = resolved === "cicekci"
    ? "approve-florist-application"
    : resolved === "kurye"
      ? "approve-application"
      : "approve-restaurant-application";
  const label = resolved === "kurye" ? "Kurye" : partnerKindLabel(resolved);
  const place = [item.province, item.district].filter(Boolean).join(" / ");
  const photo = item.photo ? '<img class="restaurant-thumb" src="' + esc(item.photo) + '" alt="">' : "";
  return '<article class="order">' + photo + "<h3>" + esc(item.name) + "</h3>"
    + '<p class="meta">' + label + " · " + esc(place) + " · " + esc(item.phone) + " · " + esc(item.email) + "</p>"
    + (item.address ? '<p class="meta">' + esc(item.address) + "</p>" : "")
    + '<div class="actions"><button class="btn" type="button" data-action="' + action + '" data-id="' + esc(item.id) + '">Onayla</button></div></article>';
}

function renderPartnerApplications() {
  const root = document.querySelector("#partner-applications");
  if (!root) return;
  const businesses = (state.restaurantApplications || []).filter(function (item) { return item && item.status !== "onayli"; });
  const florists = (state.floristApplications || []).filter(function (item) { return item && item.status !== "onayli"; });
  const couriers = (state.courierApplications || []).filter(function (item) { return item && item.status !== "onayli"; });
  const cards = businesses.map(function (item) { return partnerApplicationCard(item, "business"); })
    .concat(florists.map(function (item) { return partnerApplicationCard(item, "cicekci"); }))
    .concat(couriers.map(function (item) { return partnerApplicationCard(item, "kurye"); }));
  root.innerHTML = cards.length ? cards.join("") : '<p class="empty">Bekleyen başvuru yok.</p>';
}

function renderAdminRestaurants() {
  const root = document.querySelector("#admin-restaurants");
  if (!root) return;
  if (!state.restaurants.length) {
    root.innerHTML = '<p class="empty">Henüz restoran yok.</p>';
    return;
  }
  root.innerHTML = state.restaurants.map(function (restaurant) {
    const open = state.provinces[restaurant.province] ? "Müşteriye açık" : "Müşteriye kapalı";
    return '<article class="order"><h3>' + esc(restaurant.name) + "</h3>"
      + '<p class="meta">' + esc(restaurant.province) + " · " + esc(restaurant.cuisine) + " · " + esc(open) + "</p>"
      + '<p class="meta">' + esc(restaurant.address) + "</p>"
      + '<p style="margin:12px 0 0"><span class="commission">' + esc(commissionText()) + "</span></p></article>";
  }).join("");
}

function renderAdminFlorists() {
  const root = document.querySelector("#admin-florists");
  if (!root) return;
  const list = state.florists || [];
  if (!list.length) {
    root.innerHTML = '<p class="empty">Henüz çiçekçi yok.</p>';
    return;
  }
  root.innerHTML = list.map(function (florist) {
    const open = florist.approved === false ? "Kapalı" : (state.provinces[florist.province] ? "Müşteriye açık" : "İl kapalı");
    const photo = florist.photo
      ? '<img class="restaurant-thumb" src="' + esc(florist.photo) + '" alt="' + esc(florist.name) + '">'
      : "";
    return '<article class="order">' + photo + "<h3>" + esc(florist.name) + "</h3>"
      + '<p class="meta">' + esc(florist.province) + " · " + esc(florist.phone || "") + " · " + esc(open) + "</p>"
      + '<p class="meta">' + esc(florist.address || "") + "</p>"
      + '<div class="actions" style="margin:12px 0">'
      + '<button class="btn ghost" type="button" data-action="toggle-florist" data-id="' + esc(florist.id) + '">'
      + (florist.approved === false ? "Aç" : "Kapat") + "</button></div>"
      + '<form data-form="edit-florist" data-id="' + esc(florist.id) + '">'
      + '<label class="field">Ad<input name="ad" value="' + esc(florist.name) + '" required></label>'
      + '<label class="field">Telefon<input name="telefon" value="' + esc(florist.phone || "") + '" required></label>'
      + '<label class="field">Adres<input name="adres" value="' + esc(florist.address || "") + '" required></label>'
      + '<label class="field">Şehir<select name="il" data-province="' + esc(florist.province || "") + '" required></select></label>'
      + '<label class="field">Profil resmi<input name="resim" type="file" accept="image/*"></label>'
      + '<p id="florist-edit-note-' + esc(florist.id) + '" class="notice" hidden></p>'
      + '<button class="btn" type="submit">Profili kaydet</button></form></article>';
  }).join("");
  fillApplyProvinces();
}

function renderCity() {
  if (!hasAdminSession()) {
    location.replace("giris.html");
    return;
  }
  const name = qs("il");
  const title = document.querySelector("#city-title");
  const known = PROVINCES.indexOf(name) !== -1;
  if (title) title.textContent = known ? name : "İl bulunamadı";
  const closed = document.querySelector("#city-closed");
  if (closed) {
    closed.hidden = !known || !!state.provinces[name];
    closed.textContent = "Bu il müşterilere kapalı. Ana sayfada görünmez.";
  }
  const countNode = document.querySelector("#city-count");
  if (countNode) {
    const total = known ? state.restaurants.filter(function (restaurant) { return restaurant.province === name; }).length : 0;
    countNode.textContent = known ? "Toplam restoran: " + total : "";
  }
  renderDistricts(known ? name : "");
  renderCityList();
}

function renderDistricts(name) {
  const root = document.querySelector("#districts");
  if (!root) return;
  const names = districtsOf(name);
  if (!names.length) {
    root.innerHTML = '<li class="empty">Bu il için ilçe yok.</li>';
    return;
  }
  root.innerHTML = names.map(function (district) {
    const on = districtIsOpen(state, name, district);
    return '<li class="district-row"><a href="ilce.html?il=' + encodeURIComponent(name) + "&ilce=" + encodeURIComponent(district) + '">' + esc(district) + "</a>"
      + '<button type="button" class="btn ghost" data-action="toggle-district" data-province="' + esc(name) + '" data-district="' + esc(district) + '">Siparişe aç/kapa</button>'
      + '<span class="meta">' + (on ? "Açık" : "Kapalı") + "</span></li>";
  }).join("");
}

function renderDistrictPage() {
  if (!hasAdminSession()) {
    location.replace("giris.html");
    return;
  }
  const province = qs("il");
  const district = qs("ilce");
  const known = PROVINCES.indexOf(province) !== -1 && districtsOf(province).indexOf(district) !== -1;
  const title = document.querySelector("#district-title");
  if (title) title.textContent = known ? district : "İlçe bulunamadı";
  const place = document.querySelector("#district-place");
  if (place) place.textContent = known ? province : "";
  const back = document.querySelector("#district-back");
  if (back && known) back.href = "il.html?il=" + encodeURIComponent(province);
  renderDistrictRestaurants(known ? province : "", known ? district : "");
  const root = document.querySelector("#district-customers");
  if (!root) return;
  if (!known) {
    root.innerHTML = '<p class="empty">İlçe bulunamadı.</p>';
    return;
  }
  const customers = state.users.filter(function (user) {
    return user && user.province === province && user.district === district;
  });
  if (!customers.length) {
    root.innerHTML = '<p class="empty">Bu ilçede kayıtlı müşteri yok.</p>';
    return;
  }
  root.innerHTML = customers.map(function (user) {
    return '<article class="order"><h3>' + esc(user.name) + "</h3>"
      + '<p class="meta">' + esc(user.email) + "</p>"
      + '<p class="meta">' + esc(user.address) + " · Kat " + esc(user.floor) + " · Daire " + esc(user.apartment) + "</p></article>";
  }).join("");
}

function restaurantsInDistrict(province, district) {
  return state.restaurants.filter(function (restaurant) {
    if (restaurant.province !== province) return false;
    if (restaurant.district) return restaurant.district === district;
    return matchDistrict(province, restaurant.address) === district;
  });
}

function renderDistrictRestaurants(province, district) {
  const section = document.querySelector("#district-restaurant-section");
  const list = document.querySelector("#district-restaurant-list");
  const root = document.querySelector("#district-restaurants");
  const known = !!(province && district);
  if (section) section.hidden = !known;
  if (list) list.hidden = !known;
  if (!root) return;
  if (!province || !district) {
    root.innerHTML = "";
    return;
  }
  const rows = restaurantsInDistrict(province, district);
  if (!rows.length) {
    root.innerHTML = '<p class="empty">Bu ilçede restoran yok.</p>';
    return;
  }
  root.innerHTML = rows.map(function (restaurant) {
    const photo = photoFor(restaurant);
    return '<article class="order district-restaurant"><img class="restaurant-thumb" src="' + esc(photo) + '" alt="">'
      + '<div><h3><a href="restoran.html?id=' + encodeURIComponent(restaurant.id) + '">' + esc(restaurant.name) + "</a></h3>"
      + '<p class="meta">' + esc(restaurant.cuisine) + " · " + esc(restaurant.address) + "</p>"
      + '<p class="meta">' + restaurant.menu.length + " ürün</p></div>"
      + '<button type="button" class="btn ghost" data-action="delete-restaurant" data-id="' + esc(restaurant.id) + '">Sil</button></article>';
  }).join("");
}

function renderSignup() {
  const form = document.querySelector('[data-form="signup"]');
  if (!form || !form.il || form.il.dataset.ready === "1") return;
  form.il.dataset.ready = "1";
  form.il.innerHTML = '<option value="">İl seçin</option>' + PROVINCES.map(function (name) {
    return '<option value="' + esc(name) + '">' + esc(name) + "</option>";
  }).join("");
  fillDistrictOptions(form.ilce, "");
}

function fillDistrictOptions(select, province) {
  if (!select) return;
  const names = districtsOf(province);
  const current = select.value;
  select.innerHTML = '<option value="">İlçe seçin</option>' + names.map(function (name) {
    return '<option value="' + esc(name) + '">' + esc(name) + "</option>";
  }).join("");
  if (names.indexOf(current) !== -1) select.value = current;
}

function renderCityList() {
  const name = qs("il");
  const root = document.querySelector("#city-restaurants");
  if (!root) return;
  const rows = state.restaurants.filter(function (restaurant) { return restaurant.province === name; });
  if (!rows.length) {
    root.innerHTML = '<p class="empty">Bu ilde henüz restoran yok.</p>';
    return;
  }
  root.innerHTML = rows.map(function (restaurant) {
    return '<article class="order"><h3><a href="restoran.html?id=' + encodeURIComponent(restaurant.id) + '">' + esc(restaurant.name) + "</a></h3>"
      + '<p class="meta">' + esc(restaurant.cuisine) + " · " + esc(restaurant.address) + "</p>"
      + '<p class="meta">IBAN ' + esc(restaurant.iban) + "</p>"
      + '<p style="margin:12px 0 0"><span class="commission">' + esc(commissionText()) + "</span></p></article>";
  }).join("");
}

function lineCard(name, price) {
  const shown = lira(price);
  return '<article class="line" data-line data-name="' + esc(name) + '" data-price="' + esc(price) + '">'
    + '<div class="item-title"><h3>' + esc(name) + '</h3><span class="price-stack"><span class="price">' + shown + '</span><span class="qty">'
    + '<button type="button" data-action="qty" data-dir="-1" aria-label="Azalt">−</button><strong data-qty>0</strong>'
    + '<button type="button" data-action="qty" data-dir="1" aria-label="Arttır">+</button></span></span></div>'
    + "</article>";
}

function productCard(item, restaurant) {
  const qty = cartQty(restaurant.id, item.id);
  const photo = item.photo ? '<img class="item-photo" src="' + esc(item.photo) + '" alt="' + esc(item.name) + '">' : "";
  const description = item.description ? '<p class="meta">' + esc(item.description) + "</p>" : "";
  return '<article class="line" data-line data-item="' + esc(item.id) + '" data-restaurant="' + esc(restaurant.id) + '" data-name="' + esc(item.name) + '" data-price="' + esc(item.price) + '">'
    + photo
    + '<div class="item-title"><span class="item-copy"><h3>' + esc(item.name) + "</h3>" + description + "</span>"
    + priceStack(item.price, qty)
    + "</div></article>";
}

function renderMenu() {
  const root = document.querySelector("#menu-app");
  if (!root) return;
  const restaurant = findRestaurant(state, qs("id"));
  if (!restaurant) {
    root.innerHTML = '<p class="empty">Restoran bulunamadı.</p>';
    return;
  }
  const provinceClosed = !state.provinces[restaurant.province];
  const districtClosed = !provinceClosed && !restaurantAcceptsOrders(state, restaurant);
  const closed = provinceClosed || districtClosed;
  const gateways = enabledGateways(state);
  const lines = restaurant.menu.map(function (item) { return productCard(item, restaurant); }).join("");
  const alternatives = restaurant.extras.map(function (extra) { return lineCard(extra.name, extra.plus); }).join("");
  const pay = gateways.length
    ? gateways.map(function (item, index) {
      return '<label class="check"><input type="radio" name="gateway" value="' + esc(item.id) + '"' + (index === 0 ? " checked" : "") + "> " + esc(item.label) + "</label>";
    }).join("")
    : '<p class="notice warn">Yönetici henüz ödeme yöntemi açmadı.</p>';
  root.innerHTML = "<h1>" + esc(restaurant.name) + "</h1>"
    + (provinceClosed ? '<p class="notice warn">Bu il kapalı. Sipariş alınmıyor.</p>' : "")
    + (districtClosed ? '<p class="notice warn">Bu ilçe siparişe kapalı. Sipariş alınmıyor.</p>' : "")
    + '<p id="cart-status" class="notice" hidden></p>'
    + '<form data-form="checkout" data-restaurant="' + esc(restaurant.id) + '">'
    + (lines || '<p class="empty">Menüde henüz sabit ürün yok.</p>')
    + (alternatives ? '<h2>İçecekler</h2>' + alternatives : "")
    + '<section class="sheet"><h2>Ödeme</h2><p class="section-note">Deneme siparişi. Banka veya SMS yok.</p><div id="pay-list">' + pay + "</div>"
    + '<div class="total-row"><span>Toplam</span><strong id="menu-total">' + lira(0) + "</strong></div>"
    + '<p id="checkout-note" class="notice warn" hidden></p>'
    + '<button class="btn" type="submit"' + (closed ? " disabled" : "") + ">Ödemeyi onayla</button></section></form>";
}

function updateMenuTotal() {
  const form = document.querySelector('[data-form="checkout"]');
  const totalNode = document.querySelector("#menu-total");
  if (!form || !totalNode) return;
  const restaurant = findRestaurant(state, form.dataset.restaurant);
  let total = 0;
  form.querySelectorAll("[data-line]").forEach(function (row) {
    const qty = Number(row.querySelector("[data-qty]").textContent);
    if (!qty) return;
    let extra = 0;
    row.querySelectorAll("[data-extra]:checked").forEach(function (box) {
      const match = restaurant && restaurant.extras.filter(function (item) { return item.id === box.dataset.extra; })[0];
      if (match) extra += Number(match.plus);
    });
    total += (Number(row.dataset.price) + extra) * qty;
  });
  totalNode.textContent = lira(total);
}

function courierBlock(order) {
  const courier = courierPublic(state, order);
  if (!courier) return "";
  return '<div class="courier-box"><strong>' + esc(courier.company) + "</strong>"
    + "<p class=\"meta\">Kurye: " + esc(courier.name) + "</p>"
    + "<p class=\"meta\">Telefon: " + esc(courier.phone) + "</p></div>";
}

function splitPersonName(full) {
  const parts = String(full || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function orderCustomerName(order) {
  const first = String(order && order.customerFirstName || "").trim();
  const last = String(order && order.customerLastName || "").trim();
  if (first || last) return (first + " " + last).trim();
  const split = splitPersonName(order && order.customerName);
  return (split.firstName + " " + split.lastName).trim();
}

function customerPlaceText(state) {
  const session = state && state.session;
  const user = session && session.email
    ? (state.users || []).filter(function (item) { return item && item.email === session.email; })[0]
    : null;
  if (user && user.email === "musteri@harbiyemek7.com") return "Yıldız Mahallesi Görkem 4. Ara Sokak No 26";
  const address = (state.delivery && state.delivery.address) || (user && user.address) || "";
  const floor = (state.delivery && state.delivery.floor) || (user && user.floor) || "";
  const apartment = (state.delivery && state.delivery.apartment) || (user && user.apartment) || "";
  const parts = [];
  if (address) parts.push(address);
  if (floor) parts.push("Kat " + floor);
  if (apartment) parts.push("Daire " + apartment);
  if (user && user.district && parts.join(" ").indexOf(user.district) === -1) parts.push(user.district);
  if (user && user.province && parts.join(" ").indexOf(user.province) === -1) parts.push(user.province);
  return parts.join(", ");
}

function orderCustomerPlace(order) {
  const email = String(order && order.customerEmail || "").trim().toLowerCase();
  const name = String(order && order.customerName || "").trim();
  if (email === "musteri@harbiyemek7.com" || name === "Müşteri") return "Yıldız Mahallesi Görkem 4. Ara Sokak No 26";
  if (order && order.customerAddress) return order.customerAddress;
  const user = (state.users || []).filter(function (item) {
    return item && order && (item.email === order.customerEmail || item.name === order.customerName);
  })[0];
  if (!user) return "";
  return user.address || "";
}

function mapPoint(text, province) {
  const hay = String(text || "").toLocaleLowerCase("tr");
  if (hay.indexOf("görkem 4") !== -1) return { lat: 41.398443, lng: 27.3688424 };
  const district = matchDistrict(province || "Kırklareli", text || "");
  const bases = {
    "Lüleburgaz": [41.4046, 27.3564],
    "Kırklareli": [41.7351, 27.2256]
  };
  const base = bases[district] || bases[province] || bases["Lüleburgaz"];
  let n = 0;
  const seed = String(text || province || "yer");
  for (let i = 0; i < seed.length; i += 1) n = (n * 33 + seed.charCodeAt(i)) >>> 0;
  const angle = (n % 360) * Math.PI / 180;
  const km = 0.35 + (n % 10) / 10;
  const lat = base[0] + (Math.cos(angle) * km) / 110.574;
  const lng = base[1] + (Math.sin(angle) * km) / (111.32 * Math.cos(base[0] * Math.PI / 180));
  return { lat: lat, lng: lng };
}

function goMapHtml(title, address, province) {
  const point = mapPoint(address, province);
  const exact = String(address || "").toLocaleLowerCase("tr").indexOf("görkem 4") !== -1;
  const pad = exact ? 0.004 : 0.012;
  const bbox = [point.lng - pad, point.lat - pad, point.lng + pad, point.lat + pad].join(",");
  const src = "https://www.openstreetmap.org/export/embed.html?bbox=" + encodeURIComponent(bbox) + "&layer=mapnik&marker=" + encodeURIComponent(point.lat + "," + point.lng);
  return '<section class="go-map"><h3>' + esc(title) + "</h3>"
    + '<iframe title="' + esc(title) + '" src="' + esc(src) + '" loading="lazy"></iframe>'
    + (address ? '<p class="meta">' + esc(address) + "</p>" : "")
    + "</section>";
}

function googleMapsHref(address) {
  const place = address || "Yıldız Mahallesi Görkem 4. Ara Sokak No 26";
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
}

function customerMapLink(address) {
  const place = address || "Yıldız Mahallesi Görkem 4. Ara Sokak No 26";
  const href = googleMapsHref(place);
  return '<a class="map-symbol" href="' + esc(href) + '" aria-label="Müşteriye Git">'
    + '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.2A7.2 7.2 0 0 0 4.8 9.4c0 5.2 6.2 11.6 6.7 12.1a.7.7 0 0 0 1 0c.5-.5 6.7-6.9 6.7-12.1A7.2 7.2 0 0 0 12 2.2Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.2" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
    + "<span>Müşteriye Git</span></a>"
    + '<p class="meta">' + esc(place) + "</p>";
}

function courierGoMap(order) {
  const restaurant = findRestaurant(state, order.restaurantId);
  const province = (restaurant && restaurant.province) || order.province || "";
  const pickedUp = order.status === "teslim-alindi" || order.status === "yolda" || order.status === "teslim";
  if (pickedUp) return customerMapLink(orderCustomerPlace(order));
  if (order.status === "iptal" || order.status === "bekliyor") return "";
  return goMapHtml("Restorana Git", (restaurant && restaurant.address) || order.address || "", province);
}

function orderCard(order, mode) {
  const lines = order.lines.map(function (line) {
    const extras = (line.extras || []).map(function (extra) { return esc(extra.name) + " +" + lira(extra.plus); }).join(", ");
    return "<p class=\"meta\">" + line.qty + " × " + esc(line.name) + (extras ? " (" + extras + ")" : "") + " · " + lira(line.lineTotal) + "</p>";
  }).join("");
  let actions = "";
  if (mode === "restaurant" && order.status !== "iptal") {
    let buttons = "";
    if (order.status === "hazir" && order.deliveryMode === "kendi") {
      buttons += '<button class="btn" type="button" data-action="deliver" data-id="' + esc(order.id) + '">Teslim ettim</button>';
    } else if (order.status !== "teslim" && order.status !== "yolda" && order.status !== "teslim-alindi" && order.status !== "hazir") {
      const approved = order.status !== "yeni" ? " disabled" : "";
      buttons += '<button class="btn" type="button" data-action="approve-order" data-id="' + esc(order.id) + '"' + approved + ">Onayla</button>"
        + '<button class="btn" type="button" data-action="ready" data-id="' + esc(order.id) + '">Sipariş hazır</button>';
    }
    buttons += '<button class="btn ghost" type="button" data-action="cancel-order" data-id="' + esc(order.id) + '">İptal et</button>';
    actions = '<div class="actions">' + buttons + "</div>";
  }
  if (mode === "courier" && order.status !== "teslim") {
    const skip = '<button class="btn ghost" type="button" data-action="show-skip" data-id="' + esc(order.id) + '">Sektir</button>'
      + '<div class="skip-reasons" hidden>'
      + '<button class="btn ghost" type="button" data-action="skip-order" data-id="' + esc(order.id) + '" data-reason="Hastayım">Hastayım</button>'
      + '<button class="btn ghost" type="button" data-action="skip-order" data-id="' + esc(order.id) + '" data-reason="Kaza yaptım">Kaza yaptım</button>'
      + "</div>";
    if (order.status === "atandi") {
      actions = '<div class="actions"><button class="btn" type="button" data-action="accept" data-id="' + esc(order.id) + '">Kabul et</button>'
        + '<button class="btn ghost" type="button" data-action="decline" data-id="' + esc(order.id) + '">Reddet</button>'
        + skip + "</div>";
    } else {
      actions = '<div class="actions">'
        + stepButton(order, "teslim-alindi", "Teslim aldım")
        + stepButton(order, "yolda", "Yola çıktım")
        + stepButton(order, "teslim", "Teslim ettim")
        + skip
        + "</div>";
    }
  }
  const pickedUp = order.status === "teslim-alindi" || order.status === "yolda" || order.status === "teslim";
  const payer = mode === "restaurant"
    ? orderCustomerName(order)
    : (mode === "courier" && pickedUp ? (orderCustomerPlace(order) || order.address) : order.address);
  return '<article class="order"><h3>' + esc(order.restaurantName) + "</h3>"
    + "<p>" + esc(statusText(order)) + "</p>"
    + lines
    + '<p class="meta">' + esc(payer) + " · " + esc(order.gatewayLabel) + (order.deliveryLabel ? " · " + esc(order.deliveryLabel) : "") + "</p>"
    + '<div class="total-row"><span>Toplam</span><strong>' + lira(order.total) + "</strong></div>"
    + (mode === "restaurant" ? '<p style="margin:8px 0 0"><span class="commission">Ciro ' + lira(orderMoney(order).total) + " · " + esc(commissionText()) + " " + lira(orderMoney(order).commission) + " · Kazanç " + lira(orderMoney(order).net) + "</span></p>" : "")
    + courierBlock(order)
    + actions
    + (mode === "courier" ? courierGoMap(order) : "")
    + "</article>";
}

function stepButton(order, step, label) {
  const enabled = (step === "teslim-alindi" && order.status === "hazir")
    || (step === "yolda" && order.status === "teslim-alindi")
    || (step === "teslim" && order.status === "yolda");
  return '<button class="btn" type="button" data-action="step" data-step="' + step + '" data-id="' + esc(order.id) + '"' + (enabled ? "" : " disabled") + ">" + label + "</button>";
}

function renderOrder() {
  const root = document.querySelector("#order-app");
  if (!root) return;
  const order = findOrder(state, qs("id"));
  root.innerHTML = order
    ? '<p class="notice">Siparişiniz onaylandı</p>' + orderCard(order, "customer")
    : '<p class="empty">Sipariş bulunamadı.</p>';
}

function renderCart() {
  const root = document.querySelector("#cart-app");
  if (!root) return;
  const lines = state.cart || [];
  if (!lines.length) {
    root.innerHTML = '<p id="cart-note" class="notice" hidden></p><p class="empty">Sepet boş.</p>';
    return;
  }
  const gateways = enabledGateways(state);
  const pay = gateways.length
    ? gateways.map(function (item, index) {
      return '<label class="check"><input type="radio" name="gateway" value="' + esc(item.id) + '"' + (index === 0 ? " checked" : "") + "> " + esc(item.label) + "</label>";
    }).join("")
    : '<p class="notice warn">Yönetici henüz ödeme yöntemi açmadı.</p>';
  const cards = lines.map(function (line) {
    const seller = findRestaurant(state, line.restaurantId) || findShop(line.restaurantId);
    const photo = line.photo ? '<img class="item-photo" src="' + esc(line.photo) + '" alt="">' : "";
    return '<article class="order">' + photo + "<h3>" + esc(line.name) + "</h3>"
      + '<p class="meta">' + esc(seller ? seller.name : "") + " · " + line.qty + " adet</p>"
      + '<p class="price">' + lira(line.price * line.qty) + "</p></article>";
  }).join("");
  root.innerHTML = '<p id="cart-note" class="notice" hidden></p>' + cards
    + '<form data-form="cart-checkout" class="sheet"><h2>Ödeme</h2><div id="pay-list">' + pay + "</div>"
    + '<button class="btn" type="submit"' + (gateways.length ? "" : " disabled") + ">Ödemeyi onayla</button></form>";
}

function renderOrders() {
  const root = document.querySelector("#orders-app");
  if (!root) return;
  root.innerHTML = state.orders.length
    ? state.orders.map(function (order) {
      return '<a class="order" style="display:block;text-decoration:none;color:inherit" href="siparis.html?id=' + encodeURIComponent(order.id) + '"><strong>' + esc(order.restaurantName) + "</strong><p class=\"meta\">" + esc(statusText(order)) + " · " + lira(order.total) + "</p></a>";
    }).join("")
    : '<p class="empty">Bu tarayıcıda sipariş yok.</p>';
}

let payoutPainted = false;

function renderShopOwner(shop) {
  const root = document.querySelector("#restaurant-app");
  if (!root) return;
  if (!payoutPainted) {
    payoutPainted = true;
    root.innerHTML = "<h1>" + esc(shop.name) + "</h1>"
      + ibanSheet(shop.iban)
      + '<section class="sheet"><h2>Ürün ekle</h2>'
      + productFormHtml()
      + '<div id="menu-list" style="margin-top:16px"></div></section>';
  }
  paintCategorySelect(sellerKind(shop));
  paintOwnerMenu(shop);
}

function renderRestaurant() {
  const root = document.querySelector("#restaurant-app");
  if (!root) return;
  const seller = currentSeller();
  if (!seller) {
    root.innerHTML = '<p class="empty">Restoran girişi gerekli. <a href="giris.html">Giriş Yap</a></p>';
    return;
  }
  if (sellerKind(seller) !== "restoran") {
    renderShopOwner(seller);
    return;
  }
  const restaurant = seller;
  if (!payoutPainted) {
    payoutPainted = true;
    const district = restaurant.district || matchDistrict(restaurant.province, restaurant.address);
    const admin = hasAdminSession();
    const back = !admin ? "" : district
      ? '<p class="admin-entry"><a href="ilce.html?il=' + encodeURIComponent(restaurant.province) + "&ilce=" + encodeURIComponent(district) + '">İlçeye dön</a></p>'
      : '<p class="admin-entry"><a href="il.html?il=' + encodeURIComponent(restaurant.province) + '">İle dön</a></p>';
    const eyebrow = admin ? '<p class="eyebrow">' + esc(restaurant.province) + "</p>" : "";
    const mode = deliveryModeOf(restaurant);
    root.innerHTML = back + eyebrow + "<h1>" + esc(restaurant.name) + "</h1>"
      + '<p style="margin:0 0 22px"><span class="commission">' + esc(commissionText()) + "</span></p>"
      + ibanSheet(restaurant.payoutIban || restaurant.iban)
      + '<div class="ops-row">'
      + '<div class="ops-stack">'
      + '<section class="sheet"><h2>Kazanç</h2><p class="section-note">Günlük, haftalık ve aylık.</p>'
      + '<button class="btn" type="button" data-action="open-earnings">Kazancı aç</button></section>'
      + '<section class="sheet"><h2>Teslimat</h2>'
      + '<p class="section-note">Siparişler bu seçimle gider. Seçim bu tarayıcıda kalır.</p>'
      + '<div class="delivery-grid" role="radiogroup" aria-label="Teslimat">'
      + '<label class="gateway-row"><span>Kendi Kuryemle</span><input type="radio" name="deliveryMode" value="kendi"' + (mode === "kendi" ? " checked" : "") + "></label>"
      + '<label class="gateway-row"><span>Harbi Kurye İle Teslimat</span><input type="radio" name="deliveryMode" value="harbi"' + (mode === "harbi" ? " checked" : "") + "></label>"
      + '</div><p id="delivery-note" class="notice" hidden></p></section>'
      + "</div>"
      + '<section class="sheet"><h2>Gelen siparişler</h2><div id="restaurant-orders"></div></section>'
      + '<section class="sheet"><h2>İptal edilenler</h2><div id="restaurant-cancelled"></div></section>'
      + "</div>"
      + '<dialog id="earnings-dialog" class="earnings-dialog"><div id="restaurant-earnings"></div>'
      + '<button class="btn ghost" type="button" data-action="close-earnings">Kapat</button></dialog>'
      + '<section class="sheet"><h2>Ürün ekle</h2>'
      + productFormHtml()
      + '<div id="menu-list" style="margin-top:16px"></div></section>'
      + '<section class="sheet"><h2>Alternatif ürün</h2><p class="section-note">Artı fiyat, seçilince ürünün üstüne eklenir.</p>'
      + '<form data-form="add-extra"><label class="field">Ürün adı<input name="ad" required></label>'
      + '<label class="field">Artı fiyat (₺)<input name="fiyat" type="number" min="0" step="1" required></label>'
      + '<p id="extra-note" class="notice warn" hidden></p><button class="btn" type="submit">Ekle</button></form>'
      + '<div id="extra-list" style="margin-top:16px"></div></section>'
      + '<section class="sheet"><h2>Ödeme bilgisi</h2><p class="section-note">Tahsilatın gitmesini istediğiniz IBAN ve adres. Bankaya bağlanmaz.</p>'
      + '<form data-form="save-payout"><label class="field">IBAN<input name="iban" data-payout value="' + esc(restaurant.payoutIban) + '"></label>'
      + '<label class="field">Adres<textarea name="adres" data-payout rows="3" style="width:100%;border-radius:16px;border:1px solid #e4d5c6;padding:14px 16px;font:inherit">' + esc(restaurant.payoutAddress) + "</textarea></label>"
      + '<button class="btn" type="submit">Kaydet</button></form>'
      + '<p id="saved-note" class="notice"' + (restaurant.payoutSaved ? "" : " hidden") + ">Kaydedildi</p></section>";
  }
  paintEarnings(restaurant);
  paintCategorySelect("restoran");
  paintOwnerMenu(restaurant);
  const mine = state.orders.filter(function (order) { return order.restaurantId === restaurant.id; });
  const incoming = mine.filter(function (order) { return order.status !== "iptal"; });
  const cancelled = mine.filter(function (order) { return order.status === "iptal"; });
  const orders = document.querySelector("#restaurant-orders");
  const cancelledRoot = document.querySelector("#restaurant-cancelled");
  if (orders) orders.innerHTML = incoming.length ? incoming.map(function (order) { return orderCard(order, "restaurant"); }).join("") : '<p class="empty">Gelen sipariş yok.</p>';
  if (cancelledRoot) cancelledRoot.innerHTML = cancelled.length ? cancelled.map(function (order) { return orderCard(order, "restaurant"); }).join("") : '<p class="empty">İptal edilen sipariş yok.</p>';
  const extras = document.querySelector("#extra-list");
  if (extras) {
    extras.innerHTML = restaurant.extras.length
      ? restaurant.extras.map(function (extra) {
        return '<div class="province-row"><span>' + esc(extra.name) + " · +" + lira(extra.plus) + "</span>"
          + '<button class="btn ghost" type="button" data-action="remove-extra" data-id="' + esc(extra.id) + '">Sil</button></div>';
      }).join("")
      : '<p class="empty">Alternatif ürün yok.</p>';
  }
  const saved = document.querySelector("#saved-note");
  if (saved && document.activeElement && document.activeElement.matches && document.activeElement.matches("[data-payout]")) return;
  if (saved) saved.hidden = !restaurant.payoutSaved;
}

function provinceSelectHtml() {
  return '<option value="">İl seçin</option>' + PROVINCES.map(function (name) {
    return '<option value="' + esc(name) + '">' + esc(name) + "</option>";
  }).join("");
}

function renderCourier() {
  const root = document.querySelector("#courier-app");
  if (!root) return;
  const session = state.session;
  if (!session || session.role !== "kurye") {
    root.innerHTML = '<p class="eyebrow">Harbi Kuryeler</p><h1>Kurye</h1>'
      + '<section class="sheet"><h2>Kurye girişi</h2>'
      + '<p class="section-note">Onaylı kurye buradan girer ve yalnız kendi şehrindeki siparişi görür.</p>'
      + '<p id="courier-login-note" class="notice warn" hidden></p>'
      + '<form data-form="login-courier-account"><label class="field">E-posta<input type="email" name="eposta" autocomplete="username" required></label>'
      + '<label class="field">Şifre<input type="password" name="sifre" autocomplete="current-password" required></label>'
      + '<button class="btn" type="submit">Giriş Yap</button></form></section>'
      + '<section class="sheet"><h2>Kurye başvurusu</h2>'
      + '<p class="section-note">Başvuru bu tarayıcıda kalır. Harbi Kurye yönetimi onaylayınca giriş açılır.</p>'
      + '<p id="courier-apply-note" class="notice" hidden></p>'
      + '<form data-form="courier-apply"><label class="field">Ad soyad<input name="ad" required></label>'
      + '<label class="field">Telefon<input name="telefon" required></label>'
      + '<label class="field">Mail<input type="email" name="eposta" required></label>'
      + '<label class="field">Şifre<input type="password" name="sifre" required></label>'
      + '<label class="field">Şehir<select name="il" required>' + provinceSelectHtml() + "</select></label>"
      + '<label class="field">Profil resmi<input name="resim" type="file" accept="image/*" required></label>'
      + '<button class="btn" type="submit">Başvur</button></form></section>';
    return;
  }
  const courier = findCourier(state, session.courierId);
  const city = courier ? courier.province : "";
  const mine = state.orders.filter(function (order) {
    return order.courierId === session.courierId && order.status !== "bekliyor" && order.province === city;
  });
  const openOrders = mine.filter(function (order) { return order.status !== "teslim"; });
  const delivered = mine.filter(function (order) { return order.status === "teslim"; });
  root.innerHTML = '<p class="eyebrow">Harbi Kuryeler</p><h1>' + esc(courier ? courier.name : "Kurye") + "</h1>"
    + '<p class="section-note">' + esc(courier ? courier.phone : "") + (city ? " · " + esc(city) : "") + "</p>"
    + '<p class="section-note">Yalnızca ' + esc(city || "bulunduğunuz şehir") + " siparişleri gelir.</p>"
    + '<section class="sheet"><h2>IBAN</h2>'
    + '<form data-form="save-courier-iban"><label class="field">IBAN<input name="iban" autocomplete="off" value="' + esc(courier ? courier.iban : "") + '"></label>'
    + '<p id="courier-iban-note" class="notice" hidden></p>'
    + '<button class="btn" type="submit">Kaydet</button></form></section>'
    + '<section class="sheet">'
    + courierEarningRow("day", "Günlük kazanç", courierEarningAmount(delivered, "day"))
    + courierEarningRow("week", "Haftalık kazanç", courierEarningAmount(delivered, "week"))
    + courierEarningRow("month", "Aylık kazanç", courierEarningAmount(delivered, "month"))
    + "</section>"
    + (openOrders.length ? openOrders.map(function (order) { return orderCard(order, "courier"); }).join("") : '<p class="empty">Size atanmış sipariş yok.</p>')
    + '<section class="sheet"><h2><button class="section-toggle" type="button" data-action="toggle-delivered" aria-expanded="' + (deliveredListOpen ? "true" : "false") + '">Teslim edildi</button></h2>'
    + '<div id="delivered-orders"' + (deliveredListOpen ? "" : " hidden") + ">"
    + (delivered.length ? delivered.map(function (order) { return orderCard(order, "courier"); }).join("") : '<p class="empty">Teslim edilen sipariş yok.</p>')
    + "</div></section>";
}

var deliveredListOpen = false;
var courierEarningOpen = { day: false, week: false, month: false };

var courierEditId = "";

function courierNameParts(courier) {
  const first = String(courier && courier.firstName || "").trim();
  const last = String(courier && courier.lastName || "").trim();
  if (first || last) return { firstName: first, lastName: last };
  return splitPersonName(courier && courier.name);
}

function courierEditForm(courier) {
  const parts = courierNameParts(courier);
  return '<form class="courier-edit" data-form="edit-courier" data-id="' + esc(courier.id) + '">'
    + '<p id="edit-courier-note" class="notice warn" hidden></p>'
    + '<label class="field">Ad<input name="isim" required value="' + esc(parts.firstName) + '"></label>'
    + '<label class="field">Soyad<input name="soyisim" required value="' + esc(parts.lastName) + '"></label>'
    + '<label class="field">Telefon<input name="telefon" required value="' + esc(courier.phone || "") + '"></label>'
    + '<label class="field">Adres<textarea name="adres" rows="3" required>' + esc(courier.address || "") + "</textarea></label>"
    + '<label class="field">Mail<input type="email" name="eposta" required value="' + esc(courier.email || "") + '"></label>'
    + '<label class="field">Şifre<input name="sifre" required value="' + esc(courier.password || "") + '"></label>'
    + '<button class="btn" type="submit">Kaydet</button></form>';
}

function renderCourierAdmin() {
  const root = document.querySelector("#courier-admin-app");
  if (!root) return;
  if (!state.session || state.session.role !== "kurye-yonetim") {
    location.replace("giris.html");
    return;
  }
  const mode = luleburgazMode(state);
  const pending = state.courierApplications.filter(function (item) { return item.status !== "onayli"; });
  const approved = state.couriers.filter(function (courier) { return courier.approved !== false; });
  const openOrders = state.orders.filter(function (order) {
    return order.deliveryMode !== "kendi" && (order.status === "bekliyor" || order.status === "atandi") && isLuleburgazPlace(orderPlace(state, order));
  });
  const applications = pending.length
    ? pending.map(function (item) {
      const photo = item.photo ? '<img class="item-photo" src="' + esc(item.photo) + '" alt="">' : "";
      return '<article class="order">' + photo + "<h3>" + esc(item.name) + "</h3>"
        + '<p class="meta">' + esc(item.province) + " · " + esc(item.phone) + " · " + esc(item.email) + "</p>"
        + '<div class="actions"><button class="btn" type="button" data-action="approve-application" data-id="' + esc(item.id) + '">Onayla</button></div></article>';
    }).join("")
    : '<p class="empty">Bekleyen başvuru yok.</p>';
  const approvedHtml = approved.length
    ? approved.map(function (courier) {
      const photo = courier.photo ? '<img class="item-photo" src="' + esc(courier.photo) + '" alt="">' : "";
      const docs = (courier.residence ? '<a href="' + esc(courier.residence) + '" download="ikametgah">İkametgah belgesi</a>' : "")
        + (courier.residence && courier.criminalRecord ? " · " : "")
        + (courier.criminalRecord ? '<a href="' + esc(courier.criminalRecord) + '" download="sabika-kaydi">Sabıka kaydı</a>' : "");
      return '<div class="province-row">' + photo + "<span>" + esc(courier.name)
        + (courier.phone ? " · " + esc(courier.phone) : "")
        + (courier.email ? " · " + esc(courier.email) : "")
        + (courier.tc ? " · TC " + esc(courier.tc) : "")
        + (courier.address ? "<br>" + esc(courier.address) : "")
        + (docs ? "<br>" + docs : "")
        + '</span><span class="meta">' + esc(courier.province || "Şehir yok") + "</span>"
        + '<div class="actions"><button class="btn ghost" type="button" data-action="edit-courier" data-id="' + esc(courier.id) + '">Kurye bilgileri düzenle</button>'
        + '<button class="btn ghost" type="button" data-action="delete-courier" data-id="' + esc(courier.id) + '">Kurye sil</button></div>'
        + (courierEditId === courier.id ? courierEditForm(courier) : "")
        + "</div>";
    }).join("")
    : '<p class="empty">Onaylı kurye yok.</p>';
  const lulePool = state.couriers.filter(courierServesLuleburgaz);
  let manualHtml = "";
  if (mode === "manuel") {
    manualHtml = openOrders.length
      ? openOrders.map(function (order) {
        const choices = lulePool.length
          ? '<label class="field">Kurye<select>' + lulePool.map(function (courier) {
            return '<option value="' + esc(courier.id) + '"' + (courier.id === order.courierId ? " selected" : "") + ">" + esc(courier.name) + "</option>";
          }).join("") + "</select></label>"
          + '<button class="btn" type="button" data-action="manual-assign" data-id="' + esc(order.id) + '">Ata</button>'
          : '<p class="meta">Lüleburgaz’da onaylı kurye yok.</p>';
        return '<article class="order" data-order="' + esc(order.id) + '"><h3>' + esc(order.restaurantName) + "</h3>"
          + '<p class="meta">Lüleburgaz · ' + esc(statusText(order)) + "</p>"
          + choices + "</article>";
      }).join("")
      : '<p class="empty">Atanacak Lüleburgaz siparişi yok.</p>';
  }
  root.innerHTML = '<p class="eyebrow">Harbi Kuryeler</p><h1>Harbi Kurye yönetimi</h1>'
    + '<p class="section-note">Ayarlar ve onaylar bu tarayıcıda kalır. Onaylı kurye yalnız kendi şehrindeki siparişi alır.</p>'
    + '<section class="sheet"><h2>Sipariş atama</h2>'
    + '<p class="section-note">Yalnızca Lüleburgaz. Tıklayınca otomatik, tekrar tıklayınca manuel.</p>'
    + '<button type="button" class="btn" data-action="toggle-luleburgaz-assign" aria-pressed="' + (mode === "otomatik" ? "true" : "false") + '">Lüleburgaz: ' + (mode === "manuel" ? "Manuel" : "Otomatik") + "</button>"
    + manualHtml + "</section>"
    + '<section class="sheet"><h2>Kurye ekle</h2>'
    + '<p class="section-note">İsim, soyisim, telefon, adres, resim, TC, ikametgah belgesi ve sabıka kaydı zorunlu. Biri boşsa kaydedilmez. Kayıt ve belgeler bu tarayıcıda kalır. Adresin sonuna ili yazın; kurye yalnız o şehirdeki siparişi alır.</p>'
    + '<p id="add-courier-note" class="notice" hidden></p>'
    + '<form data-form="add-courier">'
    + '<label class="field">İsim<input name="isim" required></label>'
    + '<label class="field">Soyisim<input name="soyisim" required></label>'
    + '<label class="field">Telefon<input name="telefon" required></label>'
    + '<label class="field">Adres<textarea name="adres" rows="3" required></textarea></label>'
    + '<label class="field">Resim<input name="resim" type="file" accept="image/*" required></label>'
    + '<label class="field">TC<input name="tc" inputmode="numeric" required></label>'
    + '<label class="field">İkametgah belgesi<input name="ikametgah" type="file" accept="image/*,.pdf" required></label>'
    + '<label class="field">Sabıka kaydı<input name="sabika" type="file" accept="image/*,.pdf" required></label>'
    + '<button class="btn" type="submit">Kaydet</button></form></section>'
    + '<section class="sheet"><h2>Kurye başvuruları</h2>' + applications + "</section>"
    + '<section class="sheet"><h2>Onaylı kuryeler</h2>' + approvedHtml + "</section>";
}

function renderLogin() {
  const restaurants = document.querySelector("#restaurant-select");
  const couriers = document.querySelector("#courier-select");
  if (restaurants) {
    const current = restaurants.value;
    restaurants.innerHTML = state.restaurants.length
      ? state.restaurants.map(function (restaurant) {
        return '<option value="' + esc(restaurant.id) + '">' + esc(restaurant.name) + " · " + esc(restaurant.province) + "</option>";
      }).join("")
      : '<option value="">Restoran yok</option>';
    if (current) restaurants.value = current;
  }
  if (couriers) {
    couriers.innerHTML = state.couriers.map(function (courier) {
      return '<option value="' + esc(courier.id) + '">' + esc(courier.name) + " — " + esc(courier.company) + "</option>";
    }).join("");
  }
  const email = document.querySelector('[data-form="login-customer"] [name="eposta"]');
  const remember = document.querySelector('[data-form="login-customer"] [name="hatirla"]');
  if (email && state.rememberEmail) {
    email.value = state.rememberEmail;
    if (remember) remember.checked = true;
  }
}

if (typeof document !== "undefined") boot();
if (typeof globalThis !== "undefined") globalThis.Harbi = Harbi;
