import { Request, Response, NextFunction } from 'express';

import AWS from 'aws-sdk';


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACC,
  secretAccessKey: process.env.AWS_SECRET,
  region: "us-west-1",
  signatureVersion: "v4",
});

export async function getAWSURL(req: Request, res: Response, next: NextFunction): Promise<void>  {
    try {
        const { key } = req.body;
        const params = {
            Bucket: "listing-photos-scout",
            Key: key,
            Expires: 60,
        };
        const url = await s3.getSignedUrlPromise("putObject", params);
        res.locals.url = url;
        return next();
    } catch (e) {
        return next(e);
    }
}

export async function setIMGKey (req:Request, res:Response, next:NextFunction): Promise<void>{
    const {key} = req.body;
}
