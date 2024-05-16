
export default function Admin2Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className={"mx-auto  w-full py-12 "}>
                {children}
            </div>
        </main>
    )
}