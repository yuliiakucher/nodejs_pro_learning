import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../src/users/entities/user.entity';

// User Factory
export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  return user;
});
