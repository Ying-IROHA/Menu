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
  Gin: "金酒",
  Vodka: "伏特加",
  Whiskey: "威士忌",
  Rum: "朗姆",
  Tequila: "龙舌兰",
  Campari: "Campari",
  Cognac: "干邑",
  Pisco: "皮斯科",
  Bitters: "苦精",
  Mixed: "混合基酒"
};

// 风味说明表，后续只需要改这里即可补充每款酒的描述。
const tasteNotes = {
  "Americano": "风味-等待填写中",
  "Aviation": "风味-等待填写中",
  "Bee’s Knees": "风味-等待填写中",
  "Black Russian": "风味-等待填写中",
  "Bloody Mary": "风味-等待填写中",
  "Boulevardier": "风味-等待填写中",
  "Cardinale": "风味-等待填写中",
  "Clover Club": "风味-等待填写中",
  "Cosmopolitan": "风味-等待填写中",
  "Cuba Libre": "风味-等待填写中",
  "Daiquiri": "风味-等待填写中",
  "Dry Martini": "风味-等待填写中",
  "Espresso Martini": "风味-等待填写中",
  "French 75": "风味-等待填写中",
  "French Martini": "风味-等待填写中",
  "Garibaldi": "风味-等待填写中",
  "Gin Fizz": "风味-等待填写中",
  "Grand Margarita": "风味-等待填写中",
  "Hemingway special": "风味-等待填写中",
  "John Collins": "风味-等待填写中",
  "Last Word": "风味-等待填写中",
  "Long Island Iced Tea": "风味-等待填写中",
  "Manhattan": "风味-等待填写中",
  "Margarita": "风味-等待填写中",
  "Martinez": "风味-等待填写中",
  "Negroni": "风味-等待填写中",
  "New York Sour": "风味-等待填写中",
  "Old Fashioned": "风味-等待填写中",
  "Pisco Sour": "风味-等待填写中",
  "Ramos Gin Fizz": "风味-等待填写中",
  "Sea Breeze": "风味-等待填写中",
  "Sex on the beach": "风味-等待填写中",
  "Sidecar": "风味-等待填写中",
  "Tequila Sunrise": "风味-等待填写中",
  "Trinidad Sour": "风味-等待填写中",
  "Whiskey Sour": "风味-等待填写中",
  "White Lady": "风味-等待填写中"
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

let currentBase = "All";
let openCocktail = null;

// 缓存常用 DOM 节点，避免每次渲染重复查找。
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const filters = document.getElementById("filters");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

// 只展示数据里实际存在的基酒分类，同时保留固定排序。
function uniqueBases() {
  const preferred = ["All", "Gin", "Vodka", "Whiskey", "Rum", "Tequila", "Campari", "Cognac", "Pisco", "Bitters", "Mixed"];
  const actual = new Set(cocktails.map(c => c.base));
  return preferred.filter(b => b === "All" || actual.has(b));
}

// 渲染分类按钮，并在点击后更新当前分类和酒单。
function renderFilters() {
  filters.innerHTML = uniqueBases().map(base => `
    <button class="filter ${base === currentBase ? "active" : ""}" data-base="${base}">
      ${baseLabels[base] || base}
    </button>
  `).join("");

  document.querySelectorAll(".filter").forEach(btn => {
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
    const baseOk = currentBase === "All" || c.base === currentBase;
    const searchOk = !keyword || matchCocktail(c, keyword);
    return baseOk && searchOk;
  });

  count.textContent = `当前显示 ${filtered.length} / ${cocktails.length} 款鸡尾酒`;

  grid.innerHTML = filtered.map(c => {
    const isOpen = openCocktail === c.name;

    return `
    <article class="card ${isOpen ? "open" : ""}" data-name="${c.name}" role="button" tabindex="0" aria-expanded="${isOpen}">
      <div class="card-top">
        <div>
          <h2 class="name">${c.name}</h2>
          ${c.zh ? `<div class="zh">${c.zh}</div>` : ""}
          ${tasteNotes[c.name] ? `<div class="taste">${tasteNotes[c.name]}</div>` : ""}
        </div>
        <div class="card-meta">
          <span class="tag">${baseLabels[c.base] || c.base}</span>
          ${prices[c.name] ? `<span class="price">&yen;${prices[c.name]}</span>` : ""}
        </div>
      </div>
      ${isOpen ? `<ul>
        ${c.ingredients.map(i => `<li>${i}</li>`).join("")}
      </ul><div class="card-action">收起配方</div>` : `<div class="card-action">查看配方</div>`}
    </article>
  `;
  }).join("");

  empty.style.display = filtered.length ? "none" : "block";
}

// 监听搜索输入、鼠标点击和键盘操作，保持卡片可访问性。
search.addEventListener("input", renderMenu);
grid.addEventListener("click", event => {
  const card = event.target.closest(".card");
  if (!card) return;
  openCocktail = openCocktail === card.dataset.name ? null : card.dataset.name;
  renderMenu();
});
grid.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".card");
  if (!card) return;
  event.preventDefault();
  openCocktail = openCocktail === card.dataset.name ? null : card.dataset.name;
  renderMenu();
});

renderFilters();
renderMenu();
