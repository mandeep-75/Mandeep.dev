export default function Contact() {
  return (
    <section id="contact" className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Contact</h2>
      <form className="flex flex-col gap-4">
        <input
          className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          type="email"
          placeholder="Your Email"
        />
        <textarea
          className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          rows="4"
          placeholder="Your Message"
        ></textarea>
        <button
          className="bg-blue-500 hover:bg-blue-600 py-2 rounded text-white"
          type="submit"
        >
          Send
        </button>
      </form>
    </section>
  );
}
