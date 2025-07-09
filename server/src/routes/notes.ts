import express from 'express';
import jwt from 'jsonwebtoken';
import Note from '../models/Note';

const router = express.Router();

const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

router.get('/', authenticate, async (req: any, res) => {
  const notes = await Note.find({ userId: req.user.userId });
  res.json(notes);
});

router.post('/', authenticate, async (req: any, res) => {
  const newNote = new Note({ userId: req.user.userId, text: req.body.text });
  await newNote.save();
  res.json({ message: 'Note created' });
});

router.delete('/:id', authenticate, async (req: any, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
});

export default router;
