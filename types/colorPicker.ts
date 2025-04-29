export const colorPickerValues = [
  'White',
  'Red',
  'Pink',
  'Purple',
  'Deep Purple',
  'Indigo',
  'Blue',
  'Light Blue',
  'Teal',
  'Green',
  'Lime',
  'Yellow',
  'Amber',
  'Orange',
  'Deep Orange',
  'Brown',
  'Blue Gray',
  'Black',
] as const;

export type ColorPickerName = (typeof colorPickerValues)[number];

export type ColorPickerOption = {
  name: ColorPickerName;
  color: string;
  darkText: boolean;
};

export const colorPickerOptions: ColorPickerOption[] = [
  { name: 'White', color: '#F4F4F5', darkText: true },
  { name: 'Red', color: '#EF4444', darkText: false },
  { name: 'Pink', color: '#EC4899', darkText: false },
  { name: 'Purple', color: '#A78BFA', darkText: false },
  { name: 'Deep Purple', color: '#7C3AED', darkText: false },
  { name: 'Indigo', color: '#6366F1', darkText: false },
  { name: 'Blue', color: '#3B82F6', darkText: false },
  { name: 'Light Blue', color: '#38BDF8', darkText: false },
  { name: 'Teal', color: '#14B8A6', darkText: false },
  { name: 'Green', color: '#22C55E', darkText: false },
  { name: 'Lime', color: '#A3E635', darkText: true },
  { name: 'Yellow', color: '#FACC15', darkText: true },
  { name: 'Amber', color: '#FBBF24', darkText: true },
  { name: 'Orange', color: '#FB923C', darkText: false },
  { name: 'Deep Orange', color: '#F97316', darkText: false },
  { name: 'Brown', color: '#A16207', darkText: false },
  { name: 'Blue Gray', color: '#64748B', darkText: false },
  { name: 'Black', color: '#18181B', darkText: false },
];
