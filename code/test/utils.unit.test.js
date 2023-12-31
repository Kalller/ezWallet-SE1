import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { handleDateFilterParams, verifyAuth, handleAmountFilterParams } from '../controllers/utils';

jest.mock('jsonwebtoken');

describe("handleDateFilterParams", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return an empty object for an empty query', () => {
        const req = { query: undefined };
        const result = handleDateFilterParams(req);
        expect(result).toEqual({});
    });
    test('should return matchStage with $gte condition for valid "from" parameter', () => {
        const req = { query: { from: '2023-01-01' } };
        const result = handleDateFilterParams(req);
        expect(result).toEqual({ date: { $gte: new Date('2023-01-01T00:00:00.000Z') } });
    });

    test('should return matchStage with $gte condition for valid "from" parameter', () => {
        const req = { query: { from: '2024-02-29' } };
        const result = handleDateFilterParams(req);
        expect(result).toEqual({ date: { $gte: new Date('2024-02-29T00:00:00.000Z') } });
    });

    test('should return matchStage with $gte condition for valid "from" parameter', () => {
        const req = { query: { from: '2000-04-29' } };
        const result = handleDateFilterParams(req);
        expect(result).toEqual({ date: { $gte: new Date('2000-04-29T00:00:00.000Z') } });
    });

    test('should throw an error for invalid "from" parameter', () => {
        const req = { query: { from: 'invalid' } };
        expect(() => handleDateFilterParams(req)).toThrow('The string is not a date');
    });
    test('should return matchStage with $lte condition for valid "upTo" parameter', () => {
        const req = { query: { upTo: '2023-01-31' } };
        const result = handleDateFilterParams(req);
        expect(result).toEqual({ date: { $lte: new Date('2023-01-31T23:59:59.999Z') } });
    });
    test('should throw an error for invalid "upTo" parameter', () => {
        const req = { query: { upTo: 'invalid' } };
        expect(() => handleDateFilterParams(req)).toThrow('The string is not a date');
    });
    test('should return matchStage with $gte and $lte conditions for valid "date" parameter', () => {
        const req = { query: { date: '2023-01-15' } };
        const result = handleDateFilterParams(req);
        const expectedDate = new Date('2023-01-15');
        const expectedDateEnd = new Date('2023-01-15T23:59:59.999Z');
        expect(result).toEqual({ date: { $gte: expectedDate, $lte: expectedDateEnd } });
    });
    test('should throw an error for "date" parameter with conflicting parameters', () => {
        const req = { query: { date: '2023-01-15', from: '2023-01-01' } };
        expect(() => handleDateFilterParams(req)).toThrow('Impossible combination');
    });
    test('should throw an error for invalid "date" parameter', () => {
        const req = { query: { date: 'invalid' } };
        expect(() => handleDateFilterParams(req)).toThrow('The string is not a date');
    });
    test('should throw an error for invalid "date" parameter', () => {
        const req = { query: { date: '2023-02-29' } };
        expect(() => handleDateFilterParams(req)).toThrow('The string is not a date');
    });
    test('should throw an error for invalid "date" parameter', () => {
        const req = { query: { date: '2023-01-32' } };
        expect(() => handleDateFilterParams(req)).toThrow('The string is not a date');
    });
    test('should throw an error for invalid "date" parameter', () => {
        const req = { query: { date: '2023-04-31' } };
        expect(() => handleDateFilterParams(req)).toThrow('The string is not a date');
    });
    test('should throw an error for conflicting "upTo" and "from" parameters', () => {
        const req = { query: { from: '2023-01-01', upTo: '2022-12-31' } };
        expect(() => handleDateFilterParams(req)).toThrow('Impossible combination');
    });
    test('should throw an error when date2 month is after date1', () => {
        const req = { query: { from: '2023-03-02', upTo: '2023-02-01' } };
        expect(() => handleDateFilterParams(req)).toThrow('Impossible combination');
    });
    test('should throw an error when date2 day is after date1', () => {
        const req = { query: { from: '2023-02-02', upTo: '2023-02-01' } };
        expect(() => handleDateFilterParams(req)).toThrow('Impossible combination');
    });
    test('should not throw an error after the isAfter method check', () => {
        const req = { query: { from: '2023-01-02', upTo: '2023-02-01' } };
        expect(() => handleDateFilterParams(req)).not.toThrow('Impossible combination');
    });
});



