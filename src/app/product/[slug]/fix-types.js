const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'dbGalleryImages = imagesRows.map(row => row.image_url);',
  'dbGalleryImages = (imagesRows as any[]).map(row => row.image_url);'
);

content = content.replace(
  'dbReviews = reviewsRows.map(row => ({',
  'dbReviews = (reviewsRows as any[]).map(row => ({'
);

content = content.replace(
  'dbFaqs = qaRows.map(row => ({',
  'dbFaqs = (qaRows as any[]).map(row => ({'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Types casted successfully!");
