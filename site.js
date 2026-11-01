"use strict";

const KEY = "harbi-yemek-7";
const COMMISSION = 0.05;

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

const GATEWAYS = [
  { id: "kredi-karti", label: "Kredi kartı", group: "Ödeme", on: true },
  { id: "nakit", label: "Nakit", group: "Ödeme", on: true },
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
  { id: "k-ayse", name: "Ayşe Demir", phone: "0532 111 22 33", company: "Harbi Kuryeler" },
  { id: "k-mehmet", name: "Mehmet Kaya", phone: "0533 444 55 66", company: "Harbi Kuryeler" }
];

const COURIER_VISIBLE = { kabul: 1, hazir: 1, "teslim-alindi": 1, yolda: 1, teslim: 1 };

const STATUS_TEXT = {
  atandi: "Kurye atandı, onay bekleniyor",
  kabul: "Kurye kabul etti",
  hazir: "Restoran hazır",
  "teslim-alindi": "Kurye teslim aldı",
  yolda: "Yola çıktı",
  teslim: "Teslim edildi",
  bekliyor: "Uygun kurye yok"
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
    courierTurn: 0,
    session: null
  };
}

function seedRestaurants() {
  return [
    {
      id: "r-trakya", province: "Kırklareli", name: "Trakya Ocakbaşı", cuisine: "Izgara",
      address: "Kurtuluş Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 01",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#b4532a", eta: "30–45 dk", min: 200,
      extras: [], menu: [{ id: "m-adana", name: "Adana kebap", price: 280 }]
    },
    {
      id: "r-pide", province: "Kırklareli", name: "Mahalle Pidecisi", cuisine: "Pide",
      address: "Yıldız Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 02",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#c4923a", eta: "20–35 dk", min: 120,
      extras: [], menu: [
        { id: "m-pide", name: "Kaşarlı pide", price: 220 },
        { id: "m-kunefe", name: "Künefe", price: 160 }
      ]
    },
    {
      id: "r-balkan", province: "Kırklareli", name: "Balkan Sofrası", cuisine: "Ev yemeği",
      address: "Barış Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 03",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#3f6b4e", eta: "25–40 dk", min: 150,
      extras: [], menu: [
        { id: "m-fasulye", name: "Kuru fasulye, pilav", price: 175 },
        { id: "m-salata", name: "Çoban salata", price: 85 }
      ]
    },
    {
      id: "r-firin", province: "Kırklareli", name: "İstasyon Fırını", cuisine: "Fırın",
      address: "İstasyon Mah. Lüleburgaz", iban: "TR00 0000 0000 0000 0000 0000 04",
      payoutIban: "", payoutAddress: "", payoutSaved: false, color: "#a33b32", eta: "15–30 dk", min: 90,
      extras: [], menu: [{ id: "m-lahmacun", name: "Lahmacun", price: 95 }]
    }
  ];
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
  if (!Array.isArray(next.users)) next.users = [];
  if (!Array.isArray(next.orders)) next.orders = [];
  if (!Array.isArray(next.couriers) || !next.couriers.length) next.couriers = COURIERS.map(function (item) { return Object.assign({}, item); });
  if (typeof next.courierTurn !== "number") next.courierTurn = 0;
  next.restaurants.forEach(function (restaurant) {
    if (!Array.isArray(restaurant.extras)) restaurant.extras = [];
    if (!Array.isArray(restaurant.menu)) restaurant.menu = [];
    if (typeof restaurant.payoutIban !== "string") restaurant.payoutIban = "";
    if (typeof restaurant.payoutAddress !== "string") restaurant.payoutAddress = "";
    if (typeof restaurant.payoutSaved !== "boolean") restaurant.payoutSaved = false;
  });
  return next;
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
  const q = (query || "").trim().toLocaleLowerCase("tr");
  return state.restaurants.filter(function (restaurant) {
    if (!state.provinces[restaurant.province]) return false;
    if (!q) return true;
    const blob = [restaurant.name, restaurant.cuisine, restaurant.address, restaurant.province].join(" ").toLocaleLowerCase("tr");
    return blob.indexOf(q) !== -1;
  });
}

