import { Router } from "express";
import { TagController } from "../controllers/TagController";

const router = Router();

// Add debug middleware
router.use((req, res, next) => {
    console.log('Tag route accessed:', req.method, req.url);
    next();
});

router.get("/", TagController.getTags);
router.post("/", TagController.createTag);
router.put("/:id", TagController.updateTag);
router.delete("/:id", TagController.deleteTag);

export default router; 