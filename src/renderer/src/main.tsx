import "./styles/reset.css";
import "./styles/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Companion from "@renderer/pages/companion";
import Notch from "@renderer/pages/notch";

const page = window.location.hash.replace("#/", "") || "companion";

createRoot(document.getElementById("root")!).render(
   <StrictMode>{page === "notch" ? <Notch /> : <Companion />}</StrictMode>
);
