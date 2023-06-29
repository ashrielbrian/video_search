import Image from "next/image";
import Link from "next/link";
export const Header = () => {
    return (
        <div className="bg-transprent border-b-2">
            {/* <div className="bg-gradient-to-r from-red-400 to-orange-300"> */}
            <nav className="relative container mx-auto p-2">
                <div className="flex items-center justify-between">
                    {/* LOGO */}
                    <div className="pt-2 flex-shrink-0 mr-6">
                        <Image
                            src="/mlj.svg"
                            alt="martyn-lloyd-jones icon"
                            width={40}
                            height={40}
                        />
                    </div>

                    {/* Menu Items */}
                    <div className="flex space-x-6">
                        <Link href="https://github.com/ashrielbrian/video_semsearch">
                            by @ashrielbrian
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};
