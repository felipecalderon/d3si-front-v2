import LoginPage from "./login/page"

export default function Home() {
    return (
        <main
            className="min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-700"
        >
            <LoginPage />
        </main>
    )
}
