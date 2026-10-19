// Vuetify が出すテーマの CSS（vuetify.theme.styles）から、ダークのテーマの変数（.v-theme--dark の中身）を取り出し、
// html に dark-mode が付いているときは、ライトのテーマの class にも当てる CSS を作る（#158）
// 静的 HTML はライトのテーマで出力されるが、color-mode はハイドレーションの前に html の class を決めるので、
// これでハイドレーションまでの画面もダークになる。ハイドレーションのあとは要素が .v-theme--dark になるので効かない
export function darkModeFallbackStyles(themeStyles: string): string {
  const variables = themeStyles.match(/\.v-theme--dark\s*\{([^}]*)\}/)?.[1];
  if (!variables) return "";
  return `html.dark-mode, html.dark-mode .v-theme--light {${variables}}`;
}
