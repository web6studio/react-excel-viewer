import { Router } from 'express';
import multer from 'multer';
import { postFile, getFile, deleteFile, getFiles } from './controllers';

const router = Router();
const upload = multer(); // memory storage

router.post('/files', upload.single('file'), postFile);
router.get('/files/:id', getFile);
router.delete('/files/:id', deleteFile);
router.get('/files', getFiles);

export default router;
