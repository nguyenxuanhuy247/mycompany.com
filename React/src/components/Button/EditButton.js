import { PureComponent } from 'react';
import { connect } from 'react-redux';
import className from 'classnames/bind';
import PropTypes from 'prop-types';
import { RiDragMove2Fill } from 'react-icons/ri';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineLogout } from 'react-icons/md';
import DefaultTippy from '@tippyjs/react';

import styles from './EditButton.module.scss';
import Button from './Button';

const cx = className.bind(styles);

class EditButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {};

    static propTypes = {
        name: PropTypes.string,
    };

    render() {
        return (
            <div className={cx('wrapper')}>
                <DefaultTippy content="Kéo thả để di chuyển mục">
                    <Button className={cx('btn', 'drag')}>
                        <RiDragMove2Fill />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Thêm mục mới">
                    <Button className={cx('btn', 'add')}>
                        <IoIosAddCircleOutline />
                    </Button>
                </DefaultTippy>

                <DefaultTippy content="Xóa mục này">
                    <Button className={cx('btn', 'delete')}>
                        <AiOutlineDelete />
                    </Button>
                </DefaultTippy>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditButton);
