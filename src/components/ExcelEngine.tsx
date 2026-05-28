"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Download, Plus, Wand2, Trash2, Columns, X } from 'lucide-react';

interface ExcelEngineProps {
  onClose: () => void;
}

const ExcelEngine: React.FC<ExcelEngineProps> = ({ onClose }) => {
  const [data, setData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [timeFormat, setTimeFormat] = useState<string>("12");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      const headersArray = (XLSX.utils.sheet_to_json(ws, { header: 1 })[0] || []) as string[];
      const jsonObjects = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { raw: false });
      
      const parsedData = jsonObjects.map((obj) => {
        return headersArray.map(header => obj[header] !== undefined ? String(obj[header]) : "");
      });

      if (headersArray.length > 0) {
        setHeaders(headersArray.map(h => h || ""));
        setData(parsedData);
        setSelectedColumn(headersArray[0] || "");
      }
    };
    reader.readAsBinaryString(file);
  };

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
        newRow.push("");
      }

      const timestampVal = String(newRow[targetIdx]).trim();
      let datePart = timestampVal;
      let timePart = "";

      if (timestampVal && timestampVal !== "undefined" && timestampVal !== "") {
        const parts = timestampVal.split(/\s+/);
        
        if (parts.length >= 2) {
          datePart = parts[0];
          timePart = parts[1];
          
          if (timeFormat === "12" && timePart.includes(":")) {
            const timeSplit = timePart.split(":");
            let hours = parseInt(timeSplit[0] || "0", 10);
            const minutes = timeSplit[1] || "00";
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            timePart = `${hours}:${minutes} ${ampm}`;
          }
        }
      }

      newRow.splice(targetIdx + 1, 0, timePart);
      newRow[targetIdx] = datePart;
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

  const exportToExcel = () => {
    const finalContent = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(finalContent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Processed_Data");
    XLSX.writeFile(wb, fileName ? `Processed_${fileName}` : "ToolWool_Export.xlsx");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-white/5">
        
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
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          
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
                              {row[j] !== undefined ? String(row[j]) : ""}
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

export default ExcelEngine;