import type { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import ThemeProvider from "../styles/themeProvider"
import GlobalStyles from "../styles/globalStyles"
import { ToastContainer } from "react-toastify"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default MyApp
