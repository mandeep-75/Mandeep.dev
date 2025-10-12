export default function Card({ title, description }) {
  return (
    <div className="border border-gray-700 bg-gray-800 rounded-lg p-6 shadow-lg m-2">
      <h3 className="text-xl font-bold mb-2 text-blue-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
