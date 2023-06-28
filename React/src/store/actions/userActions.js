import actionNames from './actionNames';
import * as userService from '~/services';
import { toast } from 'react-toastify';

// USER SIGN UP - CREATE USER INFORMATION
export const userSignUpStart = (userData) => {
    return async (dispatch) => {
        dispatch({ type: actionNames.USER_SIGNUP_START });
        try {
            let res = await userService.postSignUp(userData);
            const { errorCode, errorMessage } = res;
            if (errorCode === 0) {
                toast.success(`${errorMessage}`, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
                dispatch(userSignUpSuccess());
            } else {
                toast.error(`${errorMessage}`, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
                dispatch(userSignUpFail());
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
            dispatch(userSignUpFail());
            console.log('An error in userSignUpStart() - userActions.js: ', error);
        }
    };
};

export const userSignUpSuccess = () => ({
    type: actionNames.USER_SIGNUP_SUCCESS,
});

export const userSignUpFail = () => ({
    type: actionNames.USER_SIGNUP_FAIL,
});

// USER SIGN IN
export const userSignInStart = (userData) => {
    return async (dispatch) => {
        dispatch({ type: actionNames.USER_SIGNIN_START });
        try {
            let res = await userService.postSignIn(userData.email, userData.password);
            const { errorCode, errorMessage, data } = res;
            if (errorCode === 0) {
                toast.success(`${errorMessage}`, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
                dispatch(userSignInSuccess(data));
            } else {
                toast.error(`${errorMessage}`, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                });
                dispatch(userSignInFail());
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
            dispatch(userSignInFail());
            console.log('An error in userSignInStart() - userActions.js: ', error);
        }
    };
};

export const userSignInSuccess = (user) => ({
    type: actionNames.USER_SIGNIN_SUCCESS,
    payload: user,
});

export const userSignInFail = () => ({
    type: actionNames.USER_SIGNIN_FAIL,
});

// USER SIGN OUT
export const userSignOut = () => ({
    type: actionNames.USER_SIGNOUT,
});

// =================================================================
// CRUD TECHNOLOGY

// CREATE TECHNOLOGY
export const createTechnology = (dataSent, type) => {
    return async (dispatch) => {
        let toastText = '';
        if (type === 'SOURCECODE') {
            toastText = 'Source Code';
        } else if (type === 'TECHNOLOGY') {
            toastText = 'công nghệ sử dụng';
        } else if (type === 'LIBRARY') {
            toastText = 'thư viện sử dụng';
        }

        try {
            let res = await userService.createTechnology(dataSent);
            if (res.errorCode === 0) {
                toast.success(`Tạo mới ${toastText} thành công`);
                return res.errorCode;
            } else {
                toast.error(`Tạo mới ${toastText} thất bại`);
                return res.errorCode;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            console.log('An error in createTechnology() - userActions.js: ', error);
            return error.response.data.errorCode;
        }
    };
};

// UPDATE TECHNOLOGY
export const updateTechnology = (dataSent, type, isToastSuccess) => {
    return async (dispatch) => {
        let toastText = '';
        if (type === 'SOURCECODE') {
            toastText = 'Source Code';
        } else if (type === 'TECHNOLOGY') {
            toastText = 'công nghệ sử dụng';
        } else if (type === 'LIBRARY') {
            toastText = 'thư viện sử dụng';
        }
        try {
            let res = await userService.updateTechnology(dataSent);
            if (res.errorCode === 0) {
                isToastSuccess && toast.success(`Sửa ${toastText} thành công`);
                return res.errorCode;
            } else {
                toast.error(`Sửa ${toastText} thất bại`);
                return res.errorCode;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            console.log('An error in updateTechnology() - userActions.js: ', error);
            return error.response.data.errorCode;
        }
    };
};

// DELETE TECHNOLOGY
export const deleteTechnology = (id, type) => {
    return async (dispatch) => {
        let toastText = '';
        if (type === 'SOURCECODE') {
            toastText = 'Source Code';
        } else if (type === 'TECHNOLOGY') {
            toastText = 'công nghệ sử dụng';
        } else if (type === 'LIBRARY') {
            toastText = 'thư viện sử dụng';
        }

        try {
            let res = await userService.deleteTechnology(id);
            if (res.errorCode === 0) {
                toast.success(`Xóa ${toastText} thành công`);
                return res.errorCode;
            } else {
                toast.error(`Xóa ${toastText} thất bại`);
                return res.errorCode;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            console.log('An error in deleteTechnology() - userActions.js: ', error);
            return error.response.data.errorCode;
        }
    };
};

// =================================================================
// CRUD PRODUCT LIST

// READ PRODUCT LIST
export const readProductList = (actionName, userId) => {
    return async (dispatch) => {
        const actionStart = `READ_${actionName}_START`;
        const actionSuccess = `READ_${actionName}_SUCCESS`;
        const actionFailure = `READ_${actionName}_FAILURE`;

        dispatch(readProductList_Start(actionStart));
        try {
            const res = await userService.readProductList(userId);
            const { errorCode, data } = res;
            if (errorCode === 0) {
                dispatch(readProductList_Success(actionSuccess, data));
            } else {
                toast.error(`Tải danh sách sản phẩm thất bại`);
                dispatch(readProductList_Failure(actionFailure));
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDUserInformation_Failure(actionFailure));
            console.log('An error in readUserInformation() - userActions.js: ', error);
        }
    };
};

export const readProductList_Start = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});

export const readProductList_Success = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});

export const readProductList_Failure = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});

// =================================================================
// CRUD USER INFORMATION

// READ USER INFORMATION
export const readUserInformation = (toastText, actionName, id) => {
    return async (dispatch) => {
        const actionStart = `READ_${actionName}_START`;
        const actionSuccess = `READ_${actionName}_SUCCESS`;
        const actionFailure = `READ_${actionName}_FAILURE`;

        dispatch(CRUDUserInformation_Start(actionStart));
        try {
            const res = await userService.readUserInformation(id);

            if (res.errorCode === 0) {
                dispatch(CRUDUserInformation_Success(actionSuccess, res));
            } else {
                toast.error(`Tải ${toastText} thất bại`);
                dispatch(CRUDUserInformation_Failure(actionFailure, res));
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDUserInformation_Failure(actionFailure, error.response.data));
            console.log('An error in readUserInformation() - userActions.js: ', error);
        }
    };
};

// UPDATE USER INFORMATION
export const updateUserInformation = (toastText, actionName, dataSent, isToastSuccess) => {
    return async (dispatch) => {
        const actionStart = `UPDATE_${actionName}_START`;
        const actionSuccess = `UPDATE_${actionName}_SUCCESS`;
        const actionFailure = `UPDATE_${actionName}_FAILURE`;

        dispatch(CRUDUserInformation_Start(actionStart));
        try {
            let res = await userService.updateUserInformation(dataSent);
            if (res.errorCode === 0) {
                isToastSuccess && toast.success(`Sửa ${toastText} thành công`);
                dispatch(CRUDUserInformation_Success(actionSuccess, res));
                return res.errorCode;
            } else {
                toast.error(`Sửa ${toastText} thất bại`);
                dispatch(CRUDUserInformation_Failure(actionFailure, res));
                return res.errorCode;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDUserInformation_Failure(actionFailure, error.response.data));
            console.log('An error in updateTechnology() - userActions.js: ', error);
            return error.response.data.errorCode;
        }
    };
};

export const CRUDUserInformation_Start = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});

export const CRUDUserInformation_Success = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});

export const CRUDUserInformation_Failure = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});
