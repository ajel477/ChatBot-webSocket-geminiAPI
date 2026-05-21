function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Aurex AI
          </h1>

          <p className="text-zinc-400 text-sm">
            {subtitle}
          </p>
        </div>

        {children}

      </div>
    </div>
  );
}

export default AuthLayout;