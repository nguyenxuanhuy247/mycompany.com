import React, { Component } from 'react';
import className from 'classnames/bind';
import { connect } from 'react-redux';
import TippyHeadless from '@tippyjs/react/headless';
import { BiArrowBack } from 'react-icons/bi';

import * as userActions from '~/store/actions/userActions.js';
import PopoverWrapper from '~/components/Popover/Wrapper.js';
import styles from './Menu.module.scss';
import Button from '~/components/Button/Button';

const cx = className.bind(styles);

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: this.props.data,
            isHeaderShow: false,
            subMenuHeaderTitle: '',
        };
    }

    static defaultProps = {
        data: [],
    };

    handleShowMenuContent = (attrs) => (
        <div tabIndex="-1" {...attrs}>
            <PopoverWrapper className={cx('menu-wrapper')}>
                {this.state.isHeaderShow && (
                    <div className={cx('submenu-header')}>
                        <Button
                            className={cx('button-back')}
                            onClick={() =>
                                this.setState({
                                    menuList: this.props.data,
                                    isHeaderShow: false,
                                })
                            }
                        >
                            <i className={cx('arrow-left')}>
                                <BiArrowBack />
                            </i>
                            <span className={cx('text')}>{this.state.subMenuHeaderTitle}</span>
                        </Button>
                    </div>
                )}

                {this.state.menuList.length > 0 &&
                    this.state.menuList.map((item) => {
                        const isChildren = !!item.children;

                        return (
                            <div key={item.id} className={cx('container')}>
                                <Button
                                    className={cx('button')}
                                    onClick={() => {
                                        if (isChildren) {
                                            const { title, data } = item.children;
                                            this.setState({
                                                menuList: data,
                                                isHeaderShow: true,
                                                subMenuHeaderTitle: title,
                                            });
                                        }

                                        if (item.title === 'Đăng xuất') {
                                            this.props.userSignOut();
                                        }
                                    }}
                                >
                                    <i className={cx('left-icon')}>{item.leftIcon}</i>
                                    <span className={cx('text')}>{item.title}</span>
                                    <i className={cx('arrow-right')}>{item.rightIcon}</i>
                                </Button>
                            </div>
                        );
                    })}
            </PopoverWrapper>
        </div>
    );

    render() {
        let { children } = this.props;

        return (
            <TippyHeadless
                interactive
                delay={[0, 100000]}
                hideOnClick
                placement="bottom-end"
                render={() => this.handleShowMenuContent()}
            >
                {children}
            </TippyHeadless>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSignOut: () => dispatch(userActions.userSignOut()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
