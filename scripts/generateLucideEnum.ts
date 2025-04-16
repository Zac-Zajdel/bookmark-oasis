const fs = require('fs');
const path = require('path');
const { icons } = require('lucide-react');

const iconNames = Object.keys(icons);

// Helper function to format the icon names correctly
const formatIconName = (name: string): string => {
  let formatted = name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Add hyphen between lowercase/number and uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Add hyphen between consecutive capitals if followed by lowercase
    .replace(/([a-zA-Z])(\d+)/g, '$1-$2'); // Add hyphen between letters and numbers

  // Convert to lowercase
  formatted = formatted.toLowerCase();

  // Fix the specific 2x2 pattern after lowercase conversion
  formatted = formatted.replace(/(\d)x-(\d)/g, '$1-x-$2');

  return formatted;
};

const iconUnionTypeContent = `export const lucideIcons = [\n${iconNames
  .map((icon) => `  "${formatIconName(icon)}",`)
  .join(
    '\n',
  )}\n] as const;\n\nexport type LucideIcon = typeof lucideIcons[number];\n`;

const filePath = path.join(__dirname, '../types', 'lucideIcons.ts');

if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

fs.writeFileSync(filePath, iconUnionTypeContent);

console.log(`Union type successfully created in ${filePath}`);
