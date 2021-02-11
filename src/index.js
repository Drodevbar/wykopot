import cron from 'node-cron';
import { entriesUploaderService } from './service/entries-uploader-service';
import { config } from './config';

const app = async () => {
  cron.schedule(config.cronInterval, async () => {
    await entriesUploaderService.uploadNewPostWithComment()
      .catch((err) => console.error('Failed to upload new content. See the logs.', err));
  });
};

app();
