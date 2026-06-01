import { communityComponents } from '@/components/community';

export default function ShowcasePage() {
  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Advanced Components Showcase</h1>
        <p className="text-gray-600 dark:text-gray-400">Custom React UI components built by experienced community contributors.</p>
      </header>

      <div className="flex flex-col gap-12">
        {communityComponents.map((item, idx) => (
          <div key={idx} className="flex flex-col space-y-4 w-full">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {item.name}
              </span>
              <a
                href={`https://github.com/${item.author}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full transition-colors"
              >
                <img src={`https://github.com/${item.author}.png`} className="w-5 h-5 rounded-full" alt={item.author} />
                by @{item.author}
              </a>
            </div>

            <div className="w-full flex justify-center">
              {/* Render the community component dynamically */}
              <item.component />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
