import "./index.css";
import { InputHTMLAttributes, useEffect, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   leftLabel?: string;
   labelClassName?: string;
   onChangeProp?: (checked: boolean, value: string) => void;
}

const Toggle = ({
   label,
   leftLabel,
   checked,
   onChangeProp,
   ...props
}: Props) => {
   const [isChecked, setIsChecked] = useState(props.defaultChecked ?? false);

   useEffect(() => {
      if (checked !== undefined) setIsChecked(checked);
   }, [checked]);

   const handleChange = (value: string, checked: boolean) => {
      if (props.readOnly) return;

      setIsChecked(checked);
      onChangeProp?.(checked, value);
   };

   return (
      <div className={`toggle_container ${props.className ?? ""}`}>
         <label className={`${props.labelClassName ?? ""}`}>
            {leftLabel}
            <input
               {...props}
               className={`switch ${props.readOnly ? `readOnly` : ""}`}
               type="checkbox"
               checked={isChecked}
               onClick={event => event.stopPropagation()}
               onChange={e => handleChange(e.target.value, e.target.checked)}
               onKeyDown={e => e.key === "Enter" && e.preventDefault()}
            />
            {label}
         </label>
      </div>
   );
};

export default Toggle;
