# Nocturne · 部署与运行指南

Nocturne 现在是一个真正带后端的网页应用：FastAPI + SQLite 提供数据接口，
`Menu/` 里的静态页面通过接口读写数据。不再需要手改 JS 文件来更新酒单，
私人点单台的账单和历史也保存在服务器的数据库里，不再只存在某一台浏览器的
`localStorage` 中。

```
Bar menu/
├── backend/              # FastAPI 后端
│   ├── main.py            # 路由、启动逻辑，同时把 Menu/ 作为静态站点托管
│   ├── models.py           # SQLAlchemy 数据模型（cocktails / orders / order_items）
│   ├── schemas.py          # 请求 / 响应用的 Pydantic 模型
│   ├── database.py         # SQLite 引擎与 session
│   ├── seed_data.py        # 首次启动时写入的初始酒单数据（迁移自旧的 script.js）
│   ├── requirements.txt
│   └── Dockerfile
└── Menu/                  # 前端页面（客用酒单 / 点单台 / 管理后台）
    ├── index.html          # 客用酒单，从 /api/cocktails 读取数据
    ├── ledger.html         # 私人点单台，从 /api/ledger/catalog 和 /api/orders 读写
    ├── admin.html          # 酒单管理后台，增删改酒款
    └── ...
```

## 本地运行（推荐先这样跑起来看看）

需要 Python 3.10 及以上版本。

```bash
cd "Bar menu/backend"
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

启动后打开：

- 客用酒单：http://127.0.0.1:8000/menu.html
- 私人点单台：http://127.0.0.1:8000/menu/ledger.html
- 管理后台：http://127.0.0.1:8000/menu/admin.html
- API 文档（FastAPI 自带）：http://127.0.0.1:8000/docs

> 前端资源都挂在 `/menu` 这个前缀下面，根路径 `/` 是空的，留给以后在同一台服务器上部署的其他网站/应用用。客用酒单额外注册了一个 `/menu.html` 的整洁入口，效果和 `/menu/index.html` 一样。

第一次启动会自动创建 `backend/bar_menu.db` 这个 SQLite 文件，并把旧酒单的
44 款经典 + 特调数据写进去。之后所有修改都通过管理后台或 API 完成，`.db`
文件就是完整的数据来源；备份这一个文件就是备份整个酒单和点单历史。

## 局域网内使用（吧台平板 / 手机点单）

把 `--host 0.0.0.0` 加上，让同一 WiFi 下的其他设备也能访问：

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

然后在手机 / 平板浏览器里访问 `http://<这台电脑的局域网 IP>:8000/ledger.html`
即可。这台电脑（或者一个树莓派、迷你主机）常驻运行 uvicorn，就相当于一个
小型本地服务器，不需要公网、不需要域名。

## 部署到云端（可选，多人 / 多地点使用）

### 方式一：Docker（推荐）

项目根目录（也就是包含 `backend/` 和 `Menu/` 的这个文件夹）下执行：

```bash
docker build -f backend/Dockerfile -t nocturne-bar .
docker run -d --name nocturne -p 8000:8000 -v nocturne-data:/app/backend nocturne-bar
```

`-v nocturne-data:/app/backend` 把数据库文件所在目录挂载成一个具名卷，
容器重建、镜像升级都不会丢数据。把 8000 端口反向代理到 80/443（Nginx /
Caddy 均可）并配上 HTTPS 证书，就能对外提供服务。

### 方式二：直接在云主机上跑

1. 云主机装好 Python 3.10+，把整个 `Bar menu/` 文件夹上传上去。
2. 按"本地运行"的步骤装依赖、启动 `uvicorn main:app --host 0.0.0.0 --port 8000`。
3. 用 `systemd`（Linux）或 `pm2`/`supervisor` 之类的工具把这个命令做成
   开机自启、崩溃自动重启的服务，避免每次都要手动开终端。
4. 在前面套一层 Nginx / Caddy 做反向代理和 HTTPS，域名解析过来即可。

> 之前的 GitHub Pages 链接（`ying-iroha.github.io/Menu`）只能托管纯静态
> 文件，装不了这个后端，所以上线之后需要换成能跑 Python 的服务器/平台
> （国内外的云服务器、Fly.io、Railway、Render 等都可以，任选其一）。

## 关于管理后台的安全性

`admin.html` 目前**没有登录验证**——任何能访问这个网址的人都能改酒单。
这符合"先把点单台和后台数据库化"这一步的范围；如果之后要把网站放到公网
上给客人也能访问酒单，强烈建议至少做以下两件事之一：

- 把 `/admin.html` 和 `/api/cocktails` 的写操作（POST/PUT/DELETE）放在
  内网 / VPN 才能访问的地址后面，不对公网开放；
- 或者加一层最基础的登录保护（比如 Nginx 的 Basic Auth，或者在 FastAPI
  里加一个共享密码的中间件）。

如果想加登录鉴权，告诉我一声，这是个独立的小改动，随时可以加上。

## API 一览

| 方法 | 路径 | 用途 |
| :--- | :--- | :--- |
| GET | `/api/cocktails` | 全部酒款（客用酒单用这个） |
| POST | `/api/cocktails` | 新增酒款 |
| PUT | `/api/cocktails/{id}` | 编辑酒款 |
| DELETE | `/api/cocktails/{id}` | 删除酒款 |
| GET | `/api/ledger/catalog` | 点单台的快速点单目录（含临时特调） |
| GET | `/api/orders?limit=100` | 结账历史 |
| POST | `/api/orders` | 结账（新建一条记录） |
| DELETE | `/api/orders/{id}` | 删除一条历史记录 |

完整、可交互的接口文档见运行后的 `/docs` 页面。
