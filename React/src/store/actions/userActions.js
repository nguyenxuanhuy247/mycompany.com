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
export const createTechnology = (toastText, actionName, dataSent) => {
    return async (dispatch) => {
        const actionStart = `CREATE_${actionName}_START`;
        const actionSuccess = `CREATE_${actionName}_SUCCESS`;
        const actionFailure = `CREATE_${actionName}_FAILURE`;

        dispatch(CRUDTechnology_Start_Success_Failure(actionStart));
        try {
            let res = await userService.createTechnology(dataSent);
            if (res.errorCode === 0) {
                toast.success(`Tạo mới ${toastText} thành công`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionSuccess, res));
                return res;
            } else {
                toast.error(`Tạo mới ${toastText} thất bại`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, res));
                return res;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, error.response.data));
            console.log('An error in createTechnology() - userActions.js: ', error);
            return error.response.data;
        }
    };
};

// READ TECHNOLOGY
export const readTechnology = (toastText, actionName, id, key, side, page, pageSize) => {
    return async (dispatch) => {
        const actionStart = `READ_${actionName}_START`;
        const actionSuccess = `READ_${actionName}_SUCCESS`;
        const actionFailure = `READ_${actionName}_FAILURE`;

        dispatch(CRUDTechnology_Start_Success_Failure(actionStart));
        try {
            const res = await userService.readTechnology(id, key, side, page, pageSize);

            if (res.errorCode === 0) {
                dispatch(CRUDTechnology_Start_Success_Failure(actionSuccess, res));
            } else {
                toast.error(`Tải ${toastText} thất bại`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, res));
            }
        } catch (error) {
            toast.error(error.response?.data?.errorMessage);
            dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, error.response.data));
            console.log('An error in readTechnology() - userActions.js: ', error);
        }
    };
};

// UPDATE TECHNOLOGY
export const updateTechnology = (toastText, actionName, dataSent, isToastSuccess) => {
    return async (dispatch) => {
        const actionStart = `UPDATE_${actionName}_START`;
        const actionSuccess = `UPDATE_${actionName}_SUCCESS`;
        const actionFailure = `UPDATE_${actionName}_FAILURE`;

        dispatch(CRUDTechnology_Start_Success_Failure(actionStart));
        try {
            let res = await userService.updateTechnology(dataSent);
            if (res.errorCode === 0) {
                isToastSuccess && toast.success(`Sửa ${toastText} thành công`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionSuccess, res));
                return res.errorCode;
            } else {
                toast.error(`Sửa ${toastText} thất bại`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, res));
                return res.errorCode;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, error.response.data));
            console.log('An error in updateTechnology() - userActions.js: ', error);
            return error.response.data.errorCode;
        }
    };
};

// DELETE TECHNOLOGY
export const deleteTechnology = (toastText, actionName, id, key, side) => {
    return async (dispatch) => {
        const actionStart = `DELETE_${actionName}_START`;
        const actionSuccess = `DELETE_${actionName}_SUCCESS`;
        const actionFailure = `DELETE_${actionName}_FAILURE`;

        dispatch(CRUDTechnology_Start_Success_Failure(actionStart));
        try {
            let res = await userService.deleteTechnology(id, key, side);
            if (res.errorCode === 0) {
                toast.success(`Xóa ${toastText} thành công`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionSuccess, res));
                return res;
            } else {
                toast.error(`Xóa ${toastText} thất bại`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, res));
                return res;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, error.response.data));
            console.log('An error in deleteTechnology() - userActions.js: ', error);
            return error.response.data;
        }
    };
};

export const CRUDTechnology_Start_Success_Failure = (actionName, data) => ({
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

        dispatch(CRUDUserInformation_Start_Success_Failure(actionStart));
        try {
            const res = await userService.readUserInformation(id);

            if (res.errorCode === 0) {
                dispatch(CRUDUserInformation_Start_Success_Failure(actionSuccess, res));
            } else {
                toast.error(`Tải ${toastText} thất bại`);
                dispatch(CRUDUserInformation_Start_Success_Failure(actionFailure, res));
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDUserInformation_Start_Success_Failure(actionFailure, error.response.data));
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

        dispatch(CRUDTechnology_Start_Success_Failure(actionStart));
        try {
            let res = await userService.updateUserInformation(dataSent);
            if (res.errorCode === 0) {
                isToastSuccess && toast.success(`Sửa ${toastText} thành công`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionSuccess, res));
                return res.errorCode;
            } else {
                toast.error(`Sửa ${toastText} thất bại`);
                dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, res));
                return res.errorCode;
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDTechnology_Start_Success_Failure(actionFailure, error.response.data));
            console.log('An error in updateTechnology() - userActions.js: ', error);
            return error.response.data.errorCode;
        }
    };
};

export const CRUDUserInformation_Start_Success_Failure = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});

// =================================================================
// READ CV LAYOUT

export const readCVLayout = (toastText, actionName, id) => {
    return async (dispatch) => {
        const actionStart = `READ_${actionName}_START`;
        const actionSuccess = `READ_${actionName}_SUCCESS`;
        const actionFailure = `READ_${actionName}_FAILURE`;

        dispatch(readCVLayout_Start_Success_Failure(actionStart));
        try {
            const res = await userService.readCVLayout(id);
            const { errorCode, data } = res;
            console.log(data);
            if (errorCode === 0) {
                dispatch(readCVLayout_Start_Success_Failure(actionSuccess, data));
            } else {
                toast.error(`Tải ${toastText} thất bại`);
                dispatch(readCVLayout_Start_Success_Failure(actionFailure));
            }
        } catch (error) {
            toast.error(error.response.data.errorMessage);
            dispatch(CRUDUserInformation_Start_Success_Failure(actionFailure, error.response.data));
            console.log('An error in readUserInformation() - userActions.js: ', error);
        }
    };
};

export const readCVLayout_Start_Success_Failure = (actionName, data) => ({
    type: actionNames[actionName],
    payload: data,
});
