import { Test, TestingModule } from '@nestjs/testing';
import { AnimalService } from '../animal.service';
import { EAnimalTypes } from '../file-operations/enums/animal-types.enum';
import { IAnimal } from '../models/animal.interface';

describe('AnimalService', () => {
  let service: AnimalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalService],
    }).compile();
    jest.clearAllMocks();
    service = module.get<AnimalService>(AnimalService);
  });

  it('should be defined', () => {
    //then
    expect(service).toBeDefined();
  });

  describe('When trying to create new animal and name is empty string', () => {
    it('It should throw an exception', () => {
      //then
      expect(() => service.createAnimal('', EAnimalTypes.FISH)).toThrow();
    });
  });

  describe('When trying to create new animal and type is not valid animal type', () => {
    it('It should throw an exception', () => {
      //given
      const type: string = 'type';
      //then
      expect(() => service.createAnimal('', type as EAnimalTypes)).toThrow();
    });
  });

  describe('When trying to create Animal and everything goes well', () => {
    it('It shoudl return IAnima object', () => {
      //given
      const name: string = 'name';
      const type: EAnimalTypes = EAnimalTypes.FISH;
      //then
      expect(service.createAnimal(name, type)).toMatchObject<IAnimal>;
    });
  });

  describe('When trying to update Animal and not providing name and type', () => {
    it('It should throw an exception', () => {
      //given
      const animal: IAnimal = service.createAnimal('animal', EAnimalTypes.FISH);
      //then
      expect(() => service.updateAnimal(animal)).toThrow();
    });
  });

  describe('When trying to update Animal and name is empty string', () => {
    it('It should throw an exception', () => {
      //given
      const animal: IAnimal = service.createAnimal('animal', EAnimalTypes.FISH);
      const name: string = '';
      //then
      expect(() => service.updateAnimal(animal, name)).toThrow();
    });
  });

  describe('When trying to update Animal and everything goes well', () => {
    it('It should return IAnimal object', () => {
      //given
      const animal: IAnimal = service.createAnimal('animal', EAnimalTypes.FISH);
      const name: string = 'name';
      const type: EAnimalTypes = EAnimalTypes.FISH;
      //then
      expect(() => service.updateAnimal(animal, name, type)).toMatchObject<IAnimal>;
    });
  });
});
