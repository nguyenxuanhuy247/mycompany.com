import React, { Component } from 'react';
import classNames from 'classnames/bind';

import { PngImages } from '~/components/Image/Images.js';
import styles from './Carousel.module.scss';

const cx = classNames.bind(styles);

const items = [
    {
        id: 1,
        src: PngImages.makeCV,
        altText: 'Slide 1',
        caption: 'Slide 1',
    },
    {
        id: 2,
        src: PngImages.findJob,
        altText: 'Slide 2',
        caption: 'Slide 2',
    },
    {
        id: 3,
        src: PngImages.secSafe,
        altText: 'Slide 3',
        caption: 'Slide 3',
    },
];

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.image = items;
    }

    idRef = React.createRef();

    componentWillUnmount() {
        console.log(this.idRef.current);
        clearInterval(this.idRef.current);
    }

    componentDidMount() {
        const slider = document.querySelector(`.${cx('slider')}`);
        const images = slider.querySelectorAll(`.${cx('img-wrapper')}`);
        const length = images.length;
        const imgWidth = images[0].clientWidth;
        console.log(imgWidth);

        let step = 0;

        const moveLeft = () => {
            const index = step % length;
            const newImage = images[index].cloneNode(true);
            slider.appendChild(newImage);

            slider.style.transition = '2s';
            slider.style.left = `-${step * imgWidth}px`;
            step++;
        };

        this.idRef.current = setInterval(moveLeft, 3000);
    }

    render() {
        return (
            <div className={cx('carousel')}>
                <div className={cx('slider')}>
                    <div className={cx('img-wrapper')}>
                        <img src={this.image[0].src} alt="" className={cx('image')} />
                        <h3 className={cx('title')}>Công cụ viết CV đẹp Miễn phí</h3>
                        <p className={cx('desc')}>
                            Nhiều mẫu CV đẹp, phù hợp nhu cầu ứng tuyển các vị trí khác nhau. Dễ dàng chỉnh sửa thông
                            tin, tạo CV online nhanh chóng trong vòng 5 phút.
                        </p>
                    </div>
                    <div className={cx('img-wrapper')}>
                        <img src={this.image[1].src} alt="" className={cx('image')} />
                        <h3 className={cx('title')}>Bảo mật & An toàn tuyệt đối</h3>
                        <p className={cx('desc')}>
                            Bạn có thể chủ động bật / tắt trạng thái tìm việc. Nếu trạng thái tắt, không ai có thể xem
                            được CV của bạn.
                        </p>
                    </div>
                    <div className={cx('img-wrapper')}>
                        <img src={this.image[2].src} alt="" className={cx('image')} />
                        <h3 className={cx('title')}>Hỗ trợ Người tìm việc</h3>
                        <p className={cx('desc')}>
                            Nhiều mẫu CV đẹp, phù hợp nhu cầu ứng tuyển các vị trí khác nhau. Dễ dàng chỉnh sửa thông
                            tin, tạo CV online nhanh chóng trong vòng 5 phút.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Carousel;
