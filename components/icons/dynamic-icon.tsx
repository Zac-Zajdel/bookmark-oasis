import { type LucideProps, icons } from 'lucide-react';

type IconComponentName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: string;
}

function isValidIconComponent(
  componentName: string,
): componentName is IconComponentName {
  return componentName in icons;
}

export function DynamicIcon({ name, ...props }: IconProps) {
  const kebabToPascal = (str: string) =>
    str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

  const componentName = kebabToPascal(name);

  if (!isValidIconComponent(componentName)) {
    return null;
  }

  const Icon = icons[componentName];
  return <Icon {...props} />;
}
