const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  '  let dbGalleryImages = [];',
  '  let dbGalleryImages: string[] = [];'
);

content = content.replace(
  '  let dbReviews = [];',
  '  let dbReviews: any[] = [];'
);

content = content.replace(
  '  let dbFaqs = [];',
  '  let dbFaqs: any[] = [];'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Explicit types declared successfully!");
