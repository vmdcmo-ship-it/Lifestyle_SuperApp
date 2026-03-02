# PostgreSQL Local Setup

## Thông tin kết nối

### Database
| Field | Value |
|-------|-------|
| **Host** | `localhost` |
| **Port** | `5432` |
| **Database** | `lifestyle_db` |
| **Username** | `lifestyle_admin` |
| **Password** | `Lifestyle@2026!` |
| **Connection String** | `postgresql://lifestyle_admin:Lifestyle@2026!@localhost:5432/lifestyle_db` |

### pgAdmin (UI quản lý)
| Field | Value |
|-------|-------|
| **URL** | http://localhost:5050 |
| **Email** | `admin@lifestyle.vn` |
| **Password** | `Admin@2026!` |

### Redis
| Field | Value |
|-------|-------|
| **Host** | `localhost` |
| **Port** | `6379` |
| **Password** | `Redis@2026!` |
| **Connection String** | `redis://:Redis@2026!@localhost:6379` |

## Database Schemas

| Schema | Mô tả | Tables |
|--------|--------|--------|
| `core` | Users, Auth, Addresses | 4 tables |
| `driver` | Drivers, Identity, Vehicles | 3 tables |
| `merchant` | Merchants, Staff | 2 tables |
| `payment` | Wallets, Transactions, Callbacks, Bank accounts | 4 tables |
| `spotlight` | Creators, Redcomments, Reviews, Comments, CTA, Earnings | 6 tables |

**Total: 20 tables**

## Init Scripts (chạy tự động theo thứ tự)

| File | Mô tả |
|------|--------|
| `00-extensions.sql` | Extensions (UUID, PostGIS, FTS) + Schemas |
| `01-users.sql` | Users, Addresses, Auth Tokens, Social Login |
| `02-drivers.sql` | Drivers, Identity, Vehicles |
| `03-merchants.sql` | Merchants, Staff |
| `04-wallets.sql` | Wallets, Transactions, Callbacks, Bank Accounts |
| `05-redcomments.sql` | Creators, Redcomments, Reviews, Comments, CTA, Earnings |
| `06-seed-data.sql` | Sample data (5 users, 1 driver, 1 merchant, 1 creator, 1 redcomment) |
