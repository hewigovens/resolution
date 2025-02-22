import nock from 'nock';
import Resolution, { ResolutionErrorCode } from '.';
import { UnclaimedDomainResponse } from './types';
import { expectResolutionErrorCode } from './utils/testHelpers';

beforeEach(() => {
  nock.cleanAll();
  jest.restoreAllMocks();
});

describe('Resolution', () => {
  it('checks Resolution#addressOrThrow error #1', async () => {
    const resolution = new Resolution();
    await expectResolutionErrorCode(
      resolution.addressOrThrow('sdncdoncvdinvcsdncs.zil', 'ZIL'),
      ResolutionErrorCode.UnregisteredDomain,
    );
  });

  it('checks Resolution#addressOrThrow error #2', async () => {
    const resolution = new Resolution();
    await expectResolutionErrorCode(
      resolution.addressOrThrow('brad.zil', 'INVALID_CURRENCY_SYMBOL'),
      ResolutionErrorCode.UnspecifiedCurrency,
    );
  });

  it('resolves non-existing domain zone with throw', async () => {
    const resolution = new Resolution({ blockchain: true });
    await expectResolutionErrorCode(
      resolution.addressOrThrow('bogdangusiev.qq', 'ZIL'),
      ResolutionErrorCode.UnsupportedDomain,
    );
  });

  it('resolves non-existing domain zone via safe address', async () => {
    const resolution = new Resolution({ blockchain: true });
    const result = await resolution.address('bogdangusiev.qq', 'ZIL');
    expect(result).toEqual(null);
  });

  it('provides empty response constant', async () => {
    const response = UnclaimedDomainResponse;
    expect(response.addresses).toEqual({});
    expect(response.meta.owner).toEqual(null);
  });

  it('checks the isSupportedDomainInNetwork', async () => {
    const resolution = new Resolution();
    const result = resolution.isSupportedDomainInNetwork('brad.zil');
    expect(result).toBe(true);
  });

  it('checks namehash for unsupported domain', async () => {
    const resolution = new Resolution();
    await expectResolutionErrorCode(
      () => resolution.namehash('something.hello.com'),
      ResolutionErrorCode.UnsupportedDomain,
    );
  });

  it('checks return of ipfs hash for brad.zil', async () => {
    const resolution = new Resolution();
    const hash = await resolution.ipfsHash('brad.zil');
    expect(hash).toBe('QmVaAtQbi3EtsfpKoLzALm6vXphdi2KjMgxEDKeGg6wHuK');
  });

  it('checks return of email for ergergergerg.zil', async () => {
    const resolution = new Resolution();
    const email = await resolution.email('ergergergerg.zil');
    expect(email).toBe('matt+test@unstoppabledomains.com');
  });

  it('checks error for  email on brad.zil', async () => {
    const resolution = new Resolution();
    await expectResolutionErrorCode(
      resolution.email('brad.zil'),
      ResolutionErrorCode.RecordNotFound,
    );
  });


  describe('serviceName', () => {
    it('checks ens service name', () => {
      const resolution = new Resolution();
      const serviceName = resolution.serviceName('domain.eth');
      expect(serviceName).toBe('ENS');
    });

    it('checks ens service name 2', () => {
      const resolution = new Resolution();
      const serviceName = resolution.serviceName('domain.luxe');
      expect(serviceName).toBe('ENS');
    });

    it('checks ens service name', () => {
      const resolution = new Resolution();
      const serviceName = resolution.serviceName('domain.xyz');
      expect(serviceName).toBe('ENS');
    });

    it('checks zns service name', () => {
      const resolution = new Resolution();
      const serviceName = resolution.serviceName('domain.zil');
      expect(serviceName).toBe('ZNS');
    });

    it('checks cns service name', () => {
      const resolution = new Resolution();
      const serviceName = resolution.serviceName('domain.crypto');
      expect(serviceName).toBe('CNS');
    });

    it('checks naming service via api', () => {
      const resolution = new Resolution({blockchain: false});
      const serviceName = resolution.serviceName('domain.zil');
      expect(serviceName).toBe('ZNS');
    });

    it('checks naming service via api 2', () => {
      const resolution = new Resolution({blockchain: false});
      const serviceName = resolution.serviceName('domain.luxe');
      expect(serviceName).toBe('ENS');
    });

    it('checks naming service via api 3', () => {
      const resolution = new Resolution({blockchain: false});
      const serviceName = resolution.serviceName('domain.xyz');
      expect(serviceName).toBe('ENS');
    });

    it('checks naming service via api 4', () => {
      const resolution = new Resolution({blockchain: false});
      const serviceName = resolution.serviceName('domain.eth');
      expect(serviceName).toBe('ENS');
    });

    it('checks naming service via api 5', () => {
      const resolution = new Resolution({blockchain: false});
      const serviceName = resolution.serviceName('domain.crypto');
      expect(serviceName).toBe('CNS');
    });
  })
});
