import Server from './class/server';
import userRoutes from './routes/user.route';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();


// Body Parser (Middleware)
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// Routes
server.app.use('/user', userRoutes);

// Connect to DB
mongoose.connect('mongodb://localhost:27017/swisstex', 
	{ useNewUrlParser: true, useCreateIndex: true }, ( error ) => {
		if (error) throw error;

		console.log(`Database Online`);
	}
);


// Run express
server.start( () => {
	console.log(`Server running on port ${server.port}`);
});

