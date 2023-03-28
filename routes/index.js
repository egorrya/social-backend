import AuthRoutes from './Auth.routes.js';
import UploadRoutes from './File.routes.js';
import FollowRoutes from './Follow.routes.js';
import PostRoutes from './Post.routes.js';
import UserRoutes from './User.routes.js';

const routes = (app) => {
	app.get('/', (_, res) => {
		res.send({
			message: 'Welcome, Space Cowboy!',
		});
	});

	app.use('/auth', AuthRoutes);
	app.use('/posts', PostRoutes);
	app.use('/users', UserRoutes);
	app.use('/follow', FollowRoutes);
	app.use('/file', UploadRoutes);
};

export default routes;
