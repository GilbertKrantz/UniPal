import { Swiper, SwiperSlide } from 'swiper/react';
import "./Home.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";

const HomeSlider = () => {
    <Swiper 
          pagination={true} 
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
                      <h4>University Knowledge</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
                      </p>
                    </li>
                    <li>
                      <h4>Speech Recognition</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
                      </p>
                    </li>
                    <li>
                      <h4>Immediate Responses</h4>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Natus, quas.
                      </p>
                    </li>
                    <li>
                      <h4>Vent with Ease</h4>
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
}

export default HomeSlider;