/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `footer_links` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_categories" ("created_at", "id", "name", "slug", "updated_at") SELECT "created_at", "id", "name", "slug", "updated_at" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE TABLE "new_websites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "thumbnail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "visits" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "websites_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_websites" ("category_id", "created_at", "description", "id", "likes", "status", "thumbnail", "title", "updated_at", "url", "visits") SELECT "category_id", "created_at", "description", "id", "likes", "status", "thumbnail", "title", "updated_at", "url", "visits" FROM "websites";
DROP TABLE "websites";
ALTER TABLE "new_websites" RENAME TO "websites";
CREATE UNIQUE INDEX "websites_url_key" ON "websites"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "footer_links_url_key" ON "footer_links"("url");
