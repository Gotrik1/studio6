import { randomUUID } from 'crypto';
import * as path from 'path';

export const generateUniqueFileKey = (originalFileName: string): string => {
  const fileExtension = path.extname(originalFileName);
  const baseName = path.basename(originalFileName, fileExtension);
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-]/g, '-');
  const uuid = randomUUID();
  return `${sanitizedBaseName}-${uuid}${fileExtension}`;
};
