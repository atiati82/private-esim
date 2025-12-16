import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { File } from 'payload';

import { getCliLogger } from '@/lib/logging';
import { MediaCollectionId } from '@/payload/collections';
import { AppCacheDir, ensureCacheDir } from '@/payload/utils/cache';
import { appGetPayloadStandalone } from '@/payload/utils/get-payload-standalone';

// Directory to store downloaded images
export const DownloadImageCacheDir: string = path.resolve(
  `${AppCacheDir}/remote-images` + (process.env.TEST ? '-test' : ''),
);

/**
 * Download image (as Buffer), so it can be imported as PayloadCMS media
 */
export const downloadImageAsBuffer = (url: string): Promise<File> => {
  ensureCacheDir(DownloadImageCacheDir + '/');

  return new Promise((resolve, reject) => {
    const filename: string = url.split('/').pop() || 'default.png';
    const cachedFile = getImageFileFromCache(filename);
    if (cachedFile) {
      return resolve(cachedFile);
    }

    const chunks: Buffer[] = [];
    https
      .get(url, (response) => {
        response.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          const data: Buffer = Buffer.concat(chunks);
          const mimetype: string = response.headers['content-type'] || 'application/octet-stream';
          const fileObject: File = {
            data,
            mimetype,
            name: filename,
            size: data.length,
          };
          fs.writeFileSync(path.join(DownloadImageCacheDir, filename), data); // Save to cache
          return resolve(fileObject);
        });
      })
      .on('error', (err: Error) => {
        return reject(err);
      });
  });
};

const getImageFileFromCache = (filename: string): File | undefined => {
  const filePath: string = path.join(DownloadImageCacheDir, filename);
  // console.log(`getImageFileFromCache(${filename}): exists:`, fs.existsSync(filePath));
  if (fs.existsSync(filePath)) {
    const data: Buffer = fs.readFileSync(filePath);
    const mimetype: string = getMimeType(filename);
    return { data, name: filename, mimetype, size: data.length };
  }
  return;
};

const getMimeType = (filename: string): string => {
  const extension = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

/**
 * uploadImage - Uploads an image to a media collection in Payload CMS.
 *
 * This function supports both local file paths and remote image URLs. It determines the
 * source type based on the input string and handles the file accordingly.
 *
 * @example
 *
 * // Uploading a local image file
 * await uploadImage('./images/local-image.jpg');
 *
 * // Uploading an image from a URL
 * await uploadImage('https://example.com/remote-image.jpg');
 */
export const uploadImage = async (imagePathNameOrUrl: string): Promise<void> => {
  const payload = await appGetPayloadStandalone();
  const logger = getCliLogger();

  try {
    let fileBuffer: Buffer;
    let fileSize: number;
    let fileName: string;
    let mimetype: string;

    if (imagePathNameOrUrl.startsWith('http://') || imagePathNameOrUrl.startsWith('https://')) {
      const fileObject = await downloadImageAsBuffer(imagePathNameOrUrl);
      fileBuffer = fileObject.data;
      fileSize = fileObject.size;
      fileName = fileObject.name;
      mimetype = fileObject.mimetype;
    } else {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const filePath = path.resolve(__dirname, imagePathNameOrUrl);

      fileBuffer = fs.readFileSync(filePath);
      const fileStats = fs.statSync(filePath);
      fileSize = fileStats.size;
      fileName = path.basename(filePath);
      mimetype = getMimeType(fileName);
    }

    const createdMedia = await payload.create({
      collection: MediaCollectionId,
      data: { filename: fileName },
      file: {
        data: fileBuffer,
        mimetype,
        name: fileName,
        size: fileSize,
      },
    });

    logger.info({ id: createdMedia.id }, 'Image uploaded successfully');
  } catch (error) {
    logger.error({ err: error }, 'Error uploading image');
  }
};
