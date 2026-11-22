import "./index.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshCcwIcon } from "@hugeicons/core-free-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getWeekDays } from "@renderer/helpers/dates";
import { useEffect, useState } from "react";
import { Analytics, DEFAULTS } from "../../../../../../_shared/analytics";

dayjs.extend(duration);

const WEEKS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const weekDays = getWeekDays(dayjs().format("YYYY-MM-DD"));
const today = Number(dayjs().format("D"));

export function formatDuration(ms: number): string {
   const d = dayjs.duration(Math.max(0, ms));
   const h = Math.floor(d.asHours());
   const m = d.minutes();
   return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

const Overview = () => {
   const [analytics, setAnalytics] = useState<Analytics>(DEFAULTS);

   useEffect(() => {
      void getAnalytics();
   }, []);

   const getAnalytics = async () => {
      const analytics = await window.activityAPI.getAnalytics();
      setAnalytics(analytics);
   };

   return (
      <div className="overview_container">
         <div className="top">
            <div className="text_container">
               <span className="label">Make room for a good day</span>
               <span className="today">{dayjs().format("dddd, MMMM D")}</span>
            </div>

            <button onClick={getAnalytics}>
               <HugeiconsIcon
                  icon={RefreshCcwIcon}
                  size={18}
                  color="#082C31"
                  strokeWidth={2}
               />
               Refresh current stats
            </button>
         </div>

         <div className="stats_container">
            <span className="label">Today’s stats</span>
            <div className="stats">
               <div className="stat_item">
                  <span className="label">Focus time</span>
                  <span className="value">
                     {formatDuration(analytics.appFocusTime)}
                  </span>
                  <span className="info">
                     {" "}
                     {Math.round(
                        (analytics.appFocusTime * 100) /
                           analytics.totalActivityTime
                     )}
                     % of total time
                  </span>
               </div>
               <div className="stat_item">
                  <span className="label">Idle time</span>
                  <span className="value">
                     {formatDuration(analytics.idleTime)}
                  </span>
                  <span className="info">
                     {Math.round(
                        (analytics.idleTime * 100) / analytics.totalActivityTime
                     )}
                     % of total time
                  </span>
               </div>
               <div className="stat_item">
                  <span className="label">Total active time</span>
                  <span className="value">
                     {formatDuration(analytics.totalActivityTime)}
                  </span>
                  {/*<span className="info">24% of total time</span>*/}
               </div>
            </div>
         </div>

         <div className="week_container">
            <div className="top">
               <span className="label">This week</span>
            </div>
            <div className="week_days">
               {WEEKS.map((column, index) => (
                  <div
                     className={`day_item ${today === new Date(weekDays[index]).getDate() ? "today" : ""}`}
                     key={index}
                  >
                     <span className="day">{column}</span>
                     <span className="date">
                        {new Date(weekDays[index]).getDate()}
                     </span>
                     <span className="dot"></span>
                  </div>
               ))}
            </div>
         </div>

         {/*<div className="projects_container">*/}
         {/*   <div className="top">*/}
         {/*      <span className="label">*/}
         {/*         Projects <span>2</span>*/}
         {/*      </span>*/}
         {/*      <button>*/}
         {/*         <HugeiconsIcon*/}
         {/*            icon={PlusIcon}*/}
         {/*            size={18}*/}
         {/*            color="#65E7C2"*/}
         {/*            strokeWidth={2}*/}
         {/*         />*/}
         {/*         Add directory*/}
         {/*      </button>*/}
         {/*   </div>*/}
         {/*   <div className="projects">*/}
         {/*      <div className="project_item">*/}
         {/*         <div className="left">*/}
         {/*            <div className="icon_wrapper">*/}
         {/*               <HugeiconsIcon*/}
         {/*                  icon={Folder01Icon}*/}
         {/*                  size={24}*/}
         {/*                  color="#65E7C2"*/}
         {/*                  strokeWidth={2}*/}
         {/*               />*/}
         {/*            </div>*/}
         {/*            <div className="folder_info">*/}
         {/*               <span className="folder_name">Design resources</span>*/}
         {/*               <span className="folder_path">*/}
         {/*                  ~/Documents/Design resources*/}
         {/*               </span>*/}
         {/*            </div>*/}
         {/*         </div>*/}

         {/*         <button className="delete_button">*/}
         {/*            <HugeiconsIcon*/}
         {/*               icon={TrashIcon}*/}
         {/*               size={18}*/}
         {/*               color="#A2B7BB"*/}
         {/*               strokeWidth={2}*/}
         {/*            />*/}
         {/*         </button>*/}
         {/*      </div>*/}
         {/*      <div className="project_item">*/}
         {/*         <div className="left">*/}
         {/*            <div className="icon_wrapper">*/}
         {/*               <HugeiconsIcon*/}
         {/*                  icon={Folder01Icon}*/}
         {/*                  size={24}*/}
         {/*                  color="#65E7C2"*/}
         {/*                  strokeWidth={2}*/}
         {/*               />*/}
         {/*            </div>*/}
         {/*            <div className="folder_info">*/}
         {/*               <span className="folder_name">Design resources</span>*/}
         {/*               <span className="folder_path">*/}
         {/*                  ~/Documents/Design resources*/}
         {/*               </span>*/}
         {/*            </div>*/}
         {/*         </div>*/}

         {/*         <button className="delete_button">*/}
         {/*            <HugeiconsIcon*/}
         {/*               icon={TrashIcon}*/}
         {/*               size={18}*/}
         {/*               color="#A2B7BB"*/}
         {/*               strokeWidth={2}*/}
         {/*            />*/}
         {/*         </button>*/}
         {/*      </div>*/}
         {/*      <div className="project_item">*/}
         {/*         <div className="left">*/}
         {/*            <div className="icon_wrapper">*/}
         {/*               <HugeiconsIcon*/}
         {/*                  icon={Folder01Icon}*/}
         {/*                  size={24}*/}
         {/*                  color="#65E7C2"*/}
         {/*                  strokeWidth={2}*/}
         {/*               />*/}
         {/*            </div>*/}
         {/*            <div className="folder_info">*/}
         {/*               <span className="folder_name">Design resources</span>*/}
         {/*               <span className="folder_path">*/}
         {/*                  ~/Documents/Design resources*/}
         {/*               </span>*/}
         {/*            </div>*/}
         {/*         </div>*/}

         {/*         <button className="delete_button">*/}
         {/*            <HugeiconsIcon*/}
         {/*               icon={TrashIcon}*/}
         {/*               size={18}*/}
         {/*               color="#A2B7BB"*/}
         {/*               strokeWidth={2}*/}
         {/*            />*/}
         {/*         </button>*/}
         {/*      </div>*/}
         {/*      <div className="project_item">*/}
         {/*         <div className="left">*/}
         {/*            <div className="icon_wrapper">*/}
         {/*               <HugeiconsIcon*/}
         {/*                  icon={Folder01Icon}*/}
         {/*                  size={24}*/}
         {/*                  color="#65E7C2"*/}
         {/*                  strokeWidth={2}*/}
         {/*               />*/}
         {/*            </div>*/}
         {/*            <div className="folder_info">*/}
         {/*               <span className="folder_name">Design resources</span>*/}
         {/*               <span className="folder_path">*/}
         {/*                  ~/Documents/Design resources*/}
         {/*               </span>*/}
         {/*            </div>*/}
         {/*         </div>*/}

         {/*         <button className="delete_button">*/}
         {/*            <HugeiconsIcon*/}
         {/*               icon={TrashIcon}*/}
         {/*               size={18}*/}
         {/*               color="#A2B7BB"*/}
         {/*               strokeWidth={2}*/}
         {/*            />*/}
         {/*         </button>*/}
         {/*      </div>*/}
         {/*      <div className="project_item">*/}
         {/*         <div className="left">*/}
         {/*            <div className="icon_wrapper">*/}
         {/*               <HugeiconsIcon*/}
         {/*                  icon={Folder01Icon}*/}
         {/*                  size={24}*/}
         {/*                  color="#65E7C2"*/}
         {/*                  strokeWidth={2}*/}
         {/*               />*/}
         {/*            </div>*/}
         {/*            <div className="folder_info">*/}
         {/*               <span className="folder_name">Design resources</span>*/}
         {/*               <span className="folder_path">*/}
         {/*                  ~/Documents/Design resources*/}
         {/*               </span>*/}
         {/*            </div>*/}
         {/*         </div>*/}

         {/*         <button className="delete_button">*/}
         {/*            <HugeiconsIcon*/}
         {/*               icon={TrashIcon}*/}
         {/*               size={18}*/}
         {/*               color="#A2B7BB"*/}
         {/*               strokeWidth={2}*/}
         {/*            />*/}
         {/*         </button>*/}
         {/*      </div>*/}
         {/*   </div>*/}
         {/*</div>*/}
      </div>
   );
};

export default Overview;
