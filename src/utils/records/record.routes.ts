import { Router } from "express";
import { recordController } from "./record.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { createRecordSchema, updateRecordSchema } from "./record.schema.js";

const router = Router();

router.use(authenticate);

// POST /api/records — ANALYST and ADMIN can create records
router.post(
  "/",
  authorize("ANALYST", "ADMIN"),
  validate(createRecordSchema),
  recordController.create,
);

// GET /api/records — All authenticated roles can read
// Supports: ?type=INCOME&category=Salary&dateFrom=2025-01-01&dateTo=2025-12-31&search=rent&page=1&limit=10
router.get(
  "/",
  authorize("VIEWER", "ANALYST", "ADMIN"),
  recordController.getAll,
);

// GET /api/records/:id
router.get(
  "/:id",
  authorize("VIEWER", "ANALYST", "ADMIN"),
  recordController.getById,
);

// PATCH /api/records/:id — ANALYST and ADMIN can update
router.patch(
  "/:id",
  authorize("ANALYST", "ADMIN"),
  validate(updateRecordSchema),
  recordController.update,
);

// DELETE /api/records/:id — Only ADMIN can delete (soft delete)
router.delete("/:id", authorize("ADMIN"), recordController.delete);

export default router;
