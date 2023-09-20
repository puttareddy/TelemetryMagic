import Link from "next/link";

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center flex-wrap bg-purple-700 p-3 ">
        <Link href="/">
          <a className="inline-flex items-center  p-2 ml-4 ">
            <span className="text-xl  p-2 text-white font-bold uppercase tracking-wide">
              Next Js and openTelemetry
            </span>
          </a>
        </Link>
      </nav>
    </>
  );
};
