// 鸡尾酒基础数据：名称、中文名、基酒和配方材料。
const cocktails = [
  {
"name": "Americano",
"zh": "美国佬",
"base": "Campari",
"ingredients": [
  "30ml Campari",
  "30ml Red Vermouth",
  "Soda Water"
]
  },
  {
"name": "Aviation",
"zh": "飞行",
"base": "Gin",
"ingredients": [
  "45ml Gin",
  "15ml Luxardo",
  "15ml Lemon juice",
  "1 Bar spoon Violette Crème"
]
  },
  {
"name": "Bee’s Knees",
"zh": "蜂膝",
"base": "Gin",
"ingredients": [
  "45ml Gin",
  "10ml Lime juice",
  "Enough Honey"
]
  },
  {
"name": "Black Russian",
"zh": "黑俄罗斯",
"base": "Vodka",
"ingredients": [
  "50ml Vodka",
  "20ml Coffee Liqueur"
]
  },
  {
"name": "Bloody Mary",
"zh": "血腥玛丽",
"base": "Vodka",
"ingredients": [
  "45ml Vodka",
  "90ml Tomato juice",
  "15ml Lemon juice",
  "Tabasco",
  "Celery Salt",
  "Pepper"
]
  },
  {
"name": "Boulevardier",
"zh": "花花公子",
"base": "Whiskey",
"ingredients": [
  "45ml Rye Whiskey",
  "30ml Campari",
  "30ml Red Vermouth"
]
  },
  {
"name": "Cardinale",
"zh": "卡迪纳尔",
"base": "Gin",
"ingredients": [
  "40ml Gin",
  "20ml Dry Vermouth",
  "10ml Campari"
]
  },
  {
"name": "Clover Club",
"zh": "三叶草俱乐部",
"base": "Gin",
"ingredients": [
  "45ml Gin",
  "15ml Raspberry Syrup",
  "15ml Lemon juice",
  "Egg White"
]
  },
  {
"name": "Cosmopolitan",
"zh": "大都会",
"base": "Vodka",
"ingredients": [
  "40ml Vodka Citron",
  "15ml Cointreau",
  "15ml Lime juice",
  "30ml Cranberry juice"
]
  },
  {
"name": "Cuba Libre",
"zh": "自由古巴",
"base": "Rum",
"ingredients": [
  "50ml White Rum",
  "120ml Cola",
  "10ml Lime juice"
]
  },
  {
"name": "Daiquiri",
"zh": "大吉利",
"base": "Rum",
"ingredients": [
  "60ml White Rum",
  "20ml Lime juice",
  "2 Bar Spoons Sugar"
]
  },
  {
"name": "Dry Martini",
"zh": "干马天尼",
"base": "Gin",
"ingredients": [
  "Gin",
  "Vermouth"
]
  },
  {
"name": "Espresso Martini",
"zh": "意式浓缩马天尼",
"base": "Vodka",
"ingredients": [
  "50ml Vodka",
  "30ml Kahlúa",
  "10ml Syrup",
  "1 Espresso"
]
  },
  {
"name": "French 75",
"zh": "法式 75",
"base": "Gin",
"ingredients": [
  "30ml Gin",
  "15ml Syrup",
  "15ml Lemon juice",
  "60ml Champagne"
]
  },
  {
"name": "French Martini",
"zh": "法式马天尼",
"base": "Vodka",
"ingredients": [
  "45ml Vodka",
  "15ml Raspberry Liqueur",
  "15ml Pineapple juice"
]
  },
  {
"name": "Garibaldi",
"zh": "加里波第",
"base": "Campari",
"ingredients": [
  "45ml Campari",
  "120ml Orange juice"
]
  },
  {
"name": "Gin Fizz",
"zh": "金菲士",
"base": "Gin",
"ingredients": [
  "45ml Gin",
  "30ml Lemon juice",
  "10ml Syrup",
  "Soda Water"
]
  },
  {
"name": "Grand Margarita",
"zh": "特级玛格丽特",
"base": "Tequila",
"ingredients": [
  "45ml Tequila",
  "30ml Cointreau",
  "15ml Lime juice"
]
  },
  {
"name": "Hemingway special",
"zh": "海明威",
"base": "Rum",
"ingredients": [
  "60ml Rum",
  "40ml Grapefruit juice",
  "15ml Luxardo",
  "15ml Lime juice"
]
  },
  {
"name": "John Collins",
"zh": "约翰·柯林斯",
"base": "Gin",
"ingredients": [
  "45ml Gin",
  "30ml Lemon juice",
  "15ml Syrup",
  "Soda Water"
]
  },
  {
"name": "Last Word",
"zh": "遗言",
"base": "Gin",
"ingredients": [
  "22.5ml Gin",
  "22.5ml Green Chartreuses",
  "22.5ml Luxardo",
  "22.5ml Lime juice"
]
  },
  {
"name": "Long Island Iced Tea",
"zh": "长岛冰茶",
"base": "Mixed",
"ingredients": [
  "15ml Vodka",
  "15ml Tequila",
  "15ml White Rum",
  "15ml Gin",
  "15ml Cointreau",
  "25ml Lemon juice",
  "30ml Syrup",
  "Cola"
]
  },
  {
"name": "Manhattan",
"zh": "曼哈顿",
"base": "Whiskey",
"ingredients": [
  "50ml Rye Whiskey",
  "20ml Red Vermouth",
  "1 dash Angostura Bitters"
]
  },
  {
"name": "Margarita",
"zh": "玛格丽特",
"base": "Tequila",
"ingredients": [
  "50ml Tequila",
  "20ml Cointreau",
  "15ml Lime juice"
]
  },
  {
"name": "Martinez",
"zh": "马丁内斯",
"base": "Gin",
"ingredients": [
  "45ml Gin",
  "45ml Red Vermouth",
  "1 Bar spoon Luxardo",
  "2 Dashes Orange Bitters"
]
  },
  {
"name": "Negroni",
"zh": "尼格罗尼",
"base": "Gin",
"ingredients": [
  "30ml Gin",
  "30ml Campari",
  "30ml Red Vermouth"
]
  },
  {
"name": "New York Sour",
"zh": "纽约酸",
"base": "Whiskey",
"ingredients": [
  "60ml Rye Whiskey",
  "22.5ml Syrup",
  "30ml Lemon juice",
  "Egg White",
  "15ml Red wine"
]
  },
  {
"name": "Old Fashioned",
"zh": "古典",
"base": "Whiskey",
"ingredients": [
  "45ml Rye Whiskey",
  "1 Sugar Cube",
  "1 Dash Bitter",
  "Water"
]
  },
  {
"name": "Pisco Sour",
"zh": "皮斯科酸",
"base": "Pisco",
"ingredients": [
  "60ml Pisco",
  "30ml Lemon juice",
  "20ml Syrup",
  "Egg White"
]
  },
  {
"name": "Ramos Gin Fizz",
"zh": "拉莫斯金菲士",
"base": "Gin",
"ingredients": [
  "别点我求你"
]
  },
  {
"name": "Sea Breeze",
"zh": "海风",
"base": "Vodka",
"ingredients": [
  "40ml Vodka",
  "120ml Cranberry juice",
  "30ml Grapefruit juice"
]
  },
  {
"name": "Sex on the beach",
"zh": "",
"base": "Vodka",
"ingredients": [
  "40ml Vodka",
  "20ml Peach Schnapps",
  "40ml Orange juice",
  "40ml Cranberry juice"
]
  },
  {
"name": "Sidecar",
"zh": "边车",
"base": "Cognac",
"ingredients": [
  "50ml Cognac",
  "20ml Cointreau",
  "20ml Lemon juice"
]
  },
  {
"name": "Tequila Sunrise",
"zh": "龙舌兰日出",
"base": "Tequila",
"ingredients": [
  "45ml Tequila",
  "90ml Orange juice",
  "15ml Grenadine Syrup"
]
  },
  {
"name": "Trinidad Sour",
"zh": "特立尼达酸",
"base": "Bitters",
"ingredients": [
  "45ml Angostura Bitters",
  "30ml Orgeat Syrup",
  "22.5ml Lemon juice",
  "15ml Rye Whiskey"
]
  },
  {
"name": "Whiskey Sour",
"zh": "威士忌酸",
"base": "Whiskey",
"ingredients": [
  "45ml Bourbon Whiskey",
  "25ml Lemon juice",
  "20ml Syrup",
  "Egg White"
]
  },
  {
"name": "White Lady",
"zh": "",
"base": "Gin",
"ingredients": [
  "40ml Gin",
  "30ml Cointreau",
  "20ml Lemon juice"
]
  }
];

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
  Cognac: "干邑",
  Pisco: "皮斯科",
  Bitters: "苦精",
  Mixed: "混合基酒"
};

