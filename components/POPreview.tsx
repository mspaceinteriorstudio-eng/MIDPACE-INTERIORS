
import React from 'react';
import { PurchaseOrder, COMPANY_DETAILS } from '../types';

interface Props {
  po: PurchaseOrder;
}

const POPreview: React.FC<Props> = ({ po }) => {
  return (
    <div className="bg-white p-4 md:p-8 max-w-[210mm] mx-auto print:p-0">
      <div className="border-2 border-slate-800 bg-[#d9e7d4] font-sans text-sm">
        {/* Main Header */}
        <div className="border-b-2 border-slate-800 p-2 text-center">
          <h1 className="text-2xl font-bold tracking-wider uppercase">{COMPANY_DETAILS.name}</h1>
        </div>
        <div className="border-b-2 border-slate-800 p-1 text-center font-bold text-xs">
          {COMPANY_DETAILS.subHeader}
        </div>
        <div className="border-b-2 border-slate-800 p-2 text-center">
          <h2 className="text-xl font-bold underline">Purchase Requisition</h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-12 border-b-2 border-slate-800">
          <div className="col-span-2 border-r-2 border-slate-800 p-1 font-bold">PRQ NO</div>
          <div className="col-span-10 p-1">{po.poNumber}</div>
        </div>
        <div className="grid grid-cols-12 border-b-2 border-slate-800">
          <div className="col-span-2 border-r-2 border-slate-800 p-1 font-bold">PO Date</div>
          <div className="col-span-4 border-r-2 border-slate-800 p-1">{po.date}</div>
          <div className="col-span-6 p-1"></div>
        </div>
        <div className="grid grid-cols-12 border-b-2 border-slate-800">
          <div className="col-span-2 border-r-2 border-slate-800 p-1 font-bold">LOCATION</div>
          <div className="col-span-10 p-1">{po.location}</div>
        </div>
        <div className="grid grid-cols-12 border-b-2 border-slate-800">
          <div className="col-span-2 border-r-2 border-slate-800 p-1 font-bold h-8"></div>
          <div className="col-span-8 border-r-2 border-slate-800 p-1"></div>
          <div className="col-span-1 border-r-2 border-slate-800 p-1"></div>
          <div className="col-span-1 p-1"></div>
        </div>
        <div className="grid grid-cols-12 border-b-2 border-slate-800 items-center">
          <div className="col-span-2 border-r-2 border-slate-800 p-1 font-bold">Proj Name</div>
          <div className="col-span-10 p-1 text-lg font-bold">{po.projectName}</div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 border-b-2 border-slate-800 font-bold bg-[#d9e7d4]">
          <div className="col-span-1 border-r-2 border-slate-800 p-1 text-center">SI NO</div>
          <div className="col-span-4 border-r-2 border-slate-800 p-1">Materials</div>
          <div className="col-span-2 border-r-2 border-slate-800 p-1 text-center">Brand</div>
          <div className="col-span-3 border-r-2 border-slate-800 p-1 text-center">Speicification</div>
          <div className="col-span-1 border-r-2 border-slate-800 p-1 text-center">UOM</div>
          <div className="col-span-1 p-1 text-center">Qty</div>
        </div>

        {/* Table Content */}
        {po.items.map((item, index) => (
          <div key={item.id} className={`grid grid-cols-12 border-b border-slate-400 last:border-b-2 last:border-slate-800 ${index % 2 === 0 ? 'bg-white' : 'bg-[#eef5eb]'}`}>
            <div className="col-span-1 border-r-2 border-slate-800 p-1 text-center text-blue-800 font-bold">{index + 1}</div>
            <div className="col-span-4 border-r-2 border-slate-800 p-1 text-blue-900 font-bold">{item.description}</div>
            <div className="col-span-2 border-r-2 border-slate-800 p-1 text-blue-900">{item.brand}</div>
            <div className="col-span-3 border-r-2 border-slate-800 p-1 text-blue-900">{item.specification}</div>
            <div className="col-span-1 border-r-2 border-slate-800 p-1 text-center text-blue-900">{item.unit}</div>
            <div className="col-span-1 p-1 text-center font-bold text-blue-900">{item.quantity}</div>
          </div>
        ))}

        {/* Empty Space for visual matching */}
        <div className="h-10 border-b-2 border-slate-800"></div>

        {/* Footer */}
        <div className="p-2 font-bold bg-white">
          Prepared By : {po.preparedBy || "sujith"}
        </div>
      </div>

      <div className="mt-4 no-print text-[10px] text-slate-400 text-center">
        Note: The exported layout follows the exact TRIVANDRUM, ATTINGAL, CHEMPOOR template.
      </div>
    </div>
  );
};

export default POPreview;
