import express  from "express";

import { signin,signup } from '../controllers/users.js';
import router from "./posts.js";

router.post('/signin', signin);
router.post('/signup', signup);

export default router;