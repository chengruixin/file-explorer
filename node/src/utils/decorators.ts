import { Request, Response } from "express";

export const catchError = (target, name, descriptor) => {
    if (typeof target[name] === 'function') {
        const oriFunc = descriptor.value;
        descriptor.value = async function (req: Request, res: Response) {
            try {
                await oriFunc.call(this, req, res);
            } catch (e) {
                console.log(e);
                res.status(400).json({
                    message: JSON.stringify(e),
                    code: 1
                })
            }
        }
    }
}