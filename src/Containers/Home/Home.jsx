import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import "./Home.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

// Icons
import { FaBookReader, FaMicrophone, FaRegSmile  } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";

// Import NavBar
import { NavBar } from "../../Components";

// Import Link
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="hero">
        <div className="hero_content">
          <div className="hero_item">
            <h1 className="logo">UniPal</h1>
            <h2>Your Campus Assistant</h2>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit quos
              quod quas dignissimos fugit? Ea adipisci aperiam asperiores sint!
              Nulla nisi suscipit at! Non ducimus cumque, consectetur dicta
              alias magnam quo nesciunt necessitatibus vero quis numquam
              deleniti nulla ratione dolorem dolore ipsa laudantium placeat
              facilis rem temporibus! Atque, explicabo minus.
            </p>
          </div>
          <div className="hero_button-container">
            <span>What are you waiting for?</span>
            <button id="hero_sign-up-btn" className="sign-in-btn">
              <Link to="/register">
                Sign Up Now
              </Link>
            </button>
          </div>
        </div>
        <div className="hero_slider">
          <Swiper 
          spaceBetween={50}
          pagination={true} 
          autoplay={{ delay: 5000 }}
          modules={[Pagination]}>
            <SwiperSlide>
              <div className="hero_slider-container">
                <h2>About UniPal</h2>
                <div className="hero_slider-item">
                  <p>
                    <span className="logo">UniPal</span> Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Corrupti, nisi
                    consectetur cumque culpa in maxime quos? Sequi sint vitae
                    sunt. Quas nostrum optio, rerum eum obcaecati dolores,
                    laborum repudiandae fugit a at praesentium? Illum quae ullam
                    accusantium culpa minima temporibus, ducimus nesciunt
                    molestias! Fuga mollitia repudiandae cupiditate quidem
                    optio. Saepe voluptatem porro laudantium voluptatum, eius
                    quo odit molestias tempora beatae perspiciatis non
                    necessitatibus, ex a quam. Consequuntur tempora, ea quo
                    illum dignissimos aliquam? Ducimus, doloremque temporibus
                    hic explicabo laborum amet laudantium corrupti odit
                    cupiditate accusamus, eaque quos saepe, non culpa ad
                    consequuntur sapiente quia similique facilis obcaecati.
                    Asperiores, cumque totam!
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="hero_slider-container">
                <h2>Features</h2>
                <div className="hero_slider-item">
                  <ul>
                    <li>
                      <h4><FaBookReader/> University Knowledge</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
                      </p>
                    </li>
                    <li>
                      <h4><FaMicrophone/> Speech Recognition</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
                      </p>
                    </li>
                    <li>
                      <h4><IoIosChatboxes/> Immediate Responses</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
                      </p>
                    </li>
                    <li>
                      <h4><FaRegSmile/> Vent with Ease</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
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
  );
};

export default Home;
