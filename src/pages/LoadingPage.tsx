const LoadingPage = () => (
  <div className="fixed inset-0 bg-lab-bg flex flex-col items-center justify-center">
    <div className="w-10 h-10 rounded-xl bg-lab-cyan flex items-center justify-center font-display font-black text-xl text-lab-bg animate-pulse">K</div>
    <p className="text-lab-muted font-mono text-[10px] mt-4 tracking-[0.3em] uppercase animate-pulse">Initializing Lab...</p>
  </div>
);
export default LoadingPage;
