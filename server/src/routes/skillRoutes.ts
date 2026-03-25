import { Router } from 'express';
import { createSkill, getMySkills, getAllMarketSkills, updateSkill, deleteSkill } from '@controllers/SkillController';
import { authenticateToken } from '@middleware/auth';

const router = Router();

router.post('/', authenticateToken, createSkill);
router.get('/my-skills', authenticateToken, getMySkills);
router.get('/market', authenticateToken, getAllMarketSkills);
router.put('/:id', authenticateToken, updateSkill);
router.delete('/:id', authenticateToken, deleteSkill);

export default router;
