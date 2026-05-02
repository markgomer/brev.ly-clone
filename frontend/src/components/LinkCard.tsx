

type Link = { originalURL: string; shortenedURL: string; numberOfAccesses: number };

type Props = {
   link: Link;
   onDelete: (shortenedURL: string) => void;
};

export function LinkCard({ link, onDelete }: Props) {
   return (
      <div>
         <span className="font-bold text-blue-600 truncate">{link.shortenedURL}</span>
         <span className="text-sm text-gray-400 truncate">{link.originalURL}</span>
         <span className="text-sm text-gray-500">{link.numberOfAccesses} accesses</span>
      </div>
   )
}
