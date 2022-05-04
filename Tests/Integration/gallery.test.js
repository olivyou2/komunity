const supertest = require('supertest');

const app = require('../../app');
const memoryDB = require('../Utils/memoryDB');

const {
  genUser, insertUser, genAccessToken,
} = require('../Fixture/user');
const { genGallery, insertGallery } = require('../Fixture/gallery');

const request = supertest(app);

memoryDB();

describe('Gallery', () => {
  describe('Get Gallery', () => {
    let user;
    let token;

    let gallery;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);
      await insertUser(user);

      gallery = genGallery();
      await insertGallery(gallery);
    });

    test('갤러리 아이디 잘 받아와지는지', async () => {
      const res = await request
        .post('/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            {
              getGalleryIds {
                id
              }
            }
          `,
        }).expect(200);

      expect(res.body.data.getGalleryIds).toBeDefined();
      expect(res.body.data.getGalleryIds[0].id).toBe(gallery.id.toHexString());
    });

    test('갤러리 잘 받아와지는지', async () => {
      const res = await request
        .post('/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            {
              getGallery(
                id: "${gallery.id}"
              ) {
                name
              }
            }
          `,
        }).expect(200);

      expect(res.body.data.getGallery).toBeDefined();
      expect(res.body.data.getGallery.name).toBe(gallery.name);
    });
  });

  describe('Create Gallery', () => {
    let user;
    let token;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);

      await insertUser(user);
    });

    test('Create Gallery 잘 되는지', async () => {
      const gallery = genGallery();
      const res = await request
        .post('/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            mutation {
                createGallery (
                    name: "${gallery.name}"
                ) {
                    id
                }
            }
          `,
        }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('이름 중복시 ', async () => {
      const gallery = genGallery();
      await insertGallery(gallery);

      const res = await request
        .post('/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            mutation {
                createGallery (
                    name: "${gallery.name}"
                ) {
                    id
                }
            }
          `,
        }).expect(200);

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('GALLERY_EXISTS');
    });
  });

  describe('Remove Gallery', () => {
    let gallery;
    let user;
    let token;

    beforeEach(async () => {
      user = genUser();
      token = genAccessToken(user);

      gallery = genGallery();
      gallery.owner = user.id;

      await insertUser(user);
      await insertGallery(gallery);
    });

    test('갤러리 삭제 잘 되는지', async () => {
      const res = await request
        .post('/gallery')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: `
            mutation {
                removeGallery (
                    id: "${gallery.id}"
                )
            }
            `,
        }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('다른 사람이 갤러리 삭제시 GALLERY_NOT_OWNED', async () => {
      const otherUser = genUser();
      const otherToken = genAccessToken(otherUser);

      await insertUser(otherUser);

      const res = await request
        .post('/gallery')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          query: `
            mutation {
                removeGallery (
                    id: "${gallery.id}"
                )
            }
            `,
        }).expect(200);

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('GALLERY_NOT_OWNED');
    });
  });
});
