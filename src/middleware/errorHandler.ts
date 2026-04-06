import type { NextFunction,Request,Response } from "express";


export const errorHandler = (error:Error,req:Request,res:Response,next:NextFunction)=>{
    let errorMessage = "an Unknown Error has Occured ";
    let statusCode = 500;
    res.status(statusCode).json({error:errorMessage})
}
