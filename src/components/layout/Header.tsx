import { UserNav } from './UserNav';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-kryv-border bg-kryv-bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-kryv-bg-dark/60">
      <div className="container flex h-16 items-center max-w-7xl mx-auto">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <div className="w-8 h-8 bg-kryv-cyan rounded-lg flex items-center justify-center font-bold text-black font-heading text-xl">K</div>
            <span className="font-bold font-heading">KRYVLABS</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
