import { Request, Response } from 'express';
import { recordService } from './record.service';
import { CreateRecordInput, UpdateRecordInput } from './record.schema';
import { sendSuccess } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const recordController = {
    create: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as CreateRecordInput;
        const record = await recordService.createRecord(data, req.user!.id);
        sendSuccess(res, record, 'Record created', 201);
    }),

    getAll: asyncHandler(async (req: Request, res: Response) => {
        const { type, category, dateFrom, dateTo, search } = req.query as Record<string, string>;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await recordService.getRecords({
            type,
            category,
            dateFrom,
            dateTo,
            search,
            page,
            limit,
        });

        sendSuccess(res, result.records, 'Records retrieved', 200, { pagination: result.pagination });
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
        const record = await recordService.getRecordById(req.params.id);
        sendSuccess(res, record, 'Record retrieved');
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as UpdateRecordInput;
        const record = await recordService.updateRecord(req.params.id, data);
        sendSuccess(res, record, 'Record updated');
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
        const result = await recordService.softDeleteRecord(req.params.id);
        sendSuccess(res, result, 'Record deleted');
    }),
};
