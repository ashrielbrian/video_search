export const Footer = () => {
    return (
        <footer className="bg-white rounded-lg shado shadow-md border border-indigo-500 m-8 ">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-md text-black-500 sm:text-center dark:text-black-400 ">
                    © Audio Sermons belong to{" "}
                    <a
                        href="https://www.mljtrust.org/"
                        className="hover:underline"
                    >
                        MLJ Trust
                    </a>
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black-500 dark:text-black-400 sm:mt-0">
                    {/* <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
                    </li> */}
                </ul>
            </div>
        </footer>
    );
};
