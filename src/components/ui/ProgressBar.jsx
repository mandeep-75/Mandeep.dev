export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
      <div
        className="bg-blue-500 h-4 rounded-full transition-all"
        style={{ width: progress + "%" }}
      ></div>
    </div>
  );
}
