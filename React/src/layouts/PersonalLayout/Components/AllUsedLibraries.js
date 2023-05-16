import { PureComponent } from 'react';
import { connect } from 'react-redux';
import className from 'classnames/bind';
import { BsPlusCircleDotted } from 'react-icons/bs';

import styles from './AllUsedLibraries.module.scss';
import PaginationBar from '~/components/Pagination/PaginationBar.js';
import LibraryList from './LibraryList';
import { Icons } from '~/components/Image/Images.js';
import Button from '~/components/Button/Button.js';
import Modal from '~/components/Modal/Modal.js';
import { ImageWithRef } from '~/components/Image/Image';

const cx = className.bind(styles);

const FE_LIBRARY_LIST = [
    {
        id: 1,
        icon: Icons.Github,
        name: 'React router dom React router dom React router dom',
        version: '6.10.0',
    },
    {
        id: 2,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 3,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 4,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 5,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 6,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 7,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 8,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 9,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 10,
        icon: Icons.Github,
        name: 'React router dom',
        version: '6.10.0',
    },
];

const BE_LIBRARY_LIST = [
    {
        id: 1,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 2,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 3,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 4,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 5,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 6,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 7,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 8,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 9,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
    {
        id: 10,
        icon: Icons.Gitlab,
        name: 'React router dom',
        version: '6.10.0',
    },
];

class AllUsedLibraries extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isFE: true,
            isModalOpen: false,
            showAddLibrary: false,
        };
    }

    changeActiveButton = (e, classNameRemoved, isFE) => {
        const btn = document.querySelector(`.${classNameRemoved}`);
        if (btn) {
            this.setState({ isFE: isFE });
            btn.classList.remove(cx('active'));
            e.currentTarget.classList.add(cx('active'));
        }
    };

    handleShowFELibraryList = (e) => {
        this.changeActiveButton(e, cx('BE-btn'), true);
    };

    handleShowBELibraryList = (e) => {
        this.changeActiveButton(e, cx('FE-btn'), false);
    };

    componentDidMount() {
        const FEBtn = document.querySelector(`.${cx('FE-btn')}`);
        if (FEBtn) {
            FEBtn.classList.add(cx('active'));
        }
    }

    render() {
        return (
            <div>
                <div className={cx('library-used')}>
                    <p className={cx('library-heading')}>Danh sách thư viện sử dụng</p>
                    <div className={cx('divide')}>
                        <Button
                            className={cx('text', 'FE-btn')}
                            onClick={(e) => this.handleShowFELibraryList(e)}
                            ref={this.FEBtnRef}
                        >
                            Front-end
                        </Button>
                        <Button
                            className={cx('text', 'BE-btn')}
                            onClick={(e) => this.handleShowBELibraryList(e)}
                            ref={this.BEBtnRef}
                        >
                            Back-end
                        </Button>
                    </div>
                    <div className={cx('library-list')}>
                        {this.state.isFE ? (
                            <LibraryList data={FE_LIBRARY_LIST} />
                        ) : (
                            <LibraryList data={BE_LIBRARY_LIST} />
                        )}
                    </div>

                    {!this.state.showAddLibrary ? (
                        <Button className={cx('add-btn')} onClick={() => this.setState({ showAddLibrary: true })}>
                            <i className={cx('left-icon')}>
                                <BsPlusCircleDotted />
                            </i>
                            <span className={cx('text')}>Thêm thư viện</span>
                        </Button>
                    ) : (
                        <div className={cx('add-library')}>
                            <div className={cx('info')}>
                                <ImageWithRef
                                    wapperClass={cx('wrapper')}
                                    className={cx('image')}
                                    editText="Sửa"
                                    sizeEditbtn="small"
                                />
                                <input type="text" className={cx('name')} placeholder="Nhập tên thư viện" />
                                <input type="text" className={cx('version')} placeholder="Nhập version" />
                            </div>
                            <div className={cx('actions')}>
                                <Button
                                    className={cx('btn', 'cancel')}
                                    onClick={() => this.setState({ showAddLibrary: false })}
                                >
                                    Hủy
                                </Button>
                                <Button className={cx('btn', 'add')}>Thêm</Button>
                            </div>
                        </div>
                    )}

                    <div className={cx('paganition')}>
                        <PaginationBar />
                    </div>

                    <Modal isOpen={this.state.isModalOpen} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AllUsedLibraries);