// 风味说明表，后续只需要改这里即可补充每款酒的描述。
const tasteNotes = {
  "Americano": "草本微苦 · 气泡轻盈 · 适合作为开场",
  "Aviation": "紫罗兰花香 · 柑橘酸度 · 优雅而冷冽",
  "Bee’s Knees": "蜂蜜柔甜 · 青柠明亮 · 金酒植物香",
  "Black Russian": "咖啡烘烤 · 酒体厚重 · 苦甜直接",
  "Bloody Mary": "番茄鲜咸 · 香料辛辣 · 复杂浓郁",
  "Boulevardier": "橙皮苦香 · 谷物温暖 · 深沉圆润",
  "Cardinale": "干爽草本 · 苦橙清晰 · 利落克制",
  "Clover Club": "覆盆子果香 · 绵密泡沫 · 酸甜轻盈",
  "Cosmopolitan": "蔓越莓酸甜 · 柑橘清爽 · 都市感",
  "Cuba Libre": "焦糖气泡 · 青柠清亮 · 轻松畅饮",
  "Daiquiri": "朗姆甘蔗香 · 青柠锐利 · 纯粹平衡",
  "Dry Martini": "极干净 · 杜松主导 · 冷冽而经典",
  "Espresso Martini": "浓缩咖啡 · 香草甜感 · 丝滑醒神",
  "French 75": "香槟气泡 · 柠檬明亮 · 轻快优雅",
  "French Martini": "热带果香 · 覆盆子甜 · 柔顺讨喜",
  "Garibaldi": "鲜橙绵密 · 苦甜平衡 · 阳光明亮",
  "Gin Fizz": "柠檬酸爽 · 气泡活泼 · 干净轻盈",
  "Grand Margarita": "龙舌兰植物香 · 柑橘饱满 · 酸爽",
  "Hemingway special": "葡萄柚清苦 · 樱桃核香 · 干爽",
  "John Collins": "柠檬气泡 · 杜松草本 · 清爽修长",
  "Last Word": "草药浓郁 · 青柠锐利 · 四味精确平衡",
  "Long Island Iced Tea": "柑橘可乐 · 酒感强烈 · 甜爽",
  "Manhattan": "黑麦辛香 · 香艾酒甜润 · 成熟深邃",
  "Margarita": "青柠鲜明 · 龙舌兰矿物感 · 盐边提味",
  "Martinez": "草本甜润 · 樱桃核香 · 马天尼的前奏",
  "Negroni": "苦橙 · 草本 · 甜苦等量的永恒经典",
  "New York Sour": "威士忌酸甜 · 红酒单宁 · 层次分明",
  "Old Fashioned": "木桶香草 · 苦精辛香 · 直接醇厚",
  "Pisco Sour": "葡萄蒸馏香 · 柑橘酸度 · 泡沫细腻",
  "Ramos Gin Fizz": "橙花奶香 · 绵密悠长 · 值得等待",
  "Sea Breeze": "蔓越莓清酸 · 葡萄柚微苦 · 海风般轻快",
  "Sex on the beach": "桃子甜香 · 热带果汁 · 轻松易饮",
  "Sidecar": "干邑果干 · 橙香 · 酸度锋利而温暖",
  "Tequila Sunrise": "橙汁明亮 · 石榴甜美 · 渐层日出",
  "Trinidad Sour": "苦精香料 · 杏仁甜香 · 大胆而平衡",
  "Whiskey Sour": "柠檬酸甜 · 谷物温暖 · 泡沫柔滑",
  "White Lady": "柑橘清冽 · 杜松优雅 · 干净利落"
};

