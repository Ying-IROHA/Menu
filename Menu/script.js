// 鸡尾酒数据不再写死在前端，而是从后端 API（/api/cocktails）加载。
// 增删改酒款、价格、配方、风味描述请使用 admin.html 管理后台，
// 数据保存在服务器的数据库里，所有访问这个酒单的人看到的是同一份数据。
let cocktails = [];
let tasteNotes = {};
let prices = {};

// 基酒英文值到页面中文标签的映射，用于筛选按钮和卡片标签。
const baseLabels = {
  All: "全部",
  Other: "其他",
  Gin: "金酒",
  Vodka: "伏特加",
  Whiskey: "威士忌",
  Rum: "朗姆",
  Tequila: "龙舌兰",
  Brandy: "白兰地",
  Campari: "Campari",
  Mezcal: "梅斯卡尔",
  Cognac: "干邑",
  Pisco: "皮斯科",
  Bitters: "苦精",
  Mixed: "混合基酒"
};

let currentCollection = "classic";
let currentBase = "All";
let openCocktail = null;

// 缓存常用 DOM 节点，避免每次渲染重复查找。
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const filters = document.getElementById("filters");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

const baseColors = {
  Gin: "#a8b88a",
  Vodka: "#93aeba",
  Whiskey: "#c18a55",
  Rum: "#b69268",
  Tequila: "#c3ad62",
  Mezcal: "#b86f4b",
  Brandy: "#a6684b",
  Campari: "#b94d5d",
  Cognac: "#a6684b",
  Pisco: "#b7a987",
  Bitters: "#9c4d3f",
  Mixed: "#9b789c"
};

const primaryBases = ["Gin", "Vodka", "Whiskey", "Rum", "Tequila", "Brandy"];
const primaryBaseValues = ["Gin", "Vodka", "Whiskey", "Rum", "Tequila", "Brandy", "Cognac"];

// 只展示数据里实际存在的基酒分类，同时保留固定排序。
function uniqueBases() {
  return ["All", ...primaryBases, "Other"];
}

