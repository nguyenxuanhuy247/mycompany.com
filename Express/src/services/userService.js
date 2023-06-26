import db from '~/models';
import bcrypt from 'bcryptjs';
import product from '~/models/product';

const salt = bcrypt.genSaltSync(10);

// Email check function
const checkUserEmailInDB = async (email) => {
    try {
        let user = await db.User.findOne({ where: { email: email } });

        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log('An error in checkUserEmailInDB() in userService.js : ', error);
    }
};

// Hash password function
const hashUserPassword = async (password) => {
    try {
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    } catch (error) {
        console.log('An error in hashUserPassword() : ', error);
    }
};

// Connect signup with Database
export const postUserSignUp = async (fullName, email, password) => {
    try {
        let hashPassword = await hashUserPassword(password);

        const [user, created] = await db.User.findOrCreate({
            where: {
                email: email,
            },
            defaults: {
                fullName: fullName,
                email: email,
                password: hashPassword,
            },
        });

        if (!created) {
            return {
                errorCode: 32,
                errorMessage: `Email của bạn đã được đăng ký`,
            };
        } else {
            return {
                errorCode: 0,
                errorMessage: `Tài khoản được tạo thành công`,
            };
        }
    } catch (error) {
        console.log('An error in postUserSignUp() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// Handle User Sign In with Database
export const postUserSignIn = async (userEmail, userPassword) => {
    try {
        // Use email to check whether the user exists
        let isEmailExisted = await checkUserEmailInDB(userEmail);

        if (isEmailExisted) {
            // Get user's data again prevent someone from deleting/changing data
            let user = await db.User.findOne({
                where: { email: userEmail },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            });

            if (user) {
                // Compare password
                let isPasswordMatch = await bcrypt.compareSync(userPassword, user.password);

                if (isPasswordMatch) {
                    delete user.password;

                    return {
                        errorCode: 0,
                        errorMessage: `Đăng nhập thành công`,
                        data: user,
                    };
                } else {
                    return {
                        errorCode: 34,
                        errorMessage: `Sai mật khẩu. Vui lòng kiểm tra lại`,
                    };
                }
            } else {
                return {
                    errorCode: 33,
                    errorMessage: `Không tìm thấy người dùng`,
                };
            }
        } else {
            userData.errorCode = 32;
            userData.errorMessage = `Email không tồn tại trên hệ thống`;
        }

        return userData;
    } catch (error) {
        console.log('An error in postUserSignIn() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// =================================================================
// CRUD TECHNOLOGY

// CREATE TECHNOLOGY
export const handleCreateTechnology = async (data) => {
    try {
        const { type, key, side, image, name, version, link } = data;

        let whereQuery;
        if (key === 'LI') {
            whereQuery = { side: side, name: name };
        } else {
            whereQuery = { name: name };
        }

        const technology = await db.Technology.findOne({
            where: whereQuery,
            attributes: ['name'],
        });

        if (!technology || technology.name !== name) {
            await db.Technology.create({
                type: type,
                key: key,
                side: side,
                image: image,
                name: name,
                version: version,
                link: link,
            });

            let whereQuery;
            if (key === 'LI') {
                whereQuery = { key: key, side: side };
            } else {
                whereQuery = { key: key };
            }

            const totalRows = await db.Technology.count({
                where: whereQuery,
            });

            return {
                errorCode: 0,
                errorMessage: `Tạo dữ liệu thành công`,
                totalRows: totalRows,
            };
        } else {
            return {
                errorCode: 32,
                errorMessage: `Dữ liệu đã tồn tại trong Database`,
            };
        }
    } catch (error) {
        console.log('An error in handleCreateTechnology() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// READ TECHNOLOGY
export const handleGetTechnology = async (data) => {
    try {
        const { key, side, id, page, page_size } = data;

        let whereQuery;
        if (key === 'LI') {
            whereQuery = { key: key, side: side };
        } else {
            whereQuery = { key: key };
        }

        let technology;

        if (id === 'ALL') {
            if (page && page_size && page_size > 0) {
                const pageNumber = parseInt(page);
                const pageSizeNumber = parseInt(page_size);

                const startIndex = (pageNumber - 1) * pageSizeNumber;

                const { count, rows } = await db.Technology.findAndCountAll({
                    where: { key: key, side: side },
                    attributes: ['id', 'image', 'name', 'version', 'link'],
                    offset: startIndex,
                    limit: pageSizeNumber,
                });

                const totalPages = Math.ceil(count / pageSizeNumber);

                return {
                    errorCode: 0,
                    errorMessage: `Tải dữ liệu phân trang thành công`,
                    totalPages: totalPages,
                    data: rows,
                };
            } else {
                technology = await db.Technology.findAll({
                    where: whereQuery,
                    attributes: ['id', 'image', 'name', 'version', 'link'],
                });

                return {
                    errorCode: 0,
                    errorMessage: `Tải tất cả dữ liệu thành công`,
                    data: technology,
                };
            }
        } else {
            technology = await db.Technology.findOne({
                where: { id: id, ...whereQuery },
                attributes: ['id', 'image', 'name', 'version', 'link'],
            });

            if (technology) {
                return {
                    errorCode: 0,
                    errorMessage: `Tải dữ liệu thành công`,
                    data: technology,
                };
            } else {
                return {
                    errorCode: 32,
                    errorMessage: `Không tìm thấy dữ liệu khớp id`,
                };
            }
        }
    } catch (error) {
        console.log('An error in handleGetTechnology() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// UPDATE TECHNOLOGY
export const handleUpdateTechnology = async (data) => {
    try {
        const { id, image, name, version, link } = data;

        const result = await db.Technology.findOne({
            where: { id: id },
            raw: false,
        });

        if (result) {
            if (image) {
                result.image = image;
            }
            result.name = name;
            result.version = version;
            result.link = link;

            await result.save();

            return {
                errorCode: 0,
                errorMessage: `Sửa dữ liệu thành công`,
            };
        } else {
            return {
                errorCode: 32,
                errorMessage: `Không tìm thấy id trong Database`,
            };
        }
    } catch (error) {
        console.log('An error in handleUpdateTechnology() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// DELETE TECHNOLOGY
export const handleDeleteTechnology = async (data) => {
    try {
        const { key, side, id } = data;

        const result = await db.Technology.findOne({
            where: { id: id },
        });

        if (result) {
            await db.Technology.destroy({ where: { id: id } });

            let whereQuery;
            if (key === 'LI') {
                whereQuery = { key: key, side: side };
            } else {
                whereQuery = { key: key };
            }

            const totalRows = await db.Technology.count({
                where: whereQuery,
            });

            console.log('Total Rows: ', totalRows);
            return {
                errorCode: 0,
                errorMessage: `Xóa thư viện thành công`,
                totalRows: totalRows,
            };
        } else {
            return {
                errorCode: 32,
                errorMessage: `Không tìm thấy id trong Database`,
            };
        }
    } catch (error) {
        console.log('An error in handleDeleteTechnology() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// =================================================================
// CRUD USER INFORMATION

// READ USER INFORMATION
export const handleGetUserInformation = async (data) => {
    try {
        const { id } = data;

        let user = await db.User.findOne({
            where: { id: id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        });

        if (user) {
            return {
                errorCode: 0,
                errorMessage: `Tải dữ liệu người dùng thành công`,
                data: user,
            };
        } else {
            return {
                errorCode: 32,
                errorMessage: `Không tìm thấy thông tin người dùng`,
            };
        }
    } catch (error) {
        console.log('An error in handleGetUserInformation() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// UPDATE USER INFORMATION
export const handleUpdateUserInformation = async (data) => {
    try {
        const { id, avatar, fullName, dateOfBirth } = data;

        const newData = { ...data };
        delete newData.id;

        const user = await db.User.findOne({
            where: { id: id },
            raw: false,
        });

        if (user) {
            for (let prop in newData) {
                if (newData[prop] !== undefined) {
                    user[prop] = newData[prop];
                }
            }

            await user.save();

            return {
                errorCode: 0,
                errorMessage: `Sửa thông tin người dùng thành công`,
            };
        } else {
            return {
                errorCode: 32,
                errorMessage: `Không tìm thấy id người dùng trong Database`,
            };
        }
    } catch (error) {
        console.log('An error in handleUpdateUserInformation() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};

// =================================================================
// CRUD PRODUCT LIST

// READ PRODUCT LIST
export const handleGetProductList = async (data) => {
    try {
        const { id, page, page_size } = data;

        let user = await db.User.findOne({
            where: { id: id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        });

        if (user) {
            let products = await db.Product.findAll({
                where: { userId: id },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            });

            if (products) {
                let newProducts = [];

                for (let index in products) {
                    const productIDinDB = products[index].id;
                    console.log('productIDinDB', productIDinDB);
                    newProducts[index] = { productInfo: { ...products[index] } };

                    const sourceCodeList = await db.Technology.findAll({
                        where: { key: 'SC', userId: id, productId: productIDinDB },
                        attributes: ['id', 'image', 'name', 'link'],
                    });

                    const FETechnologyList = await db.Technology.findAll({
                        where: { key: 'FT', userId: id, productId: productIDinDB },
                        attributes: ['id', 'image', 'name', 'link'],
                    });

                    const BETechnologyList = await db.Technology.findAll({
                        where: { key: 'BT', userId: id, productId: productIDinDB },
                        attributes: ['id', 'image', 'name', 'link'],
                    });

                    const { count, rows } = await db.Technology.findAndCountAll({
                        where: { userId: id, productId: productIDinDB, key: 'LI', side: 'FE' },
                        attributes: ['id', 'image', 'name', 'version', 'link'],
                        offset: 0,
                        limit: 10,
                    });

                    const technologies = {
                        sourceCodeList,
                        FETechnologyList,
                        BETechnologyList,
                        libraryList: rows,
                        totalPages: count,
                    };

                    newProducts[index].technologies = technologies;
                }

                return {
                    errorCode: 0,
                    errorMessage: `Tải dữ toàn bộ dữ liệu của người dùng thành công`,
                    data: newProducts,
                };
            } else {
                return {
                    errorCode: 34,
                    errorMessage: `Không tìm thấy công nghệ của sản phẩm`,
                };
            }
        } else {
            return {
                errorCode: 32,
                errorMessage: `Không tìm thấy thông tin người dùng`,
            };
        }
    } catch (error) {
        console.log('An error in handleGetProductList() in userService.js : ', error);
        return {
            errorCode: 31,
            errorMessage: `Không kết nối được với Database`,
        };
    }
};
