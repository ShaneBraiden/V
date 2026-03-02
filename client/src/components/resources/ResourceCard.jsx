import { Youtube, Check, BookOpen, X, ExternalLink, FileText, Play } from 'lucide-react';
import { useState } from 'react';

/** Resolve YouTube URL to embeddable src */
function toYouTubeEmbed(url) {
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('playlist')) {
    const id = url.split('list=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/videoseries?list=${id}`;
  }
  return url.replace('watch?v=', 'embed/');
}

const TYPE_BADGES = {
  video: 'bg-red-500/20   text-red-400   border-red-500/30',
  book: 'bg-blue-500/20  text-blue-400  border-blue-500/30',
  course: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  article: 'bg-green-500/20 text-green-400 border-green-500/30',
  docs: 'bg-neon-cyan/10 text-neon-cyan  border-neon-cyan/30',
};

const TYPE_ICONS = { video: Play, book: BookOpen, course: FileText, docs: FileText, article: FileText };

/** Resource card with in-app viewer - no external-link redirects, no FREE badge */
export default function ResourceCard({ resource, onToggleComplete }) {
  const [viewerOpen, setViewerOpen] = useState(false);

  const isYouTube = resource.url?.includes('youtube.com') || resource.url?.includes('youtu.be');
  // Docs and articles can be iframed; others (Coursera, etc.) need external link fallback
  const canEmbed = isYouTube || resource.type === 'docs' || resource.type === 'article';
  const TypeIcon = TYPE_ICONS[resource.type] || FileText;

  const embedSrc = isYouTube ? toYouTubeEmbed(resource.url) : resource.url;

  return (
    <>
      <div className={`neon-card p-4 ${resource.completed ? 'border-neon-cyan/40' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-200 flex-1 pr-2 leading-snug">{resource.title}</h3>
          <button
            onClick={() => onToggleComplete?.(resource)}
            className={`shrink-0 p-1 rounded ${resource.completed ? 'text-neon-cyan' : 'text-gray-600 hover:text-gray-400'}`}
            title={resource.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check size={16} />
          </button>
        </div>

        {/* Type + tech badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${TYPE_BADGES[resource.type] || TYPE_BADGES.docs}`}>
            {resource.type}
          </span>
          {resource.techId && (
            <span className="text-xs px-2 py-0.5 rounded border border-border-dim text-gray-400">
              {resource.techId}
            </span>
          )}
        </div>

        {resource.description && (
          <p className="text-xs text-gray-500 mb-3">{resource.description}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {isYouTube ? (
            <button
              onClick={() => setViewerOpen(true)}
              className="btn-neon-purple text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <Youtube size={12} /> Watch
            </button>
          ) : canEmbed ? (
            <button
              onClick={() => setViewerOpen(true)}
              className="btn-neon text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <TypeIcon size={12} /> Open in App
            </button>
          ) : (
            // Non-embeddable resources (Coursera, Udemy, etc.) — open externally with clear label
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon text-xs px-3 py-1.5 flex items-center gap-1.5"
            >
              <ExternalLink size={12} /> Visit Resource
            </a>
          )}
        </div>
      </div>

      {/* In-app viewer modal */}
      {viewerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg-primary/95 backdrop-blur-sm">
          {/* Modal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim bg-bg-card shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_BADGES[resource.type] || TYPE_BADGES.docs}`}>
                {resource.type}
              </span>
              <h2 className="text-sm font-semibold text-white truncate">{resource.title}</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-neon-cyan flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={12} /> Open tab
              </a>
              <button
                onClick={() => setViewerOpen(false)}
                className="p-1.5 rounded-lg border border-border-dim text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Iframe content */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={embedSrc}
              className="w-full h-full border-0"
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />
          </div>
        </div>
      )}
    </>
  );
}

