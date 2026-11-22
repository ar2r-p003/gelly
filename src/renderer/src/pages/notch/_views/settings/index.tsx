import "./index.css";
import Toggle from "@renderer/components/toggle";
import FloatingTab from "@renderer/components/floatingTab";
import { useSettings } from "@renderer/hooks/useSettings";

const Settings = () => {
   const settings = useSettings();

   const handleFocusAppChange = (value: string) => {
      void window.settingsAPI.settingsSet({
         focusApp: value
      });
   };

   const handleLaunchAtStartupChange = (value: boolean) => {
      void window.settingsAPI.settingsSet({
         launchAtLogin: value
      });
   };

   return (
      <div className="settings_container">
         <div className="top">
            <span className="label">Settings</span>
            <span className="sub_label">
               A few preferences to make app feel like yours
            </span>
         </div>

         <div className="startup_block">
            <span className="label">General</span>

            <div className="wrapper">
               <div className="text_container">
                  <span className="label">Launch at startup</span>
                  <span className="desc">
                     Open Gelly automatically when you sign in.
                  </span>
               </div>

               <Toggle
                  checked={settings?.launchAtLogin}
                  onChangeProp={checked => handleLaunchAtStartupChange(checked)}
               />
            </div>
         </div>

         <div className="code_editor">
            <div className="top">
               <span className="label">Code Editor</span>
               <span className="sub_label">
                  Will be used for focus time calculation
               </span>
            </div>

            <FloatingTab
               active={settings?.focusApp}
               tabs={[
                  { label: "WebStorm", value: "webstorm" },
                  { label: "VS Code", value: "vscode" },
                  { label: "Visual Studio", value: "vs" },
                  { label: "Cursor", value: "cursor" }
               ]}
               onChange={handleFocusAppChange}
            />
         </div>
      </div>
   );
};

export default Settings;
