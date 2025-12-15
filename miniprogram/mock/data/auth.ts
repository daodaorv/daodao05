/**
 * 认证相关Mock数据
 */

export const authData = {
    /**
     * 发送验证码
     */
    sendCode(data: any) {
        return {
            code: 0,
            message: '验证码发送成功',
            data: {
                codeId: 'mock_code_id_' + Date.now(),
                expireIn: 300
            }
        };
    },

    /**
     * 用户注册
     */
    register(data: any) {
        return {
            code: 0,
            message: '注册成功',
            data: {
                token: 'mock_token_' + Date.now(),
                refreshToken: 'mock_refresh_token_' + Date.now(),
                user: {
                    id: 'user_001',
                    phone: data.phone,
                    nickname: '新用户',
                    avatar: 'https://via.placeholder.com/100',
                    userType: 'CUSTOMER',
                    tags: ['新用户']  // 新用户标签
                }
            }
        };
    },

    /**
     * 用户登录
     */
    login(data: any) {
        return {
            code: 0,
            message: '登录成功',
            data: {
                token: 'mock_token_' + Date.now(),
                refreshToken: 'mock_refresh_token_' + Date.now(),
                user: {
                    id: 'user_001',
                    phone: data.phone,
                    nickname: '叨叨用户',
                    avatar: 'https://via.placeholder.com/100',
                    userType: 'CUSTOMER',
                    tags: []  // 普通用户无标签
                }
            }
        };
    },

    /**
     * 获取用户信息
     */
    getProfile() {
        return {
            code: 0,
            message: 'success',
            data: {
                id: 'user_001',
                phone: '138****0001',
                nickname: '叨叨用户',
                avatar: 'https://via.placeholder.com/100',
                userType: 'CUSTOMER',
                tags: [],  // 普通用户无标签
                walletBalance: 0,
                integrals: 0,
                profile: {
                    realName: '',
                    idCard: '',
                    driverLicense: ''
                }
            }
        };
    }
};
