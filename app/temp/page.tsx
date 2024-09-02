import { NextPage } from 'next';
import NavBar from './components/navbar';
import ImageDisplay from './components/image_display';
import Form from './components/form';

const Home: NextPage = () => {
    return (
        <section>
            <div className="relative max-w-[600px] lg:max-w-none mx-auto">
                <NavBar />
                <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                    <ImageDisplay />
                    <div className="hidden space-y-6 p-10 pb-16 md:block">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                            <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
                        </div>
                        <div className="shrink-0 bg-border h-[1px] w-full my-6"></div>
                        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <aside className="-mx-4 lg:w-1/5">
                                <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                                    <a href="/examples/forms" className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start">Profile</a>
                                    <a href="/examples/forms/account" className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start">Account</a>
                                    <a href="/examples/forms/appearance" className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 bg-muted hover:bg-muted justify-start">Appearance</a>
                                    <a href="/examples/forms/notifications" className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start">Notifications</a>
                                    <a href="/examples/forms/display" className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start">Display</a>
                                </nav>
                            </aside>
                            <div className="flex-1 lg:max-w-2xl">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium">Appearance</h3>
                                        <p className="text-sm text-muted-foreground">Customize the appearance of the app. Automatically switch between day and night themes.</p>
                                    </div>
                                    <div className="shrink-0 bg-border h-[1px] w-full"></div>
                                    <Form />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
