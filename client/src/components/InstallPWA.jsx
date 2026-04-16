import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 3 seconds
      setTimeout(() => setShowBanner(true), 3000);
    });

    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-fade-up">
      <div className="glass rounded-2xl border p-4 shadow-2xl"
        style={{ borderColor: 'rgba(108,99,255,0.3)' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
            LF
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">Install Campus L&F</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Add to home screen for quick access
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium"
              >
                <Download size={12} /> Install
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium glass border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            style={{ color: 'var(--muted)' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;