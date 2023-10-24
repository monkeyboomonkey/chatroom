// require("aws-sdk/lib/maintenance_mode_message").suppress = true;
// require("dotenv").config();
import {Express, Request, Response, NextFunction} from 'express';

import AWS from 'aws-sdk';
// const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACC_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "us-west-1",
  signatureVersion: "v4",
});

export async function getAWSURL(req: Request, res: Response, next: NextFunction): Promise<void>  {
    const { key } = req.body;
    const params = {
        Bucket: "listing-photos-scout",
        Key: key,
        Expires: 60,
    };
    try {
        const url = await s3.getSignedUrlPromise("putObject", params);
        res.locals.url = url;
        return next();
    } catch (e) {
        return next(e);
    }
}

export async function setIMGKey (req:Request,res:Response,next:NextFunction): Promise<void>{
    const {key} = req.body;

    
}
// controller for saving key into database



// controller for getting key from database


