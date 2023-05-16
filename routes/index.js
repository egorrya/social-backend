import { Router } from 'express';

import AuthRoutes from './Auth.routes.js';
import FollowRoutes from './Follow.routes.js';
import PostRoutes from './Post.routes.js';
import UserRoutes from './User.routes.js';

const routes = Router();

routes.get('/', (_, res) => {
	res.send({
		message: 'Welcome, Space Cowboy!',
	});
});

routes.use('/auth', AuthRoutes);
routes.use('/posts', PostRoutes);
routes.use('/users', UserRoutes);
routes.use('/follow', FollowRoutes);

export default routes;
