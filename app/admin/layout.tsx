
export default function Admin2Layout({ children }: { children: React.ReactNode }) {
    return (
      <main className="flex flex-1 flex-col p-4 md:p-6">
          <div className={"mx-auto max-w-7xl w-full py-12 sm:px-6 lg:px-8"}>
              <div className="mx-auto max-w-4xl ">
                  {children}
              </div>
              </div>
              </main>
)
}