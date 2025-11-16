import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Breadcrumb({ items }) {
    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#37692F] transition-colors"
                            >
                                {item.icon && (
                                    <span className="mr-2">{item.icon}</span>
                                )}
                                {item.label}
                            </Link>
                        ) : (
                            <span className="inline-flex items-center text-sm font-medium text-gray-500">
                                {item.icon && (
                                    <span className="mr-2">{item.icon}</span>
                                )}
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
