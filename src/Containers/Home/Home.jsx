import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import './Home.css'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination } from 'swiper/modules'

// Icons
import { FaBookReader, FaMicrophone, FaRegSmile } from 'react-icons/fa'
import { IoIosChatboxes } from 'react-icons/io'

// Import NavBar
import { NavBar } from '../../Components'

// Import Link
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <NavBar />
      <div className='hero'>
        <div className='hero_content'>
          <div className='hero_item'>
            <h1 className='hero_item-logo logo'>UniPal</h1>
            <h2>Your Campus Assistant</h2>
            <p>
              Apakah Anda ingin tahu lebih banyak tentang BINUS University?
              UniPal hadir untuk memberikan jawaban cepat dan akurat hanya untuk
              Anda. Temukan informasi lengkap seperti program studi, kondisi
              kampus, gambaran umum perkuliahan, himpunan mahasiswa, unit
              kegiatan mahasiswa, dan syarat kelulusan dengan mudah.
            </p>
          </div>
          <div className='hero_button-container'>
            <h4>Apa yang kamu tunggu?</h4>
            <button id='hero_sign-up-btn'>
              <Link to='/register'>Daftar Sekarang</Link>
            </button>
          </div>
        </div>
        <div className='hero_slider'>
          <Swiper
            spaceBetween={50}
            slidesPerView='auto'
            pagination
            autoplay={{ delay: 5000 }}
            modules={[Pagination]}
          >
            <SwiperSlide>
              <div className='hero_slider-container'>
                <h2>Tentang UniPal</h2>
                <div className='hero_slider-item'>
                  <h4>
                    <span className='logo'>UniPal</span> merupakan virtual
                    assistant yang dikembangkan oleh mahasiswa dari program Data
                    Science BINUS University melalui program PKM-KC. UniPal
                    menyediakan informasi seputar BINUS University. Anda dapat
                    bertanya kepada UniPal menggunakan suara Anda dan UniPal
                    akan memberikan respon kepada Anda dengan menggunakan suara
                    pula, sehingga interaksi menjadi lebih mudah dan alami.
                  </h4>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='hero_slider-container'>
                <h2>Fitur</h2>
                <div className='hero_slider-item'>
                  <ul>
                    <li>
                      <h5>
                        <FaBookReader /> Pengetahuan Terkait Universitas
                      </h5>
                      <p>
                        UniPal memiliki berbagai informasi mengenai BINUS
                        University, termasuk program studi, fasilitas, HMJ, UKM,
                        syarat kelulusan, gambaran jadwal perkulian. Dapatkan
                        semua yang Anda butuhkan untuk mengetahui lebih dalam
                        tentang BINUS University.
                      </p>
                    </li>
                    <li>
                      <h5>
                        <FaMicrophone /> Pengenalan Suara
                      </h5>
                      <p>
                        Dengan teknologi pengenalan suara canggih, Anda dapat
                        berbicara langsung dengan UniPal untuk menanyakan
                        berbagai informasi. UniPal akan memahami dan merespon
                        pertanyaan Anda secara natural dan efisien.
                      </p>
                    </li>
                    <li>
                      <h5>
                        <IoIosChatboxes /> Respon Instan
                      </h5>
                      <p>
                        UniPal dirancang untuk memberikan respon secepat kilat,
                        memastikan Anda mendapatkan jawaban atas pertanyaan Anda
                        tanpa perlu menunggu lama. Semua informasi yang Anda
                        butuhkan tersedia hanya dalam hitungan detik.
                      </p>
                    </li>
                    <li>
                      <h5>
                        <FaRegSmile /> Curahkan Perasaan Anda
                      </h5>
                      <p>
                        UniPal juga dilengkapi dengan fitur untuk mendengarkan
                        dan merespon perasaan Anda. Baik Anda merasa senang,
                        cemas, atau membutuhkan teman bicara, UniPal siap
                        mendengarkan dan memberikan dukungan yang Anda butuhkan.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default Home
