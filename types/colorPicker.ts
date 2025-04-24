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
  { name: 'White', color: '#E2E2E2', darkText: true },
  { name: 'Red', color: '#F44336', darkText: false },
  { name: 'Pink', color: '#E91E63', darkText: false },
  { name: 'Purple', color: '#9C27B0', darkText: false },
  { name: 'Deep Purple', color: '#673AB7', darkText: false },
  { name: 'Indigo', color: '#3F51B5', darkText: false },
  { name: 'Blue', color: '#2196F3', darkText: false },
  { name: 'Light Blue', color: '#03A9F4', darkText: false },
  { name: 'Teal', color: '#009688', darkText: false },
  { name: 'Green', color: '#4CAF50', darkText: false },
  { name: 'Lime', color: '#CDDC39', darkText: true },
  { name: 'Yellow', color: '#FFEB3B', darkText: true },
  { name: 'Amber', color: '#FFC107', darkText: true },
  { name: 'Orange', color: '#FF9800', darkText: false },
  { name: 'Deep Orange', color: '#FF5722', darkText: false },
  { name: 'Brown', color: '#795548', darkText: false },
  { name: 'Blue Gray', color: '#607D8B', darkText: false },
  { name: 'Black', color: '#212121', darkText: false },
];
