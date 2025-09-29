import React, { Suspense } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "../src/theme/Theme";
import createEmotionCache from "../src/createEmotionCache";
import { Provider } from "react-redux";
import Store from "../src/store/Store";
import RTL from "./../src/layouts/full/shared/customizer/RTL";
import { useSelector } from "../src/store/Store";
import { AppState } from "../src/store/Store";

import BlankLayout from "../src/layouts/blank/BlankLayout";
import FullLayout from "../src/layouts/full/FullLayout";

import "../src/utils/i18n";

// CSS FILES
import "react-quill/dist/quill.snow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  }: any = props;
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Classerly Admin</title>
      </Head>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RTL>
        <div><Toaster /></div>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default (props: MyAppProps) => (
  <Provider store={Store}>
    <MyApp {...props} />
  </Provider>
);
