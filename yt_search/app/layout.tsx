import { Header } from '@/components/Header'
import './globals.css'

export const metadata = {
    title: 'MLJ Sermons',
    description: `Semantically search across all Martyn Lloyd Jones' sermons`,
    keywords: "sermons, reformation, martyn-lloyd jones, Christianity, protestant, reformed theology"
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>

                <Header />

                {children}
            </body>
        </html>
    )
}
