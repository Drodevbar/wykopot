import wykopClient from '../integration/wykop/client';
import entryBuilder from './entry-builder';

const uploadNewPostWithComment = async () => {
  try {
    const post = await entryBuilder.buildPost();
    const comment = await entryBuilder.buildComment();

    const newPostId = await wykopClient.addEntry({ 
      body: post.content,
      embed: post.embed 
    }).then(res => res.data.data.id);
    
    const newCommentId = await wykopClient.addEntry({
      body: comment.content,
      embed: comment.embed
    }, newPostId).then(res => res.data.data.id);

    console.log(`New post ${newPostId} and comment ${newCommentId} uploaded successfully.`);
  } catch (err) {
    console.error({
      message: 'Failed to upload new post with comment',
      errorMessage: err.message,
    });

    throw err;
  }
};

export const entriesUploaderService = {
  uploadNewPostWithComment,
};
