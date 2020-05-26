import jwt from 'jsonwebtoken';

export default class Token {

	private static seed: string = 'this-is-the-secret-seed-of-my-app';
	private static expiration: string = '30d';

	constructor() {}

	static getToken( payload: any ): string {
		return jwt.sign({
			user: payload
		}, this.seed, { expiresIn: this.expiration });
	}

	static validateToken(userToken: string) {

		return new Promise( (resolve, reject) => {
			jwt.verify(userToken, this.seed, (error, decoded) => {

				if (error) {
					reject();
				} else {
					resolve(decoded);
				}

			});
		});

	}
}