describe('verifyAuth', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            cookies: {
                accessToken: 'validAccessToken',
                refreshToken: 'validRefreshToken'
            }
        };
        res = {
            locals: {},
            cookie: jest.fn()
        };
        jwt.verify.mockImplementation((token) => {
            if (token === 'validAccessToken') {
                return { username: 'user1', email: 'user1@example.com', role: 'Regular' };
            } else if (token === 'validRefreshToken') {
                return { username: 'user1', email: 'user1@example.com', role: 'Regular' };
            }
            if (token === 'validAccessTokenAdmin') {
                return { username: 'user1', email: 'user1@example.com', role: 'Admin' };
            } else if (token === 'validRefreshTokenAdmin') {
                return { username: 'user1', email: 'user1@example.com', role: 'Admin' };
            }
            if (token === 'badAccessToken') {
                return { username: '', email: 'user1@example.com', role: 'Regular' };
            } else if (token === 'badRefreshToken') {
                return { username: '', email: 'user1@example.com', role: 'Regular' };
            }
            throw new Error('Invalid token');
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return authorized false and cause Unauthorized if one of the token is missing', () => {
        req.cookies = {};
        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Unauthorized' });
    });

    test('should return authorized false and cause Token is missing information if one of the access token information is missing', () => {
        req.cookies = { accessToken: "badAccessToken", refreshToken: "validRefreshToken" };
        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Token is missing information' });
    });

    test('should return authorized false and cause Token is missing information if one of the refresh token information is missing', () => {
        req.cookies = { accessToken: "validAccessToken", refreshToken: "badRefreshToken" };
        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Token is missing information' });
    });

    test('should return authorized false and cause Mismatched users if a field of the AToken is not equal to the same field of the RToken', () => {
        req.cookies = { accessToken: "validAccessToken", refreshToken: "validRefreshTokenAdmin" };
        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Mismatched users' });
    });

    test('should return authorized true and cause Authorized for Simple authType', () => {
        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: true, cause: 'Authorized' });
    });

    test('should return authorized true and cause Authorized for Admin authType with valid role', () => {
        req.cookies = { accessToken: "validAccessTokenAdmin", refreshToken: "validRefreshTokenAdmin" };
        const info = { authType: 'Admin' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: true, cause: 'Authorized' });
    });

    test('should return authorized false and cause Unauthorized for Admin authType with invalid role', () => {
        const info = { authType: 'Admin' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Unauthorized' });
    });

    test('should return authorized true and cause Authorized for User authType with valid username and role', () => {
        const info = { authType: 'User', username: 'user1' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: true, cause: 'Authorized' });
    });

    test('should return authorized false and cause Unauthorized for User authType with invalid username', () => {
        const info = { authType: 'User', username: 'user2' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Unauthorized' });
    });

    test('should return authorized true and cause Authorized for Group authType with valid email', () => {
        const info = { authType: 'Group', memberEmails: ['user1@example.com', 'user2@example.com'] };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: true, cause: 'Authorized' });
    });

    test('should return authorized false and cause Unauthorized for Group authType with invalid email', () => {
        const info = { authType: 'Group', memberEmails: ['user2@example.com', 'user3@example.com'] };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Unauthorized' });
    });

    test('should return authorized false and cause Unknown auth type for unknown authType', () => {
        const info = { authType: 'Unknown' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Unknown auth type' });
    });

    test('should return authorized true and cause Authorized after refreshing the accessToken', () => {
        jwt.verify.mockImplementationOnce(() => {
            const TokenExpiredError = jest.requireActual('jsonwebtoken').TokenExpiredError;
            throw new TokenExpiredError('Token expired');
        });
        const info = { authType: 'Simple' };
        const newAccessToken = 'newAccessToken';
        jwt.sign.mockReturnValue(newAccessToken);

        const result = verifyAuth(req, res, info);

        expect(result).toEqual({ authorized: true, cause: 'Authorized' });
        expect(res.cookie).toHaveBeenCalledWith('accessToken', newAccessToken, { httpOnly: true, path: '/api', maxAge: 3600000, sameSite: 'none', secure: true });
        expect(res.locals.refreshedTokenMessage).toBe('Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls');
    });

    test('should return authorized false and cause Perform login again after failing to refresh the accessToken', () => {
        jwt.verify.mockImplementation(() => {
            const TokenExpiredError = jest.requireActual('jsonwebtoken').TokenExpiredError;
            throw new TokenExpiredError('Token expired');
        });
        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Perform login again' });
    });

    test('should return authorized false and cause Error if the refreshToken throw an unexpected error', () => {
        jwt.verify.mockImplementationOnce(() => {
            const TokenExpiredError = jest.requireActual('jsonwebtoken').TokenExpiredError;
            throw new TokenExpiredError('Token expired');
        });
        jwt.verify.mockImplementationOnce(() => {
            throw new Error();
        });

        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Error' });
    });

    test('should return authorized false and cause Error if the accessToken throw an unexpected error', () => {

        jwt.verify.mockImplementationOnce(() => {
            throw new Error();
        });

        const info = { authType: 'Simple' };
        const result = verifyAuth(req, res, info);
        expect(result).toEqual({ authorized: false, cause: 'Error' });
    });

});

describe("handleAmountFilterParams", () => { 
    // Mock request object
    const mockReq = {
        query: {},
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test when no query params are present
    test('should return an empty object when no query params are present', () => {
        mockReq.query = undefined;
        const result = handleAmountFilterParams(mockReq);
        expect(result).toEqual({});
    });

    // Test when `min` query param is present and valid
    test('should return an object with $gte attribute when min query param is present and valid', () => {
        mockReq.query = { min: '100' };
        const result = handleAmountFilterParams(mockReq);
        expect(result).toEqual({ amount: { $gte: 100 } });
    });

    // Test when `max` query param is present and valid
    test('should return an object with $lte attribute when max query param is present and valid', () => {
        mockReq.query = { max: '500' };
        const result = handleAmountFilterParams(mockReq);
        expect(result).toEqual({ amount: { $lte: 500 } });
    });

    // Test when `min` and `max` query params are present and valid
    test('should return an object with $gte and $lte attributes when min and max query params are present and valid', () => {
        mockReq.query = { min: '100', max: '500' };
        const result = handleAmountFilterParams(mockReq);
        expect(result).toEqual({ amount: { $gte: 100, $lte: 500 } });
    });

    // Test when `min` or `max` query param is not a number
    test('should throw error when min or max query param is not a number', () => {
        mockReq.query = { min: 'not_a_number' };
        expect(() => handleAmountFilterParams(mockReq)).toThrow('The input is not a number');

        mockReq.query = { max: 'not_a_number' };
        expect(() => handleAmountFilterParams(mockReq)).toThrow('The input is not a number');
    });

    // Test when `min` is greater than `max`
    test('should throw error when min is greater than max', () => {
        mockReq.query = { min: '500', max: '100' };
        expect(() => handleAmountFilterParams(mockReq)).toThrow('Impossible combination');
    });
});

