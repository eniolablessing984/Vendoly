

export default function Container({ children, className = '' }) {
  return (
    <div className={`container mx-auto box-border w-full min-w-0 px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  )
}
