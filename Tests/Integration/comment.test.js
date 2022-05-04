const supertest = require('supertest');

const { default: mongoose } = require('mongoose');
const app = require('../../app');
const memoryDB = require('../Utils/memoryDB');

const {
  genUser, insertUser, genAccessToken,
} = require('../Fixture/user');
const { genGallery, insertGallery } = require('../Fixture/gallery');
const { genPost, insertPost } = require('../Fixture/post');
const { genComment, insertComment } = require('../Fixture/comment');

const request = supertest(app);

memoryDB();

describe('Comment', () => {
  describe('Get Comment', () => {
    let gallery;
    let user;
    let token;
    let comment;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);
      await insertUser(user);

      gallery = genGallery();
      gallery.owner = user.id;
      await insertGallery(gallery);

      comment = genComment();
      comment.parent = gallery.id;
      comment.gallery = gallery.id;
      await insertComment(comment);
    });

    test('댓글 아이디 잘 받아와지는지', async () => {
      const res = await request
        .post('/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            {
              getCommentIds (
                parent: "${gallery.id}"
              ) {
                id
              }
            }
          `,
        }).expect(200);

      expect(res.body.data.getCommentIds).toBeDefined();
      expect(res.body.data.getCommentIds[0].id).toBe(comment.id.toHexString());
    });

    test('댓글 잘 받아와지는지', async () => {
      const res = await request
        .post('/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            {
              getComment (
                commentId: "${comment.id}"
              ) {
                contents
              }
            }
          `,
        }).expect(200);

      expect(res.body.data.getComment).toBeDefined();
      expect(res.body.data.getComment.contents).toBe(comment.contents);
    });
  });

  describe('Create Comment', () => {
    let post;
    let user;
    let token;
    let gallery;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);
      post = genPost();
      gallery = genGallery();

      await insertUser(user);
      await insertPost(post);
      await insertGallery(gallery);
    });

    test('댓글 잘 작성 되는지', async () => {
      const comment = genComment();
      comment.parent = post.id;

      await request.post('/comment').set('Authorization', `Bearer ${token}`).send({
        query: `
            mutation {
                createComment (
                    input: {
                        contents: "${comment.contents}"
                        parent: "${comment.parent}"
                        galleryId: "${gallery.id}"
                    }
                ) {
                    id
                }
            }
        `,
      }).expect(200);
    });

    test('없는 갤러리에 댓글 쓰면 GALLERY_NOT_EXISTS', async () => {
      const comment = genComment();
      comment.parent = post.id;

      const res = await request.post('/comment').set('Authorization', `Bearer ${token}`).send({
        query: `
            mutation {
                createComment (
                    input: {
                        contents: "${comment.contents}"
                        parent: "${comment.parent}"
                        galleryId: "${mongoose.Types.ObjectId()}"
                    }
                ) {
                    id
                }
            }
        `,
      }).expect(200);

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('GALLERY_NOT_EXISTS');
    });
  });

  describe('Remove Comment', () => {
    let post;
    let user;
    let token;
    let gallery;
    let comment;
    let userComment;
    let owner;
    let ownerToken;

    beforeEach(async () => {
      user = genUser();
      owner = genUser();
      token = genAccessToken(user);
      ownerToken = genAccessToken(owner);
      post = genPost();
      gallery = genGallery();
      gallery.owner = owner.id;
      comment = genComment();
      comment.gallery = gallery.id;
      comment.author = owner.id;
      userComment = genComment();
      userComment.gallery = gallery.id;
      userComment.author = user.id;

      await insertUser(owner);
      await insertUser(user);
      await insertPost(post);
      await insertGallery(gallery);
      await insertComment(comment);
      await insertComment(userComment);
    });

    test('댓글 잘 삭제 되는지', async () => {
      const res = await request
        .post('/comment')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          query: `
                mutation {
                    removeComment (
                        commentId: "${comment.id}"
                    )
                }
            `,
        }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('다른 사람 댓글 삭제시 COMMENT_NOT_OWNED', async () => {
      const res = await request
        .post('/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
                mutation {
                    removeComment (
                        commentId: "${comment.id}"
                    )
                }
            `,
        }).expect(200);

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('COMMENT_NOT_OWNED');
    });

    test('관리자가 댓글 삭제할 수 있는지', async () => {
      const res = await request
        .post('/comment')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          query: `
                mutation {
                    removeComment (
                        commentId: "${userComment.id}"
                    )
                }
            `,
        }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });
  });
});
