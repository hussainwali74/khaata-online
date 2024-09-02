'use client'
import { useState } from 'react';

const Form = () => {
    const [font, setFont] = useState('inter');
    const [theme, setTheme] = useState('light');

    return (
        <form className="space-y-8">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="font-select">
                    Font
                </label>
                <div className="relative w-max">
                    <select
                        id="font-select"
                        name="font"
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-[200px] appearance-none font-normal"
                    >
                        <option value="inter">Inter</option>
                        <option value="manrope">Manrope</option>
                        <option value="system">System</option>
                    </select>
                </div>
                <p className="text-[0.8rem] text-muted-foreground">Set the font you want to use in the dashboard.</p>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium leading-none" htmlFor="theme-select">
                    Theme
                </label>
                <p className="text-[0.8rem] text-muted-foreground">Select the theme for the dashboard.</p>
                <div className="grid max-w-md grid-cols-2 gap-8 pt-2" role="radiogroup">
                    <label className="space-y-2">
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={theme === 'light'}
                            onChange={() => setTheme('light')}
                            className="sr-only"
                        />
                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                            <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                    <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]"></div>
                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                                    <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
                                </div>
                            </div>
                        </div>
                        <span className="block w-full p-2 text-center font-normal">Light</span>
                    </label>

                    <label className="space-y-2">
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={theme === 'dark'}
                            onChange={() => setTheme('dark')}
                            className="sr-only"
                        />
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-2 w-[80px] rounded-lg bg-slate-400"></div>
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                    <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                                    <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
                                </div>
                            </div>
                        </div>
                        <span className="block w-full p-2 text-center font-normal">Dark</span>
                    </label>
                </div>
            </div>

            <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                type="submit"
            >
                Update preferences
            </button>
        </form>
    );
};

export default Form;
