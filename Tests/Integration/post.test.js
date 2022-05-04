const supertest = require('supertest');

const app = require('../../app');
const memoryDB = require('../Utils/memoryDB');

const {
  genUser, insertUser, genAccessToken,
} = require('../Fixture/user');
const { genGallery, insertGallery } = require('../Fixture/gallery');
const { genPost, insertPost } = require('../Fixture/post');
const { Post } = require('../../Models');

const request = supertest(app);

memoryDB();

describe('POST', () => {
  describe('GET Post', () => {
    let user;
    let token;
    let gallery;
    let post;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);
      await insertUser(user);

      gallery = genGallery();
      await insertGallery(gallery);

      post = genPost();
      post.gallery = gallery.id;
      await insertPost(post);
    });

    test('글 아이디 잘 받아와지는지', async () => {
      const res = await request.post('/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
          {
            getPostIds (
              galleryId: "${gallery.id}"
            ) {
              id
            }
          }
        `,
        }).expect(200);

      expect(res.body.data.getPostIds).toBeDefined();
      expect(res.body.data.getPostIds[0].id).toBe(post.id.toHexString());
    });

    test('글 잘 받아와지는지', async () => {
      const res = await request.post('/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
          {
            getPost (
              postId: "${post.id}"
            ) {
              title
              contents
            }
          }
        `,
        }).expect(200);

      expect(res.body.data.getPost).toBeDefined();
      expect(res.body.data.getPost.title).toBe(post.title);
      expect(res.body.data.getPost.contents).toBe(post.contents);
    });
  });

  describe('Create POST', () => {
    let gallery;
    let user;
    let token;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);
      await insertUser(user);

      gallery = genGallery();
      gallery.author = user.id;
      await insertGallery(gallery);
    });

    test('글 잘 생성되는지', async () => {
      const post = genPost();
      const res = await request
        .post('/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
          mutation {
              createPost (
                  galleryId: "${gallery.id}"
                  input: {
                      title: "${post.title}"
                      contents: "${post.contents}"
                  }
              ) {
                  id
              }
          }
          `,
        })
        .expect(200);

      expect(res.body.errors).toBeUndefined();
    });
  });

  describe('Update Post', () => {
    let gallery;
    let user;
    let token;
    let post;
    let userTwo;
    let tokenTwo;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);
      post = genPost();
      post.author = user.id;
      gallery = genGallery();
      userTwo = genUser();
      tokenTwo = genAccessToken(userTwo);

      await insertUser(user);
      await insertUser(userTwo);
      await insertPost(post);
      await insertGallery(gallery);
    });

    test('글 제목 수정 잘 되는지', async () => {
      await request
        .post('/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            mutation {
                updatePost (
                    input: {
                        title: "CHANGED"
                    }
                    postId: "${post.id}"
                )
            }
        `,
        }).expect(200);

      expect((await Post.findById(post.id)).title).toBe('CHANGED');
    });

    test('글 내용 수정 잘 되는지', async () => {
      await request
        .post('/post')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            mutation {
                updatePost (
                    input: {
                        contents: "CHANGED"
                    }
                    postId: "${post.id}"
                )
            }
        `,
        }).expect(200);

      expect((await Post.findById(post.id)).contents).toBe('CHANGED');
    });

    test('다른 사람이 수정할 시 POST_NOT_OWNED', async () => {
      const res = await request
        .post('/post')
        .set('Authorization', `Bearer ${tokenTwo}`)
        .send({
          query: `
            mutation {
                updatePost (
                    input: {
                        contents: "CHANGED"
                    }
                    postId: "${post.id}"
                )
            }
        `,
        }).expect(200);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('POST_NOT_OWNED');
    });
  });

  describe('Remove Post', () => {
    let gallery;
    let owner;
    let ownerToken;
    let user;
    let userToken;

    let userPost;
    let ownerPost;

    beforeEach(async () => {
      user = genUser();
      userToken = genAccessToken(user);

      owner = genUser();
      ownerToken = genAccessToken(owner);

      gallery = genGallery();
      gallery.owner = owner.id;

      await insertUser(user);
      await insertUser(owner);

      await insertGallery(gallery);

      userPost = genPost();
      ownerPost = genPost();

      userPost.author = user.id;
      ownerPost.author = owner.id;

      userPost.gallery = gallery.id;
      ownerPost.gallery = gallery.id;

      await insertPost(userPost);
      await insertPost(ownerPost);
    });

    test('글 잘 삭제 되는지', async () => {
      const res = await request
        .post('/post')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          query: `
                mutation {
                    removePost (
                        id: "${userPost.id}"
                    )
                }
            `,
        })
        .expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('다른사람이 글 잘 삭제시 POST_NOT_OWNED', async () => {
      const res = await request
        .post('/post')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          query: `
                mutation {
                    removePost (
                        id: "${ownerPost.id}"
                    )
                }
            `,
        })
        .expect(200);

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('POST_NOT_OWNED');
    });

    test('관리자가 글 삭제할 수 있는지', async () => {
      const res = await request
        .post('/post')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          query: `
                mutation {
                    removePost (
                        id: "${userPost.id}"
                    )
                }
            `,
        })
        .expect(200);

      expect(res.body.errors).toBeUndefined();
    });
  });
});
