import "./index.css";
import { useEffect, useRef, useState } from "react";
import Companion from "../../components/companion";

const EYE_CENTER = { x: 120.5, y: 163.9 };
const MAX_TRAVEL = { x: 20, y: 15 };
const LOOK_RANGE = 250;

const CompanionPage = () => {
   const [isMusicPlaying, setIsMusicPlaying] = useState(false);
   const [isSleeping, setIsSleeping] = useState(false);
   const companion = useRef<SVGSVGElement | null>(null);
   const eyes = useRef<SVGGElement | null>(null);

   useEffect(() => {
      companion.current?.addEventListener("mousedown", e => {
         if (e.button !== 0) return;
         let moved = false;

         window.companionAPI.dragStart();

         const onMove = () => {
            moved = true;
            window.companionAPI.dragMove();
         };

         const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.companionAPI.dragEnd();
            if (!moved)
               companion.current?.dispatchEvent(
                  new CustomEvent("companion-click")
               );
         };

         window.addEventListener("mousemove", onMove);
         window.addEventListener("mouseup", onUp, { once: true });
      });

      const off = window.companionAPI.onPlayerStateUpdate(value => {
         if (value === "playing") {
            setIsMusicPlaying(true);
         } else {
            setIsMusicPlaying(false);
         }
      });

      return () => off();
   }, []);

   useEffect(() => {
      const lookAt = (clientX: number, clientY: number) => {
         const svg = companion.current;
         const eyesEl = eyes.current;
         const ctm = svg?.getScreenCTM();
         if (!svg || !eyesEl || !ctm) return;

         const center = new DOMPoint(
            EYE_CENTER.x,
            EYE_CENTER.y
         ).matrixTransform(ctm);

         let nx = (clientX - center.x) / LOOK_RANGE;
         let ny = (clientY - center.y) / LOOK_RANGE;
         const len = Math.hypot(nx, ny);
         if (len > 1) {
            nx /= len;
            ny /= len;
         }

         eyesEl.style.transform = `translate(${nx * MAX_TRAVEL.x}px, ${ny * MAX_TRAVEL.y}px)`;
      };

      const off = window.companionAPI.onCursor(({ x, y }) =>
         !isSleeping ? lookAt(x, y) : undefined
      );
      return () => off();
   }, [isSleeping]);

   useEffect(() => {
      const off = window.companionAPI.onCompanionSleep(value => {
         setIsSleeping(value);
      });

      return () => off();
   }, []);

   return (
      <div className="stage">
         <Companion
            ref={companion}
            eyesRef={eyes}
            className={`${isMusicPlaying ? "dancing" : undefined} ${isSleeping ? "sleeping" : undefined}`}
         />
      </div>
   );
};

export default CompanionPage;
