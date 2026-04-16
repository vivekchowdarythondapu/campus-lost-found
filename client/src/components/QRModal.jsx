import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QRModal = ({ item, onClose }) => {
  const qrRef = useRef(null);
  const itemUrl = `${window.location.origin}/items/${item._id}`;

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 350;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 350);
      ctx.drawImage(img, 25, 25, 250, 250);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.title, 150, 300);
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText('Campus Lost & Found', 150, 325);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = `qr-${item.title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = url;
  };

  const shareQR = async () => {
    if (navigator.share) {
      await navigator.share({
        title: item.title,
        text: `Check this ${item.type} item on Campus Lost & Found: ${item.title}`,
        url: itemUrl
      });
    } else {
      navigator.clipboard.writeText(itemUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}>
      <div className="glass rounded-2xl border border-[var(--border)] p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-white">QR Code</h2>
          <button onClick={onClose}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
            <X size={18} />
          </button>
        </div>

        {/* QR Code */}
        <div ref={qrRef}
          className="bg-white rounded-2xl p-5 flex items-center justify-center mb-4">
          <QRCodeSVG
            value={itemUrl}
            size={200}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: '',
              excavate: false
            }}
          />
        </div>

        {/* Item Info */}
        <div className="text-center mb-5">
          <p className="font-display font-semibold text-white">{item.title}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Scan to view item details
          </p>
          <p className="text-xs mt-1 truncate px-4" style={{ color: 'var(--accent)' }}>
            {itemUrl}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={downloadQR}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all glass border border-[var(--border)] text-white hover:border-[var(--accent)]">
            <Download size={15} /> Download
          </button>
          <button onClick={shareQR}
            className="btn-primary flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium">
            <Share2 size={15} /> Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;