// 价格表按鸡尾酒英文名匹配，便于统一调整展示价格。
const prices = {
  "Americano": 88,
  "Aviation": 88,
  "Bee’s Knees": 88,
  "Black Russian": 88,
  "Bloody Mary": 88,
  "Boulevardier": 88,
  "Cardinale": 88,
  "Clover Club": 88,
  "Cosmopolitan": 88,
  "Cuba Libre": 88,
  "Daiquiri": 88,
  "Dry Martini": 88,
  "Espresso Martini": 88,
  "French 75": 88,
  "French Martini": 88,
  "Garibaldi": 88,
  "Gin Fizz": 88,
  "Grand Margarita": 88,
  "Hemingway special": 88,
  "John Collins": 88,
  "Last Word": 88,
  "Long Island Iced Tea": 88,
  "Manhattan": 88,
  "Margarita": 88,
  "Martinez": 88,
  "Negroni": 88,
  "New York Sour": 88,
  "Old Fashioned": 88,
  "Pisco Sour": 88,
  "Ramos Gin Fizz": 88,
  "Sea Breeze": 88,
  "Sex on the beach": 88,
  "Sidecar": 88,
  "Tequila Sunrise": 88,
  "Trinidad Sour": 88,
  "Whiskey Sour": 88,
  "White Lady": 88
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

// 根据当前分类、搜索关键字和展开状态重新生成酒单卡片。
function renderMenu() {
  const keyword = search.value.trim();

  const filtered = cocktails.filter(c => {
    const collectionOk = currentCollection === "classic"
      ? (c.collection || "classic") === "classic"
      : c.collection === "signature";
    const baseOk = currentBase === "All"
      || c.base === currentBase
      || (currentBase === "Brandy" && c.base === "Cognac")
      || (currentBase === "Other" && !primaryBaseValues.includes(c.base));
    const searchOk = !keyword || matchCocktail(c, keyword);
    return collectionOk && baseOk && searchOk;
  });

  const collectionName = currentCollection === "classic" ? "CLASSICS" : "SIGNATURES";
  count.textContent = `${String(filtered.length).padStart(2, "0")} ${collectionName}`;

  grid.innerHTML = filtered.map((c, index) => {
    const isOpen = openCocktail === c.name;
    const number = String(cocktails.indexOf(c) + 1).padStart(2, "0");

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

renderFilters();
renderMenu();
