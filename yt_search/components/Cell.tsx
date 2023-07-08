import Image from "next/image";
import Link from "next/link";
import { Video, VideoSearch } from "@/lib/types";

function extractLinkAndText(input: string): { link: string; text: string } {
    const linkRegex =
        /^((?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;
    const linkMatch = input.match(linkRegex);
    const link = linkMatch ? linkMatch[0] : "";
    const text = linkMatch ? input.replace(linkRegex, "").trim() : input.trim();

    return { link, text };
}

export const Cell = ({ video }: { video: Video | VideoSearch }) => {
    let url = `https://youtube.com/watch?v=${video.id}`;
    let desc = video.description?.substring(0, 500) + "...";
    let mljLink,
        videoDesc = "";

    if ("content" in video) {
        desc = `...${video.content}`;
    } else {
        let { link, text } = extractLinkAndText(desc);
        mljLink = link;
        videoDesc = text;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-2 transition-transform duration-500 transform hover:-translate-y-1 hover:scale-102 flex min-h-250">
            <div className="flex flex-col flex-grow">
                {video.thumbnail && (
                    <Image
                        src={video.thumbnail}
                        alt="Placeholder image"
                        className="w-full h-64 object-cover rounded-t-lg"
                        height={100}
                        width={100}
                    />
                )}

                <div className="flex flex-col flex-grow p-4">
                    <Link href={url} target="_blank">
                        <h2 className="text-lg font-bold mb-2 text-grey-500 hover:text-indigo-700 hover:underline transition-colors">
                            {video.title}
                        </h2>
                    </Link>

                    {"content" in video && (
                        <p className="text-gray-700 text-justify">{desc}</p>
                    )}

                    {mljLink && videoDesc && (
                        <div>
                            <p className="text-gray-700 text-justify">
                                <span className="border border-indigo-600 rounded-md text-gray-700 p-1 font-semibold mb-2 hover:underline transition-colors">
                                    {/* <span className="bg-orange-400 rounded-md text-white p-1 font-bold mb-2 hover:underline transition-colors"> */}

                                    <Link href={mljLink} target="_blank">
                                        MLJ Trust Sermon Details
                                    </Link>
                                </span>
                                {" - " + videoDesc}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-grow justify-center">
                        {"start_time" in video ? (
                            <Link
                                href={`listen/${video.id}?ts=${video.start_time}&content=${desc}`}
                            >
                                <button className="bg-indigo-500 border text-white py-2 px-4 mt-4 mr-2 hover:bg-indigo-600 transition-colors duration-300 ease-in-out">
                                    Listen to Snippet
                                </button>
                            </Link>
                        ) : (
                            <Link href={url} target="_blank">
                                <button className="bg-indigo-500 border text-white py-2 px-4 mt-4 mr-2 hover:bg-indigo-600 transition-colors duration-300 ease-in-out">
                                    Watch Sermon
                                </button>
                            </Link>
                        )}

                        <Link href={"summary/" + video.id}>
                            <button className="text-indigo-500 border border-indigo-600 py-2 px-4 mt-4 font-semibold hover:bg-indigo-600 hover:text-white transition-colors duration-300 ease-in-out">
                                Summary
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
