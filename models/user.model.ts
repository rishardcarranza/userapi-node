import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new Schema({
	fullname: {
		type: String,
		required: [ true, 'El nombre es requerido' ]
	},
	avatar: {
		type: String,
		default: 'av-1.png',
		required: [ false ]
	},
	email: {
		type: String,
		unique: true,
		required: [ true, 'El correo electrónico es requerido' ]
	},
	password: {
		type: String,
		required: [ true, 'La contraseña es requerida' ]
	}
});

userSchema.method('checkPassword', function(password: string = ''): boolean {

	if (bcrypt.compareSync(password, this.password)) {
		return true;
	} else {
		return false;
	}

});


interface IUser extends Document {
	fullname: string;
	avatar: string;
	email: string;
	password: string;

	checkPassword(password: string): boolean;
};

export const User = model<IUser>('User', userSchema);