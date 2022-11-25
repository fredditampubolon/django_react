import Image from "next/image"


export default function Footer(props) {
  return <footer className="footer">
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by <b>¯\_(ツ)_/¯</b>
      {/* <span className="logo">
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </span> */}
    </a>
  </footer>
}