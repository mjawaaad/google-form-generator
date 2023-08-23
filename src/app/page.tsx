import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex  max-h-screen flex-col items-center  ">
      <h1 className="text-3xl my-10 font-bold">Generate Your Form</h1>
      <h2 className="text-md">Login to create your forms! </h2>
      <section className="absolute h-screen flex items-center justify-center ">
        <Link
          href={"/create-form"}
          className="bg-indigo-700 text-white py-2 px-4 mx-2"
        >
          Create your Form
        </Link>
      </section>
    </main>
  );
}
