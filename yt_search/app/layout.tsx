import { Assistant } from "next/font/google";

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata = {
    title: 'MLJ Sermons',
    description: `Semantically search across all Martyn Lloyd Jones' sermons`,
    keywords: "sermons, reformation, martyn-lloyd jones, Christianity, protestant, reformed theology"
}

const assistant = Assistant({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"]
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={assistant.className}>

                <Header />

                {children}

                <Footer />
            </body>
        </html>
    )
}