function findRestaurant(state, id) {
  return state.restaurants.filter(function (item) { return item.id === id; })[0] || null;
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

function enabledGateways(state) {
  return GATEWAYS.filter(function (item) { return state.gateways[item.id]; });
}

function assignCourier(state, order) {
  const pool = state.couriers;
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
    if (!declined[courier.id]) {
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

function placeOrder(state, input) {
  const restaurant = findRestaurant(state, input.restaurantId);
  if (!restaurant) throw new Error("Restoran yok");
  if (!state.provinces[restaurant.province]) throw new Error("İl kapalı");
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
  const order = {
    id: uid("s"),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    province: restaurant.province,
    address: restaurant.address,
    lines: savedLines,
    total: total,
    commissionRate: COMMISSION,
    commission: Math.round(total * COMMISSION),
    gatewayId: input.gatewayId,
    gatewayLabel: gatewayLabel(input.gatewayId),
    courierId: null,
    status: "atandi",
    declinedBy: [],
    createdAt: new Date().toISOString(),
    customerName: (state.session && state.session.name) || "Misafir"
  };
  assignCourier(state, order);
  state.orders.unshift(order);
  return order;
}

function acceptOrder(state, orderId, courierId) {
  const order = findOrder(state, orderId);
  if (!order || order.status !== "atandi" || order.courierId !== courierId) return order;
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

function markReady(state, orderId, restaurantId) {
  const order = findOrder(state, orderId);
  if (!order || order.restaurantId !== restaurantId || order.status !== "kabul") return order;
  order.status = "hazir";
  return order;
}

function courierStep(state, orderId, courierId, step) {
  const order = findOrder(state, orderId);
  if (!order || order.courierId !== courierId) return order;
  const allowed = (step === "teslim-alindi" && order.status === "hazir")
    || (step === "yolda" && order.status === "teslim-alindi")
    || (step === "teslim" && order.status === "yolda");
  if (allowed) order.status = step;
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

function render() {
  const page = pageRoot();
  if (page === "home") renderHome();
  else if (page === "admin") renderAdmin();
  else if (page === "city") renderCity();
  else if (page === "menu") renderMenu();
  else if (page === "order") renderOrder();
  else if (page === "orders") renderOrders();
  else if (page === "restaurant") renderRestaurant();
  else if (page === "courier") renderCourier();
  else if (page === "login") renderLogin();
}

function boot() {
  state = load();
  save(state);
  const query = qs("q");
  const search = document.querySelector("#q");
  if (search && query) search.value = query;
  render();
  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", onInput);
  window.addEventListener("storage", function (event) {
    if (event.key !== KEY) return;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT")) return;
    state = load();
    render();
  });
}

function onClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
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
  if (action === "qty") {
    const line = button.closest("[data-line]");
    const node = line.querySelector("[data-qty]");
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
  if (action === "accept") return mutateCourier(button.dataset.id, "accept");
  if (action === "decline") return mutateCourier(button.dataset.id, "decline");
  if (action === "ready") return mutateRestaurant(button.dataset.id);
  if (action === "step") return mutateCourier(button.dataset.id, button.dataset.step);
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
  if (kind === "login-restaurant") return submitRestaurantLogin(form);
  if (kind === "login-courier") return submitCourierLogin(form);
  if (kind === "add-restaurant") return submitRestaurant(form);
  if (kind === "add-extra") return submitExtra(form);
  if (kind === "save-payout") return submitPayout(form);
  if (kind === "checkout") return submitCheckout(form);
}

function note(id, text, ok) {
  const node = document.querySelector(id);
  if (!node) return;
  node.hidden = false;
  node.textContent = text;
  node.className = ok ? "notice" : "notice warn";
}

function submitSignup(form) {
  const name = form.ad.value.trim();
  const email = form.eposta.value.trim().toLocaleLowerCase("tr");
  const password = form.sifre.value;
  if (!name || !email || !password) {
    note("#signup-note", "Ad, e-posta ve şifre gerekli.", false);
    return;
  }
  if (state.users.some(function (user) { return user.email === email; })) {
    note("#signup-note", "Bu e-posta ile kayıt var.", false);
    return;
  }
  state.users.push({ id: uid("u"), name: name, email: email, password: password });
  persist();
  note("#signup-note", "Kaydedildi", true);
}

function submitCustomer(form) {
  const email = form.eposta.value.trim().toLocaleLowerCase("tr");
  const password = form.sifre.value;
  const user = state.users.filter(function (item) { return item.email === email && item.password === password; })[0];
  if (!user) {
    note("#customer-note", "E-posta veya şifre uyuşmadı.", false);
    return;
  }
  state.session = { role: "musteri", name: user.name, email: user.email };
  persist();
  location.href = "siparisler.html";
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
  if (!courier) return;
  state.session = { role: "kurye", courierId: courier.id, name: courier.name };
  persist();
  location.href = "kurye.html";
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
  const id = state.session && state.session.role === "restoran" ? state.session.restaurantId : "";
  return findRestaurant(state, id);
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

function submitPayout(form) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  restaurant.payoutIban = form.iban.value.trim();
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
    lines.push({ name: row.dataset.name, price: Number(row.dataset.price), qty: qty, extras: extras });
  });
  if (!lines.length) {
    note("#checkout-note", "Bir ürün seçin.", false);
    return;
  }
  const order = placeOrder(state, { restaurantId: restaurant.id, lines: lines, gatewayId: gateway });
  persist();
  location.href = "siparis.html?id=" + encodeURIComponent(order.id);
}

function mutateCourier(orderId, step) {
  const courierId = state.session && state.session.courierId;
  if (!courierId) return;
  if (step === "accept") acceptOrder(state, orderId, courierId);
  else if (step === "decline") declineOrder(state, orderId, courierId);
  else courierStep(state, orderId, courierId, step);
  persist();
  renderCourier();
}

function mutateRestaurant(orderId) {
  const restaurant = currentRestaurant();
  if (!restaurant) return;
  markReady(state, orderId, restaurant.id);
  persist();
  renderRestaurant();
}

function renderHome() {
  const query = qs("q");
  const restaurants = openRestaurants(state, query);
  const grid = document.querySelector("#restaurants");
  const dishes = document.querySelector("#dishes");
  const empty = document.querySelector("#empty-restaurants");
  if (!grid || !dishes) return;
  if (!restaurants.length) {
    grid.innerHTML = "";
    dishes.innerHTML = "";
    if (empty) {
      empty.hidden = false;
      empty.textContent = query ? "Bu aramaya uygun restoran yok." : "Şu an siparişe açık restoran yok.";
    }
    return;
  }
  if (empty) empty.hidden = true;
  grid.innerHTML = restaurants.map(function (restaurant) {
    return '<a class="rest" href="menu.html?id=' + encodeURIComponent(restaurant.id) + '">'
      + '<div class="swatch" style="--c:' + esc(restaurant.color || "#b4532a") + '">' + esc(restaurant.cuisine) + "</div>"
      + '<div class="body"><h3>' + esc(restaurant.name) + "</h3>"
      + '<p class="meta">' + esc(restaurant.cuisine) + " · " + esc(restaurant.address) + "</p>"
      + '<p class="meta">' + esc(restaurant.province) + (restaurant.eta ? " · " + esc(restaurant.eta) : "") + (restaurant.min ? " · Min. " + lira(restaurant.min) : "") + "</p>"
      + "</div></a>";
  }).join("");
  const items = [];
  restaurants.forEach(function (restaurant) {
    restaurant.menu.forEach(function (item) {
      const blob = (item.name + " " + restaurant.name).toLocaleLowerCase("tr");
      if (query && blob.indexOf(query.trim().toLocaleLowerCase("tr")) === -1 && (restaurant.name + " " + restaurant.cuisine).toLocaleLowerCase("tr").indexOf(query.trim().toLocaleLowerCase("tr")) === -1) return;
      items.push({ item: item, restaurant: restaurant });
    });
  });
  dishes.innerHTML = items.map(function (entry) {
    return "<li><a href=\"menu.html?id=" + encodeURIComponent(entry.restaurant.id) + "\">"
      + "<span><strong>" + esc(entry.item.name) + "</strong><p class=\"meta\">" + esc(entry.restaurant.name) + "</p></span>"
      + "<span class=\"price\">" + lira(entry.item.price) + "</span></a></li>";
  }).join("");
}

function switchButton(on, attrs, label) {
  return '<button type="button" class="switch" role="switch" aria-checked="' + (on ? "true" : "false") + '" aria-label="' + esc(label) + '" ' + attrs + "></button>";
}

function renderAdmin() {
  const list = document.querySelector("#provinces");
  if (!list) return;
  list.innerHTML = PROVINCES.map(function (name) {
    const on = !!state.provinces[name];
    return '<div class="province-row"><a href="il.html?il=' + encodeURIComponent(name) + '">' + esc(name) + "</a>"
      + switchButton(on, 'data-action="toggle-province" data-province="' + esc(name) + '"', name + (on ? " açık" : " kapalı"))
      + "</div>";
  }).join("");
  renderGateways();
  renderAdminRestaurants();
}

function renderGateways() {
  const root = document.querySelector("#gateways");
  if (!root) return;
  let html = "";
  let group = "";
  GATEWAYS.forEach(function (item) {
    if (item.group !== group) {
      group = item.group;
      html += '<p class="group-label">' + esc(group) + "</p>";
    }
    const on = !!state.gateways[item.id];
    html += '<div class="gateway-row"><span>' + esc(item.label) + "</span>"
      + switchButton(on, 'data-action="toggle-gateway" data-gateway="' + esc(item.id) + '"', item.label + (on ? " açık" : " kapalı"))
      + "</div>";
  });
  root.innerHTML = html;
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

function renderCity() {
  const name = qs("il");
  const title = document.querySelector("#city-title");
  const known = PROVINCES.indexOf(name) !== -1;
  if (title) title.textContent = known ? name : "İl bulunamadı";
  const closed = document.querySelector("#city-closed");
  if (closed) {
    closed.hidden = !known || !!state.provinces[name];
    closed.textContent = "Bu il müşterilere kapalı. Ana sayfada görünmez.";
  }
  const form = document.querySelector("#add-form");
  if (form) form.hidden = !known;
  renderCityList();
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
    return '<article class="order"><h3>' + esc(restaurant.name) + "</h3>"
      + '<p class="meta">' + esc(restaurant.cuisine) + " · " + esc(restaurant.address) + "</p>"
      + '<p class="meta">IBAN ' + esc(restaurant.iban) + "</p>"
      + '<p style="margin:12px 0 0"><span class="commission">' + esc(commissionText()) + "</span></p></article>";
  }).join("");
}

function lineCard(name, price, plus) {
  return '<article class="line" data-line data-name="' + esc(name) + '" data-price="' + esc(price) + '">'
    + "<h3>" + esc(name) + "</h3><p class=\"price\">" + (plus ? "+" : "") + lira(price) + "</p>"
    + '<div class="qty"><button type="button" data-action="qty" data-dir="-1" aria-label="Azalt">−</button><strong data-qty>0</strong><button type="button" data-action="qty" data-dir="1" aria-label="Arttır">+</button></div>'
    + "</article>";
}

function renderMenu() {
  const root = document.querySelector("#menu-app");
  if (!root) return;
  const restaurant = findRestaurant(state, qs("id"));
  if (!restaurant) {
    root.innerHTML = '<p class="empty">Restoran bulunamadı.</p>';
    return;
  }
  const closed = !state.provinces[restaurant.province];
  const gateways = enabledGateways(state);
  const lines = restaurant.menu.map(function (item) { return lineCard(item.name, item.price, false); }).join("");
  const alternatives = restaurant.extras.map(function (extra) { return lineCard(extra.name, extra.plus, true); }).join("");
  const pay = gateways.length
    ? gateways.map(function (item, index) {
      return '<label class="check"><input type="radio" name="gateway" value="' + esc(item.id) + '"' + (index === 0 ? " checked" : "") + "> " + esc(item.label) + "</label>";
    }).join("")
    : '<p class="notice warn">Yönetici henüz ödeme yöntemi açmadı.</p>';
  root.innerHTML = '<p class="eyebrow">' + esc(restaurant.province) + "</p><h1>" + esc(restaurant.name) + "</h1>"
    + '<p class="section-note">' + esc(restaurant.cuisine) + " · " + esc(restaurant.address) + "</p>"
    + (closed ? '<p class="notice warn">Bu il kapalı. Sipariş alınmıyor.</p>' : "")
    + '<form data-form="checkout" data-restaurant="' + esc(restaurant.id) + '">'
    + (lines || '<p class="empty">Menüde henüz sabit ürün yok.</p>')
    + (alternatives ? '<h2>Alternatifler</h2>' + alternatives : "")
    + '<section class="sheet"><h2>Ödeme</h2><p class="section-note">Deneme siparişi. Banka veya SMS yok.</p><div id="pay-list">' + pay + "</div>"
    + '<div class="total-row"><span>Toplam</span><strong id="menu-total">' + lira(0) + "</strong></div>"
    + '<p id="checkout-note" class="notice warn" hidden></p>'
    + '<button class="btn" type="submit"' + (closed ? " disabled" : "") + ">Siparişi ver</button></section></form>";
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

function orderCard(order, mode) {
  const lines = order.lines.map(function (line) {
    const extras = (line.extras || []).map(function (extra) { return esc(extra.name) + " +" + lira(extra.plus); }).join(", ");
    return "<p class=\"meta\">" + line.qty + " × " + esc(line.name) + (extras ? " (" + extras + ")" : "") + " · " + lira(line.lineTotal) + "</p>";
  }).join("");
  let actions = "";
  if (mode === "restaurant") {
    const readyDisabled = order.status !== "kabul" ? " disabled" : "";
    actions = '<div class="actions"><button class="btn" type="button" data-action="ready" data-id="' + esc(order.id) + '"' + readyDisabled + ">Hazır</button></div>";
  }
  if (mode === "courier") {
    if (order.status === "atandi") {
      actions = '<div class="actions"><button class="btn" type="button" data-action="accept" data-id="' + esc(order.id) + '">Kabul et</button>'
        + '<button class="btn ghost" type="button" data-action="decline" data-id="' + esc(order.id) + '">Reddet</button></div>';
    } else {
      actions = '<div class="actions">'
        + stepButton(order, "teslim-alindi", "Teslim aldım")
        + stepButton(order, "yolda", "Yola çıktım")
        + stepButton(order, "teslim", "Teslim ettim")
        + "</div>";
    }
  }
  return '<article class="order"><h3>' + esc(order.restaurantName) + "</h3>"
    + "<p>" + esc(STATUS_TEXT[order.status] || order.status) + "</p>"
    + lines
    + '<p class="meta">' + esc(order.address) + " · " + esc(order.gatewayLabel) + "</p>"
    + '<div class="total-row"><span>Toplam</span><strong>' + lira(order.total) + "</strong></div>"
    + (mode === "restaurant" ? '<p style="margin:8px 0 0"><span class="commission">' + esc(commissionText()) + " · " + lira(order.commission) + "</span></p>" : "")
    + courierBlock(order)
    + actions
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
  root.innerHTML = order ? orderCard(order, "customer") : '<p class="empty">Sipariş bulunamadı.</p>';
}

function renderOrders() {
  const root = document.querySelector("#orders-app");
  if (!root) return;
  root.innerHTML = state.orders.length
    ? state.orders.map(function (order) {
      return '<a class="order" style="display:block;text-decoration:none;color:inherit" href="siparis.html?id=' + encodeURIComponent(order.id) + '"><strong>' + esc(order.restaurantName) + "</strong><p class=\"meta\">" + esc(STATUS_TEXT[order.status] || order.status) + " · " + lira(order.total) + "</p></a>";
    }).join("")
    : '<p class="empty">Bu tarayıcıda sipariş yok.</p>';
}

let payoutPainted = false;

function renderRestaurant() {
  const root = document.querySelector("#restaurant-app");
  if (!root) return;
  const restaurant = currentRestaurant();
  if (!restaurant) {
    root.innerHTML = '<p class="empty">Restoran girişi gerekli. <a href="giris.html">Giriş Yap</a></p>';
    return;
  }
  if (!payoutPainted) {
    payoutPainted = true;
    root.innerHTML = '<p class="eyebrow">' + esc(restaurant.province) + "</p><h1>" + esc(restaurant.name) + "</h1>"
      + '<p style="margin:0 0 22px"><span class="commission">' + esc(commissionText()) + "</span></p>"
      + '<section class="sheet"><h2>Gelen siparişler</h2><div id="restaurant-orders"></div></section>'
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
  const orders = document.querySelector("#restaurant-orders");
  const mine = state.orders.filter(function (order) { return order.restaurantId === restaurant.id; });
  if (orders) orders.innerHTML = mine.length ? mine.map(function (order) { return orderCard(order, "restaurant"); }).join("") : '<p class="empty">Gelen sipariş yok.</p>';
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

function renderCourier() {
  const root = document.querySelector("#courier-app");
  if (!root) return;
  const session = state.session;
  if (!session || session.role !== "kurye") {
    root.innerHTML = '<p class="empty">Kurye girişi gerekli. <a href="giris.html">Giriş Yap</a> — Harbi Kuryeler</p>';
    return;
  }
  const courier = findCourier(state, session.courierId);
  const mine = state.orders.filter(function (order) { return order.courierId === session.courierId && order.status !== "bekliyor"; });
  root.innerHTML = '<p class="eyebrow">Harbi Kuryeler</p><h1>' + esc(courier ? courier.name : "Kurye") + "</h1>"
    + '<p class="section-note">' + esc(courier ? courier.phone : "") + "</p>"
    + (mine.length ? mine.map(function (order) { return orderCard(order, "courier"); }).join("") : '<p class="empty">Size atanmış sipariş yok.</p>');
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
}

if (typeof document !== "undefined") boot();
if (typeof globalThis !== "undefined") globalThis.Harbi = Harbi;
