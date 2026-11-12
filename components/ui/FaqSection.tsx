'use client';

import { useState } from 'react';
import { useCms } from '@/components/cms/CmsProvider';

export default function FaqSection({ maxItems }: { maxItems?: number }) {
  const { getSectionContent, isSectionActive } = useCms();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isSectionActive('faq')) return null;

  const faqData = getSectionContent('faq');
  const allItems = Array.isArray(faqData?.items)
    ? [...faqData.items]
        .filter((item: any) => item.actif !== false)
        .sort((a: any, b: any) => (a.ordre ?? 0) - (b.ordre ?? 0))
    : [];

  const items = maxItems ? allItems.slice(0, maxItems) : allItems;
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold-500 font-semibold text-sm uppercase tracking-widest mb-2">
            {faqData?.subtitle || 'Foire Aux Questions'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-700">
            {faqData?.title || 'Questions fréquemment posées'}
          </h2>
          {faqData?.description && (
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              {faqData.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id || idx}
                className="card-modern bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                >
                  <div>
                    {item.categorie && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-1">
                        {item.categorie}
                      </span>
                    )}
                    <h3 className="font-bold text-navy-700 text-sm sm:text-base">
                      {item.question}
                    </h3>
                  </div>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-transform duration-300 ${
                      isOpen
                        ? 'bg-gold-400 text-navy-900 rotate-180'
                        : 'bg-gray-100 text-navy-600'
                    }`}
                  >
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    {item.reponse}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
