const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. We will inject query logic right after const product = combinedProducts.find((p) => p.id === id);
const targetQuery = `  // Find the current product
  const product = combinedProducts.find((p) => p.id === id);

  if (!product) {`;

const replacementQuery = `  // Find the current product
  const product = combinedProducts.find((p) => p.id === id);

  if (!product) {`;

// Let's modify the query block to fetch individual table data
const targetDbFetch = `  // Find the current product
  const product = combinedProducts.find((p) => p.id === id);

  if (!product) {`;

const replacementDbFetch = `  // Find the current product
  const product = combinedProducts.find((p) => p.id === id);

  // Fetch gallery images, reviews, Q&As if it's a database product
  let dbGalleryImages = [];
  let dbReviews = [];
  let dbFaqs = [];

  const isDbProduct = dbProducts.some(dbP => dbP.id === product?.id);
  if (product && isDbProduct) {
    try {
      // 1. Fetch gallery images
      const [imagesRows] = await pool.query(
        "SELECT image_url FROM product_images WHERE product_id = ?",
        [Number(product.id)]
      );
      dbGalleryImages = imagesRows.map(row => row.image_url);
      if (product.image) {
        dbGalleryImages = [product.image, ...dbGalleryImages.filter(img => img !== product.image)];
      }

      // 2. Fetch reviews
      const [reviewsRows] = await pool.query(
        "SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC",
        [Number(product.id)]
      );
      dbReviews = reviewsRows.map(row => ({
        name: row.username || 'Anonymous',
        rating: Number(row.rating || 5),
        date: row.review_date || new Date(row.created_at).toLocaleDateString('bn-BD'),
        text: row.comment || '',
        helpful: Number(row.likes || 0),
        images: row.profile_picture ? [row.profile_picture] : []
      }));

      // 3. Fetch questions and answers
      const [qaRows] = await pool.query(
        "SELECT * FROM questions_and_answers WHERE product_id = ? ORDER BY id DESC",
        [Number(product.id)]
      );
      dbFaqs = qaRows.map(row => ({
        q: row.question || '',
        a: row.answer || ''
      }));
    } catch (err) {
      console.error("Error fetching product sub-tables:", err);
    }
  }

  if (!product) {`;

if (content.includes(targetDbFetch)) {
  content = content.replace(targetDbFetch, replacementDbFetch);
  console.log("Query block modified successfully!");
} else {
  console.error("Query block NOT found!");
}

// 2. Replace ProductImageGallery render
const targetGallery = `            <ProductImageGallery
              primaryImage={product.image}
              title={product.title}
              category={product.category}
              discount={product.discount}
            />`;

const replacementGallery = `            <ProductImageGallery
              primaryImage={product.image}
              title={product.title}
              category={product.category}
              discount={product.discount}
              galleryImages={dbGalleryImages.length > 0 ? dbGalleryImages : undefined}
            />`;

if (content.includes(targetGallery)) {
  content = content.replace(targetGallery, replacementGallery);
  console.log("Gallery render modified successfully!");
} else {
  console.error("Gallery render NOT found!");
}

// 3. Replace ProductReviews and ProductFAQs calls
const targetReviews = `            <ProductReviews product={product} />`;
const replacementReviews = `            <ProductReviews product={product} dbReviews={isDbProduct ? dbReviews : undefined} />`;

if (content.includes(targetReviews)) {
  content = content.replace(targetReviews, replacementReviews);
  console.log("Reviews render modified successfully!");
} else {
  console.error("Reviews render NOT found!");
}

const targetFAQs = `            <ProductFAQs product={product} />`;
const replacementFAQs = `            <ProductFAQs product={product} dbFaqs={isDbProduct ? dbFaqs : undefined} />`;

if (content.includes(targetFAQs)) {
  content = content.replace(targetFAQs, replacementFAQs);
  console.log("FAQs render modified successfully!");
} else {
  console.error("FAQs render NOT found!");
}

// 4. Update the specifications JSON mapping for database products so we fetch specifications and review summary from db
// Let's replace the dbProducts mapping to include reviewSummary
const targetMapping = `      return {
        id: String(row.id),
        title: row.title,
        price: row.current_price ? \`৳ \${Math.round(Number(row.current_price))}\` : 'N/A',
        originalPrice: row.original_price ? \`৳ \${Math.round(Number(row.original_price))}\` : '',
        discount: discountPercentage > 0 ? \`\${discountPercentage}% ছাড়\` : '',
        rating: row.average_rating ? String(row.average_rating) : '0',
        reviews: row.total_reviews ? String(row.total_reviews) : '0',
        image: row.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
        category: row.product_type || 'book',
        author: row.author_name || undefined,
        description: row.description || '',
        specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
      };`;

const replacementMapping = `      return {
        id: String(row.id),
        title: row.title,
        price: row.current_price ? \`৳ \${Math.round(Number(row.current_price))}\` : 'N/A',
        originalPrice: row.original_price ? \`৳ \${Math.round(Number(row.original_price))}\` : '',
        discount: discountPercentage > 0 ? \`\${discountPercentage}% ছাড়\` : '',
        rating: row.average_rating ? String(row.average_rating) : '0',
        reviews: row.total_reviews ? String(row.total_reviews) : '0',
        image: row.cover_image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
        category: row.product_type || 'book',
        author: row.author_name || undefined,
        description: row.description || '',
        specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
        reviewSummary: row.review_summary || undefined,
      };`;

if (content.includes(targetMapping)) {
  content = content.replace(targetMapping, replacementMapping);
  console.log("Mapping modified successfully!");
} else {
  console.error("Mapping NOT found!");
}

fs.writeFileSync(filePath, content, 'utf8');
