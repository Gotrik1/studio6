import { Injectable, Logger } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateUniqueFileKey } from "./storage.utils";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || "";
    if (!this.bucketName) {
      this.logger.error("S3_BUCKET_NAME environment variable is not set.");
      throw new Error("S3 bucket name is not configured.");
    }

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      // If using a local S3-compatible service like MinIO, endpoint is needed.
      endpoint: process.env.S3_ENDPOINT_URL || undefined,
      forcePathStyle: !!process.env.S3_ENDPOINT_URL, // Required for MinIO
    });

    this.logger.log(
      `StorageService initialized for bucket: ${this.bucketName}`,
    );
  }

  async getPresignedUrlForUpload(fileName: string, fileType: string) {
    const uniqueKey = generateUniqueFileKey(fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueKey,
      ContentType: fileType,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      this.logger.log(`Generated presigned URL for key: ${uniqueKey}`);
      return {
        uploadUrl: signedUrl,
        fileUrl: this.getFileUrl(uniqueKey),
        fileKey: uniqueKey,
      };
    } catch (error) {
      this.logger.error("Error generating presigned URL", error);
      throw new Error("Could not generate presigned URL.");
    }
  }

  getFileUrl(key: string): string {
    if (process.env.S3_ENDPOINT_URL) {
      // For local development (e.g., MinIO)
      return `${process.env.S3_ENDPOINT_URL}/${this.bucketName}/${key}`;
    }
    // For production (e.g., AWS S3)
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted file with key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file with key: ${key}`, error);
      throw new Error("Could not delete file.");
    }
  }
}