// 两层索引：第一层区分经典与特调，第二层按六大基酒筛选。
function renderFilters() {
  const collections = [
    { value: "classic", label: "经典鸡尾酒", en: "Classics" },
    { value: "signature", label: "特调", en: "Signatures" }
  ];

  filters.innerHTML = `
    <div class="filter-row collection-row" aria-label="酒单类型">
      <span class="filter-row-label">01 · 酒单</span>
      <div class="filter-options">
        ${collections.map(item => `
          <button class="filter collection-filter ${item.value === currentCollection ? "active" : ""}" data-collection="${item.value}">
            <span>${item.label}</span><small>${item.en}</small>
          </button>
        `).join("")}
      </div>
    </div>
    <div class="filter-row base-row" aria-label="基酒类型">
      <span class="filter-row-label">02 · 基酒</span>
      <div class="filter-options">
        ${uniqueBases().map(base => `
          <button class="filter base-filter ${base === currentBase ? "active" : ""}" data-base="${base}">
            ${base === "All" ? "全部基酒" : baseLabels[base] || base}
          </button>
        `).join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".collection-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCollection = btn.dataset.collection;
      openCocktail = null;
      renderFilters();
      renderMenu();
    });
  });

  document.querySelectorAll(".base-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      currentBase = btn.dataset.base;
      renderFilters();
      renderMenu();
    });
  });
}

// 搜索时把名称、中文名、基酒、风味、价格和材料都纳入匹配范围。
function matchCocktail(cocktail, keyword) {
  const haystack = [
    cocktail.name,
    cocktail.zh,
    cocktail.base,
    tasteNotes[cocktail.name],
    prices[cocktail.name],
    ...(cocktail.ingredients || [])
  ].join(" ").toLowerCase();

  return haystack.includes(keyword.toLowerCase());
}

function cocktailCollection(cocktail) {
  return cocktail.collection || "classic";
}

function sortByName(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

function cocktailsInCollection(collection) {
  return sortByName(cocktails.filter(item => cocktailCollection(item) === collection));
}

function collectionNumber(cocktail) {
  const collection = cocktailCollection(cocktail);
  const index = cocktailsInCollection(collection).indexOf(cocktail);

  return String(index + 1).padStart(2, "0");
}

// 根据当前分类、搜索关键字和展开状态重新生成酒单卡片。
function renderMenu() {
  const keyword = search.value.trim();

  const filtered = sortByName(cocktails.filter(c => {
    const collectionOk = currentCollection === "classic"
      ? cocktailCollection(c) === "classic"
      : c.collection === "signature";
    const baseOk = currentBase === "All"
      || c.base === currentBase
      || (currentBase === "Brandy" && c.base === "Cognac")
      || (currentBase === "Other" && !primaryBaseValues.includes(c.base));
    const searchOk = !keyword || matchCocktail(c, keyword);
    return collectionOk && baseOk && searchOk;
  }));

  const collectionName = currentCollection === "classic" ? "CLASSICS" : "SIGNATURES";
  count.textContent = `${String(filtered.length).padStart(2, "0")} ${collectionName}`;

  grid.innerHTML = filtered.map((c, index) => {
    const isOpen = openCocktail === c.name;
    const number = collectionNumber(c);

    return `
    <article class="card ${isOpen ? "open" : ""}" data-name="${c.name}" data-index="${number}" role="button" tabindex="0" aria-expanded="${isOpen}" style="--accent:${baseColors[c.base] || "#a95164"};--delay:${Math.min(index, 10) * 45}ms">
      <div class="card-top">
        <div class="card-title">
          <span class="card-index">N° ${number} · ${c.base.toUpperCase()}</span>
          <h2 class="name">${c.name}</h2>
          ${c.zh ? `<div class="zh">${c.zh}</div>` : ""}
          ${tasteNotes[c.name] ? `<div class="taste">${tasteNotes[c.name]}</div>` : ""}
        </div>
        <div class="card-meta">
          <span class="tag">${baseLabels[c.base] || c.base}</span>
          ${prices[c.name] ? `<span class="price">&yen;${prices[c.name]}</span>` : ""}
        </div>
      </div>
      ${isOpen ? `<ul class="recipe">
        ${c.ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul><div class="card-action">收起配方</div>` : `<div class="card-action">查看配方</div>`}
    </article>
  `;
  }).join("");

  empty.style.display = filtered.length ? "none" : "block";
}

// 展开配方时只更新相关卡片，避免重建整个网格造成闪烁。
function setCardOpen(card, shouldOpen) {
  if (!card) return;

  const cocktail = cocktails.find(item => item.name === card.dataset.name);
  const action = card.querySelector(".card-action");
  if (!cocktail || !action) return;

  card.classList.toggle("open", shouldOpen);
  card.setAttribute("aria-expanded", String(shouldOpen));

  const existingRecipe = card.querySelector(".recipe");
  if (shouldOpen && !existingRecipe) {
    action.insertAdjacentHTML("beforebegin", `
      <ul class="recipe">
        ${cocktail.ingredients.map(item => `<li>${item}</li>`).join("")}
      </ul>
    `);
  } else if (!shouldOpen && existingRecipe) {
    existingRecipe.remove();
  }

  action.textContent = shouldOpen ? "收起配方" : "查看配方";
}

function toggleCard(card) {
  const isClosing = openCocktail === card.dataset.name;

  if (openCocktail && !isClosing) {
    const previousCard = [...grid.querySelectorAll(".card")]
      .find(item => item.dataset.name === openCocktail);
    setCardOpen(previousCard, false);
  }

  openCocktail = isClosing ? null : card.dataset.name;
  setCardOpen(card, !isClosing);
}

// 监听搜索输入、鼠标点击和键盘操作，保持卡片可访问性。
search.addEventListener("input", renderMenu);
grid.addEventListener("click", event => {
  const card = event.target.closest(".card");
  if (!card) return;
  toggleCard(card);
});
grid.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".card");
  if (!card) return;
  event.preventDefault();
  toggleCard(card);
});

// 从后端拉取酒款数据，并重建 tasteNotes / prices 这两张查表，
// 保持下面渲染逻辑（renderMenu 等）完全不需要改动。
async function loadCocktails() {
  const response = await fetch("/api/cocktails");
  if (!response.ok) throw new Error(`加载酒单失败：${response.status}`);
  const data = await response.json();

  tasteNotes = {};
  prices = {};
  data.forEach(item => {
    if (item.taste_note) tasteNotes[item.name] = item.taste_note;
    if (item.price) prices[item.name] = item.price;
  });

  cocktails = data.map(item => ({
    name: item.name,
    zh: item.zh,
    base: item.base,
    collection: item.collection,
    ingredients: item.ingredients
  }));
}

async function init() {
  renderFilters();
  grid.innerHTML = `<p style="opacity:.6;padding:24px">正在加载酒单…</p>`;
  try {
    await loadCocktails();
    renderMenu();
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p style="opacity:.6;padding:24px">酒单加载失败，请确认后端服务已启动，然后刷新页面。</p>`;
    empty.style.display = "none";
  }
}

init();
