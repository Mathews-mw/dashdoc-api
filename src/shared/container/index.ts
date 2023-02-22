import { container } from 'tsyringe';

import { DateProvider } from '../providers/DateProvider';
import { OTPLibProvider } from '../providers/OTPLibProvider';
import { RedisCacheProvider } from '../providers/CacheProvider';
import { IDateProvider } from '../providers/interfaces/IDateProvider';
import { ICacheProvider } from '../providers/interfaces/ICacheProvider';
import { LocalStorageProvider } from '../providers/LocalStorageProvider';
import { IUserRepository } from '../../modules/interfaces/IUserRepository';
import { IStorageProvider } from '../providers/interfaces/IStorageProvider';
import { UsersRepository } from '../../modules/repositories/UsersRepository';
import { IOneTimePasswordProvider } from '../providers/interfaces/IOneTimePasswordProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);
container.registerSingleton<IUserRepository>('UsersRepository', UsersRepository);
container.registerSingleton<ICacheProvider>('RedisCacheProvider', RedisCacheProvider);
container.registerSingleton<IOneTimePasswordProvider>('OTPLibProvider', OTPLibProvider);
container.registerSingleton<IStorageProvider>('LocalStorageProvider', LocalStorageProvider);
