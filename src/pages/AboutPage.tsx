import { Link } from 'react-router'
import Navbar from '../components/Navbar'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <section className="section-inner pt-24 pb-16">
        <div className="copy">
          <h2>Giới thiệu</h2>
          <p>Route mẫu: <code>/about</code></p>
          <p>
            <Link to="/">Về trang chủ</Link>
          </p>
        </div>
      </section>
    </>
  )
}
