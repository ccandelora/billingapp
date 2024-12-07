import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Tag } from "../entities/Tag";

export class TagController {
    static getTags = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Getting all tags');
            const tagRepository = AppDataSource.getRepository(Tag);
            const tags = await tagRepository.find();
            res.json(tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
            res.status(500).json({ message: 'Error fetching tags' });
        }
    };

    static createTag = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Creating tag with data:', req.body);
            const { name, color, description } = req.body;
            const tagRepository = AppDataSource.getRepository(Tag);
            
            const tag = tagRepository.create({
                name,
                color,
                description
            });

            const savedTag = await tagRepository.save(tag);
            console.log('Tag created:', savedTag);
            res.status(201).json(savedTag);
        } catch (error) {
            console.error('Error creating tag:', error);
            res.status(500).json({ message: 'Error creating tag' });
        }
    };

    static updateTag = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, color, description } = req.body;
            const tagRepository = AppDataSource.getRepository(Tag);
            
            let tag = await tagRepository.findOne({ where: { id: parseInt(id) } });
            if (!tag) {
                res.status(404).json({ message: 'Tag not found' });
                return;
            }

            tag = tagRepository.merge(tag, { name, color, description });
            await tagRepository.save(tag);
            res.json(tag);
        } catch (error) {
            console.error('Error updating tag:', error);
            res.status(500).json({ message: 'Error updating tag' });
        }
    };

    static deleteTag = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const tagRepository = AppDataSource.getRepository(Tag);
            
            const tag = await tagRepository.findOne({ where: { id: parseInt(id) } });
            if (!tag) {
                res.status(404).json({ message: 'Tag not found' });
                return;
            }

            await tagRepository.remove(tag);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting tag:', error);
            res.status(500).json({ message: 'Error deleting tag' });
        }
    };
} 