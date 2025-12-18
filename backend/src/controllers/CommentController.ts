import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Comment } from "../entities/Comment";

export class CommentController {
    private commentRepo = AppDataSource.getRepository(Comment);

    async create(req: Request, res: Response) {
        if (!req.body.content) return res.status(400).json({ error: "Content required" });

        const comment = new Comment();
        comment.content = req.body.content;

        await this.commentRepo.save(comment);
        res.json({ success: true });
    }

    async getAll(req: Request, res: Response) {
        const comments = await this.commentRepo.find({ order: { id: "DESC" } });
        res.json(comments);
    }
}