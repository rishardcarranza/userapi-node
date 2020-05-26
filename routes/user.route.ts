import { Router, Request, Response } from "express";
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../class/token';
import { checkToken } from '../middlewares/authentication';

const userRoutes = Router();


// Login User
userRoutes.post('/login', (request: Request, response: Response) => {

	const body = request.body;

	User.findOne({ email: body.email }, ( error, userDB ) => {

		if (error) throw error;

		if (!userDB) {
			return response.json({
				success: false,
				message: 'Usuario o contraseña no son correctos'
			});
		}

		if (userDB.checkPassword(body.password)) {

			const userToken = Token.getToken({
				_id: userDB._id,
				fullname: userDB.fullname,
				email: userDB.email,
				password: userDB.password,
				avatar: userDB.avatar
			});

			response.json({
				success: true,
				token: userToken
			});
		} else {
			return response.json({
				success: false,
				message: 'Usuario o contraseña no son correctos'
			});
		}

	}).catch( error => {
		response.json({
			success: false,
			message: 'Error al crear usuario',
			error
		});
	});

	// console.log(user);
});

// Create User
userRoutes.post('/create', (request: Request, response: Response) => {

	const user = {
		fullname: request.body.fullname,
		avatar: request.body.avatar,
		email: request.body.email,
		password: bcrypt.hashSync(request.body.password, 10)
	};

	User.create( user ).then( userDB => {

		const userToken = Token.getToken({
			_id: userDB._id,
			fullname: userDB.fullname,
			email: userDB.email,
			password: userDB.password,
			avatar: userDB.avatar
		});

		response.json({
			success: true,
			message: 'Usuario creado con éxito',
			token: userToken
		});

	}).catch( error => {
		response.json({
			success: false,
			message: 'Error al crear usuario',
			error
		});
	});

	// console.log(user);
});

// Update User
userRoutes.post('/update', checkToken, (request: any, response: Response) => {

	const user = {
		fullname: request.body.fullname || request.user.fullname,
		email: request.body.email || request.user.email,
		avatar: request.body.avatar || request.user.avatar,
	};

	User.findByIdAndUpdate(request.user._id, user, { new: true }, (error, userDB) => {

		if (error) throw error;

		if (!userDB) {
			return response.json({
				success: false,
				message: 'No existe usuario con este id'
			});
		}

		const userToken = Token.getToken({
			_id: userDB._id,
			fullname: userDB.fullname,
			email: userDB.email,
			password: userDB.password,
			avatar: userDB.avatar
		});

		response.json({
			success: true,
			message: 'Usuario actualizado con éxito',
			token: userToken
		});

	});
	// console.log(user);
});

// 
userRoutes.get('/', [ checkToken ], (request: any, response: Response) => {
	const user = request.user;

	response.json({
		success: true,
		user
	});


});

export default userRoutes;