import { Share2, MessageCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareButtons = ({ item }) => {
  const itemUrl = `${window.location.origin}/items/${item._id}`;

  const shareWhatsApp = () => {
    const emoji = item.type === 'lost' ? '🔍' : '📦';
    const message = `${emoji} ${item.type.toUpperCase()} Item Alert!\n\n*Item:* ${item.title}\n*Category:* ${item.category}\n*Location:* ${item.location}\n*Date:* ${new Date(item.date).toLocaleDateString()}\n\n*Description:* ${item.description}\n\n🔗 View details: ${itemUrl}\n\n_Posted on Campus Lost & Found Portal_`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(itemUrl);
    toast.success('Link copied to clipboard!');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.type === 'lost' ? 'Lost' : 'Found'}: ${item.title}`,
          text: `Check this ${item.type} item on Campus Lost & Found: ${item.title} at ${item.location}`,
          url: itemUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="glass rounded-xl border border-[var(--border)] p-4">
      <p className="text-xs uppercase tracking-wider mb-3 font-medium"
        style={{ color: 'var(--muted)' }}>
        Share this item
      </p>
      <div className="flex gap-2">
        {/* WhatsApp */}
        <button
          onClick={shareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border"
          style={{
            background: 'rgba(37,211,102,0.1)',
            borderColor: 'rgba(37,211,102,0.3)',
            color: '#25D366'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#25D366'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'}
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </button>

        {/* Share */}
        <button
          onClick={shareNative}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all glass border"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--muted)';
          }}
        >
          <Share2 size={15} />
          <span>Share</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          className="p-2.5 rounded-xl transition-all glass border"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--muted)';
          }}
          title="Copy link"
        >
          <Copy size={15} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;