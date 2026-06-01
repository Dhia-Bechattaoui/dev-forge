// Example community component
export default function ExampleCard() {
  return (
    <div className="p-4 border border-blue-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all bg-blue-50">
      <h3 className="font-bold text-lg text-blue-900">Advanced Component</h3>
      <p className="text-blue-700 mt-2 text-sm">This component was imported dynamically from the <code>src/components/community</code> folder!</p>
    </div>
  );
}
