import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
    const [state, setState] = useState('expanded');

    const toggle = () => {
        setState(state === 'expanded' ? 'collapsed' : 'expanded');
    };

    return (
        <SidebarContext.Provider value={{ state, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({ children, className }) => {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    return (
        <aside className={`transition-all duration-300 ${className} ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {children}
        </aside>
    );
};

export const SidebarContent = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarGroup = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarGroupLabel = ({ children, className }) => <div className={className}>{children}</div>;
export const SidebarMenu = ({ children, className }) => <ul className={className}>{children}</ul>;
export const SidebarMenuItem = ({ children, className }) => <li className={className}>{children}</li>;
export const SidebarMenuButton = ({ children, asChild, className }) => {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    if (asChild) {
        return React.cloneElement(children, {
            className: `${children.props.className} ${isCollapsed ? 'justify-center' : ''}`
        });
    }

    return (
        <button className={`${className} ${isCollapsed ? 'justify-center' : ''}`}>
            {children}
        </button>
    );
};

export const SidebarTrigger = () => {
    const { toggle } = useSidebar();
    return (
        <button onClick={toggle} className="p-2 rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
    );
};

