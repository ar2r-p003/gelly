import "./index.css";
import { useEffect, useRef, useState } from "react";

type TabOption<T> = {
   value: T;
   label: string;
};

interface Props<T extends string> {
   disabled?: Array<boolean>;
   active?: T;
   tabs: TabOption<T>[];
   onChange: (value: T) => void;
}

const FloatingTab = <T extends string>({
   active,
   disabled,
   tabs,
   onChange
}: Props<T>) => {
   const [activeTab, setActiveTab] = useState(0);
   const tabRefs = useRef<Array<HTMLDivElement | null>>([]);

   useEffect(() => {
      if (!active) return;

      const activeIndex = tabs.findIndex(tab => tab.value === active);
      setActiveTab(activeIndex);
   }, [active, tabs]);

   const handleTabClick = (index: number) => {
      if (disabled?.[index]) return;

      setActiveTab(index);
      onChange(tabs[index].value);
   };

   return (
      <figure className="floating_tab_container">
         <span
            className="indicator"
            style={{
               width: `calc(${100 / tabs.length}% - 6px)`,
               transform: `
                  translateX(${(tabRefs.current[activeTab]?.offsetLeft || 4) - 4}px)
                  `
            }}
         ></span>

         {tabs.map((tab, index) => (
            <div
               key={tab.value}
               ref={el => {
                  tabRefs.current[index] = el;
               }}
               className={`tab ${activeTab === index ? "active" : ""}`}
               onClick={() => handleTabClick(index)}
               inert={disabled?.[index]}
            >
               <span>{tab.label}</span>
            </div>
         ))}
      </figure>
   );
};

export default FloatingTab;
