"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Download, Plus, Wand2, Trash2, Columns } from 'lucide-react';

const ExcelEngine = ({ onClose }: { onClose: () => void }) => {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [timeFormat, setTimeFormat] = useState<string>("12");

  // Load File: Raw values read karenge taake Excel ka hidden numeric timestamp bhi mil sakay
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      // raw: true rakhne se Excel ke numbers aur actual strings dono un-formatted milti hain
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: false });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      const headersArray: string[] = XLSX.utils.sheet_to_json(ws, { header: 1 })[0] as string[];
      
      // raw: false aur w/o cellDates se safe plain text dictionary milti hai
      const jsonObjects: any[] = XLSX.utils.sheet_to_json(ws, { raw: false });
      
      // Hamein raw values bhi chahiye ho sakti hain agar text mein time na ho, isliye cell rows ko absolute check karenge
      const rawJsonObjects: any[] = XLSX.utils.sheet_to_json(ws, { raw: true });

      const parsedData = jsonObjects.map((obj: any, rowIndex: number) => {
        return headersArray.map(header => {
          // Object structure create karte hain taake formatted aur raw value dono pass hon
          const formattedVal = obj[header] !== undefined ? obj[header] : "";
          const rawVal = rawJsonObjects[rowIndex]?.[header] !== undefined ? rawJsonObjects[rowIndex][header] : "";
          return { formatted: formattedVal, raw: rawVal };
        });
      });

      if (headersArray.length > 0) {
        setHeaders(headersArray);
        setData(parsedData);
        setSelectedColumn(headersArray[0]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Split and Matrix Shift Engine
  const handleSplitDateTime = () => {
    if (!selectedColumn || data.length === 0) return;

    const targetIdx = headers.indexOf(selectedColumn);
    if (targetIdx === -1) return;

    const newHeaders = [...headers];
    newHeaders.splice(targetIdx + 1, 0, `${selectedColumn} (Time)`);
    newHeaders[targetIdx] = `${selectedColumn} (Date)`;

    const newData = data.map((row) => {
      const newRow = [...row];
      
      while (newRow.length < headers.length) {
        newRow.push({ formatted: "", raw: "" });
      }

      const cellObj = newRow[targetIdx];
      const formattedStr = String(cellObj.formatted).trim();
      const rawVal = cellObj.raw;
      
      let datePart = formattedStr;
      let timePart = "";

      // APPROACH 1: Agar text string ke andar hi space aur time majood ho
      const parts = formattedStr.split(/\s+/);
      if (parts.length >= 2) {
        datePart = parts[0];
        timePart = parts[1];
      } 
      // APPROACH 2: Agar string fail ho jaye par background mein Excel Serial Number (Float) ho
      else if (typeof rawVal === 'number' && rawVal > 0) {
        // Excel serial number ka integer part Date hota hai aur decimal part Time hota hai
        const serialDate = Math.floor(rawVal);
        const serialTime = rawVal - serialDate;
        
        // Convert Excel Serial Time to Hours, Minutes, Seconds
        const totalSeconds = Math.round(serialTime * 24 * 60 * 60);
        const hours24 = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Formatted Time output mapping
        const minStr = minutes < 10 ? `0${minutes}` : minutes;
        const secStr = seconds < 10 ? `0${seconds}` : seconds;

        if (timeFormat === "12") {
          const ampm = hours24 >= 12 ? 'PM' : 'AM';
          let hours12 = hours24 % 12;
          hours12 = hours12 ? hours12 : 12;
          timePart = `${hours12}:${minStr}:${secStr} ${ampm}`;
        } else {
          const hrStr = hours24 < 10 ? `0${hours24}` : hours24;
          timePart = `${hrStr}:${minStr}:${secStr}`;
        }

        // Agar Date string numeric ban gayi ho, toh usay safe static date shakal mein fallback karein
        if (!isNaN(Number(datePart))) {
          const jsDate = XLSX.SSF.parse_date_code(rawVal);
          datePart = `${jsDate.m}/${jsDate.d}/${jsDate.y}`;
        }
      }
      // APPROACH 3: Standard JS Date Object parsing fallback
      else {
        const parsedDate = new Date(formattedStr);
        if (!isNaN(parsedDate.getTime())) {
          datePart = parsedDate.toLocaleDateString();
          timePart = parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
      }

      // Safe deployment back to schema map object
      newRow.splice(targetIdx + 1, 0, { formatted: timePart, raw: timePart });
      newRow[targetIdx] = { formatted: datePart, raw: datePart };
      return newRow;
    });

    setHeaders(newHeaders);
    setData(newData);
  };

  const handleReset = () => {
    setData([]);
    setHeaders([]);
    setFileName("");
    setSelectedColumn("");
  };

  // Export Matrix Map back to standard flat array configuration
  const exportToExcel = () => {
    const flatData = data.map(row => row.map((cell: any) => cell.formatted));
    const finalContent = [headers, ...flatData];
    const ws = XLSX.utils.aoa_to_sheet(finalContent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Processed_Data");
    XLSX.writeFile(wb, fileName ? `Processed_${fileName}` : "ToolWool_Export.xlsx");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-white/5">
        
        {/* Top Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white">Excel Data Engine</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Smart Transform Module</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <XIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          
          {/* Side Configuration Panel */}
          <div className="w-full lg:w-80 border-r border-gray-200 dark:border-white/5 p-6 space-y-6 overflow-y-auto bg-white dark:bg-[#151515]">
            {data.length > 0 && (
              <div className="space-y-5">
                <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Columns className="w-3 h-3" /> Date-Time Splitter
                </label>
                
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-500">Select Target Column</span>
                  <select 
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none text-gray-700 dark:text-gray-300"
                  >
                    {headers.map((header, idx) => (
                      <option key={idx} value={header}>{header || `Column ${idx + 1}`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-500">Time Format Output</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setTimeFormat("12")}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${timeFormat === "12" ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-transparent text-gray-400 border-gray-200 dark:border-white/5'}`}
                    >
                      12 Hour (AM/PM)
                    </button>
                    <button 
                      onClick={() => setTimeFormat("24")}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${timeFormat === "24" ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-transparent text-gray-400 border-gray-200 dark:border-white/5'}`}
                    >
                      24 Hour (Military)
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSplitDateTime}
                  className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-xs"
                >
                  <Wand2 className="w-4 h-4" /> Split & Shift Columns
                </button>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                  <button 
                    onClick={handleReset}
                    className="w-full py-2.5 border border-red-200 dark:border-red-900/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs"
                  >
                    <Trash2 className="w-4 h-4" /> Clear Current Dataset
                  </button>
                </div>
              </div>
            )}
            
            {!data.length && (
              <div className="h-full flex items-center justify-center text-center text-gray-400 text-xs italic">
                Upload an Excel/CSV file to unlock configurations.
              </div>
            )}
          </div>

          {/* Table Spreadsheet Viewport */}
          <div className="flex-1 p-6 overflow-auto">
            {!data.length ? (
              <div className="h-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-black/10 transition-all hover:border-green-600/30">
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" id="excel-main-file" />
                <label htmlFor="excel-main-file" className="cursor-pointer group flex flex-col items-center text-center p-8">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Import Spreadsheet Dataset</span>
                  <span className="text-xs text-gray-400 mt-1">Supports .xlsx, .xls, .csv</span>
                </label>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-4">
                <div className="flex justify-between items-center bg-white dark:bg-[#151515] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="truncate pr-4">
                    <span className="text-xs font-bold text-gray-400 uppercase block tracking-wider">Active File</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{fileName}</span>
                  </div>
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" /> Export Processed Sheet
                  </button>
                </div>
                
                {/* Table Sheet View */}
                <div className="flex-1 overflow-auto border border-gray-200 dark:border-white/5 rounded-xl shadow-inner bg-white dark:bg-black/20">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-[#181818] z-10 shadow-sm">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="p-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/5 whitespace-nowrap">{h || `Header ${i+1}`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                          {headers.map((_, j) => (
                            <td key={j} className="p-3.5 text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-nowrap">
                              {row[j] !== undefined ? String(row[j].formatted) : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const XIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

export default ExcelEngine;