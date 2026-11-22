import "./index.css";
import Companion from "@renderer/components/companion";
import { useEffect, useState } from "react";
import { CompanionColors } from "../../../../../../_shared/settings";
import { useSettings } from "@renderer/hooks/useSettings";

function paletteToCompanionColors(paletteColors: {
   stroke: { start: string; end: string };
   body: { start: string; end: string };
   leaf: { start: string; end: string };
   highlight: string;
}): CompanionColors {
   return {
      bodyStrokeGradientStart: paletteColors.stroke.start,
      bodyStrokeGradientEnd: paletteColors.stroke.end,
      bodyGradientStart: paletteColors.body.start,
      bodyGradientEnd: paletteColors.body.end,
      bodyHighlight: paletteColors.highlight,
      leafPrimary: paletteColors.leaf.start,
      leafSecondary: paletteColors.leaf.end
   };
}

const PALETTES = [
   {
      name: "Mint & lagoon",
      desc: "Fresh · original",
      colors: {
         stroke: { start: "#83F6BC", end: "#40CED3" },
         body: { start: "#4DE29D", end: "#2C81C3" },
         leaf: { start: "#62C357", end: "#93D455" },
         highlight: "#A5F8C9"
      }
   },
   {
      name: "Lavender dusk",
      desc: "Soft · dreamy",
      colors: {
         stroke: { start: "#CBB6FF", end: "#8C83EB" },
         body: { start: "#CBB6FF", end: "#6854AE" },
         leaf: { start: "#E7B5E1", end: "#F2D4EA" },
         highlight: "#E8D9FF"
      }
   },
   {
      name: "Peach & coral",
      desc: "Warm · playful",
      colors: {
         stroke: { start: "#FFCEAD", end: "#EF8B82" },
         body: { start: "#FFCEAD", end: "#D75C65" },
         leaf: { start: "#F1D475", end: "#F9E8A8" },
         highlight: "#FFE8D4"
      }
   },
   {
      name: "Ocean blue",
      desc: "Cool · calm",
      colors: {
         stroke: { start: "#9DDCF7", end: "#57AFCB" },
         body: { start: "#9DDCF7", end: "#3278AF" },
         leaf: { start: "#3d92d6", end: "#B5D4F8" },
         highlight: "#D4EEFF"
      }
   }
] as const;

const PALETTE_COLORS: CompanionColors[] = PALETTES.map(p =>
   paletteToCompanionColors(p.colors)
);

const CompanionSettings = () => {
   const settings = useSettings();
   const [selectedPalette, setSelectedPalette] = useState(
      settings?.paletteIndex ?? 0
   );

   useEffect(() => {
      setSelectedPalette(settings?.paletteIndex ?? 0);
   }, [settings?.paletteIndex]);

   const handleSave = async () => {
      await window.settingsAPI.settingsSet({
         companionPalette: PALETTE_COLORS[selectedPalette],
         paletteIndex: selectedPalette
      });
   };

   return (
      <div className="companion_settings">
         <div className="text_container">
            <span className="label">A little more you</span>
            <span className="sub_label">
               Choose your Gelly’s colors. Make this space yours
            </span>
         </div>

         <div className="current_settings">
            <div className="top">
               <span className="label">Your Gelly palette</span>
               <button className="apply_btn" onClick={handleSave}>
                  <span>Apply</span>
               </button>
            </div>

            <div className="content">
               <div className="left">
                  <span className="label">
                     {PALETTES[selectedPalette].name}
                  </span>
                  <span className="desc">{PALETTES[selectedPalette].desc}</span>
                  <span className="info">live preview</span>
               </div>
               <Companion colorsProp={PALETTE_COLORS[selectedPalette]} />
            </div>
         </div>

         <div className="palettes_container">
            <div className="top">
               <span className="label">Find your color</span>
               <span className="count">4 palettes</span>
            </div>

            <div className="palettes">
               {PALETTES.map((p, index) => {
                  const isSelected = index === selectedPalette;
                  return (
                     <div
                        key={index}
                        className={`palette_item ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedPalette(index)}
                     >
                        <div className="left">
                           <div className="colors">
                              <span
                                 style={{
                                    background: `linear-gradient(90deg, ${p.colors.stroke.start} 0%, ${p.colors.stroke.end} 100%)`
                                 }}
                              ></span>
                              <span
                                 style={{
                                    background: `linear-gradient(90deg, ${p.colors.body.start} 0%, ${p.colors.body.end} 100%)`
                                 }}
                              ></span>
                              <span
                                 style={{
                                    background: `linear-gradient(90deg, ${p.colors.leaf.start} 0%, ${p.colors.leaf.end} 100%)`
                                 }}
                              ></span>
                           </div>
                           <div className="text_container">
                              <span className="name">{p.name}</span>
                              <span className="desc">{p.desc}</span>
                           </div>
                        </div>

                        <div className="checkbox"></div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
};

export default CompanionSettings;
