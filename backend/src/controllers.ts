import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { db } from './db';
import { parseExcel, validateUploadedFile } from './utils';

// POST /files - upload and parse Excel
export const postFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).send('No file uploaded');
      return;
    }
    const validationError = validateUploadedFile(file);
    if (validationError) {
      res.status(400).send(validationError);
      return;
    }

    const parsed = parseExcel(file.buffer);
    if (!parsed.columns || !parsed.rows || parsed.rows.length === 0) {
      res.status(400).send('Invalid or empty Excel file');
      return;
    }

    const now = new Date();
    const fileDoc = {
      originalName: file.originalname,
      createdAt: now,
      updatedAt: now,
      userId: null,
      columns: parsed.columns,
    };
    const result = await db.collection('files').insertOne(fileDoc);
    const fileId = result.insertedId;
    const rowsWithFileId = parsed.rows.map((row) => ({ ...row, fileId }));

    await db.collection('file_rows').insertMany(rowsWithFileId);

    res.status(201).json({
      id: fileId,
      originalName: file.originalname,
      createdAt: now,
      updatedAt: now,
      userId: null,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Failed to upload file');
  }
};

// GET /files/:id?page=1&pageSize=100 - get parsed contents of a file with pagination
export const getFile = async (req: Request, res: Response) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const file = await db.collection('files').findOne({ _id: fileId });

    if (!file) {
      res.status(404).send('File not found');
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100; // Default page size to prevent overwhelming
    const skip = (page - 1) * pageSize;
    const total = await db.collection('file_rows').countDocuments({ fileId });
    const rows = await db
      .collection('file_rows')
      .find({ fileId })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    res.json({
      originalName: file.originalName,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      userId: file.userId,
      total,
      page,
      pageSize,
      columns: file.columns,
      rows,
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).send('Failed to fetch file');
  }
};

// DELETE /files/:id - delete a file and its rows
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const fileId = new ObjectId(req.params.id);

    const result = await db.collection('files').deleteOne({ _id: fileId });
    await db.collection('file_rows').deleteMany({ fileId });

    if (result.deletedCount === 0) {
      res.status(404).send('File not found');
      return;
    }

    res.status(200).send(`File ${fileId} has been deleted`);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Failed to delete file');
  }
};

// GET /files - list all uploaded files (without contents)
export const getFiles = async (_req: Request, res: Response) => {
  try {
    const files = await db
      .collection('files')
      .find({}, { projection: { originalName: 1, createdAt: 1, updatedAt: 1, userId: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    const mappedFiles = files.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));

    res.json(mappedFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Failed to fetch files');
  }
};
