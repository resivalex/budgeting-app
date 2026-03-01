# Budget Name Migration

## Goal

Fill `budget_name` in CouchDB for every transaction whose `category` matches the current category → budget mapping in spending limits. Transactions with no matching category (transfers, uncategorized, categories not assigned to any budget) keep an empty `budget_name`.

## How it works

Opening the app in a browser triggers a one-time client-side migration: it reads all transactions from PouchDB, applies the category → budget mapping, writes back only the transactions that need updating, and syncs to CouchDB within ~10 seconds. The migration is idempotent and version-gated via `localStorage`.

---

## Steps

### 1. Backup

```bash
curl -s https://<BACKEND_HOST>/backup \
  -H "Authorization: Bearer <BACKEND_TOKEN>" \
  -o backup-pre-migration-$(date +%Y%m%d).zip
```

Verify the doc count looks right:

```bash
unzip -p backup-pre-migration-*.zip couchdb/budgeting.json | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print(d['doc_count'], d['exported_at'])"
```

### 2. Deploy

```bash
git pull origin main
docker compose build backend web
docker compose up -d
```

### 3. Open the app

Open the app in a browser. The migration runs automatically in the background — no action needed. It completes within a few seconds and syncs to CouchDB within ~10 seconds.

---

### 4. Verify

Check CouchDB via CSV export:

```bash
curl -s https://<BACKEND_HOST>/exporting \
  -H "Authorization: Bearer <BACKEND_TOKEN>" > /tmp/export.csv

# Distribution of budget_name values
awk -F',' 'NR>1 {print $9}' /tmp/export.csv | sort | uniq -c | sort -rn
```

Every transaction whose category appears in spending limits should have a non-empty `budget_name`. Empty `budget_name` is expected only for transfers and categories not assigned to any budget.

---

## Rollback

```bash
curl -X POST https://<BACKEND_HOST>/restore \
  -H "Authorization: Bearer <BACKEND_TOKEN>" \
  -F "file=@backup-pre-migration-YYYYMMDD.zip"
```

This restores both the transaction database and settings. All clients reset and re-pull automatically on their next sync.

If the frontend code also needs to be rolled back:

```bash
git checkout <previous-commit-hash>
docker compose build backend web
docker compose up -d
```

---

## Re-running the migration

If the migration didn't run (e.g. after a data import), clear the version key in the browser console and reload:

```javascript
localStorage.removeItem("budgeting_migration_version");
location.reload();
```
