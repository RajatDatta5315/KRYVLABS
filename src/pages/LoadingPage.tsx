const LoadingPage = () => {
    return (
        <div className="fixed inset-0 bg-kryv-bg-dark flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-kryv-cyan rounded-lg flex items-center justify-center font-bold text-black font-heading text-3xl animate-pulse">K</div>
            <p className="text-kryv-text-secondary font-mono text-sm mt-4 tracking-widest uppercase animate-pulse">
                Initializing Neural Link...
            </p>
        </div>
    );
};

export default LoadingPage;
