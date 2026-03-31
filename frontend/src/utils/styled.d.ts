import "styled-components";
interface IPalette {
  main: string;
  darker?: string;
  light?: string;
}

declare module "styled-components" {
export interface DefaultTheme {
    borderColor: string;
    borderRadius: string;
    boxShadow: string;
    containerPaddingX: number;
    palette: {
      common: {
        black: string;
        white: string;
      };
      primary: IPalette;
      secondary: IPalette;
      background: {
        default: string;
        paper: string;
        surface: string;
        gradient: string;
      };
      grey: {
        100: string;
        300: string;
        500: string;
        700: string;
        900: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
      shadow: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
    };
  }
}
