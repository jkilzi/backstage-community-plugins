import { getThemes } from '@redhat-developer/red-hat-developer-hub-theme';
import LogoFull from '../components/Root/RhdhLogoFull';
import LogoIcon from '../components/Root/RhdhLogoIcon';

export function useRhdhTheme(isEnabled?: boolean) {
  return {
    isRhdhThemeEnabled: isEnabled ?? process.env.RHDH_THEME_ENABLED ?? false,
    RhdhLogoFull: LogoFull,
    RhdhLogoIcon: LogoIcon,
    theme: getThemes(),
  } as const;
}
