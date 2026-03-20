export default function AppFooter() {
  return (
    <footer className="h-20 border-t border-slate-300/70 bg-white/80 backdrop-blur-xl shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-6xl mx-auto px-4 h-full flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
        <p>© {new Date().getFullYear()} VoiceAI. All rights reserved.</p>

        <p>
          Made with ❤️ by{" "}
          <span className="font-medium text-slate-800">Rajat Gangwar</span>
        </p>
      </div>
    </footer>
  );
}
