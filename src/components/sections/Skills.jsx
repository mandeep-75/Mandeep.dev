export default function Skills() {
  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-3">
        <span className="bg-gray-800 px-4 py-2 rounded-full text-sm">
          Python
        </span>
        <span className="bg-gray-800 px-4 py-2 rounded-full text-sm">
          QA Automation
        </span>
        <span className="bg-gray-800 px-4 py-2 rounded-full text-sm">
          AI/ML
        </span>
        {/* Add more skills as needed */}
      </div>
    </section>
  );
}
