import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* The app is a single-page app, so the browser keeps the old scroll
 * position when the route changes. Reset it so every public page
 * (home, About, FAQ, 404) starts at the top. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
