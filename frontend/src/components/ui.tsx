import React, { useState, useRef, useEffect } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, titleAction }) => (
  <div className={`bg-white rounded-lg border border-brand-gray overflow-hidden ${className}`}>
    {title && (
      <div className="flex justify-between items-center p-5 border-b border-brand-gray">
        <h2 className="text-lg font-bold text-brand-blue">{title}</h2>
        {titleAction && <div>{titleAction}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
      md: 'px-5 py-2.5 text-sm',
      sm: 'px-3 py-1.5 text-xs'
  };

  const variantClasses = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark focus:ring-brand-blue',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  return (
    <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
      {...props}
    />
  </div>
);

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => (
    <div className="overflow-x-auto border border-brand-gray rounded-lg">
        <table className="min-w-full divide-y divide-brand-gray">
        <thead className="bg-brand-gray-light">
            <tr>
            {headers.map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-gray-dark uppercase tracking-wider">
                {header}
                </th>
            ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-brand-gray">
            {children}
        </tbody>
        </table>
    </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-brand-blue">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

interface DropdownProps {
    label: string;
    children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-brand-gray shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-brand-gray-light focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-blue whitespace-nowrap"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {label}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {React.Children.map(children, child => {
                            if (React.isValidElement<DropdownItemProps>(child)) {
                                return React.cloneElement(child, {
                                    onClick: () => {
                                        child.props.onClick();
                                        setIsOpen(false);
                                    },
                                });
                            }
                            return child;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

interface DropdownItemProps {
    children: React.ReactNode;
    onClick: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick }) => (
    <a href="#"
       onClick={(e) => { e.preventDefault(); onClick(); }}
       className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
       role="menuitem"
    >
        {children}
    </a>
);