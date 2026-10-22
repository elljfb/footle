import Image from 'next/image';
import { Article } from '../lib/articles';

interface ArticleArtworkProps {
  article: Article;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export default function ArticleArtwork({ article, sizes, priority = false, className = '' }: ArticleArtworkProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-950 ${className}`}>
      {article.image ? (
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-950 to-emerald-950/70 p-5 sm:p-7">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#03E690]">{article.category}</span>
          <span className="max-w-lg text-xl font-black leading-tight text-white sm:text-2xl">{article.title}</span>
          <span aria-hidden="true" className="absolute -bottom-12 -right-5 text-8xl font-black text-[#03E690]/10">F</span>
        </div>
      )}
    </div>
  );
}
