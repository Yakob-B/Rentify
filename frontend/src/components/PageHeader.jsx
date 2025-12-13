import React from 'react'

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="relative bg-emerald-500 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden mb-12">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-[50%] -left-[10%] w-96 h-96 rounded-full bg-emerald-400/30 blur-3xl"></div>
                <div className="absolute -bottom-[50%] -right-[10%] w-96 h-96 rounded-full bg-emerald-600/30 blur-3xl"></div>
                {/* Dashed line decoration similar to footer */}
                <svg className="absolute top-0 right-0 w-1/3 h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 100,0 Q 50,50 100,100" stroke="white" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-light">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}

export default PageHeader
