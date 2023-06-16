import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import Pagination from '@mui/material/Pagination';

import styles from './Product.module.scss';
import TechnologyList from '~/layouts/PersonalLayout/Components/TechnologyList.js';
import ContentEditableTag from '~/layouts/PersonalLayout/Components/ContentEditableTag.js';
import Image from '~/components/Image/Image.js';
import { JpgImages } from '~/components/Image/Images.js';
import LibraryList from './LibraryList.js';
import ChangeImageModal from '~/components/Modal/ChangeImageModal.js';
import * as userActions from '~/store/actions';
import Button from '~/components/Button/Button.js';
import Loading from '~/components/Modal/Loading.js';

const cx = classnames.bind(styles);

class Product extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isFE: true,
            isPagination: true,
            selectedPage: 1,
            itemsPerPage: 10,

            isModalOpen: false,
            uploadImageUrl: '',
            imageUrl: '',
        };

        this.lastPage = React.createRef();
    }

    onClose = () => {
        this.setState({
            isModalOpen: false,
        });
    };

    getImageUrlFromChangeImageModal = (url) => {
        this.setState({ imageUrl: url });
    };

    FEorBESide = () => {
        const side = this.state.isFE ? 'FE' : 'BE';
        return side;
    };

    handleShowLibraryList = (e) => {
        const isActive = e.currentTarget.classList.contains(cx('active'));
        const isFE = e.currentTarget.id === 'js-frontend-button';

        if (!isActive) {
            const btn = document.querySelector(`.${cx('active')}`);
            if (btn) {
                btn.classList.remove(cx('active'));
                e.target.classList.add(cx('active'));

                if (this.state.isPagination) {
                    this.setState({ isFE: isFE, selectedPage: 1 }, () =>
                        this.props.readLibrary(this.FEorBESide(), 1, this.state.itemsPerPage),
                    );
                } else {
                    this.setState({ isFE: isFE, selectedPage: 1 }, () => this.props.readLibrary(this.FEorBESide()));
                }
            }
        }
    };

    handleChangePage = (event, value) => {
        this.setState({ selectedPage: value });
        this.props.readLibrary(this.FEorBESide(), value, this.state.itemsPerPage);
    };

    handleShowAllLibraryList = () => {
        const showAllButton = document.getElementById('js-show-all');
        if (!showAllButton.classList.contains(`${cx('active')}`)) {
            this.props.readLibrary(this.FEorBESide());
            this.setState({ isPagination: false });
        }

        const paginationButton = document.getElementById('js-pagination');

        showAllButton.classList.add(`${cx('active')}`);
        paginationButton.classList.remove(`${cx('active')}`);
    };

    hanldeShowPagination = async () => {
        const paginationSelect = document.getElementById('js-select-pagination');
        const showAllButton = document.getElementById('js-show-all');
        const paginationButton = document.getElementById('js-pagination');

        paginationSelect.onclick = (e) => e.stopPropagation();

        paginationButton.classList.add(`${cx('active')}`);
        showAllButton.classList.remove(`${cx('active')}`);
        await this.setState({ isPagination: true, itemsPerPage: paginationSelect.value });
        await this.props.readLibrary(this.FEorBESide(), 1, this.state.itemsPerPage);
    };

    handleChangeItemsPerPage = async (e) => {
        const showAllButton = document.getElementById('js-show-all');
        const paginationButton = document.getElementById('js-pagination');

        paginationButton.classList.add(`${cx('active')}`);
        showAllButton.classList.remove(`${cx('active')}`);

        await this.setState({ isPagination: true, itemsPerPage: e.target.value });
        await this.props.readLibrary(this.FEorBESide(), 1, this.state.itemsPerPage);
    };

    // CRUD Library
    handleCreateLibrary = async (data) => {
        const side = this.FEorBESide();
        const libraryData = {
            side: side,
            ...data,
        };

        const { errorCode, totalRows } = await this.props.createLibrary(libraryData);

        if (errorCode === 0) {
            if (this.state.isPagination) {
                const lastPage = Math.ceil(totalRows / this.state.itemsPerPage);
                await this.setState({
                    selectedPage: lastPage,
                });
                await this.props.readLibrary(side, lastPage, this.state.itemsPerPage);
            } else {
                await this.props.readLibrary(side);
            }

            return { errorCode };
        } else {
            return { errorCode };
        }
    };

    handleUpdateLibrary = async (data) => {
        const side = this.FEorBESide();
        const libraryData = {
            side: side,
            ...data,
        };

        const errorCode = await this.props.updateLibrary(libraryData, true);

        if (errorCode === 0) {
            if (this.state.isPagination) {
                await this.props.readLibrary(side, this.state.selectedPage, this.state.itemsPerPage);
            } else {
                await this.props.readLibrary(side);
            }

            return errorCode;
        } else {
            return errorCode;
        }
    };

    handleDeleteLibrary = async (id) => {
        const side = this.FEorBESide();
        const { errorCode, totalRows } = await this.props.deleteLibrary(id, side);

        if (errorCode === 0) {
            if (this.state.isPagination) {
                const lastPage = Math.ceil(totalRows / this.state.itemsPerPage);
                if (lastPage < this.state.selectedPage) {
                    this.setState({ selectedPage: lastPage });
                    this.props.readLibrary(side, lastPage, this.state.itemsPerPage);
                }

                await this.props.readLibrary(side, lastPage, this.state.itemsPerPage);
            } else {
                await this.props.readLibrary(side);
            }

            return { errorCode };
        } else {
            return { errorCode };
        }
    };

    // =================================================================

    componentDidMount() {
        this.props.readLibrary(this.FEorBESide(), this.state.selectedPage, this.state.itemsPerPage);
        this.props.readFramework('ALL');
        this.props.readSourceCode('ALL');
        this.props.readProgrammingLanguage('ALL');
    }

    componentDidUpdate(prevProps, prevState) {
        // If page's quantity is more than 1, libray list's height of page 2, 3, 4,... will be equal to page 1
        if (prevProps.pageQuantityLibrary !== this.state.pageQuantityLibrary) {
            const libraryList = document.getElementById('js-library-list');

            if (libraryList) {
                if (this.props.pageQuantityLibrary > 1) {
                    const height = libraryList.childNodes[0].offsetHeight * this.state.itemsPerPage;
                    libraryList.style.minHeight = `${height}px`;
                } else {
                    libraryList.style.minHeight = `initial`;
                }
            }
        }
    }

    render() {
        const dataForReadLibraryAfterSorting = {
            isPagination: this.state.isPagination,
            side: this.FEorBESide(),
            selectedPage: this.state.selectedPage,
            itemsPerPage: this.state.itemsPerPage,
        };

        return (
            <div className={cx('product')}>
                <div className={cx('row no-gutters')}>
                    <div className={cx('col pc-12')}>
                        <div className={cx('product-desc')} spellCheck="false">
                            <div className={cx('work-exp')}>
                                <ContentEditableTag className={cx('exp')} placeholder="Tên sản phẩm" />
                            </div>
                            <ContentEditableTag className={cx('desc')} placeholder="Mô tả ngắn gọn về sản phẩm" />
                        </div>
                        <HeadlessTippy
                            zIndex="10"
                            placement="bottom"
                            interactive
                            delay={[0, 300]}
                            offset={[0, -200]}
                            render={(attrs) => (
                                <div tabIndex="-1" {...attrs}>
                                    <div className={cx('tooltip')} onClick={() => this.setState({ isModalOpen: true })}>
                                        Sửa ảnh
                                    </div>
                                </div>
                            )}
                        >
                            <Image
                                src={this.state.imageUrl || JpgImages.avatar}
                                className={cx('image')}
                                alt="Ảnh sản phẩm"
                            />
                        </HeadlessTippy>

                        {this.state.isModalOpen && (
                            <ChangeImageModal
                                round={false}
                                onClose={this.onClose}
                                onGetUrl={this.getImageUrlFromChangeImageModal}
                            />
                        )}
                    </div>
                    <div className={cx('col pc-7')}>
                        <div className={cx('section')}>
                            <span className={cx('title')}>Source code</span>
                            <div className={cx('list')}>
                                <LibraryList
                                    draggable
                                    technology="source code"
                                    type="SOURCECODE"
                                    keyprop="SC"
                                    technologylist={this.props.sourceCodeList}
                                    isloading={this.props.isSourceCodeLoading}
                                    readtechnology={() => this.props.readSourceCode('ALL')}
                                    createtechnology={this.props.createSourceCode}
                                    updatetechnology={this.props.updateSourceCode}
                                    deletetechnology={this.props.deleteSourceCode}
                                />
                            </div>
                        </div>

                        <div className={cx('section')}>
                            <span className={cx('title')}>Ngôn ngữ lập trình</span>
                            <div className={cx('list')}>
                                <LibraryList
                                    draggable
                                    technology="Ngôn ngữ lập trình"
                                    type="PROGRAMMINGLANGUAGE"
                                    keyprop="PL"
                                    technologylist={this.props.programmingLanguageList}
                                    isloading={this.props.isProgrammingLanguageLoading}
                                    readtechnology={() => this.props.readProgrammingLanguage('ALL')}
                                    createtechnology={this.props.createProgrammingLanguage}
                                    updatetechnology={this.props.updateProgrammingLanguage}
                                    deletetechnology={this.props.deleteProgrammingLanguage}
                                />
                            </div>
                        </div>

                        <div className={cx('section')}>
                            <span className={cx('title')}>Frameworks</span>
                            <div className={cx('list')}>
                                <LibraryList
                                    draggable
                                    technology="framework"
                                    type="FRAMEWORK"
                                    keyprop="FW"
                                    technologylist={this.props.frameworkList}
                                    isloading={this.props.isFrameworkLoading}
                                    readtechnology={() => this.props.readFramework('ALL')}
                                    createtechnology={this.props.createFramework}
                                    updatetechnology={this.props.updateFramework}
                                    deletetechnology={this.props.deleteFramework}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('col pc-5')}>
                        <div className={cx('library-used')}>
                            <p className={cx('library-heading')}>Danh sách thư viện sử dụng</p>
                            <div className={cx('divide')}>
                                <Button
                                    id="js-frontend-button"
                                    className={cx('library-select-button', 'active')}
                                    onClick={(e) => this.handleShowLibraryList(e)}
                                >
                                    Front-end
                                </Button>
                                <Button
                                    id="js-backend-button"
                                    className={cx('library-select-button')}
                                    onClick={(e) => this.handleShowLibraryList(e)}
                                >
                                    Back-end
                                </Button>
                            </div>
                            <LibraryList
                                id="js-library-list"
                                draggable
                                technology="thư viện"
                                type="LIBRARY"
                                keyprop="LI"
                                isloading={this.props.isLibraryLoading}
                                technologylist={this.props.libraryList}
                                readtechnology={this.props.readLibrary}
                                createtechnology={this.handleCreateLibrary}
                                updatetechnology={this.handleUpdateLibrary}
                                deletetechnology={this.handleDeleteLibrary}
                                sortupdatetechnology={this.props.updateLibrary}
                                dataforsort={dataForReadLibraryAfterSorting}
                            />

                            {this.state.isPagination && (
                                <div
                                    style={{
                                        margin: '12px 0 12px',
                                        display: 'grid',
                                        placeItems: 'center',
                                    }}
                                >
                                    <Pagination
                                        count={this.props.pageQuantityLibrary}
                                        variant="outlined"
                                        size="medium"
                                        siblingCount={1}
                                        boundaryCount={1}
                                        page={this.state.selectedPage}
                                        sx={{
                                            '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root': {
                                                color: 'var(--primary-color)',
                                                fontSize: '12px',
                                                borderColor: 'var(--green-color-02)',
                                            },
                                            '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root:hover': {
                                                backgroundColor: 'var(--button-bgc-green-02)',
                                            },

                                            '& .css-lqq3n7-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected': {
                                                color: '#fff',
                                                backgroundColor: 'var(--button-bgc-green-01)',
                                            },

                                            '& .Mui-selected:hover': {
                                                backgroundColor: 'var(--button-bgc-green-01) !important',
                                            },
                                        }}
                                        onChange={this.handleChangePage}
                                    />
                                </div>
                            )}

                            <div className={cx('display')}>
                                <Button
                                    className={cx('button')}
                                    id="js-show-all"
                                    onClick={this.handleShowAllLibraryList}
                                >
                                    Hiển thị tất cả
                                </Button>
                                <Button
                                    className={cx('button', 'pag-button', 'active')}
                                    id="js-pagination"
                                    onClick={this.hanldeShowPagination}
                                >
                                    <label className={cx('label')}>Phân trang</label>
                                    <select
                                        className={cx('select')}
                                        id="js-select-pagination"
                                        onChange={(e) => this.handleChangeItemsPerPage(e)}
                                    >
                                        <option value="10" defaultValue>
                                            10
                                        </option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                        <option value="40">40</option>
                                        <option value="50">50</option>
                                    </select>
                                </Button>
                            </div>
                            {/* {this.props.isLibraryLoading && <Loading style={{ position: 'absolute' }} />} */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // Library
        isLibraryLoading: state.user.isLoading.library,
        libraryList: state.user.libraries,
        pageQuantityLibrary: state.user.pageQuantityLibrary,

        // Source code
        isSourceCodeLoading: state.user.isLoading.sourcecode,
        sourceCodeList: state.user.sourcecodes,

        // Programming language
        isProgrammingLanguageLoading: state.user.isLoading.programminglanguage,
        programmingLanguageList: state.user.programmingLanguages,

        // Framework
        isFrameworkLoading: state.user.isLoading.framework,
        frameworkList: state.user.frameworks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // Library
        readLibrary: (side, page, pageSize) =>
            dispatch(userActions.readTechnology('thư viện', 'LIBRARY', 'ALL', 'LI', side, page, pageSize)),
        createLibrary: (data) => dispatch(userActions.createTechnology('thư viện', 'LIBRARY', data)),
        updateLibrary: (data, isToastSuccess) =>
            dispatch(userActions.updateTechnology('thư viện', 'LIBRARY', data, isToastSuccess)),
        deleteLibrary: (id, side) => dispatch(userActions.deleteTechnology('thư viện', 'LIBRARY', id, 'LI', side)),

        // Source code
        readSourceCode: (id) => dispatch(userActions.readTechnology('Source Code', 'SOURCECODE', id, 'SC')),
        createSourceCode: (data) => dispatch(userActions.createTechnology('Source Code', 'SOURCECODE', data)),
        updateSourceCode: (data) => dispatch(userActions.updateTechnology('Source Code', 'SOURCECODE', data)),
        deleteSourceCode: (id) => dispatch(userActions.deleteTechnology('Source Code', 'SOURCECODE', id, 'SC')),

        // Source code
        readProgrammingLanguage: (id) =>
            dispatch(userActions.readTechnology('Ngôn ngữ lập trình', 'PROGRAMMINGLANGUAGE', id, 'PL')),
        createProgrammingLanguage: (data) =>
            dispatch(userActions.createTechnology('Ngôn ngữ lập trình', 'PROGRAMMINGLANGUAGE', data)),
        updateProgrammingLanguage: (data) =>
            dispatch(userActions.updateTechnology('Ngôn ngữ lập trình', 'PROGRAMMINGLANGUAGE', data)),
        deleteProgrammingLanguage: (id) =>
            dispatch(userActions.deleteTechnology('Ngôn ngữ lập trình', 'PROGRAMMINGLANGUAGE', id, 'PL')),

        // Framework
        readFramework: (id) => dispatch(userActions.readTechnology('framework', 'FRAMEWORK', id, 'FW')),
        createFramework: (data) => dispatch(userActions.createTechnology('framework', 'FRAMEWORK', data)),
        updateFramework: (data) => dispatch(userActions.updateTechnology('framework', 'FRAMEWORK', data)),
        deleteFramework: (id) => dispatch(userActions.deleteTechnology('framework', 'FRAMEWORK', id, 'FW')),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
