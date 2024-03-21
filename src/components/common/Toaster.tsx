import { IToaster } from '@/types'
import React from 'react'
export const Toaster: React.FC<Omit<IToaster, "isVisible">> = ({
    message,
    type,
}) => {
    return (
        <div id={`toast-${type === 'positive' ? 'success' : 'danger'}`} className="end-6 top-2 fixed flex items-center w-full max-w-xs p-2.5 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${type === 'positive' ? 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200' : 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200'} rounded-lg`}>
                {
                    type === 'positive' ?
                        (<><svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                            <span className="sr-only">Check icon</span></>)
                        : (<><svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                        </svg>
                            <span className="sr-only">Error icon</span></>)
                }
            </div>
            <div className="ms-3 text-sm font-normal">{message}</div>
        </div>
    )
}
