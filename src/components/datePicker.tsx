import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

type DateInputViProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
};

export default function DateInputVi({ value, onChange, disabled }: DateInputViProps) {
  return (
    <div className="relative w-full max-w-xs">
      <DatePicker
        selected={value}
        onChange={onChange}
        locale="vi"
        dateFormat="dd/MM/yyyy"
        placeholderText="Chọn ngày muốn hiến máu"
        minDate={new Date()}
        className="w-full p-4 pl-10 border-none bg-[#D9D9D9] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 text-black text-base"
        calendarClassName="!bg-white !text-black !shadow-lg !rounded-lg"
        wrapperClassName="w-full"
        disabled={disabled}
        popperPlacement="right-start"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 6], 
            },
          },
        ]}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="2" fill="#bbb"/>
          <path stroke="#666" strokeWidth="2" d="M3 9h18M7 5V3m10 2V3"/>
        </svg>
      </span>
    </div>
  );
}
