// Vendor
import { useDark, useToggle } from "@vueuse/core";

export function useTheme() {
  const isDark = useDark({ disableTransition: false });
  const toggleDark = useToggle(isDark);

  return { isDark, toggleDark };
}
