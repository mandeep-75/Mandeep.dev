import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-black to-gray-900">
      <h1 className="text-5xl font-extrabold mb-4 text-blue-400">
        all things are place holders
      </h1>
      <p className="text-xl text-gray-300 mb-6">
        Building smart solutions in AI, automation, and mobile development.
      </p>
      <Button
        onClick={() => {
          const el = document.getElementById("contact");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Click Me
      </Button>
    </section>
  );
}
