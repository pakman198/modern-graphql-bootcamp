import { createMockContext } from '../../../context'
import hashPassword from '../../utils/hashPassword';
import Mutation from '../Mutation';

jest.mock('../../utils/hashPassword');

describe('Mutations', () => {
  let mockCtx;
  let ctx;
  
  describe('User Mutations', () => {
    beforeEach(() => {
      mockCtx = createMockContext()
      ctx = mockCtx;
      hashPassword.mockImplementation(pwd => pwd);
    });

    it('Should CREATE a new User', async () => {
      const user = {
        id: 1,
        name: 'Rich',
        email: 'hello@prisma.io',
        password: "123456",
      }

      mockCtx.prisma.user.create.mockResolvedValue(user)

      await expect(Mutation.createUser(null, {data: user}, ctx)).resolves.toEqual({
        id: 1,
        name: 'Rich',
        email: 'hello@prisma.io',
        password: "123456",
      })
    });
  });

});
