const fs = require('fs');
const path = require('path');
const { icons } = require('lucide-react');

const lucideIconNames = Object.keys(icons);

const iconUnionTypeContent = `export const lucideIcons = [\n${lucideIconNames
  .map((icon) => `  "${icon}",`)
  .join(
    '\n',
  )}\n] as const;\n\nexport type LucideIcon = typeof lucideIcons[number];\n`;

const filePath = path.join(__dirname, '../types', 'lucideIcons.ts');

if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

fs.writeFileSync(filePath, iconUnionTypeContent);

console.log(`Union type successfully created in ${filePath}`);
