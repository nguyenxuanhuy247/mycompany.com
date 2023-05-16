import { Component } from 'react';
import className from 'classnames/bind';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DefaultTippy from '@tippyjs/react';
import { FaBell } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';

import styles from './Header.module.scss';
import logo from '~/assets/logo/logo-with-text.png';
import { ImageWithRef } from '~/components/Image/Image.js';
import { JpgImages } from '~/components/Image/Images.js';
import { path } from '~/utils';
import Menu from '~/components/Popover/Menu/Menu.js';
import Button from '~/components/Button/Button.js';
import HeaderNavbar from '~/containers/Header/HeaderNavbar.js';

import { MENU_AVATAR_DATA } from '~/components/MenuData/MenuData.js';

const cx = className.bind(styles);

class Header extends Component {
    handleChangeActiveButton = (e, classNameRemoved) => {
        document.querySelector(`.${classNameRemoved}`).classList.remove(cx('active'));
        e.currentTarget.classList.add(cx('active'));
    };

    componentDidMount() {
        if (!this.props.isSignIn) {
            document.querySelector(`.${cx('signin')}`).classList.add(cx('active'));
        }
    }

    render = () => {
        return (
            <header className={cx('header')}>
                <Link to={'/personal'} className={cx('logo-link')}>
                    <img src={logo} className={cx('logo')} alt="cvonline.com" />
                </Link>

                <HeaderNavbar />

                {!this.props.isSignIn ? (
                    <div className={cx('actions')}>
                        <Button
                            route={path.SIGNIN}
                            className={cx('signin', 'btn')}
                            onMouseOver={(e) => this.handleChangeActiveButton(e, cx('signup'))}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            route={path.SIGNUP}
                            className={cx('signup', 'btn')}
                            onMouseOver={(e) => this.handleChangeActiveButton(e, cx('signin'))}
                        >
                            Đăng ký
                        </Button>
                    </div>
                ) : (
                    <div className={cx('login')}>
                        <DefaultTippy content="Thông báo" arrow="" offset={[0, 10]}>
                            <Button className={cx('icon')}>
                                <FaBell />
                            </Button>
                        </DefaultTippy>

                        <DefaultTippy content="Tin nhắn" arrow="">
                            <Button className={cx('icon')}>
                                <RiMessage2Fill />
                            </Button>
                        </DefaultTippy>

                        <Menu data={MENU_AVATAR_DATA}>
                            <Button className={cx('user')}>
                                <ImageWithRef
                                    src={JpgImages.avatar}
                                    wapperClass={cx('wapper')}
                                    className={cx('avatar')}
                                    alt="Nguyễn Xuân Huy"
                                />
                                <span className={cx('fullname')}>Nguyễn Xuân Huy</span>
                            </Button>
                        </Menu>
                    </div>
                )}
            </header>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        isSignIn: state.user.isSignIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
