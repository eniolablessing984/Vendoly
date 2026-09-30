import { useState } from 'react'

export default function CatalogImage({
  src,
  alt = '',
  className = '',
  fallbackClassName = 'grid h-full place-items-center bg-[#f0f2ed] text-sm text-slate-600',
  fallbackText = 'Image coming soon',
}){
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || failedSrc === src) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} image unavailable` : undefined}
        aria-hidden={alt ? undefined : true}
        className={fallbackClassName}
      >
        {fallbackText}
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />
}
