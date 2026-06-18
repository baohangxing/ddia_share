interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({children}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] relative">
      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="py-12 text-center text-xs text-[#333]">
        <p>《我只是想做个简单的微博，为什么最后学会了 DDIA》 © 2026</p>
      </footer>
    </div>
  );
}
