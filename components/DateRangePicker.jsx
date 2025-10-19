"use client"
import React, { useState, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'


export default function DateRangePicker({ start, end, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-indigo-50 rounded-lg px-3 py-2 shadow-sm border border-indigo-100">
      <DatePicker
        selected={start ? new Date(start) : null}
        onChange={d => {
          if (!d) return;
          const s = d.toISOString().slice(0, 10);
          onChange && onChange(s, end || s);
        }}
        selectsStart
        startDate={start ? new Date(start) : null}
        endDate={end ? new Date(end) : null}
        className="rounded border border-indigo-200 px-2 py-1 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
        calendarClassName="rounded-lg shadow-lg border border-indigo-200"
      />
      <span className="text-gray-400 font-bold">to</span>
      <DatePicker
        selected={end ? new Date(end) : null}
        onChange={d => {
          if (!d) return;
          const e = d.toISOString().slice(0, 10);
          onChange && onChange(start || e, e);
        }}
        selectsEnd
        startDate={start ? new Date(start) : null}
        endDate={end ? new Date(end) : null}
        className="rounded border border-indigo-200 px-2 py-1 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
        calendarClassName="rounded-lg shadow-lg border border-indigo-200"
      />
    </div>
  );
}
