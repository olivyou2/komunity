const supertest = require('supertest');

const app = require('../../app');
const memoryDB = require('../Utils/memoryDB');

const {
  genUser, insertUser, genRefreshToken, genAccessToken,
} = require('../Fixture/user');

const request = supertest(app);

memoryDB();

describe('User', () => {
  describe('Create User', () => {
    test('Create User 잘 되는지', async () => {
      const user = genUser();

      const res = await request
        .post('/user')
        .send({
          query: `
            mutation {
                createUser (
                    input: {
                        name: "${user.name}"
                        password: "${user.password}"
                    }
                ) {
                    id
                }
            }
        `,
        }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('Name 중복시 USER_NAME_EXISTS', async () => {
      const user = genUser();
      await insertUser(user);

      const res = await request
        .post('/user')
        .send({
          query: `
          mutation {
              createUser (
                  input: {
                      name: "${user.name}"
                      password: "${user.password}"
                  }
              ) {
                  id
              }
          }
      `,
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('USER_NAME_EXISTS');
    });
  });

  describe('Remove User', () => {
    let user;

    beforeEach(async () => {
      user = genUser();

      await insertUser(user);
    });

    test('Remove User 잘 되는지', async () => {
      const res = await request
        .post('/user')
        .send({
          query: `
            mutation {
                removeUser (
                    input: {
                        name: "${user.name}"
                        password: "${user.password}"
                    }
                )
            }
        `,
        });

      expect(res.body.errors).toBeUndefined();
    });

    test('비밀번호 틀리면 USER_NOT_EXISTS', async () => {
      const res = await request
        .post('/user')
        .send({
          query: `
              mutation {
                  removeUser (
                      input: {
                          name: "${user.name}"
                          password: "WRONG-PASSWORD"
                      }
                  )
              }
          `,
        });

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('USER_NOT_EXISTS');
    });
  });

  describe('Get User', () => {
    let user;

    beforeEach(async () => {
      user = genUser();

      await insertUser(user);
    });

    test('Get User 잘 되는지', async () => {
      const res = await request.post('/user').send({
        query: `
            query {
                getUser(
                    input: {
                        name: "${user.name}"
                        password: "${user.password}"
                    }
                ) {
                    user {
                        name
                    }
                }
            }
        `,
      }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('Refresh Token 잘 되는지', async () => {
      const token = genRefreshToken(user);

      const res = await request.post('/user').send({
        query: `
            mutation {
                refreshToken(
                    input: {
                        refreshToken: "${token}"
                    }
                ){
                    accessToken
                }
            }
        `,
      }).expect(200);

      expect(res.body.errors).toBeUndefined();
    });

    test('Refresh Token 값 이상하면 TOKEN_NOT_VALID', async () => {
      const token = genAccessToken(user);
      const res = await request.post('/user').send({
        query: `
              mutation {
                  refreshToken(
                      input: {
                          refreshToken: "${token}"
                      }
                  ){
                      accessToken
                  }
              }
          `,
      }).expect(200);

      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toBe('TOKEN_NOT_VALID');
    });
  });
});
