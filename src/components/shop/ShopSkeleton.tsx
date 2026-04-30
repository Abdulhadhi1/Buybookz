"use client";

export default function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar Placeholder */}
      <div className="h-16 bg-white border-b border-border w-full fixed top-0 z-50"></div>

      {/* Category Bar Placeholder */}
      <div className="pt-24 bg-white border-b border-border shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex space-x-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-4 w-20 bg-slate-100 animate-pulse rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm h-96 animate-pulse">
              <div className="h-4 w-1/2 bg-slate-100 rounded-full mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-3 w-full bg-slate-50 rounded-full"></div>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid Skeleton */}
          <div className="flex-grow">
            <div className="h-8 w-64 bg-slate-100 animate-pulse rounded-full mb-10"></div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4.5] w-full bg-slate-100 animate-pulse rounded-2xl"></div>
                  <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded-full"></div>
                  <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
