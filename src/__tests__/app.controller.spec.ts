import { IAnimal } from '../animal/models/animal.interface';
import * as request from 'supertest';
const makeRequest = request('http://localhost:3000');
import { EAnimalTypes } from '../animal/file-operations/enums/animal-types.enum';
import { AnimalDTO } from 'src/animal/file-operations/dtos/animal.dto';
import { AnimalNameDTO } from 'src/animal/dto/animal-name.dto';

describe('AppController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When trying to call GET on /animals directory', () => {
    it('It should respond with  200 status', async () => {
      //when
      const response: request.Response = await makeRequest.get('/animals');
      //then
      expect(response.status).toBe(200);
    });
  });

  describe('When trying to call GET on /animals/all directory', () => {
    it('It should respond with 200 status and IAnimal array', async () => {
      //when
      const response: request.Response = await makeRequest.get('/animals/all');
      //then
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject<IAnimal[]>;
    });
  });

  describe('When trying to call GET on /animals/animal/ directory and requested animal doest not exist', () => {
    it('It should respond with 400 status', async () => {
      //when
      const response: request.Response = await makeRequest.get('/animals/animal/randomAnimal');
      //then
      expect(response.status).toBe(500);
    });
  });

  describe('When trying to call GET on /animals/animal/ directory and requested animal exist', () => {
    it('It should respond with 200 status and IAnimal object', async () => {
      //when
      const response: request.Response = await makeRequest.get('/animals/animal/test');
      //then
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject<IAnimal>;
    });
  });

  describe('When trying to update animal calling PUT on /animals/animal/ and requested animal does not exist', () => {
    it('It should respond with 400 status', async () => {
      //when
      const response: request.Response = await makeRequest.put('/animals/animal/randomAnimal');
      //then
      expect(response.status).toBe(400);
    });
  });

  describe('When trying to update animal calling PUT on /animals/animal/ and requested animal does exist', () => {
    it('It should respond with 200 status and IAnimal object', async () => {
      //when
      const response: request.Response = await makeRequest.put('/animals/animal/test').send({ name: 'jasiek', type: EAnimalTypes.FISH });
      //then
      expect(response.status).toBe(202);
      expect(response.body).toMatchObject<IAnimal>;
    });
  });

  describe("When trying to add new animal by calling SEND on animals/add and requesty body isn't correct", () => {
    it('It should respond with 400 status', async () => {
      //when
      const response: request.Response = await makeRequest.post('/animals/add').send({});
      //then
      expect(response.status).toBe(400);
    });
  });

  describe("When trying to add new animal by calling SEND on animals/add and requesty body isn't correct", () => {
    it('It should respond with 400 status', async () => {
      //when
      const response: request.Response = await makeRequest.post('/animals/add').send({});
      //then
      expect(response.status).toBe(400);
    });
  });

  describe('When trying to add new animal by calling SEND on animals/add and everything goes well', () => {
    it('It should respond with 201 status and IAnimal object', async () => {
      //when
      const response: request.Response = await makeRequest.post('/animals/add').send({ name: 'zwierz', type: EAnimalTypes.TYPE3 });
      //then
      expect(response.status).toBe(202);
      expect(response.body).toMatchObject<IAnimal>;
    });
  });

  describe("When trying to add new animals by calling SEND on animals/add/animals and requesty body isn't correct", () => {
    it('It should respond with 400 status', async () => {
      //when
      const response: request.Response = await makeRequest.post('/animals/add/animals').send({});
      //then
      expect(response.status).toBe(400);
    });
  });

  describe('When trying to add new animals by calling SEND on animals/add/animals and everything goes well', () => {
    it('It should respond with 201 status na IAnimal array', async () => {
      //when
      const animal: AnimalDTO = { name: 'john', type: EAnimalTypes.FISH };
      const response: request.Response = await makeRequest.post('/animals/add/animals').send([animal, animal]);
      //then
      expect(response.status).toBe(202);
      expect(response.body).toMatchObject<IAnimal[]>;
    });
  });

  describe("When trying to add new animals by calling SEND on animals/add/animals/type and requesty body isn't correct", () => {
    it('It should respond with 400 status', async () => {
      //when
      const response: request.Response = await makeRequest.post('/animals/add/animals/fish').send({});
      //then
      expect(response.status).toBe(400);
    });
  });

  describe('When trying to add new animals by calling SEND on animals/add/animals/type and everything goes well', () => {
    it('It should respond with 202 status', async () => {
      //given
      const animal: AnimalNameDTO = { name: 'john' };
      //when
      const response: request.Response = await makeRequest.post('/animals/add/animals/fish').send([animal, animal]);
      //then
      expect(response.status).toBe(202);

      expect(response.body).toMatchObject<IAnimal[]>;
    });
  });
});
