export const metadata = {
  title: 'Hampshire Forward — A Learning Cooperative',
  description: 'Hampshire College is closing. Hampshire\'s idea is not. An experiment in carrying Hampshire\'s pedagogy forward.',
}

export default function HampshireForwardPage() {
  return (
    <iframe
      src="/hampshire-forward.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    />
  )
}
