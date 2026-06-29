const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function main() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'elakarbazar',
  });

  try {
    // 1. Add variants column if not exists
    console.log("Checking if 'variants' column exists...");
    const [cols] = await pool.query("SHOW COLUMNS FROM products LIKE 'variants'");
    if (cols.length === 0) {
      console.log("Adding 'variants' column to 'products' table...");
      await pool.query("ALTER TABLE products ADD COLUMN variants TEXT DEFAULT NULL");
      console.log("Column 'variants' added successfully.");
    } else {
      console.log("'variants' column already exists.");
    }

    // 2. Identify all scraped product folders
    const productsParentDir = path.join(__dirname, '..', 'products');
    const foldersToScan = [];
    if (fs.existsSync(productsParentDir)) {
      const files = fs.readdirSync(productsParentDir);
      for (const f of files) {
        const fullPath = path.join(productsParentDir, f);
        if (fs.statSync(fullPath).isDirectory() && (f.includes('scraped') || f.includes('test'))) {
          foldersToScan.push(fullPath);
        }
      }
    }
    console.log("Scanning the following folders for scraped products:", foldersToScan);

    let updatedCount = 0;
    let totalScanned = 0;

    for (const folder of foldersToScan) {
      const files = fs.readdirSync(folder);
      for (const fname of files) {
        if (fname.endsWith('.json')) {
          totalScanned++;
          const filePath = path.join(folder, fname);
          try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(rawData);
            const productId = data.product_id || data.id;
            const variants = data.variants;

            if (productId && variants && (variants.formats?.length > 0 || variants.colors?.length > 0)) {
              const variantsStr = JSON.stringify(variants);
              const [res] = await pool.query(
                "UPDATE products SET variants = ? WHERE id = ?",
                [variantsStr, Number(productId)]
              );
              if (res.affectedRows > 0) {
                updatedCount++;
              }
            }
          } catch (fileErr) {
            // Ignore parse errors or missing files
          }
        }
      }
    }

    console.log(`Finished! Scanned ${totalScanned} product JSON files. Updated variants for ${updatedCount} products in the database.`);
  } catch (err) {
    console.error("Migration/Population failed:", err);
  } finally {
    await pool.end();
  }
}

main();
