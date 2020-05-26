import { Response, Request, NextFunction } from 'express';
import Token from '../class/token';

export const checkToken = (request: any, response: Response, next: NextFunction) => {

	const userToken = request.get('x-token') || '';

	Token.validateToken(userToken)
		.then( (decoded: any) => {
			console.log('Decoded', decoded)
			request.user = decoded.user;

			next();
		})
		.catch( error => {
			response.json({
				success: false,
				message: 'Token no es correcto'
			});
		});

}