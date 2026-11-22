import "./index.css";
import { useEffect, useState } from "react";
import Companion from "@renderer/components/companion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDownIcon, SquareLock01Icon } from "@hugeicons/core-free-icons";
import FloatingTab from "@renderer/components/floatingTab";
import Overview from "@renderer/pages/notch/_views/overview";
import CompanionSettings from "@renderer/pages/notch/_views/companionSettings";
import Settings from "@renderer/pages/notch/_views/settings";

type Size = { width: number; height: number };

const CollapsedView = () => {
   return (
      <div className="collapsed_container">
         <Companion />
         <div className="arrow_container">
            <HugeiconsIcon
               icon={ChevronDownIcon}
               size={14}
               color="#92A8AC"
               strokeWidth={3}
            />
         </div>
      </div>
   );
};

const ExpandedView = ({ notchHeight }: { notchHeight: number }) => {
   const [view, setView] = useState<"overview" | "companion" | "settings">(
      "overview"
   );

   return (
      <div
         className="expanded_container"
         style={{ paddingTop: notchHeight + 24 }}
      >
         <FloatingTab
            tabs={[
               { label: "Overview", value: "overview" },
               { label: "Companion", value: "companion" },
               { label: "Settings", value: "settings" }
            ]}
            onChange={setView}
         />

         {view === "overview" ? (
            <Overview />
         ) : view === "companion" ? (
            <CompanionSettings />
         ) : (
            <Settings />
         )}

         <div className="privacy_notice">
            <HugeiconsIcon
               icon={SquareLock01Icon}
               size={14}
               color="#92A8AC"
               strokeWidth={2}
            />
            <span>Just for you. Stored locally.</span>
         </div>
      </div>
   );
};

const Notch = () => {
   const [expanded, setExpanded] = useState(false);
   const [geo, setGeo] = useState<{ collapsed: Size; expanded: Size } | null>(
      null
   );

   useEffect(() => {
      window.notchAPI.getGeometry().then(setGeo);
      return window.notchAPI.onHover(setExpanded);
   }, []);

   if (!geo) return null;

   const size = expanded ? geo.expanded : geo.collapsed;

   return (
      <div
         className={`notch ${expanded ? "expanded" : ""}`}
         style={{ width: size.width, height: size.height }}
      >
         {expanded ? (
            <ExpandedView notchHeight={geo.collapsed.height} />
         ) : (
            <CollapsedView />
         )}
      </div>
   );
};

export default Notch;
