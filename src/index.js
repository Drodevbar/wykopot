import 'dotenv/config';
import { entriesUploaderService } from './service/entries-uploader-service.js';

const app = async () => {
  await entriesUploaderService.uploadNewPostWithComment();
};

app();
